import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { AuthVariables } from "../auth/middleware";
import { createMilestoneSchema, updateMilestoneSchema } from "./schema";
import {
  MilestoneNotFoundError,
  createMilestone,
  deleteMilestone,
  listProjectMilestones,
  updateMilestone,
} from "./services";

export const milestonesRouter = new Hono<{ Variables: AuthVariables }>()
  .get("/project/:projectId", async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    const result = await listProjectMilestones(c.req.param("projectId"));
    return c.json({ milestones: result }, 200);
  })
  .post("/", zValidator("json", createMilestoneSchema), async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    const result = await createMilestone(c.req.valid("json"));
    return c.json(result, 201);
  })
  .patch("/:id", zValidator("json", updateMilestoneSchema), async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    try {
      const result = await updateMilestone(c.req.param("id"), c.req.valid("json"));
      return c.json(result, 200);
    } catch (error) {
      if (error instanceof MilestoneNotFoundError) {
        return c.json({ error: "milestone_not_found" }, 404);
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
      const result = await deleteMilestone(c.req.param("id"));
      return c.json(result, 200);
    } catch (error) {
      if (error instanceof MilestoneNotFoundError) {
        return c.json({ error: "milestone_not_found" }, 404);
      }
      throw error;
    }
  });
