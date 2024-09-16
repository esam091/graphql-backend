import DataLoader from "dataloader";
import { db } from "@/db";
import { users } from "@/schema";
import { inArray } from "drizzle-orm";
import { UserMapper } from "../base/schema.mappers";

export const userLoader = new DataLoader<number, UserMapper>(async (ids) => {
  const dbUsers = await db.select().from(users).where(inArray(users.id, ids as number[]))
  return dbUsers
})