import  {lucia}     from '$lib/server/auth/auth_.server.ts';
import  {db}        from '$lib/server/db';
import  {Argon2id}  from 'oslo/password';
import  {fail, redirect}from '@sveltejs/kit';
import  {generateId}    from 'lucia';
import  {SqliteError}   from 'libsql';

import type { Actions, PageServerLoad }  from  './$types';

export const load: PageServerLoad = async (ev) => {
	if (ev.locals.user) return redirect(302, '/');
	return {};
};

export const  actions: Actions =
    
  {default: async (ev)=> {
		const formData =await ev.request.formData();
		const username =formData.get('username');
		const password =formData.get('password');
        
        let msg: String =
          ( typeof username !== 'string'||
			username.length  < 3        ||
			username.length  > 31       ||
			!/^[a-z0-9_-]+$/.test(username))
        ? 'user name'
        :  (typeof password !== 'string'||
            password.length  < 6        ||
            password.length > 255       )
        ? 'password'  : 'OK';

        if(msg!=='OK') return fail(400, {message: 'Invalid ' + msg});
		
        const hashedPassword =await new Argon2id().hash(password);
		const userId =generateId(15);

		try {
			db.prepare('INSERT INTO user (id, username, password) VALUES(?, ?, ?)'
            ).run(  userId,
                    username,
				    hashedPassword );

			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			ev.cookies.set( sessionCookie.name, 
                            sessionCookie.value,
                            {path: '.', ...sessionCookie.attributes}
            );
		}catch (e) {
			if( e instanceof SqliteError && e.code==='SQLITE_CONSTRAINT_UNIQUE')
			      return fail(400, {message: 'This username is already taken'});
			else  return fail(500, {message: 'Unknown error occurred'});
		}
		return redirect(302, '/');
	}
};
