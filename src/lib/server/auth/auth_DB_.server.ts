// single file Auth DB on server

import  {DrizzleSQLiteAdapter}  from  '@lucia-auth/adapter-drizzle';
import  {createClient}  from    '@libsql/client';
import  {drizzle}       from    'drizzle-orm/libsql';
import  {sql}           from    'drizzle-orm';
import  {sqliteTable, text, 
         uniqueIndex, integer}  from  'drizzle-orm/sqlite-core';

//import  Database    from  'libsql';
const  sql_DB =createClient({url: 'http://127.0.0.1:8080'}); // Database(':memory:');  //file: './src/lib/srv/db/todo-se.db'

const  DB     = drizzle(sql_DB);

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

const adapter =new DrizzleSQLiteAdapter(DB, sessionT, userT);
