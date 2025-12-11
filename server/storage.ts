import { type User, type InsertUser, type Diploma, type InsertDiploma } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createDiploma(diploma: InsertDiploma): Promise<Diploma>;
  getDiplomas(): Promise<Diploma[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private diplomas: Map<string, Diploma>;

  constructor() {
    this.users = new Map();
    this.diplomas = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createDiploma(insertDiploma: InsertDiploma): Promise<Diploma> {
    const id = randomUUID();
    const diploma: Diploma = {
      ...insertDiploma,
      id,
      completedAt: new Date(),
    };
    this.diplomas.set(id, diploma);
    return diploma;
  }

  async getDiplomas(): Promise<Diploma[]> {
    return Array.from(this.diplomas.values()).sort((a, b) => {
      const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return dateB - dateA;
    });
  }
}

export const storage = new MemStorage();
