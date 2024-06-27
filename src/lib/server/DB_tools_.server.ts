
export  {email_Exist, add_User}

import  {eq}    from 'drizzle-orm';
import  {DB}    from './DB_.server';
import  {userT, type UserInserType} //, type UserSelecType}
                from './db/schema_DB.ts';

const   email_Exist =
        async (email: string)=> 
            await  DB.select({email: userT.email}
                    ).from(userT
                    ).where(eq(userT.email, email))
            .then(res=> res.length > 0);

const  add_User =
        async(usr:UserInserType)=> await DB.insert(userT).values(usr);

//const result: User[] = db.select().from(users).all();
export  const   getAllUsers  =
                async()=> await DB.select(
                            {   id: userT.id,
                                name: userT.name,
                                email: userT.email
                            } ).from(userT).all();
                                //remove .all() if issue
export  const   deleteAllUsers =async()=> await DB.delete(userT);

