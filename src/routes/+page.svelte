<script>
    import  { fade, crossfade }   from  'svelte/transition';
    import  { quintOut }		  from  'svelte/easing';
    import  { flip     }	    from  'svelte/animate';
    import	  Input		        from  './Input.svelte';
    import	  Menu				from  './Menu.svelte' ;	
    //import  {D, Data, init}     from  './store.js';

const [send, receive] = crossfade(
{   duration: d => Math.sqrt(d * 400), 
    fallback(node, params) { 
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;

        return {duration: 900,
                easing  : quintOut,
                css     : t => `transform: ${transform} 
                                scale(${t});
                                opacity  : ${t} `
        };
    }
});

console.log('sooooo ', typeof 5);

    let   input = $state('');
    $effect(_=>console.log(input));
   // let x= $derived(input)
   //setTimeout( _=> {input='hello'}, 3000);
   
    let     qN   = 1,
            task_name;


function save() {	let tid  = 0;  let l = localStorage;
                    task_name = document.getElementsByTagName('VAR').item(0).innerText; 
                    console.log(task_name);
                    Todos.forEach( (t=>{ l.setItem((task_name+tid), t.text); tid++ } ) );  // Storing Todos data
}


function load() { let s = localStorage.key(0);   
                    //  s = localStorage.getItem(s); 
                    //console.log(s) // loading Todos data
}
setTimeout(()=>init(), 2000);
</script>



<div	class = 'board'	  on:contextmenu = {false}>

<Input />	 <!--on:keydown = {e=> e.which===13 && insert(e.target.value)}  /-->


<header  class = 'left'>     <h1> Todo </h1>    </header>

    <div	class = 'left' 
            on:pointerenter = { ()=> focus = -1 }
            on:pointerleave = { ()=> focus = -1 }
        >
        {#each Todos.filter(t => !t.done) as todo (todo.qID)}
            <label  animate:flip    = {{duration: 600}}
                    in:receive      = {{key: todo.qID }}
                    out:send        = {{key: todo.qID }}
                    on:contextmenu  = {e=>alert(e.target)}
                    on:pointerenter = {e=>e.currentTarget.classList.add('hovr')}
                    on:pointerleave = {e=>e.currentTarget.classList.remove('hovr')}
                    class:hovr      = {L && todo.qID===focus+1}
                >
                    <input    type = checkbox   on:change = { ()=>{ mark(todo, true) } }
                            > {todo.qID}. {todo.text} 
                
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
        {#each Todos.filter(t => t.done) as done (done.qID)}
            <label  class           = "done"
                    animate:flip    = {{duration: 600}}
                    in:receive      = {{key: done.qID}}
                    out:send        = {{key: done.qID}}
                    on:pointerenter = { e=> e.currentTarget.classList.add('hovr')    }
                    on:pointerleave = { e=> e.currentTarget.classList.remove('hovr') }
                    class:hovr      = { !L && done.qID===focus+1 }
                >
                    <input    type = checkbox   checked   on:change = { ()=> mark(done, false)}
                            > ✔ &nbsp {done.qID}. {done.text}

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
    overflow : hidden;          font-size   : var(--size);
    width    : 100vw;           user-select : none; 
    height   : 100vh;           --size      : calc((3vmin + 2vw)/2);
                                background-color: #334;
    font-family:    Merriweather, helvetica neue, Helvetica, Arial, sans-serif !important
     
}

.board {	
        display : grid;		    background-color: #345;
        padding : 4vmin;	    border-radius	: 2pt;  
        height  : 86vh;		    user-select     : none;
        margin  : 2vh 1vw;      box-shadow	    : 0 0 3vmin #000, inset 0 0 2vmin #000; 
        overflow: hidden;       justify-content : center;
        gap     : 2vh 5vw;	    grid: 9vh 16vh auto / repeat( 2, minmax(40%, 1fr) );
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

@media screen and (orientation: portrait)
{   
    :global(body)	{	--size: calc((2.8vh + 4vw)/2);  }

    .board  { 
            overflow-y: scroll;     grid-template-rows: 1fr 1fr auto 1fr auto;	
            height: 90vh; 			grid-template-columns: 90vw; 
            gap   : 1vh;
    }
    header.right	{	grid-row   : 4   }		
    header, .right	{ 	grid-column: 1   }

    label	{	text-indent: -3.2ch   }		
}
    /* To use default checkbox:
    input[type = "checkbox"]  { display : none; top : .6em;  position: absolute; left: .5em 
    .done.hovr> input[type = "checkbox"]  {	opacity: 1;  }   
    .done > input[type = "checkbox"]  {	display: block		        position: absolute;
                                    height : var(--size);		opacity: .4;
                                    width: var(--size) ;		transform: scale(1.2); 
    }*/
</style>