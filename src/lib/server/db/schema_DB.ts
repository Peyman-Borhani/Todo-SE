export  {usersT, dataT, sessionT}
export type  UserInserType  =typeof usersT.$inferInsert;
export type  UserSelecType = typeof usersT.$inferSelect // return type when queried

import  {sql}   from 'drizzle-orm';
import  {integer,  sqliteTable,  
         text,     uniqueIndex}  from   'drizzle-orm/sqlite-core';


const  usersT  =sqliteTable(  'users', 
  {
	id: text('id').primaryKey().notNull().unique(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
    accessAt: text('access_at').default(sql`CURRENT_TIMESTAMP`),
	createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
  },  
  (users)=> ({uid: uniqueIndex('uid').on(users.name)})
); // (arrow return statement)


const  dataT  =sqliteTable(  'data', 
  {
	id: text('id').primaryKey().notNull().unique(),
	name: text('name'),
	data: text('data').notNull(),
    accessAt: text('access_at').default(sql`CURRENT_TIMESTAMP`),
	createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
  },  
  (data)=> ({uid: uniqueIndex('uid').on(data.id)})
); // (arrow return statement) 


const  sessionT  =sqliteTable(  'session', 
  {
    id: text('id').primaryKey().notNull(),
    userId: text('user_id').notNull().references(()=> usersT.id),
    expiresAt: integer('expires_at').notNull()
});
