// lucia auth libSQL client
import  {dev}   from  '$app/environment';
import  {DB}    from  '../DB_.server.ts';
//import  {createClient}  from  '@libsql/client';
import  {Lucia}         from  'lucia';
import  {userT, sessionT}     from './schema_auth.ts';
import  {DrizzleSQLiteAdapter}from '@lucia-auth/adapter-drizzle';

//const  sqlite =createClient({url: "http://127.0.0.1:8080"});//(':memory:'); //file: './src/lib/srv/db/todo-se.db'
//console.log(sqlite);
const  adapter  =new DrizzleSQLiteAdapter(DB, sessionT, userT);

export const  lucia  =new Lucia(adapter, 
  {
	sessionCookie: {attributes: {secure: !dev}},
	getUserAttributes: (attributes)=> 
        ({name: attributes.name, email: attributes.email})
  }
);

declare module  'lucia' {
  interface  Register 
  {
    Lucia: typeof lucia;
    DatabaseUserAttributes:{name : string;
                            email: string}
  }
}
