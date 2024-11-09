import Dexie from "dexie";

const database = new Dexie("database");
database.version(1).stores({
  metadata: "++id, metadataPtr, metadata",
});

export const metadataTable = database.table("metadata");

export default database;
