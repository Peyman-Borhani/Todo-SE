// reusable libSQL DB starter
export {DB}
//import Database from 'better-sqlite3';
import  {drizzle}   from 'drizzle-orm/libsql'; //BSQL3: 'better-sqlite3';
//import  Database    from 'libsql'; //BSQL3: 'better-sqlite3';
import  {createClient} from "@libsql/client";
//import  {userT, sessionT}from './schema_auth.ts'

//({file: 'auth.db'}); //'./src/lib/srv/db/todo-se.db' //(':memory:');
const  sqlite  =createClient({url: "http://127.0.0.1:8080"});
//const  sqlite =new Database('./srclb/srv/db/todo-se.db');

const  DB   =drizzle(sqlite);
