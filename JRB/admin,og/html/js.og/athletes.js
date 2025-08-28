document.addEventListener("DOMContentLoaded", async () => {
  const aths = await apiGet("/admin/athletes");
  const tbody = document.querySelector("#athTable tbody");
  if (!aths.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="muted">Sem atletas</td></tr>`;
    return;
  }
  tbody.innerHTML = aths.map(a => `
    <tr>
      <td>${a.full_name}</td>
      <td>${a.belt}</td>
      <td>${a.age}</td>
      <td>${a.team_name}</td>
      <td>${a.status}</td>
    </tr>
  `).join("");
});
