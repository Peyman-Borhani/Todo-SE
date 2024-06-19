import  {lucia}             from  '$lib/server/auth';
import  {fail, redirect}    from  '@sveltejs/kit';

import type {Actions, 
             PageServerLoad} from './$types';

export const load: PageServerLoad = 
        async (ev)=>    (!ev.locals.user) ? redirect(302, '/login')
                                          : {user: ev.locals.user};

export const actions: Actions = {
	default: async (ev)=> {
		if (!ev.locals.session) return fail(401);

		await lucia.invalidateSession(ev.locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		ev.cookies.set( sessionCookie.name,
                        sessionCookie.value, {
			            path: '.',
			            ...sessionCookie.attributes
		});
        
		return  redirect(302, '/login');
	}
};
