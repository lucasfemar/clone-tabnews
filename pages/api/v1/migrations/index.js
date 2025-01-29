import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";
import { createRouter } from "next-connect";
import { InternalServerError, MethodNotAllowedError } from "infra/errors";

const router = createRouter();
router.get(getHandler).post(postHandler);

export default router.handler({
  onNoMatch: onNoMachHandler,
  onError: onErrorHandler,
});

function getDefaultMigrationOptions(dbClient) {
  return {
    dbClient,
    dryRun: true,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };
}
function onErrorHandler(error, request, response) {
  const publicErrorObject = new InternalServerError({
    cause: error,
  });
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onNoMachHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  return response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

async function postHandler(request, response) {
  const dbClient = await database.getNewClient();
  const defaultMigrationOptions = getDefaultMigrationOptions(dbClient);
  const migratedMigrations = await migrationRunner({
    ...defaultMigrationOptions,
    dryRun: false, // Rondando no liveRun
  });
  await dbClient.end();
  if (migratedMigrations.length > 0) {
    return response.status(201).json(migratedMigrations);
  }
  return response.status(200).json(migratedMigrations);
}

async function getHandler(request, response) {
  const dbClient = await database.getNewClient();
  const defaultMigrationOptions = getDefaultMigrationOptions(dbClient);
  const pedingMigrations = await migrationRunner(defaultMigrationOptions);
  await dbClient.end();
  return response.status(200).json(pedingMigrations);
}
