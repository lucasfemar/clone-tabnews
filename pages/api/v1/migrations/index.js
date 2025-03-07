import { createRouter } from "next-connect";
import controler from "infra/controller";
import migrator from "models/migrator.js";
const router = createRouter();
router.get(getHandler);
router.post(postHandler);

export default router.handler(controler.errorHandlers);

async function getHandler(request, response) {
  const pedingMigrations = await migrator.listPendingMigrations();
  return response.status(200).json(pedingMigrations);
}

async function postHandler(request, response) {
  const migratedMigrations = await migrator.runPendingMigrations();
  if (migratedMigrations.length > 0) {
    return response.status(201).json(migratedMigrations);
  }
  return response.status(200).json(migratedMigrations);
}
