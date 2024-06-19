// BSQL3 mode 
// minimal single-file to use for Oauth

//no drizzle: import {BetterSqlite3Adapter}  from '@lucia-auth/adapter-sqlite';
import  {DrizzleSQLiteAdapter}      from '@lucia-auth/adapter-drizzle';
import  {sqliteTable, text, integer}from 'drizzle-orm/sqlite-core';
import  sqlite      from    'better-sqlite3';
import  {sql}       from    'drizzle-orm';
import  {drizzle}   from    'drizzle-orm/better-sqlite3';

const sql_DB =sqlite(':memory:');
const DB     =drizzle(sql_DB);

const userT = sqliteTable(  'user',
{
    id:     text('id').notNull().primaryKey(),
    accessAt: text('access_at').default(sql`CURRENT_TIMESTAMP`),
});

const sessionT = sqliteTable( 'session', 
{
    id: text('id').notNull().primaryKey(),
    userId: text('user_id').notNull().references(()=>userT.id),
    expiresAt: integer('expires_at').notNull()
});

const adapter = new DrizzleSQLiteAdapter(DB, sessionT, userT);
