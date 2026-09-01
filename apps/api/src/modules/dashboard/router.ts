import { Hono } from "hono";
import type { AuthVariables } from "../auth/middleware";
import {
  getDashboardActivity,
  getDashboardPayouts,
  getDashboardProjects,
  getDashboardStats,
} from "./services";

export const dashboardRouter = new Hono<{ Variables: AuthVariables }>()
  .get("/stats", async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    const result = await getDashboardStats(user.id);
    return c.json(result, 200);
  })
  .get("/projects", async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    const result = await getDashboardProjects(user.id);
    return c.json({ projects: result }, 200);
  })
  .get("/payouts", async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    const result = await getDashboardPayouts(user.id);
    return c.json({ payouts: result }, 200);
  })
  .get("/activity", async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    const limitParam = c.req.query("limit");
    const limit = limitParam ? Number.parseInt(limitParam, 10) : 10;

    const result = await getDashboardActivity(user.id, limit);
    return c.json({ activities: result }, 200);
  });
