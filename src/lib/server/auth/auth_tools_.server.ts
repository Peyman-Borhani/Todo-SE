export {set_Session, del_Session}

import type  {Cookies}  from  '@sveltejs/kit';
import type  {Lucia}    from  'lucia';


const  set_Session  =async ( lucia  : Lucia,  
                             userId : string, 
                             cookies: Cookies
    )=>{
        const  session  =await lucia.createSession(userId, {});
        const  set_S_Cookie =lucia.createSessionCookie(session.id);

	    cookies.set( set_S_Cookie.name,
                     set_S_Cookie.value,
                    {path: '.',...set_S_Cookie.attributes}
	    );
};


const  del_Session  =async( lucia: Lucia, 
                            cookies: Cookies
    )=>{
	    const  del_S_Cookie  =lucia.createBlankSessionCookie();

	    cookies.set(del_S_Cookie.name,
                    del_S_Cookie.value,
                    {path: '.',...del_S_Cookie.attributes}
        );
};
