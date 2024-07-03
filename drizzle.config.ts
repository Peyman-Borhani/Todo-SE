import  {defineConfig}  from  'drizzle-kit';
//import  {env}      from    '$env/static/private';
//import * as dotenv from 'dotenv';
//import type { Config } from 'drizzle-kit';

//dotenv.config();
//const {DB_URL} =process.env;
//if(!DB_URL) throw new Error(
//    'DB_URL not defined. Check environment variable(.env file)');

const env = {DB_URL: 'http://127.0.0.1:8080',  DB_Token: 'a_B-c_D'}

export default defineConfig({
  schema:   './src/lib/server/db/schema_DB.ts',
  out:      './src/lib/server/db/out',
  dialect:  'sqlite',
  //Just For Turso//  driver:   'turso',
  dbCredentials: {url : env.DB_URL,  authToken: env.DB_Token},
//'./src/lib/server/db/todo-se.db'//Just Turso// , authtoken: ''  },
//connectionString: DB_URL, //process.env.DB_URL,
  verbose: true,
  strict : true
});

/*
DB_Pass : '_AB_CD_',
DB_HOST : '0.0.0.0',
DB_PORT : '8080',
DB_USER : 'Arya',
DB_PASS : 'Maxim'
*/
