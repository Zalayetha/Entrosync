import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { AuthVariables } from "../auth/middleware";
import { convertToProjectSchema, generateBriefSchema } from "./schema";
import { convertBriefToProject, generateBriefFromRawText } from "./services";

export const aiRouter = new Hono<{ Variables: AuthVariables }>()
  .post("/generate-brief", zValidator("json", generateBriefSchema), async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    const { rawText } = c.req.valid("json");
    const result = await generateBriefFromRawText(rawText);
    return c.json(result, 200);
  })
  .post("/convert-to-project", zValidator("json", convertToProjectSchema), async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    const result = await convertBriefToProject(user.id, c.req.valid("json"));
    return c.json(result, 201);
  });
