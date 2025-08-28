document.addEventListener("DOMContentLoaded", async () => {
  const data = await apiGet("/public/brackets");
  const container = document.getElementById("bracketsContainer");

  if (!data.length) {
    container.innerHTML = `
      <div class="card">
        <h3>Chaveamento indisponível</h3>
        <p>O chaveamento será publicado <strong>1 dia antes do início do campeonato</strong>, após o prazo final para trocas de categoria.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = data.map(b => {
    const fights = b.fights.map(f => `
      <div class="fight">
        <div><strong>Round ${f.round}</strong> — Luta ${f.position}</div>
        <div>A: ${f.a_entry_id ?? 'TBD'}</div>
        <div>B: ${f.b_entry_id ?? 'TBD'}</div>
        <div class="muted">Vencedor: ${f.winner_entry_id ?? '—'}</div>
      </div>
    `).join("");

    return `
      <div class="card">
        <h3>${b.category_key}</h3>
        ${fights}
      </div>
    `;
  }).join("");
});
