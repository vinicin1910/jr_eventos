// Admin API helper
const API_BASE = "http://localhost:4000/api";

async function apiGet(path) {
  const res = await fetch(API_BASE + path);
  if (!res.ok) throw new Error('Erro ao carregar: ' + path);
  return res.json();
}

async function apiPost(path, data) {
  const res = await fetch(API_BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

async function apiDelete(path) {
  const res = await fetch(API_BASE + path, { method: "DELETE" });
  return res.json();
}

async function apiPut(path, data) {
  const res = await fetch(API_BASE + path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
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
}

