import  {writable}     from    'svelte/store';

export  {D,     init, Data}
let qN= 0;  // que number
const get = (t = new Date().toISOString())=> 
    ({id: t.slice(0,10)+' '+ t.slice(11, 23),  date: t.slice(0,10),  time: t.slice(11, 24)});

const   Data = writable(new  Map());

const
        sort_Data=  x=>  new Map([...x].sort()),
        rev_Data =  x=>  new Map([...x].reverse()),
        set_Data =  d=>  Data.set(qN++, d);

const list = ()=> console.table(Data);
 
const // D.o, D.one Arrays  
    D = writable({o:[],  one:[]}) ,

    def_todo  =[ // default info if not initialized.
                'Check my messages',  'review the tasks',
                'Do few job orders',  'Solve few problems 🎯',
                'Code for 2 hours',   'Write a new blog post', 
    ],
    def_done =[ 'Think of new ideas', 'Learn - practice - develop'];

function   init  (todos=false,  done=false)
{   let  tL= todos.length,  dL= done.length;
    //if no/false params for todos assigns default values.
    if( !Array.isArray(todos) && !tL>0)  todos= def_todo;
    else if(!D.o)  for (let t of todos)  D.o.push(t); //assign input
    // if no/false params for done assigns default values
    if( !Array.isArray(done) && !done.length>0)  done = def_done;
    else if(!D.one)  for(let d of done)  D.one.push(d); //aassign input

    D.one.forEach( (dn, t=get()) => set_Data(
        (qN++), new Map([ [text, dn], [id, t.id], [date, t.date], [time, t.time] ])) );

    D.o.forEach(  (td, t=get()) => set_Data(
        (qN++), new Map([[text, td], [id, t.id], [date, t.date], [time, t.time] ])) );
}

function  insert(inp='') {
    // inp
    if( inp==='') { inp.blur(); return }
    //if ( !inp.value.endsWith('.') )  inp.value+= '.';

      let todo = {  qID  : qN++, // 1
                    done: false,
                    text: inp.value //data.detail.input
               };   // console.log(todo.text);

    inp.value = ''; // updateID(2)
    inp.blur();
    D.o = [todo, ...D.o];
}   

function  updateID (qID=1) 	{  
        D.o.forEach(t=> (!t.done)? t.qID = qID++ : {})
        D.o.forEach(t=> (t.done) ? t.qID = qID++ : {})
} //update qID's to be in order

function  remove_Todo(td)  	{D.o=D.o.filter(t=> t!==td)}
function  remove_Done(dn)  	{D.one =D.one.filter(d=> d!==dn)}

function  mark(x) {
                    let tid = D.o.indexOf(x),
                        did = D.one.indexOf(x);
                        if(tid && did) return;

                    if(tid)  {remove_Todo(x);   D.one.push(x)}
                    else if(did) {remove_Done(x);  D.o.push(x)}
}