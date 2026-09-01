import { createStorage } from "@repo/storage";
import { storageConfig } from "../config";

export const storage = createStorage(storageConfig);
