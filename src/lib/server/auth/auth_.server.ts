export  {lucia}
// main auth file - libSQL client - lucia + drizzle 
import  {dev}   from  '$app/environment';
import  {DB}    from  '../DB_.server.ts';
import  {Lucia} from  'lucia';
import  {userT, sessionT}     from './schema_auth.ts';
import  {DrizzleSQLiteAdapter}from '@lucia-auth/adapter-drizzle';

const  adapter  =new DrizzleSQLiteAdapter(DB, sessionT, userT);

const  lucia  = new Lucia(
    adapter, 
    { sessionCookie: {attributes: {secure: !dev}},
	  getUserAttributes: atr=> ({name: atr.name, email: atr.email})
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

