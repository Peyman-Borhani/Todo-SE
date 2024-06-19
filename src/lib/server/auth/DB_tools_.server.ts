
export  {email_Exist, add_User}

import  {eq}    from 'drizzle-orm';
import  {DB}    from './DB_.server';
import  {userT, type UserInsertSchema } from './schema_auth.ts';

const   email_Exist =
        async (email: string)=> 
            await  DB.select({email: userT.email}
                    ).from(userT
                    ).where(eq(userT.email, email))
            .then(res=> res.length > 0);

const  add_User =
        async(usr:UserInsertSchema)=> await DB.insert(userT).values(usr);

export  const   getAllUsers  =
                async()=> await DB.select(
                            {id: userT.id,
                            name: userT.name,
                            email: userT.email
                            }).from(userT);

export  const   deleteAllUsers =async()=> await DB.delete(userT);

