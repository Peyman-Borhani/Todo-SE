import {DrizzleSQLiteAdapter}  from  '@lucia-auth/adapter-drizzle';

import  {drizzle}       from    'drizzle-orm/better-sqlite3';
import  {sql}           from    'drizzle-orm';
import  {sqliteTable, text, 
         uniqueIndex, integer}  from  'drizzle-orm/sqlite-core';

import  Database    from  'better-sqlite3';

import {dev}        from  '$app/environment';

const  sqliteDB = Database(':memory:');
const  db       = drizzle(sqliteDB);

const  userT  =sqliteTable( 'user', 
{
    id      : text('id').notNull().primaryKey(),
    name    : text('name').notNull(),
    password: text('password').notNull(),
    accessAt: text('access_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
},  
(user)=> ({uid: uniqueIndex('uid').on(user.name)})
); // (arrow return statement) 


const  sessionT  =sqliteTable( 'session', 
{   
    id:     text('id').notNull().primaryKey(),
    userId: text('user_id').notNull().references(()=>userT.id),
	expiresAt: integer('expires_at').notNull()
});

const adapter =new DrizzleSQLiteAdapter(db, sessionT, userT);
