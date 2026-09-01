import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { AuthVariables } from "../auth/middleware";
import { createInviteSchema, verifyInviteSchema } from "./schema";
import {
  InvalidInviteCredentialsError,
  InviteExpiredError,
  InviteNotFoundError,
  createInvite,
  deleteInvite,
  listProjectInvites,
  verifyInvite,
} from "./services";

export const invitesRouter = new Hono<{ Variables: AuthVariables }>()
  .get("/project/:projectId", async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    const result = await listProjectInvites(c.req.param("projectId"));
    return c.json({ invites: result }, 200);
  })
  .post("/", zValidator("json", createInviteSchema), async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    const result = await createInvite(c.req.valid("json"));
    return c.json(result, 201);
  })
  .post("/verify", zValidator("json", verifyInviteSchema), async (c) => {
    try {
      const result = await verifyInvite(c.req.valid("json"));
      return c.json(result, 200);
    } catch (error) {
      if (error instanceof InviteNotFoundError) {
        return c.json({ error: "invite_not_found" }, 404);
      }
      if (error instanceof InvalidInviteCredentialsError) {
        return c.json({ error: "invalid_credentials" }, 401);
      }
      if (error instanceof InviteExpiredError) {
        return c.json({ error: "invite_expired" }, 410);
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
      const result = await deleteInvite(c.req.param("id"));
      return c.json(result, 200);
    } catch (error) {
      if (error instanceof InviteNotFoundError) {
        return c.json({ error: "invite_not_found" }, 404);
      }
      throw error;
    }
  });
