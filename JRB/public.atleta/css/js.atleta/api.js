const API_BASE = "http://localhost:4000/api";

async function apiGet(path) {
  const r = await fetch(API_BASE + path);
  if (!r.ok) throw new Error('Erro ao carregar: ' + path);
  return r.json();
}

async function apiPost(path, data) {
  const r = await fetch(API_BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return r.json();
}
