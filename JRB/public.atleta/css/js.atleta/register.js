document.addEventListener("DOMContentLoaded", async () => {
  try {
    const teams = await apiGet("/admin/teams");
    const sel = document.getElementById("teamSelect");
    sel.innerHTML = `<option value="">Equipe</option>` + teams.map(t=>`<option value="${t.id}">${t.name}</option>`).join("");
  } catch (e) {
    document.getElementById("msg").textContent = "Erro ao carregar equipes.";
  }

  document.getElementById("registerForm").addEventListener("submit", async e => {
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form).entries());
    const res = await apiPost("/public/register", data);
    document.getElementById("msg").textContent = res.error || "Inscrição registrada! Aguarde confirmação.";
    if (!res.error) form.reset();
  });
});
