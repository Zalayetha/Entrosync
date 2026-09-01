import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { AuthVariables } from "../auth/middleware";
import { createProjectSchema, projectsQuerySchema, updateProjectSchema } from "./schema";
import {
  ProjectNotFoundError,
  ProjectSlugConflictError,
  createProject,
  deleteProject,
  getProjectByIdOrSlug,
  listProjects,
  updateProject,
} from "./services";

export const projectsRouter = new Hono<{ Variables: AuthVariables }>()
  .get("/", zValidator("query", projectsQuerySchema), async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    const result = await listProjects(user.id, c.req.valid("query"));
    return c.json(result, 200);
  })
  .post("/", zValidator("json", createProjectSchema), async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    const result = await createProject(user.id, c.req.valid("json"));
    return c.json(result, 201);
  })
  .get("/:idOrSlug", async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    try {
      const result = await getProjectByIdOrSlug(c.req.param("idOrSlug"), user.id);
      return c.json(result, 200);
    } catch (error) {
      if (error instanceof ProjectNotFoundError) {
        return c.json({ error: "project_not_found" }, 404);
      }
      throw error;
    }
  })
  .patch("/:id", zValidator("json", updateProjectSchema), async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    try {
      const result = await updateProject(c.req.param("id"), user.id, c.req.valid("json"));
      return c.json(result, 200);
    } catch (error) {
      if (error instanceof ProjectNotFoundError) {
        return c.json({ error: "project_not_found" }, 404);
      }
      if (error instanceof ProjectSlugConflictError) {
        return c.json({ error: "slug_conflict" }, 409);
      }
      throw error;
    }
  })
  .delete("/:id", async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    try {
      const result = await deleteProject(c.req.param("id"), user.id);
      return c.json(result, 200);
    } catch (error) {
      if (error instanceof ProjectNotFoundError) {
        return c.json({ error: "project_not_found" }, 404);
      }
      throw error;
    }
  });
