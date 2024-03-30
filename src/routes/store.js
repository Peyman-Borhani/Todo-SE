import  {writable}     from    'svelte/store';

export  {D,     init, Data}
let qN= 0;  // que number
const get = (t = new Date().toISOString())=> 
    ({id: t.slice(0,10)+' '+ t.slice(11, 23),  date: t.slice(0,10),  time: t.slice(11, 24)});

const   Data = new Map(); //writable(new  Map());

const
        sort_Data=  x=>  new Map([...x].sort()),
        rev_Data =  x=>  new Map([...x].reverse()),
        set_Data =  d=>  Data.set(qN++, d);


 
const // D.o, D.one Arrays  
    D = {o:[],  one:[]}, //writable({o:[],  one:[]}) ,

    def_todos =[ // default info if not initialized.
                'Check my messages',  'review the tasks',
                'Do few job orders',  'Solve few problems 🎯',
                'Code for 2 hours',   'Write a new blog post', 
    ],
    def_dones =['Think of new ideas', 'Learn - practice - develop'];


const list = ()=> console.table(D.o);

function   init  (todos=false,  dones=false)
{   

   if(D.o.length>0 || D.one.length>0)  return  "initialized";
  //assign todos/dones params if it exist && valid else default values  
    D.o   =Array.from( (Array.isArray(todos) && todos.length>0)
                        ? todos :def_todos);
    D.one =Array.from( (Array.isArray(dones) && dones.length>0)
                        ? dones :def_dones );

    D.one.forEach( (dn, t=get(), i) => insert('done', dn, t);

    D.o.forEach(  (td, t=get()) => set_Data(
        (qN++), new Map([['todo', td], ['id', t.id], ['date', t.date], ['time', t.time], ['tasks', false] ])) );

//for(let d in D) d==='o'? console.log('heeereeeeee : ',D[d])  :{};
list();
}

function  insert(inp='', typ=0, itm, meta=get() ) {

    if(inp==='' || typeof inp!=='string')  return; //test nums
    typ= (typ || typ===1) ? 'done'  : 'todo';

    set_Data( (qN++), new Map([ ['done', dn],     ['id', t.id],
                                ['date', t.date], ['time', t.time],
                                ['tasks', false] ])
    );
    (typ==='todo')?  D.o =[inp, ...D.o]   : D.one =[inp, ...D.one];

}   

function  updateID (qID=1) 	{
        D.o.forEach(t=> (!t.done)? t.qID = qID++ : {})
        D.o.forEach(t=> (t.done) ? t.qID = qID++ : {})
} //update qID's to be in order

const   remove_Todo = td=>   D.o =D.o.filter(t=> t!==td),
        remove_Done = dn=> D.one =D.one.filter(d=> d!==dn);

function  mark(x) {
        
            let tid = D.o.indexOf(x),
                did = D.one.indexOf(x);
            if(tid && did) return "error: false ID";

            if(tid)  {remove_Todo(x);   D.one.push(x)}
            else if(did) {remove_Done(x);  D.o.push(x)}
}