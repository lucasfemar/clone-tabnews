import database from "infra/database";

async function cleanDatabase() {
  // Função que limpa todo o banco e depois recria
  // public é o nome do schema onde ficam todas as tabelas.
  // Cascade: server para dropar caso haja dependencia (insideout)
  await database.query("drop schema public cascade; create schema public;");
}

beforeAll(cleanDatabase);

test("GET to /api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);
});
