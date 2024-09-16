import DataLoader from "dataloader";
import { db } from "@/db";
import { shops } from "@/schema";
import { inArray } from "drizzle-orm";
import { ShopMapper } from "../base/schema.mappers";

export const shopLoader = new DataLoader<number, ShopMapper>(async (ids) => {
  console.log('ids', ids)
  const dbShops = await db.select().from(shops).where(inArray(shops.id, ids as number[]))
  return dbShops
})