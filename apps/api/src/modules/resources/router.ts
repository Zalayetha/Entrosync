import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { AuthVariables } from "../auth/middleware";
import { createResourceSchema, requestUploadUrlSchema } from "./schema";
import {
  ResourceNotFoundError,
  createResource,
  deleteResource,
  generatePresignedUploadUrl,
  listProjectResources,
} from "./services";

export const resourcesRouter = new Hono<{ Variables: AuthVariables }>()
  .get("/project/:projectId", async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    const result = await listProjectResources(c.req.param("projectId"));
    return c.json({ resources: result }, 200);
  })
  .post("/", zValidator("json", createResourceSchema), async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    const result = await createResource(c.req.valid("json"));
    return c.json(result, 201);
  })
  .post("/upload-url", zValidator("json", requestUploadUrlSchema), async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    const result = await generatePresignedUploadUrl(c.req.valid("json"));
    return c.json(result, 200);
  })
  .delete("/:id", async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    try {
      const result = await deleteResource(c.req.param("id"));
      return c.json(result, 200);
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return c.json({ error: "resource_not_found" }, 404);
      }
      throw error;
    }
  });
