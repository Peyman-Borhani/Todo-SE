export  {init,  insert}

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
    //current date/time
    let  ctm= get();  
    //__Check/set the type of input
    typ =   (typ===undefined || typ==='todo') ?  'todo'  
                    : (typ==='done') ? 'done' :  false;
    // check if date/time input is valid [min, hr, day, month, year]
    timer =  (timer===undefined) ?  '_'  // todo: format the timer,
            : (timer.length===24)? timer // correct? set countdown.
            : false;                     // else: bad input.
    //test numbers || typeof inp!=='string')
    if(!typ || !timer || inp.length<1 || inp==='')
        return "bad input"; 
    // item status done or not? 
    let  done = (typ==='done')? true  :false;
    // Update D.o/D.one array  //remove if not needed
    (typ==='todo')  ? D.o   =[inp, ...D.o]   
                    : D.one =[inp, ...D.one];
    // setting a new Map item
    Data.set( (qN++), new Map([ ['done',  done],
                                ['item',  inp],
                                ['id',    ctm.id],
                                ['date',  ctm.date],
                                ['time',  ctm.time],
                                ['timer', timer],
                                ['tasks', false] ])
    );
}
/*  Todo: sort/groupBy
function  updateID (qID=1) 	{
        D.o.forEach(t=> (!t.done)? t.qID = qID++ : {})
        D.o.forEach(t=> (t.done) ? t.qID = qID++ : {})
} // after any changes, this must update qID's to be in order
*/

const  remove = qID=> Data.delete(qID);
const  mark = qID=> Data.qID?.done.set(true);

function save(file_name) {
        //name= task_name = document.getElementsByTagName('VAR').item(0).innerText; 
        let  S  =localStorage;
        console.log(file_name);
        Data.forEach( (t, i)=> {S.setItem((file_name+i), t.text)} );  // Storing Todos data
}//__________________________________________________________________

function load(file_name) {
    // loading Todos data
        let   LS = localStorage.key(file_name);   
        LS = localStorage.getItem(LS); 
        console.log(LS)
}