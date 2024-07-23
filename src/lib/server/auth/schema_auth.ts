export  {usersT,  sessionT}
export type  UserInserType  =typeof usersT.$inferInsert;
export type  UserSelecType  =typeof usersT.$inferSelect // return type when queried

import  {sql}   from 'drizzle-orm';
import  {integer,  sqliteTable,  
         text,     uniqueIndex}  from   'drizzle-orm/sqlite-core';

const  usersT  =sqliteTable(  'user', 
  {
	id: text('id').primaryKey().notNull(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
    password: text('password').notNull(),
    accessAt: text('access_at').default(sql`CURRENT_TIMESTAMP`),
	createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
  },  
  (user)=> ({uid: uniqueIndex('uid').on(user.name)})
); // (arrow return statement) 

const  sessionT  =sqliteTable(  'session', 
  {
    id: text('id').primaryKey().notNull(),
    userId: text('user_id').notNull().references(()=> usersT.id),
    expiresAt: integer('expires_at').notNull()
});
