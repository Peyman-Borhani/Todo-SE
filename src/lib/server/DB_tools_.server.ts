
export  {email_Exist, add_User, get_User, get_all_Users}

import  {eq}    from 'drizzle-orm';
import  {DB}    from './DB_.server';
import  {type  UserSelecType, 
         type  UserInserType, usersT
        }       from './db/schema_DB.ts';

const  email_Exist=
                async (email: string)=> 
                await  DB.select({email: usersT.email}
                ).from(usersT).where(eq(usersT.email, email))
                 .then(res=> res.length > 0);

const  add_User=
                async(usr: UserInserType)=> 
                  await DB.insert(usersT).values(usr);

//const result: User[] = db.select().from(users).all();
const   get_User=
                async(id: string)=> await DB.select(
                            { id: usersT.id,
                              name: usersT.name,
                              email: usersT.email }
                ).from(usersT).where(eq(usersT.id, id))
                            
const   get_all_Users=
                async()=> await DB.select(
                            { id: usersT.id,
                              name: usersT.name,
                              email: usersT.email }
                ).from(usersT).all();
                                //remove .all() if issue
const   del_all_Users =async()=> await DB.delete(usersT);

