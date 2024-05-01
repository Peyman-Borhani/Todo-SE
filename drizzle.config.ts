import  {defineConfig}  from 'drizzle-kit';

export default defineConfig({
  schema:   './src/lib/srv/db/schema.ts',
  out:      '.src/lib/srv/db/out',
  driver:   'better-sqlite',
  dbCredentials: { url: './src/lib/srv/db/todo-se-db.sql'}, //'localDB/sql.db' },
    //connectionString: process.env.DB_URL,
  
  verbose: true,
  strict: true,
})
