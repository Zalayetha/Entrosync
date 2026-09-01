import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { AuthVariables } from "../auth/middleware";
import { createInvoiceSchema, invoicesQuerySchema, updateInvoiceSchema } from "./schema";
import {
  InvoiceNotFoundError,
  createInvoice,
  deleteInvoice,
  getInvoiceById,
  listInvoices,
  updateInvoice,
} from "./services";

export const invoicesRouter = new Hono<{ Variables: AuthVariables }>()
  .get("/", zValidator("query", invoicesQuerySchema), async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    const result = await listInvoices(user.id, c.req.valid("query"));
    return c.json(result, 200);
  })
  .get("/:id", async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    try {
      const result = await getInvoiceById(c.req.param("id"), user.id);
      return c.json(result, 200);
    } catch (error) {
      if (error instanceof InvoiceNotFoundError) {
        return c.json({ error: "invoice_not_found" }, 404);
      }
      throw error;
    }
  })
  .post("/", zValidator("json", createInvoiceSchema), async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    try {
      const result = await createInvoice(user.id, c.req.valid("json"));
      return c.json(result, 201);
    } catch (error) {
      if (error instanceof InvoiceNotFoundError) {
        return c.json({ error: "project_not_found" }, 404);
      }
      throw error;
    }
  })
  .patch("/:id", zValidator("json", updateInvoiceSchema), async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }

    try {
      const result = await updateInvoice(c.req.param("id"), user.id, c.req.valid("json"));
      return c.json(result, 200);
    } catch (error) {
      if (error instanceof InvoiceNotFoundError) {
        return c.json({ error: "invoice_not_found" }, 404);
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
      const result = await deleteInvoice(c.req.param("id"), user.id);
      return c.json(result, 200);
    } catch (error) {
      if (error instanceof InvoiceNotFoundError) {
        return c.json({ error: "invoice_not_found" }, 404);
      }
      throw error;
    }
  });
