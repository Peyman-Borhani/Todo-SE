import  {sql}   from 'drizzle-orm';
import  {integer,  sqliteTable,  
         text,     uniqueIndex}  from   'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable(
  'users', 
  {
	id: text('id').primaryKey().notNull(),

	name: text('name').notNull(),

	email: text('email').notNull().unique(),

	password: text('password').notNull(),

	createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
  },  
  (users)=> ({uid: uniqueIndex('uid').on(users.name)})
); // (arrow return statement) 

export const  usersSessionsTable = sqliteTable(
  'users_sessions', 
  {
    id: text('id').primaryKey().notNull(),

    userId: text('user_id').notNull().references(()=> usersTable.id),
    
    expiresAt: integer('expires_at').notNull()
});

export type UserInsertSchema = typeof usersTable.$inferInsert;
