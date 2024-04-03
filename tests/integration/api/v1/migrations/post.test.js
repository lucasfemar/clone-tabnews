import database from "infra/database";

async function cleanDatabase() {
  // Função que limpa todo o banco e depois recria
  // public é o nome do schema onde ficam todas as tabelas.
  // Cascade: server para dropar caso haja dependencia (insideout)
  await database.query("drop schema public cascade; create schema public;");
}

beforeAll(cleanDatabase);

test("POST to /api/v1/migrations should return 200", async () => {
  const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });

  const response1Body = await response1.json();

  expect(response1.status).toBe(201);
  expect(Array.isArray(response1Body)).toBe(true);
  expect(response1Body.length).toBeGreaterThan(0);

  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });

  const response2Body = await response2.json();

  expect(response2.status).toBe(200);
  expect(Array.isArray(response2Body)).toBe(true);
  expect(response2Body.length).toBe(0);
});

// [x] - Como melhorar o teste do POST?
// [x] - Como me certificar de que o POST esta de fato rodando as migrations?
// Implementar um teste que eu julgue seguro.
