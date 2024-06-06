//import Database from 'better-sqlite3';
import  {drizzle}   from 'drizzle-orm/libsql'; //BSQL3: 'better-sqlite3';
//import  Database    from 'libsql'; //BSQL3: 'better-sqlite3';
import  {createClient} from "@libsql/client";
import  {userT, sessionT}from './schema.ts'

//({file: 'auth.db'}); //'./src/lib/srv/db/todo-se.db' //(':memory:');
const  sqlite  =createClient({url: "http://127.0.0.1:8080"});
//const  sqlite =new Database('./srclb/srv/db/todo-se.db');

export  const  DB =drizzle(sqlite);
