document.addEventListener("DOMContentLoaded", async () => {
  const rank = await apiGet("/public/ranking");
  const tbody = document.querySelector("#rankingTable tbody");
  if (!rank.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="center muted">Sem pontuações até o momento</td></tr>`;
    return;
  }
  tbody.innerHTML = rank.map(r => `
    <tr>
      <td>${r.team_name}</td>
      <td><span class="badge gold">${r.gold}</span></td>
      <td><span class="badge silver">${r.silver}</span></td>
      <td><span class="badge bronze">${r.bronze}</span></td>
      <td><strong>${r.points}</strong></td>
    </tr>
  `).join("");
});
