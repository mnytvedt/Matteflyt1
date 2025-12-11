import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const diplomas = pgTable("diplomas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentName: text("student_name").notNull(),
  totalStars: integer("total_stars").notNull(),
  avgAccuracy: integer("avg_accuracy").notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
  levelResults: text("level_results").notNull(), // JSON string of level results
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertDiplomaSchema = z.object({
  studentName: z.string().min(1),
  totalStars: z.number().int(),
  avgAccuracy: z.number().int(),
  levelResults: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertDiploma = z.infer<typeof insertDiplomaSchema>;
export type Diploma = typeof diplomas.$inferSelect;
