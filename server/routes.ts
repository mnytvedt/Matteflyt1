import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDiplomaSchema } from "@shared/schema";
import { randomUUID } from "crypto";

const ADMIN_PASSWORD = "5656";
const tokens = new Set<string>();

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Admin login endpoint
  app.post("/api/admin/verify", async (req, res) => {
    try {
      const { password } = req.body;
      
      if (!password) {
        return res.status(400).json({ error: "Password required" });
      }
      
      if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: "Invalid password" });
      }
      
      const token = randomUUID();
      tokens.add(token);
      res.json({ token });
    } catch (error) {
      console.error("Error in admin verify:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Middleware to verify token
  const verifyToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace("Bearer ", "");
    
    if (!token || !tokens.has(token)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    next();
  };

  // Diploma submission endpoint
  app.post("/api/diplomas", async (req, res) => {
    try {
      const data = insertDiplomaSchema.parse(req.body);
      const diploma = await storage.createDiploma(data);
      res.json({ success: true, id: diploma.id });
    } catch (error) {
      console.error("Error submitting diploma:", error);
      res.status(400).json({ error: "Invalid diploma data" });
    }
  });

  // Get all diplomas endpoint (protected)
  app.get("/api/diplomas", verifyToken, async (req, res) => {
    try {
      const diplomas = await storage.getDiplomas();
      res.json(diplomas);
    } catch (error) {
      console.error("Error fetching diplomas:", error);
      res.status(500).json({ error: "Failed to fetch diplomas" });
    }
  });

  return httpServer;
}
