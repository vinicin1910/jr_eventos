// backend/src/server.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { pool } from './db.js';
import { addDays, fmtDateISO, todayISO } from './utils.js';
import { categorizeAthlete } from './categories-config.js';
import { generateBrackets, recordFightWinner } from './bracket.js';
import { getTeamRanking } from './ranking.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir sites estáticos
app.use('/public', express.static(path.join(__dirname, '..', '..', 'public')));
app.use('/admin', express.static(path.join(__dirname, '..', '..', 'admin')));

// Helper de prazos
function computeDeadlines(start_date) {
  const start = new Date(start_date);
  const inscription_deadline = fmtDateISO(addDays(start, -2));
  const change_deadline = fmtDateISO(addDays(start, -1));
  return { inscription_deadline, change_deadline };
}

// ---------------- Admin endpoints ----------------

// Criar campeonato
app.post('/api/admin/championships', async (req, res) => {
  try {
    const { name, start_date, fee_amount } = req.body;
    const { inscription_deadline, change_deadline } = computeDeadlines(start_date);
    const [r] = await pool.query(
      `INSERT INTO championships (name, start_date, inscription_deadline, change_deadline, fee_amount) VALUES (?,?,?,?,?)`,
      [name, start_date, inscription_deadline, change_deadline, fee_amount || 0]
    );
    res.json({ id: r.insertId, name, start_date, inscription_deadline, change_deadline, fee_amount });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Listar campeonatos
app.get('/api/admin/championships', async (req,res)=>{
  const [rows] = await pool.query(`SELECT * FROM championships ORDER BY created_at DESC`);
  res.json(rows);
});

// Cadastrar/gerenciar equipes
app.post('/api/admin/teams', async (req,res)=>{
  try {
    const { name } = req.body;
    const [r] = await pool.query(`INSERT INTO teams (name) VALUES (?)`, [name]);
    res.json({ id: r.insertId, name });
  } catch(e){ res.status(500).json({ error:e.message }); }
});

app.get('/api/admin/teams', async (req,res)=>{
  const [rows] = await pool.query(`SELECT * FROM teams ORDER BY name`);
  res.json(rows);
  // Resetar campeonato: remove todos os atletas/inscrições mas mantém equipes
app.delete('/api/admin/reset', async (req, res) => {
  try {
    // Pega campeonato ativo
    const [[champ]] = await pool.query(
      `SELECT id FROM championships WHERE is_active=1 ORDER BY start_date DESC LIMIT 1`
    );
    if (!champ) return res.status(400).json({ error: 'Nenhum campeonato ativo' });

    // Apaga registros relacionados a esse campeonato
    await pool.query(`DELETE FROM registrations WHERE championship_id = ?`, [champ.id]);
    await pool.query(`DELETE FROM athlete_categories WHERE championship_id = ?`, [champ.id]);
    await pool.query(`DELETE FROM brackets WHERE championship_id = ?`, [champ.id]);
    await pool.query(`DELETE FROM team_scores WHERE championship_id = ?`, [champ.id]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

});

app