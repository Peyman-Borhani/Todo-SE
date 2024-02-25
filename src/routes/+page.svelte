<script>
    import  { fade, crossfade }   from  'svelte/transition';
    import  { quintOut }		  from  'svelte/easing';
    import  { flip     }		  from  'svelte/animate';
    import	  Input				  from  './Input.svelte';
    import	  Menu				  from  './Menu.svelte' ;	

//		import  { item     }		  from  './Input.svelte';
const [send, receive] = crossfade( 
      {
        duration: d => Math.sqrt(d * 400), 
        fallback(node, params) { 
                const style = getComputedStyle(node);
                const transform = style.transform === 'none' ? '' : style.transform;

                return {duration: 900,
                        easing  : quintOut,
                        css     : t => ` transform: ${transform} 
                                         scale(${t});
                                         opacity  : ${t} `
                };
        }
    });

let idx   = 1;
let focus = 0;
let L = true; // L means Keyboard focus on left side (todo)
let footer, info, zoom, view; // App keyboard controls, as props sent to info component
let prvKey; // The key pressed previously
let task_name;

let todos = [	{ id: idx++,  done: true ,  text: 'Think about new ideas.' },
            { id: idx++,  done: false,  text: 'Learn new things.'      },
            { id: idx++,  done: true ,  text: 'Check my messages.'     },
            { id: idx++,  done: false,  text: 'Handle few job orders.' },
            { id: idx++,  done: false,  text: 'Write some code. 🗑'     },
            { id: idx++,  done: false,  text: 'Solve few problems.🎯'  },
            { id: idx++,  done: false,  text: 'Write a new blog post.'  },
          ];


function  insert(inp) {
                    if(inp.value==='') { inp.blur();   return }
                    if ( !inp.value.endsWith('.') )  inp.value+= '.';

                      let todo = {  id  : idx++, // 1
                                    done: false,
                                    text: inp.value //data.detail.input
                               };   // console.log(todo.text);

                    inp.value = ''; // updateID(2)
                    inp.blur();
                    todos = [todo, ...todos];
}   

function  updateID(id=1) 	{  todos.forEach(t=> (!t.done)? t.id = id++ : {})
                             todos.forEach(t=> (t.done) ? t.id = id++ : {})
                           } //update ID's to be in order

function  remove(todo)  	{  todos = todos.filter(t => t !== todo)  }

function  mark(todo, state) { todo.done = state;
                            remove(todo);
                            todos = todos.concat(todo);
}


function keyInput(k){ // keyboard input handler

let c=0;    // counter to check if any element left over
if(k.target.id==='typin' || k.target.id==='task-name' || todos.length===0)  return; 
//alert(k) //if user is typing or empty list return.
k = k.which;// console.log(event.srcElement.style)
switch(k) { 
        case 32:	footer = !footer;	// space key Footer visible.
                    if(info) {info = false;  footer = false}
                    break;

        case 73:	if(footer) {info = true; footer = false}
                    else info = !info; // i key: show or remove app info 
                    break;
        
        case 37:  
        case 39:	// Left or Right keys pressed
                    focus = 0; 	  // focus is the selected element virtual index
                    L = (k===37) ?   true   : false;
                                  //reaching the first todo(left side) or done(right side)
                    if  (k===37)  while(todos[focus].done)  focus++;
                    else          while(!todos[focus].done) focus++;
                    break;

        case 38:   //up
                    if(L) while( focus>0 && todos[focus-1].done  ) {focus--; c++} //todo
                    else  while( focus>0 && !todos[focus-1].done ) {focus--; c++} //done
                    if(c===todos.length) break; //if all is from opposite site
                    if(focus>0) focus--; //go up -1
                    else focus = todos.length-1;
                    break;

        case 40: 	//down
                    if(focus+1===todos.length) focus = -1;
                    if(L) while(todos[focus+1].done)  {focus++; c++} //todo
                    else  while(!todos[focus+1].done) {focus++; c++} //done
                    if(c!==todos.length) focus++; //if all is not from opposite side
                                                 // go down +1
                    break;
        
        case 46:
        case 110: 	// del  or   .
                    remove(todos[focus]);
                    if (focus===0) {}
                    else if (focus > 0) focus--;
                    else if(focus+1 <= todos.length) focus++;
                    updateID(); focus = 0;
                    break;
          
        case 107:   zoom=!zoom;  //document.documentElement.style.setProperty('--size', 'calc((3vh + 4vw)/2)'); 
                    save(); load();  
                    break; // pressed +
                    
        case 86:	view = !view;	break; // view button

        case 13:	if(focus >=0)  //if enter key pressed and keyboard focused	
                      todos[focus].done = (todos[focus].done) ?  false  : true;
                    break;
        
        case 83:    if(prvKey===83) save(); break;  //to save data press double s
        
        case 76:    if(prvKey===76) load(); break;  //to save data press double l
                    
        default: 	focus=-1;   event.target.firstChild.firstChild.focus();
                    break;
 }
prvKey = k; // saves the key so next time the previous will be known.
}

function save() {	let tid  = 0;  let l = localStorage;
                    task_name = document.getElementsByTagName('VAR').item(0).innerText; 
                    console.log(task_name);
                    todos.forEach( (t=>{ l.setItem((task_name+tid), t.text); tid++ } ) );  // Storing todos data
}


function load() { let s = localStorage.key(0);   
                    //  s = localStorage.getItem(s); 
                        //console.log(s) // loading todos data
}

</script>


<svelte:window	  on:keydown = {keyInput} />

<div	class = 'board'	  on:contextmenu = {false}>

<Input	 on:keydown = {e=> e.which===13 && insert(e.target)}  />


<header  class = 'left'>     <h1> Todo </h1>    </header>

    <div	class = 'left' 
            on:pointerenter = { ()=> focus = -1 }
            on:pointerleave = { ()=> focus = -1 }
        >
        {#each todos.filter(t => !t.done) as todo (todo.id)}
            <label  animate:flip  = {{duration: 600}}
                    in:receive    = {{key: todo.id }}
                    out:send      = {{key: todo.id }}
                    on:contextmenu = {e=>alert(e.target)}
                    on:pointerenter = {e=>e.currentTarget.classList.add('hovr')}
                    on:pointerleave = {e=>e.currentTarget.classList.remove('hovr')}
                    class:hovr    = {L && todo.id===focus+1}
                >
                    <input    type = checkbox   on:change = { ()=>{ mark(todo, true) } }
                            > {todo.id}. {todo.text} 
                
                    <button   class = 'trash'   on:click  = { ()=> { remove(todo) } }
                            > remove 
                    </button>
            </label>
        {/each}
    </div>


<header  class = 'right'>     <h1> Done </h1>    </header>

    <div    class = 'right'
            on:pointerenter = {()=>focus=-1}
            on:pointerleave = {()=>focus=-1}
        >
        {#each todos.filter(t => t.done) as done (done.id)}
            <label  class         = "done"
                    animate:flip  = {{duration: 600}}
                    in:receive    = {{key: done.id}}
                    out:send      = {{key: done.id}}
                    on:pointerenter = { e=> e.currentTarget.classList.add('hovr')    }
                    on:pointerleave = { e=> e.currentTarget.classList.remove('hovr') }
                    class:hovr    = { !L && done.id===focus+1 }
                >
                    <input    type = checkbox   checked   on:change = { ()=> mark(done, false)}
                            > ✔ &nbsp {done.id}. {done.text}

                    <button   class= 'trash'   on:click = {() => remove(done)} 
                            > remove
                    </button>
            </label>
        {/each}
    </div>
</div>


<Menu  {footer} {info} {zoom} {view} />





<style>

:global(body) { 
        overflow : hidden;              background-color: #334;
        font-size: var(--size);         user-select     : none; 
        --size   : calc((3.2vh + 2.2vw)/2);
}

.board {	
        display : grid;		    background-color: #345;
        padding : 4vmin;	    border-radius	: 4vmin;  
        height  : 86vh;		    user-select     : none;
        margin  : 2vh 1vw;      box-shadow	    : 0 0 4vmin #000; 
        overflow: hidden;       justify-content : center;
        gap     : 2vh 5vw;	    grid-template-rows   : 8vh 16vh auto;
                                grid-template-columns: repeat( 2, minmax(40vw, 1fr) );
}


header{ grid-row: 2 }	.left { grid-column: 1}        .right { grid-column: 2 }

h1    {						        background-color: #002; 
        grid-row   : 2;             letter-spacing  : .2ch;
        color      : #eee;        border-radius   : 6vmin;
        font-weight: 400;	        text-align  : center;	 	       
                                    box-shadow  : 0 0 3vmin #888;	        								
}


label {		
        position   : relative;		margin  : 0 0 2.5vh 0;
        color      : #333;		   padding : 1vh 1em .5em 2em;
        text-indent: -2.4ch;		border  : 1px solid hsl(240, 8%, 70%);
        user-select: none;	        box-shadow 		: 0 0 1ch #000;
        text-align : left;          text-shadow		: 0.1ch 0.1ch 0.2ch #555;
        overflow   : hidden;        background-color: hsl(200, 10%, 86%);
        font-weight: 600;           border-radius	: 0.4em;
        grid-row   : 3;          
}

.hovr  {  
        color			:black;
        box-shadow 		: 0 0 1ch #fff !important;
        background-color: #fff;
        text-shadow		: 0 0 0.3ch #123;
        transform  		: scaleX(1.08) scaleY(1.12);
}

input[type = "checkbox"]  { display : none }   

                                    
.done {  	
        color: #aaa;		   	   text-align: left;
        line-height: 1;		  		box-shadow: 0 0 0.7ch #49a;
        text-indent: -3ch;			border	  : 1px solid #000;
                                    background-color: hsla(211, 71%, 8%, .4);
}

.done::first-letter {   color: #0b9;	  font-size: 2.4ch   }
                             
.done.hovr 	{   opacity: 1;   		background-color: rgb(8, 28, 48)   }


label:hover .trash   {opacity: 0.6}
.trash:hover:enabled {opacity: 1; 		transform: scaleX(1.31) scaleY(1.28)}

.trash {
        position : absolute;
        top   : 0;                  width  : 2.7ch;
        right : .3ch;              	height : 100%;
        border: none;	           	opacity: 0;
        cursor: pointer;         	transition: opacity 0.3s;
        text-indent: -9999px;     /* accesiblity: a text for trash placed far away */
        background : no-repeat 60% 60% url(
        "data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg'  viewBox='0 0 24 24'%3E%3Cpath fill='%23676778' d='M12,2C17.53,2 22, 6.47 22, 12C22, 17.53  17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12, 2M17, 7H14.5L13.5,6H10.5L9.5, 7H7V9H17V7M9, 18H15A1, 1 0 0,0 16,17V10H8V17A1,1 0 0,0 9,18Z'%3E%3C/path%3E%3C/svg%3E");
        background-size: 1.7em 1.6em;
}

/* and (view) */
@media screen and (orientation: portrait)
{   
    :global(body)	{	--size: calc((2.8vh + 4vw)/2);  }

    .board  { 
            overflow-y: scroll;     grid-template-rows: 1fr 1fr auto 1fr auto;	
            height: 90vh; 			grid-template-columns: 90vw; 
            gap   : 1vh;
    }
    header.right	{	grid-row   : 4   }		
        .right	{ 	grid-row   : 5   }
    header, .right	{ 	grid-column: 1   }

    label	{	text-indent: -3.2ch   }		
}
    /* in case want to use original checkbox... 
    input[type = "checkbox"]  { display : none; top : .6em;  position: absolute; left: .5em 
    .done.hovr> input[type = "checkbox"]  {	opacity: 1;  }   
    .done > input[type = "checkbox"]  {	display: block		        position: absolute;
                                    height : var(--size);		opacity: .4;
                                    width: var(--size) ;		transform: scale(1.2); 
    }*/
</style>