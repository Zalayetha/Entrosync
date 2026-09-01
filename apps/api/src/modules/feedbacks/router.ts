import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { AuthVariables } from "../auth/middleware";
import { createFeedbackSchema } from "./schema";
import {
  FeedbackNotFoundError,
  createFeedback,
  deleteFeedback,
  listProjectFeedbacks,
} from "./services";

export const feedbacksRouter = new Hono<{ Variables: AuthVariables }>()
  .get("/project/:projectId", async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    const result = await listProjectFeedbacks(c.req.param("projectId"));
    return c.json({ feedbacks: result }, 200);
  })
  .post("/", zValidator("json", createFeedbackSchema), async (c) => {
    const result = await createFeedback(c.req.valid("json"));
    return c.json(result, 201);
  })
  .delete("/:id", async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    try {
      const result = await deleteFeedback(c.req.param("id"));
      return c.json(result, 200);
    } catch (error) {
      if (error instanceof FeedbackNotFoundError) {
        return c.json({ error: "feedback_not_found" }, 404);
      }
      throw error;
    }
  });
