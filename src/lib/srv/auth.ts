import {DrizzleSQLiteAdapter}  from  '@lucia-auth/adapter-drizzle';

import  {sqliteTable, text, integer}  from  'drizzle-orm/sqlite-core';
import  {drizzle}       from    'drizzle-orm/better-sqlite3';
import  {sql}           from    'drizzle-orm';
import  Database        from    'better-sqlite3';

import {dev}        from  '$app/environment';

const sqliteDB = Database(':memory:');
const db = drizzle(sqliteDB);

const userTable = sqliteTable( 'user', 
{ 
    id:   text('id').notNull().primaryKey(),
    time: text('time').notNull().default(sql`CURRENT_TIMESTAMP`)
});

const sessionTable = sqliteTable( 'session', 
{   id: text('id').notNull().primaryKey(),
    userId: text('user_id').notNull().references(()=>userTable.id),
	expiresAt: integer('expires_at').notNull()
});

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);

