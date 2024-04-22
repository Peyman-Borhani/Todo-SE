<script>
  import    {send, receive} from    './animate.js'
  import    { flip }        from    'svelte/animate';
  import    Input           from    './Input.svelte';
  import    Menu            from    './Menu.svelte' ;	
  import    {make_Store}    from    '$lib/store.svelte.js';
  //import    {Map}           from    'svelte/reactivity';
  
  //let Data = $state(new Map());
  let Store  = $state( make_Store());
  // Input props
  let   L = true,   menu=false,  info=false, 
        zoom=false, view=false; // L: left/todo
//onMount           //✘  qN = 1, task_name; ⚙️ 
$effect(Store.init());
//setTimeout(Store.
</script>



<main	class = 'board'	  oncontextmenu = {false}>

    <div    class ='todo'
            onpointerenter = { ()=> focus = -1 }
            onpointerleave = { ()=> focus = -1 }
        >  <h1>Todo</h1>  
    </div>
    <div    class ='done'
            onpointerenter = { ()=> focus = -1 }
            onpointerleave = { ()=> focus = -1 }
        >   <h1>Done</h1>
    </div>
    <!-- class:hovr      = { !L && id===focus+1 } -->

    {#each  Store.Data.entries() as [id, todo], i (id)}
        
            <label  class:todo_itm = {!todo.done}
                    class:done_itm = {todo.done}
                    animate:flip   = {{duration: 600}}
                    in:receive     = {{key: id }}
                    out:send       = {{key: id }}
                    oncontextmenu  = {e=>alert(e.target)}
                    onpointerenter = {e=>e.currentTarget.classList.add('hovr')}
                    onpointerleave = {e=>e.currentTarget.classList.remove('hovr')}
                    class:hovr      = {i===focus+1}
                >
                    {todo.get('done') ? `✔ ${todo.get('item')}` :  `${i}. ${todo.get('item')}`} 
          
                    <input  type ='checkbox'   checked={todo.done}   
                            onchange = { ()=> Store.mark(id)}
                    > 
                    <button     class ='trash' 
                                onclick = {()=> Store.remove(id)} 
                            > remove
                    </button>
            </label>
    {/each}

    <Input bind:L bind:menu bind:info bind:zoom  bind:view/>
</main>

<Menu  />



<style>  
.board {	
        display : grid;		    background-color: #345;
        padding : 4vmin;	    border-radius	: 2pt;  
        height  : 94vh;		    user-select     : none;
        margin  : 2vh 1vw;      box-shadow	    : 0 0 3vmin #000, inset 0 0 2vmin #000; 
        gap     : 2vh 5vw;      justify-content : center;
        overflow: hidden;       align-items     : center;
        grid-template:  16vh auto 9vh / repeat( 2, minmax(40%, 46vw) );
}

.todo,  .done    {display: grid;  grid-row:1; font-weight:1000; font-family: Segoe Print, Arial Black, Noto Sans, 'Segoe UI'; }
.todo   {grid-column: 1}        
.done   {grid-column: 2}
.todo>h1, .done>h1 {grid-row: 1}	

h1  {
        text-align : center;    border-radius   : 6vmin;
        font-weight: 400;       letter-spacing  : .2ch;
        color      : #eee;    background-color: #002;
        grid-row   : 1;         box-shadow      : 0 0 3vmin #888;	        								
}

label {font-family: CommitMono-Perfect, Noto Sans Condenced, Source Sans Pro, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu,'Helvetica', Arial}

label.todo_itm,
label.done_itm {		
    display: grid;                            position: relative;		
    color      : #333;		   margin  : 0 0 1ch 0;
    text-indent: -2.4ch;		padding : 1vh 1em .5em 2em;
    user-select: none;	        box-shadow 		: 0 0 1ch #000;
    text-align : left;          text-shadow		: 0.1ch 0.1ch 0.2ch #555;
    overflow   : hidden;        background-color: hsl(200, 10%, 86%);
    font-weight: 600;           border-radius	: 0.4em;
                 border: 1px solid hsl(240, 8%, 70%);
}

.hovr  {  
        box-shadow 	: 0 0 1ch #fff !important;
        text-shadow	: 0 0 0.3ch #123;
        transform  	: scaleX(1.08) scaleY(1.12);
        color       :black;
        background-color: #fff;
}

input[type = "checkbox"]  { display : none }                                  
label.done_itm {  	            		   	   
        line-height: 1;	  		box-shadow: 0 0 0.7ch #49a;
        text-indent: -3ch;		border	  : 1px solid #000;
        color     : #aaa;     background-color: hsla(211, 71%, 8%, .4);
}

label.done_itm::first-letter {color: #0c8;	  font-size: 5ch}
                             
label.done_itm.hovr {opacity: 1;    background-color: rgb(8, 28, 48)}

label:hover .trash   {opacity: 0.6}
label> .trash:hover:enabled {opacity: 1;   transform: scaleX(1.31) scaleY(1.28)}

label> .trash {                 position : absolute;
        top   : 0;              width    : 2.7ch;
        right : .3ch;           height   : 100%;
        border: none;           opacity  : 0;
        cursor: pointer;        transition: opacity 0.3s;
        text-indent: -9999px;     /* accesiblity: a text for trash placed far away */
        background : no-repeat 60% 60% url(
        "data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg'  viewBox='0 0 24 24'%3E%3Cpath fill='%23676778' d='M12,2C17.53,2 22, 6.47 22, 12C22, 17.53  17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12, 2M17, 7H14.5L13.5,6H10.5L9.5, 7H7V9H17V7M9, 18H15A1, 1 0 0,0 16,17V10H8V17A1,1 0 0,0 9,18Z'%3E%3C/path%3E%3C/svg%3E");
        background-size: 1.7em 1.6em;
}

@media screen and (orientation: portrait)
{   
  .board  { 
            height: 90vh; 	    overflow  : scroll;
            gap   : 1vh;        overflow-y: scroll; 
            grid-template: repeat(2, minmax(20%, 60%)) 15%  / 98%; 
  }

    .done   {grid-row: 1}
    .todo	{grid-row: 2}

    .todo,  
    .done   {grid-column: 1/-1}
 
  

    label	{text-indent: -3.2ch}		
}
    /* To use default checkbox:
    input[type = "checkbox"]  { display : none; top : .6em;  position: absolute; left: .5em 
    .done.hovr> input[type = "checkbox"]  {	opacity: 1;  }   
    .done > input[type = "checkbox"]  {	
                display: block;         position: absolute;
                height : var(--size);   opacity: .4;
                width: var(--size) ;    transform: scale(1.2); 
    }*/
</style>