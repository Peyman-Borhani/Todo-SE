export  {userT,  sessionT}
export type  UserInserType  =typeof userT.$inferInsert;
export type  UserSelecType = typeof userT.$inferSelect // return type when queried

import  {sql}   from 'drizzle-orm';
import  {integer,  sqliteTable,  
         text,     uniqueIndex}  from   'drizzle-orm/sqlite-core';

const  userT  =sqliteTable(  'user', 
  {
	id: text('id').primaryKey().notNull(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
    accessAt: text('access_at').default(sql`CURRENT_TIMESTAMP`),
	createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
  },  
  (user)=> ({uid: uniqueIndex('uid').on(user.name)})
); // (arrow return statement) 

const  sessionT  =sqliteTable(  'session', 
  {
    id: text('id').primaryKey().notNull(),
    userId: text('user_id').notNull().references(()=> userT.id),
    expiresAt: integer('expires_at').notNull()
});
