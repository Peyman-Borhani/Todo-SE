import  {defineConfig}  from  'drizzle-kit';
//import  {ENP}      from    '$env/static/private';

export default defineConfig({
  schema:   './src/lib/srv/db/schema.ts',
  out:      './src/lib/srv/db/out',
  dialect:  'sqlite',
  dbCredentials: {url: './src/lib/srv/db/todo-se.db'}, //'localDB/sql.db' },
    //connectionString: process.env.DB_URL,
  verbose: true,
  strict: true,
});
