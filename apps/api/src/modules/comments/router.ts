import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { AuthVariables } from "../auth/middleware";
import { createCommentSchema, updateCommentSchema } from "./schema";
import {
  CommentForbiddenError,
  CommentNotFoundError,
  createComment,
  deleteComment,
  listIssueComments,
  updateComment,
} from "./services";

export const commentsRouter = new Hono<{ Variables: AuthVariables }>()
  .get("/issue/:issueId", async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    const result = await listIssueComments(c.req.param("issueId"));
    return c.json({ comments: result }, 200);
  })
  .post("/", zValidator("json", createCommentSchema), async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    const result = await createComment(user.id, c.req.valid("json"));
    return c.json(result, 201);
  })
  .patch("/:id", zValidator("json", updateCommentSchema), async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    try {
      const result = await updateComment(c.req.param("id"), user.id, c.req.valid("json"));
      return c.json(result, 200);
    } catch (error) {
      if (error instanceof CommentNotFoundError) {
        return c.json({ error: "comment_not_found" }, 404);
      }
      if (error instanceof CommentForbiddenError) {
        return c.json({ error: "forbidden" }, 403);
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
      const result = await deleteComment(c.req.param("id"), user.id);
      return c.json(result, 200);
    } catch (error) {
      if (error instanceof CommentNotFoundError) {
        return c.json({ error: "comment_not_found" }, 404);
      }
      if (error instanceof CommentForbiddenError) {
        return c.json({ error: "forbidden" }, 403);
      }
      throw error;
    }
  });
