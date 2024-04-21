//import  {Map}  from  'svelte/reactivity';
export  {Data_fn}

let qN= 1;  // que number

const getTime = (t = new Date().toISOString())=> 
    ( { id: (t.slice(0,10)+' '+ t.slice(11, 23) ),
        date: t.slice(0,10),
        time: t.slice(11, 24)
    });

const // D.o, D.one Arrays  
    D = { o:[],   one:[] }; //writable({o:[],  one:[]}) ,

const   
    def_todos =[ // default info if not initialized.
            'Check my messages',  'review the tasks',
            'Do few job orders',  'Solve few problems 🎯',
            'Code for 2 hours',   'Write a new blog post', 
    ],
    def_dones =['Think of new ideas', 'Learn - practice - develop'];


function  Data_fn()
{
    const   Data = $state(new Map());
    //_________initializing Data______________
    function   init  (todos=false,  dones=false)
    {
        if(D.o.length>0 || D.one.length>0)  return  "error: initialized already";
    //assign todos/dones params if it exist && valid else default values  
        D.o   =Array.from( (Array.isArray(todos) && todos.length>0)
                            ? todos :def_todos);
        D.one =Array.from( (Array.isArray(dones) && dones.length>0)
                            ? dones :def_dones );
        qN = 1;
        D.one.forEach( dn=> insert(dn, 'done') );
        D.o.forEach(  td=> insert(td, 'todo') );
    //for(let d in D) d==='o'? console.log('logArr : ',D[d])  :{};
    }
    //____________________Add new item__________________
    function  insert(inp='',    typ='todo',
                     timer='_', now = getTime())
    {   //__Check/set the type of input
        if (typ!=='todo' || typ!=='done')  typ= false;
        // check if date/time input is valid [min, hr, day, month, year]
        // * TODO: format the timer ************************************
        if (timer.length<22 || timer!=='_')  timer= false
        //test numbers || typeof inp!=='string')
        if(!typ || !timer || inp.length<1 || inp==='' 
                || now.length<22)  return "bad input"; 
        // Update D.o/D.one array  //remove if not needed
        (typ==='todo')  ? D.o   =[inp, ...D.o]   
                        : D.one =[inp, ...D.one];
        // nake a unique id    // C.randomUUID();
        let id = URL.createObjectURL(new Blob([])).slice(-36);   
        // setting a new Map item
        Data.set( id, new Map([ ['done',  (typ==='done')],
                                ['item',  inp],
                                ['que',   (qN++)],
                                ['date',  now.date],
                                ['time',  now.time],
                                ['timer', timer],
                                ['tasks', false] ])  );
        URL.revokeObjectURL(id);
    }
    //___________________Data Tools_________________________
    const  
        remove  = q=> Data.delete(q),
        mark    = q=> Data[q].done.set(true),
        sort    = x=>  new Map([...x].sort()),
        rev     = x=>  new Map([...x].reverse()),
        // Using Map.groupBy to categorize items based on quantity
        sortBy  = (id,x)=> Map.groupBy(Data, x=> Data.id.get(x));
        //log=  ()=> {for(let d of Data.keys()) console.table(d)}
    return { 
            get Data(){ return Data},   
            init,   insert,  remove,  mark,
            sort,   rev,     sortBy
    }
}//___________________________________________________
/* 
// after any changes, this must update qID's to be in order
function  updateID (qID=1) 	{
        D.o.forEach(t=> (!t.done)? t.qID = qID++ : {})
        D.o.forEach(t=> (t.done) ? t.qID = qID++ : {})
}//__________________________________________________________

// Using Map.groupBy to categorize items based on quantity
const result = 
	Map.groupBy(store,({quantity})=> quantity<9? 'restock' :'ok');

*/
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