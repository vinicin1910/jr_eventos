// backend/src/ranking.js
import { pool } from './db.js';

export async function getTeamRanking(championship_id) {
  const [rows] = await pool.query(
    `SELECT ts.team_id, t.name as team_name, ts.gold, ts.silver, ts.bronze, ts.points
     FROM team_scores ts
     JOIN teams t ON t.id=ts.team_id
     WHERE ts.championship_id=?
     ORDER BY ts.points DESC, ts.gold DESC, ts.silver DESC, ts.bronze DESC, t.name ASC`, [championship_id]
  );
  return rows;
}
