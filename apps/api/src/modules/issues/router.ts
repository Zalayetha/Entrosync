import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { AuthVariables } from "../auth/middleware";
import { createIssueSchema, updateIssueSchema } from "./schema";
import {
  IssueNotFoundError,
  createIssue,
  deleteIssue,
  listMilestoneIssues,
  updateIssue,
} from "./services";

export const issuesRouter = new Hono<{ Variables: AuthVariables }>()
  .get("/milestone/:milestoneId", async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    const result = await listMilestoneIssues(c.req.param("milestoneId"));
    return c.json({ issues: result }, 200);
  })
  .post("/", zValidator("json", createIssueSchema), async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    const result = await createIssue(c.req.valid("json"));
    return c.json(result, 201);
  })
  .patch("/:id", zValidator("json", updateIssueSchema), async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    try {
      const result = await updateIssue(c.req.param("id"), c.req.valid("json"));
      return c.json(result, 200);
    } catch (error) {
      if (error instanceof IssueNotFoundError) {
        return c.json({ error: "issue_not_found" }, 404);
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
      const result = await deleteIssue(c.req.param("id"));
      return c.json(result, 200);
    } catch (error) {
      if (error instanceof IssueNotFoundError) {
        return c.json({ error: "issue_not_found" }, 404);
      }
      throw error;
    }
  });
