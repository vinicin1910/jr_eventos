async function loadBrackets() {
  const data = await apiGet("/admin/brackets");
  const container = document.getElementById("brackets");
  if (!data.length) {
    container.innerHTML = `<div class="card"><h3>Nenhuma chave</h3><p class="muted">Gere as chaves para visualizar.</p></div>`;
    return;
  }

  container.innerHTML = data.map(b => {
    const fights = b.fights.map(f => `
      <div class="fight">
        <div>
          <strong>${b.category_key}</strong><br>
          <small>Round ${f.round} • Luta ${f.position}</small>
          <div>A: ${f.a_entry_id ?? 'TBD'}</div>
          <div>B: ${f.b_entry_id ?? 'TBD'}</div>
          <div class="muted">Vencedor: ${f.winner_entry_id ?? '—'}</div>
        </div>
        <div class="controls">
          <select class="select" data-fight="${f.id}">
            <option value="">Selecionar vencedor</option>
            ${f.a_entry_id ? `<option value="${f.a_entry_id}">A (${f.a_entry_id})</option>` : ''}
            ${f.b_entry_id ? `<option value="${f.b_entry_id}">B (${f.b_entry_id})</option>` : ''}
          </select>
          <button class="btn ghost" data-save="${f.id}">Salvar</button>
        </div>
      </div>
    `).join("");
    return `<div class="card">${fights}</div>`;
  }).join("");

  container.querySelectorAll('button[data-save]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const fightId = btn.getAttribute('data-save');
      const sel = container.querySelector(`select[data-fight="${fightId}"]`);
      const winner_entry_id = sel.value;
      if (!winner_entry_id) return;
      await apiPost(`/admin/fights/${fightId}/winner`, { winner_entry_id });
      await loadBrackets();
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("generateBtn").addEventListener("click", async () => {
    await apiPost("/admin/brackets/generate", {});
    await loadBrackets();
  });
  await loadBrackets();
});
