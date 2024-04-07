//export  {D, Data,   init}
let qN= 0;  // que number

const   Data = $state(new Map());

const // D.o, D.one Arrays  
    D = $state({o:[],  one:[]}); //writable({o:[],  one:[]}) ,

const   
    def_todos =[ // default info if not initialized.
            'Check my messages',  'review the tasks',
            'Do few job orders',  'Solve few problems 🎯',
            'Code for 2 hours',   'Write a new blog post', 
    ],
    def_dones =['Think of new ideas', 'Learn - practice - develop'];

const get = (t = new Date().toISOString())=> 
    ( { id: (t.slice(0,10)+' '+ t.slice(11, 23) ),
        date: t.slice(0,10),
        time: t.slice(11, 24)
    });

const
        sort_Data=  x=>  new Map([...x].sort()),
        rev_Data =  x=>  new Map([...x].reverse());

const list = ()=> console.table(D.o);
//________________________________________________


//_________initializing Data______________
function   init  (todos=false,  dones=false)
{
    if(D.o.length>0 || D.one.length>0)  return  "error: initialized already";
   //assign todos/dones params if it exist && valid else default values  
    D.o   =Array.from( (Array.isArray(todos) && todos.length>0)
                        ? todos :def_todos);
    D.one =Array.from( (Array.isArray(dones) && dones.length>0)
                        ? dones :def_dones );
    qN = 0;
    D.one.forEach( dn=> insert(dn, 'done') );

    D.o.forEach(  td=> insert(td, 'todo') );

//for(let d in D) d==='o'? console.log('heeereeeeee : ',D[d])  :{};
list();
}//______________________________________________________


//______________________Add new item________________
function  insert(inp='', typ=undefined, timer= undefined) {
    let  ctm= get();  //current time
    // makes a custom date or becomes no timer
    timer = (timer===undefined)? false  : get(timer);

    typ= (typ===undefined || typ==='todo' || timer) 
         ? 'todo' : typ==='done' ?  'done'  :false;
    if(!typ || inp.length<1 || inp===''|| typeof inp!=='string')
        return "bad input"; // test numbers

    let  done = (typ==='done')? true  :false;
    (typ==='todo')?  D.o =[inp, ...D.o]   : D.one =[inp, ...D.one];

    Data.set( (qN++), new Map([ ['done', done],
                                ['timer', timer],
                                ['id', ctm.id],
                                ['date', ctm.date],
                                ['time', ctm.time],
                                ['tasks', false] ])
    );
}   
/* 
function  updateID (qID=1) 	{
        D.o.forEach(t=> (!t.done)? t.qID = qID++ : {})
        D.o.forEach(t=> (t.done) ? t.qID = qID++ : {})
} // after any changes, this must update qID's to be in order
*/
const   remove_Todo = td=>  D.o =D.o.filter(t=> t!==td),
        remove_Done = dn=>  D.one =D.one.filter(d=> d!==dn);

function  mark(x) {
        
            let tid = D.o.indexOf(x),
                did = D.one.indexOf(x);
            if(tid && did) return "error: false ID";

            if(tid)  {remove_Todo(x);   D.one.push(x)}
            else if(did) {remove_Done(x);  D.o.push(x)}
}