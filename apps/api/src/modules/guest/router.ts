import { Hono } from "hono";
import type { AuthVariables } from "../auth/middleware";
import { InviteExpiredError, InviteNotFoundError } from "../invites/services";
import { getGuestProject } from "./services";

export const guestRouter = new Hono<{ Variables: AuthVariables }>().get(
  "/projects/:token",
  async (c) => {
    try {
      const result = await getGuestProject(c.req.param("token"));
      return c.json(result, 200);
    } catch (error) {
      if (error instanceof InviteNotFoundError) {
        return c.json({ error: "invite_not_found" }, 404);
      }
      if (error instanceof InviteExpiredError) {
        return c.json({ error: "invite_expired" }, 410);
      }
      throw error;
    }
  },
);
