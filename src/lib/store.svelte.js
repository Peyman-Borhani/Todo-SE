export  {make_Store}
import  {SvelteMap as sMap}  from  'svelte/reactivity';

//const url  =process.env.DB_URL,
//      token=process.env.DB_Token;   //'http://127.0.0.1:8080'; //'http://0.0.0.0:8080'
//console.log(url, token);
let qN= 1;  // que number

const time_Date = (t = new Date().toISOString())=> 
    ( { id: (t.slice(0,10)+' '+ t.slice(11, 23) ),
        date: t.slice(0,10),
        time: t.slice(11, 24)
    });
// D.o, D.one Arrays  
const   D = { o:[],   one:[] };

const   
    def_todos =[ // default info if not initialized.
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
        // Update D.o/D.one array  //remove if not needed
        (typ==='todo')  ? D.o   =[inp, ...D.o]   
                        : D.one =[inp, ...D.one];
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
    //_________initializing Data______________
    function  init (todos=false,  dones=false){

        //if(D.o.length<1 || D.one.length<1){ // "error: list initialized already";
        //assign todos/dones params if valid, else fill with default values  
        D.o   =Array.from( (Array.isArray(todos) && todos.length>0)
                            ? todos  :def_todos);
        D.one =Array.from( (Array.isArray(dones) && dones.length>0)
                            ? dones  :def_dones);
        //} //qN = 1;
        D.one.forEach( dn=> insert(dn, 'done') );
        D.o.forEach(  td=> insert(td, 'todo') );
        //for test: //Data.get(id).set('title', 'abcd')
        //console.log('item: ', Data.get(id).get('title'));
    }
    //___________________Data Tools_________________________
    const  
        remove =id=> Data.delete(id),
        mark   =id=> Data.get(id).set('done', !(Data.get(id).get('done')))
        ,
        sort    = x=>  new Map([...x].sort()),
        rev     = x=>  new Map([...x].reverse()),
        // Using Map.groupBy to sort items based on specified category
        sortBy  = (id, x)=> Map.groupBy(Data=> Data.get(id).get(x)),
        log     = ()=> {for(let d of Data.keys()) console.log(Data.get(d))};

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