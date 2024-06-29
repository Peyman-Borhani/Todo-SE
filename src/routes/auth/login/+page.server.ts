import {fail, redirect} from '@sveltejs/kit';
import {lucia}      from  '$lib/server/auth';
import {Argon2id}   from  'oslo/password';
import {db}         from  '$lib/server/db';

import type {Actions, PageServerLoad} from './$types';
import type {DatabaseUser} from '$lib/server/db';

export const load: PageServerLoad = 
  async (ev)=> {
	if (ev.locals.user)  return  redirect(302, '/');
	return {};
};

export const actions: Actions = 
{
	default: async (ev)=> 
    {
		const formData = await ev.request.formData();
		const usr_N = formData.get('username');
		const pass_W = formData.get('password');

		if (typeof  usr_N !== 'string'
         || usr_N.length < 3 
         || usr_N.length > 31 
         || !/^[a-z0-9_-]+$/.test(usr_N)
		)  return fail(400, {message: 'Invalid username'});
		
		if (typeof pass_W !== 'string' 
            ||  pass_W.length < 6 
            ||  pass_W.length > 255
        ){
			return fail(400, {message: 'Invalid password'});
		}

		const usr_OK = 
                    db.prepare('SELECT * FROM user WHERE username = ?'
                     ).get(usr_N) as | DatabaseUser | undefined;

		if (!usr_OK) 
         return fail(400,{message: 'incorrect username or password'});
		

		const pass_OK = 
                await new Argon2id().verify(usr_OK.password, pass_W);
		
        if (!pass_OK) 
            return fail(400, {message: 'incorrect username or password'});
		
		const session = await lucia.createSession(usr_OK.id, {});
		
        const sessionCookie = lucia.createSessionCookie(session.id);
		
        ev.cookies.set( 
                        sessionCookie.name, 
                        sessionCookie.value,
			            {path: '.',...sessionCookie.attributes}
		);

		return redirect(302, '/');
	}
};
