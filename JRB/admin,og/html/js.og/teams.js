const grid = document.getElementById("teamGrid");

async function loadTeams() {
  const teams = await apiGet("/admin/teams");
  grid.innerHTML = teams.map(t => `
    <div class="card">
      <h3>${t.name}</h3>
      <p class="muted">ID: ${t.id}</p>
    </div>
  `).join("");
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadTeams();
  document.getElementById("teamForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    if (!name) return;
    const res = await apiPost("/admin/teams", { name });
    if (!res.error) {
      e.target.reset();
      loadTeams();
    }
  });
});
