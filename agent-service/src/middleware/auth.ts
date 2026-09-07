import type { NextFunction, Request, Response } from "express";
import { supabaseAdmin } from "../lib/supabase";

export interface AuthedRequest extends Request {
  userId?: string;
}

/**
 * Verifica il token Supabase (Authorization: Bearer <access_token>) inviato dal frontend
 * chiamando l'endpoint auth di Supabase, cosi' da non dover gestire manualmente le chiavi JWT.
 */
export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Token di autenticazione mancante." });
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: "Token non valido o scaduto." });
  }

  req.userId = data.user.id;
  next();
}
