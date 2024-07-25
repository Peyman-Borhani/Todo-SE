export  {make_Store}
import  {SvelteMap as sMap}  from  'svelte/reactivity';

//const url  =process.env.DB_URL,
//      token=process.env.DB_Token;   //'http://127.0.0.1:8080'; //'http://0.0.0.0:8080'
//console.log(url, token);
let qN = 1,  // que number
    initialized =  false;

const time_Date = (t = new Date().toISOString())=> 
    ( { id: (t.slice(0,10)+' '+ t.slice(11, 23) ),
        date: t.slice(0,10),
        time: t.slice(11, 24)
    });
    
// D.o, D.one Arrays  //loading? must placed in order in array
const   D = { o:[],   one:[] };

const   // default demo mode data  (not loaded / not a new project).
    def_todos =[ 
            'Check my messages',  'review the tasks',
            'Do few job orders',  'Solve few problems 🎯',
            'Code for 2 hours',   'Write a new blog post', 
    ],      
    def_dones =['Think of new ideas', 'Learn - practice - develop'];


function  make_Store()
{
    let   Data = $state(new sMap());
  
    //let complete = false;
  //____________________Add new item__________________
    function insert (inp='', typ='todo', timer='_', now=time_Date(), check=true, tasks='_')
    { //__Check/set the type of input
      if (check)
      {  
        if (typ!=='todo'  &&  typ!=='done')  typ=false;
        // * TODO: check if date/time input is valid [min, hr, day, month, year]
        //  format the timer ************************************
        // todo: precise the time check
        if (now.date.length!==10 || now.time.length<5)  now=false;
        if (timer!=='_'  &&  timer.length<5)  timer= false; 
        // * Todo: test numbers || typeof inp!=='string' now format)
        if (!typ || !timer || !now || !tasks || inp.length<1
                                   || inp==='' || inp===' ')
           {console.log('bad input at:  ', inp);  return}
      }
        // Add new records to D.o/D.one if project is live (initialized)
        if(initialized) {typ==='todo' ?  D.o.push(inp)   
                                      :  D.one.push(inp);
        } 
        console.log(D.o);
        // nake a unique id    // C.randomUUID();
        let id = URL.createObjectURL(new Blob([])).slice(-36); //36  
        
        // setting a new Map item
        Data.set(id, new sMap([ ['done' , (typ==='done')],
                                ['title', inp],
                                ['que'  , (qN++)],
                                ['date' , now.date],
                                ['time' , now.time],
                                ['timer', timer],
                                ['tasks', false] ])  );
        URL.revokeObjectURL(id);
    }  
    //____initialize / load  Data __________ params type: Array
    function  init (todos=false,  dones=false){
      if( initialized && todos!=='new')  //if initialized
         return("Dev Error: list initialized already, use: init('new') for new project");
      qN = 1;  // resets que number
      //if new project 
      if(todos==='new') {D.o=[];   D.one=[]} // then returns
      else  //assign todos/dones if params provided and valid,
      {    //or fill with default values if no params passed in
        D.o   =Array.from( (Array.isArray(todos) && todos.length>0)
                            ? todos  :def_todos);
        D.one =Array.from( (Array.isArray(dones) && dones.length>0)
                            ? dones  :def_dones);
        D.one.forEach( dn=> insert(dn, 'done') );
        D.o.forEach(  td=> insert(td, 'todo') );
      }
      initialized = true;
    }
    //___________________Data Tools_________________________
    const  
        remove =id=> Data.delete(id),
        mark   =id=> Data.get(id).set('done', !(Data.get(id).get('done')))
        ,
        sort    = x=>  new Map([...x.entries()].sort()),
        rev     = x=>  new Map([...x.entries()].reverse()),
        // Using Map.groupBy to sort items based on specified category
        sortBy  = (id, x='time')=> Map.groupBy(Data=>  Data.get(id).get(x)),
        log     = ()=> {for(let d of Data.keys()) console.log(Data.get(d).title)};

    return {  Data, //get Data()  {return  Data},
              init,  insert,  log,  sort,
              mark,  remove,  rev,  sortBy
    }
}//___________________________________________________

/* 
        set Data(id) {
          return {remove: id=> Data.delete(id),   
                  mark  : id=> Data.get(id).set('done', 
                              !Data.get(id).get('done')) }
        }
// after any changes, this must update qID's to be in order
function  updateID (qID=1) 	{
        D.o.forEach(t=> (!t.done)? t.qID = qID++ : {})
        D.o.forEach(t=> (t.done) ? t.qID = qID++ : {})
}//__________________________________________________________
// Using Map.groupBy to categorize items based on quantity
const result = 
	Map.groupBy(store,({quantity})=> quantity<9? 'restock' :'ok');


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
*/