import {DrizzleSQLiteAdapter}  from  '@lucia-auth/adapter-drizzle';

import {sqliteTable, text, integer}  from 'drizzle-orm/sqlite-core';
import  sqlite      from    'better-sqlite3';
import {drizzle}    from    'drizzle-orm/better-sqlite3';

const sqliteDB = sqlite(':memory:');
const db = drizzle(sqliteDB);

const userT = sqliteTable(
    'user', {id: text('id').notNull().primaryKey()});

const sessionT = sqliteTable(
    'session', 
    {id: text('id').notNull().primaryKey(),
    userId: text('user_id').notNull().references(()=>userT.id),
	expiresAt: integer('expires_at').notNull()
});

const adapter = new DrizzleSQLiteAdapter(db, sessionT, userT);
