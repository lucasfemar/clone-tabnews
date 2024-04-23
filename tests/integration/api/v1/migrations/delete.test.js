import database from "infra/database";

async function cleanDatabase() {
  // Função que limpa todo o banco e depois recria
  // public é o nome do schema onde ficam todas as tabelas.
  // Cascade: server para dropar caso haja dependencia (insideout)
  await database.query("drop schema public cascade; create schema public;");
}

beforeAll(cleanDatabase);

test("DELETE to /api/v1/migrations should return 405", async () => {
  const responseMigrations = await fetch(
    "http://localhost:3000/api/v1/migrations",
    {
      method: "DELETE",
    }
  );

  expect(responseMigrations.status).toBe(405);
  const responseStatus = await fetch("http://localhost:3000/api/v1/status");
  const responseBody = await responseStatus.json();
  expect(responseBody.dependencies.database.opened_connections).toBe(1);
});
