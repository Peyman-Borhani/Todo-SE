import  {defineConfig}  from  'drizzle-kit';
//import  {get as env}   from  '@dotenvx/dotenvx';// config/set/status/encrypt/decrypt...

const DB_TOKEN  =process.env.DB_TOKEN,
      DB_URL    =process.env.DB_URL;

//const DB_TOKEN=env('DB_TOKEN'), DB_URL=env('DB_URL');
//const {DB_TOKEN, DB_URL} = process.env; //console.log(DB_TOKEN, DB_URL)

if(!DB_URL) throw new Error(
    'DB_URL not defined. Check environment variable(.env file)');


export default defineConfig({
  schema:   './src/lib/server/db/schema_DB.ts',
  out:      './src/lib/server/db/out',
  dialect:  'sqlite',
  dbCredentials: {url: DB_URL,  authToken: DB_TOKEN},
  verbose: true,
  strict : true
});
//'./src/lib/server/db/todo-se.db'