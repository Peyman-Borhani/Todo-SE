export  {make_Store}        //, output}
//import  {Map}  from  'svelte/reactivity';

// non auth Database
//import  {sql}       from    'drizzle-orm';
import  {userT, sessionT}     from './server/db/schema_DB.ts';
import  {drizzle}   from 'drizzle-orm/libsql'; //BSQL3// 'drizzle-orm/better-sqlite3';
import  {migrate}   from 'drizzle-orm/libsql/migrator'; //BSQL3// 'drizzle-orm/better-sqlite3/migrator';
import  Database    from 'libsql'; //BSQL3// 'better-sqlite3';
import  {createClient} from "@libsql/client";
//import  {env}       from  '$env/static/private'

const url  ='http://127.0.0.1:8080'; //'http://0.0.0.0:8080'
const opts ={syncUrl: url, AuthToken: 'a_B-c_D'}

const  DB_path  ='./src/lib/server/db/todo.db' //':memory:'
const  client   =createClient({url: url});
//const  db       =new  Database(DB_path,  opts);//sqlite
const  db       =new  Database(':memory:');//sqlite

const  d_DB  = drizzle(client);

console.log('db___', d_DB,'cl____', client)

//libSQL //db.exec("CREATE TABLE users (@userT)");
//libSQL //db.exec("INSERT INTO userT (id, name, email) VALUES (1, 'ABC', 'ABC@example.org')");
const row = db.prepare("SELECT * FROM @userT WHERE id = ?").get(1);
/*
//BSQL3// const  insert  =db.prepare('INSERT INTO userT (id, name, email) VALUES (@id, @name, @email)');
               //db.insert(users).values(user).run();

//console.log(`Name: ${row.name}, email: ${row.email}`);

//BSQL3// const  getAll  =db.select().from(user).all().get().values().run();

const  output = ()=> {migrate(db, {migrationsFolder: './src/lib/srv/db/out'});  sqlite.close() }

const   insertMany  =db.transaction( (users)=> {
                    for (const usr of users)  db.insert.run(usr) });

insertMany( [{id: 1, name: 'Arma'}, 
             {id: 2, name: 'Ben'},
             {id: 3, name: 'Cita'}] );
output()
//BSQL3// setTimeout(()=>{console.log(getAll)}, 3000);
*/
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


function  make_Store()
{
    let   Data = $state(new Map());
  
    //let complete = false;
  //____________________Add new item__________________
     function insert (inp='', typ='todo', timer='_', now = getTime().toString()){
        //__Check/set the type of input
        if(typ!=='todo' && typ!=='done') typ=false;
        // * TODO: check if date/time input is valid [min, hr, day, month, year]
        //  format the timer ************************************
        if (timer!=='_' && timer.length<5)  timer= false; 
        // * Todo: test numbers || typeof inp!=='string' now format)
        if (!typ || !timer || inp.length<1 || inp==='' || now.length<5)
            {console.log('bad input'); return}
        // Update D.o/D.one array  //remove if not needed
        (typ==='todo')  ? D.o   =[inp, ...D.o]   
                        : D.one =[inp, ...D.one];
        // nake a unique id    // C.randomUUID();
        let id = URL.createObjectURL(new Blob([])).slice(-36); //36  
         
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
    //_________initializing Data______________
    function  init (todos=false,  dones=false){

       // if(D.o.length<1 || D.one.length<1){ // "error: if initialized already";
        //assign todos/dones params if it exist && valid else default values  
            D.o   =Array.from( (Array.isArray(todos) && todos.length>0)
                                ? todos :def_todos);
            D.one =Array.from( (Array.isArray(dones) && dones.length>0)
                                ? dones :def_dones );
        //} //qN = 1;
        D.one.forEach( dn=> insert(dn, 'done') );
        D.o.forEach(  td=> insert(td, 'todo') );
        //console.log('Daaaaaaaataaaa: ',Data.size);
    }
    //___________________Data Tools_________________________
    const  
        remove  = id=> Data.delete(id),
        mark    = id=> Data[id].done.set(!Data[id].done),
        sort    = x=>  new Map([...x].sort()),
        rev     = x=>  new Map([...x].reverse()),
        // Using Map.groupBy to categorize items based on quantity
        sortBy  = (id, x)=> Map.groupBy(Data=> Data.get(id).get(x)),
        log     = ()=> {for(let d of Data.keys()) console.log(d)};
        
    return { 
            get Data() {return Data},   
            init,   insert,  remove,  mark,
            sort,   rev,     sortBy,  log
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