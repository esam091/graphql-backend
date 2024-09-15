import 'dotenv/config'

import { migrate } from 'drizzle-orm/libsql/migrator'
import { db } from './db'

async function runMigrations() {
  await migrate(db, { migrationsFolder: './drizzle' })
  console.log('Migrations complete')
}

runMigrations().catch(console.error)
