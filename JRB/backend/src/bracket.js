// backend/src/bracket.js
import { pool } from './db.js';
import { randomShuffle } from './utils.js';

export async function generateBrackets(championship_id) {
  // Pega todas as categorias com atletas pagos/cash
  const [rows] = await pool.query(
    `SELECT ac.category_key, COUNT(*) as n
     FROM athlete_categories ac
     JOIN registrations r ON r.id = ac.registration_id
     WHERE ac.championship_id = ? AND r.status IN ('paid','cash')
     GROUP BY ac.category_key`, [championship_id]
  );

  for (const row of rows) {
    const { category_key, n } = row;

    // Marca is_solo = 1 quando só tem 1 atleta (não pontua)
    await pool.query(
      `UPDATE athlete_categories ac
       JOIN (
         SELECT id FROM athlete_categories
         WHERE championship_id=? AND category_key=?
       ) t ON t.id = ac.id
       SET ac.is_solo = ?`, [championship_id, category_key, n === 1 ? 1 : 0]
    );

    // Cria bracket
    const [ins] = await pool.query(
      `INSERT INTO brackets (championship_id, category_key, size) VALUES (?,?,?)`,
      [championship_id, category_key, n]
    );
    const bracket_id = ins.insertId;

    // Carrega registros da categoria
    const [regs] = await pool.query(
      `SELECT r.id as registration_id
       FROM registrations r
       JOIN athlete_categories ac ON ac.registration_id = r.id
       WHERE ac.championship_id=? AND ac.category_key=? AND r.status IN ('paid','cash')`,
      [championship_id, category_key]
    );

    // Shuffle e seeds
    const entries = randomShuffle(regs.map((r, idx) => ({ registration_id: r.registration_id, seed: idx+1 })));

    // Caso especial: 3 atletas
    if (entries.length === 3) {
      // Insere entries
      const entryIds = [];
      for (const e of entries) {
        const [eRes] = await pool.query(
          `INSERT INTO bracket_entries (bracket_id, registration_id, seed) VALUES (?,?,?)`,
          [bracket_id, e.registration_id, e.seed]
        );
        entryIds.push(eRes.insertId);
      }
      // F1: A vs B
      const [f1] = await pool.query(
        `INSERT INTO fights (bracket_id, round, position, a_entry_id, b_entry_id) VALUES (?,?,?,?,?)`,
        [bracket_id, 1, 1, entryIds[0], entryIds[1]]
      );
      // F2: perdedor de F1 vs C (controlaremos na marcação do vencedor com um "recovery" simples)
      const [f2] = await pool.query(
        `INSERT INTO fights (bracket_id, round, position, a_entry_id, b_entry_id) VALUES (?,?,?,?,?)`,
        [bracket_id, 2, 1, null, entryIds[2]]
      );
      // Final: vencedor de F1 vs vencedor de F2
      const [finalRes] = await pool.query(
        `INSERT INTO fights (bracket_id, round, position, a_entry_id, b_entry_id) VALUES (?,?,?,?,?)`,
        [bracket_id, 3, 1, null, null]
      );
      const finalId = finalRes.insertId;

      // Encadear fights: F1 -> define A da final; Perdedor de F1 vai para F2.A; Vencedor de F2 vai para final.B
      await pool.query(`UPDATE fights SET next_fight_id=?, next_slot='A' WHERE id=?`, [finalId, f1.insertId]);
      await pool.query(`UPDATE fights SET next_fight_id=?, next_slot='B' WHERE id=?`, [finalId, f2.insertId]);

      // Guardar uma "sombra" para saber que F2.A é perdedor de F1: armazenamos b_entry_id como o fixo (C) e manteremos F2.A nulo até registrar perdedor
      await pool.query(`INSERT INTO podiums (bracket_id) VALUES (?)`, [bracket_id]);
      continue;
    }

    // Demais casos: chave simples com bye se ímpar
    // Insere entries + bye
    const entryIds = [];
    for (const e of entries) {
      const [eRes] = await pool.query(
        `INSERT INTO bracket_entries (bracket_id, registration_id, seed) VALUES (?,?,?)`,
        [bracket_id, e.registration_id, e.seed]
      );
      entryIds.push(eRes.insertId);
    }
    if (entryIds.length % 2 === 1) {
      const [eRes] = await pool.query(
        `INSERT INTO bracket_entries (bracket_id, is_bye) VALUES (?,1)`,
        [bracket_id]
      );
      entryIds.push(eRes.insertId);
    }

    // Monta primeira rodada
    const pairs = [];
    for (let i = 0; i < entryIds.length; i += 2) {
      pairs.push([entryIds[i], entryIds[i+1]]);
    }

    // Cria rounds até final
    let currentRoundEntries = [];
    const fightIdsByRound = [];
    let round = 1;

    // Round 1
    const roundFightIds = [];
    for (let p = 0; p < pairs.length; p++) {
      const [a, b] = pairs[p];
      const [fr] = await pool.query(
        `INSERT INTO fights (bracket_id, round, position, a_entry_id, b_entry_id) VALUES (?,?,?,?,?)`,
        [bracket_id, round, p+1, a, b]
      );
      roundFightIds.push(fr.insertId);
    }
    fightIdsByRound.push(roundFightIds);

    // Próximas rodadas
    let prev = roundFightIds;
    while (prev.length > 1) {
      round++;
      const nextRoundIds = [];
      for (let i = 0; i < prev.length; i += 2) {
        const [fr] = await pool.query(
          `INSERT INTO fights (bracket_id, round, position) VALUES (?,?,?)`,
          [bracket_id, round, (i/2)+1]
        );
        nextRoundIds.push(fr.insertId);
        // linkar
        await pool.query(`UPDATE fights SET next_fight_id=?, next_slot='A' WHERE id=?`, [fr.insertId, prev[i]]);
        if (prev[i+1]) {
          await pool.query(`UPDATE fights SET next_fight_id=?, next_slot='B' WHERE id=?`, [fr.insertId, prev[i+1]]);
        } else {
          // bye propagado
        }
      }
      prev = nextRoundIds;
      fightIdsByRound.push(nextRoundIds);
    }

    await pool.query(`INSERT INTO podiums (bracket_id) VALUES (?)`, [bracket_id]);
  }
}

export async function recordFightWinner(fightId, winnerEntryId) {
  // Atualiza vencedor, propaga para próxima luta
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [[fight]] = await conn.query(`SELECT * FROM fights WHERE id=? FOR UPDATE`, [fightId]);
    if (!fight) throw new Error('Luta não encontrada');

    await conn.query(`UPDATE fights SET winner_entry_id=? WHERE id=?`, [winnerEntryId, fightId]);

    if (fight.next_fight_id) {
      const slot = fight.next_slot === 'A' ? 'a_entry_id' : 'b_entry_id';
      await conn.query(`UPDATE fights SET ${slot}=? WHERE id=?`, [winnerEntryId, fight.next_fight_id]);
    }

    // Caso especial 3 atletas: perdedor da primeira luta vai para F2.A
    // Detecta se a luta é a primeira do bracket (round=1) e se existe uma luta round=2 com a_entry_id null
    const [[bInfo]] = await conn.query(
      `SELECT bracket_id FROM fights WHERE id=?`, [fightId]
    );
    const bracket_id = bInfo.bracket_id;

    // Se esta luta é round 1 e existe luta round 2 com a_entry_id null, inserimos o perdedor lá
    const [[thisFight]] = await conn.query(`SELECT * FROM fights WHERE id=?`, [fightId]);
    if (thisFight.round === 1) {
      const [[f2]] = await conn.query(
        `SELECT * FROM fights WHERE bracket_id=? AND round=2 LIMIT 1`, [bracket_id]
      );
      if (f2 && f2.a_entry_id == null) {
        const loserEntryId = (thisFight.a_entry_id === winnerEntryId) ? thisFight.b_entry_id : thisFight.a_entry_id;
        await conn.query(`UPDATE fights SET a_entry_id=? WHERE id=?`, [loserEntryId, f2.id]);
      }
    }

    // Se final foi decidido, calcula pódio e pontua equipe
    await maybeFinalizePodiumAndScore(conn, bracket_id);

    await conn.commit();
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

async function maybeFinalizePodiumAndScore(conn, bracket_id) {
  // verifica se final está com winner
  const [[finalFight]] = await conn.query(
    `SELECT * FROM fights WHERE bracket_id=? ORDER BY round DESC, position ASC LIMIT 1`, [bracket_id]
  );
  if (!finalFight?.winner_entry_id) return; // final ainda não decidido

  // Encontrar silver: o outro da final
  const silverEntryId = (finalFight.a_entry_id === finalFight.winner_entry_id) ? finalFight.b_entry_id : finalFight.a_entry_id;

  // Encontrar bronzes: vencedores das semis perdedores não vão à final (sem repescagem)
  const [semiFights] = await conn.query(
    `SELECT * FROM fights WHERE bracket_id=? AND round=(SELECT MAX(round)-1 FROM fights WHERE bracket_id=?)`,
    [bracket_id, bracket_id]
  );

  let bronze1 = null, bronze2 = null;
  if (semiFights.length >= 2) {
    // perdedores das semis
    const loser1 = (semiFights[0].winner_entry_id === semiFights[0].a_entry_id) ? semiFights[0].b_entry_id : semiFights[0].a_entry_id;
    const loser2 = (semiFights[1].winner_entry_id === semiFights[1].a_entry_id) ? semiFights[1].b_entry_id : semiFights[1].a_entry_id;
    bronze1 = loser1; bronze2 = loser2;
  } else if (semiFights.length === 1) {
    // chave pequena, pode ter apenas uma semi -> um bronze
    const loser = (semiFights[0].winner_entry_id === semiFights[0].a_entry_id) ? semiFights[0].b_entry_id : semiFights[0].a_entry_id;
    bronze1 = loser; bronze2 = null;
  }

  // Mapear entry -> registration
  const mapEntryToReg = async (entryId) => {
    if (!entryId) return null;
    const [[row]] = await conn.query(`SELECT registration_id FROM bracket_entries WHERE id=?`, [entryId]);
    return row?.registration_id || null;
  };

  const goldReg = await mapEntryToReg(finalFight.winner_entry_id);
  const silverReg = await mapEntryToReg(silverEntryId);
  const bronze1Reg = await mapEntryToReg(bronze1);
  const bronze2Reg = await mapEntryToReg(bronze2);

  // Verifica se categoria é absoluta ou solo
  const [[catInfo]] = await conn.query(
    `SELECT ac.is_absolute, ac.is_solo
     FROM athlete_categories ac
     JOIN registrations r ON r.id = ac.registration_id
     JOIN brackets b ON b.category_key = ac.category_key AND b.championship_id = ac.championship_id
     WHERE b.id=? LIMIT 1`, [bracket_id]
  );
  const noScore = (catInfo?.is_absolute === 1) || (catInfo?.is_solo === 1);

  // Salva pódio
  await conn.query(
    `UPDATE podiums SET gold_registration_id=?, silver_registration_id=?, bronze1_registration_id=?, bronze2_registration_id=?, finalized=1 WHERE bracket_id=?`,
    [goldReg, silverReg, bronze1Reg, bronze2Reg, bracket_id]
  );

  // Atualiza pontuação por equipe
  if (!noScore) {
    const scoreMap = new Map();

    const addScore = async (regId, medal) => {
      if (!regId) return;
      const [[t]] = await conn.query(
        `SELECT a.team_id, r.championship_id
         FROM registrations r JOIN athletes a ON a.id=r.athlete_id
         WHERE r.id=?`, [regId]
      );
      if (!t) return;
      const key = `${t.championship_id}-${t.team_id}`;
      if (!scoreMap.has(key)) scoreMap.set(key, { championship_id: t.championship_id, team_id: t.team_id, gold:0,silver:0,bronze:0,points:0 });
      const rec = scoreMap.get(key);
      if (medal==='gold') { rec.gold++; rec.points+=9; }
      if (medal==='silver') { rec.silver++; rec.points+=6; }
      if (medal==='bronze') { rec.bronze++; rec.points+=3; }
    };

    await addScore(goldReg, 'gold');
    await addScore(silverReg, 'silver');
    await addScore(bronze1Reg, 'bronze');
    await addScore(bronze2Reg, 'bronze');

    for (const rec of scoreMap.values()) {
      await conn.query(
        `INSERT INTO team_scores (championship_id, team_id, gold, silver, bronze, points)
         VALUES (?,?,?,?,?,?)
         ON DUPLICATE KEY UPDATE gold=gold+VALUES(gold), silver=silver+VALUES(silver), bronze=bronze+VALUES(bronze), points=points+VALUES(points)`,
        [rec.championship_id, rec.team_id, rec.gold, rec.silver, rec.bronze, rec.points]
      );
    }
  }
}
