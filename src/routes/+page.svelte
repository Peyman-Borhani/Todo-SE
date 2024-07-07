<script>


import    {To, From} from    './animate.js'
import    { flip }        from    'svelte/animate';
import    Input           from    './Input.svelte';
import    Menu            from    './Menu.svelte' ;	
//import    {make_Store}    from    '$lib/store.svelte.js';
//import    {Map}           from    'svelte/reactivity';

  //let Data = $state(new Map());
  //let Store  = $state( make_Store());
  // Input props
  let   menu=false,  info=false, L = true,
        zoom=false, view=false; 

  let env = import.meta
  console.log(env.DEV===true? '___Yesss_' :env)
// L: left/todo //qN = 1, task_name; ⚙️ ✘
//$effect(Store.init());

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
    <!-- class:hovr ={ !L && id===focus+1 } -->

    {#each  Store.Data.entries() as [id, todo], i (id)}
        
      <label  class ={todo.done? 'td_itm'  :'dn_itm'}
              in:From ={{key: id}}   out:To ={{key: id}}
              class:hovr   ={i===focus+1}
              animate:flip ={{duration: 600}}
            oncontextmenu  ={e=>alert(e.target)}
            onpointerenter ={e=>e.currentTarget.classList.add('hovr')}
            onpointerleave ={e=>e.currentTarget.classList.remove('hovr')}
        >
        <span>  {todo.get('done')?  '🗸' : `${i}.`}   
                {todo.get('item')} 
        </span>

        <input  type ='checkbox'   checked={todo.done}   
                onchange = { ()=> Store.mark(id)}
        > 
        <button     class ='trash' 
                    onclick = {()=> Store.remove(id)} 
                > remove
        </button>
    </label>
    {/each}
    
    <Input  bind:L bind:menu bind:info bind:zoom  bind:view/>
</main>

<Menu  bind:menu bind:info bind:zoom  bind:view/>


<style>  

/* SCOPE START */
main.board 
{	    
        display : grid;		    background-color: #345;
        padding : 2.6%;	        border-radius	: 2ch;  
        height  : 100%;		    user-select     : none;
        margin  : 1%;           box-shadow	    : 0 0 4pt #000, inset 0 0 5pt #000, inset 0 0 8ch #000; 
        gap     : 6% 1%;        justify-content : center;
        overflow: hidden;       align-items     : center;
        grid-template:  11vh auto / repeat(2, minmax(40%, 46vw) );



.todo, 
.done { display: grid; width:100%;   grid-row: 1}


.todo, .td_itm {grid-column: 1}        
.done, .dn_itm {grid-column: 2}
	
.done > ::first-letter {color:green}
.todo > ::first-letter{color:red}

h1  {
                                text-align : center;    
        font-weight : 1000;     letter-spacing  : .2ch;
        color       : #eee;   background-color: #002;
        width       : 92%;      border-radius   : 12pt;
        line-height : 150%;      box-shadow      : 0 0 3vmin #888;	        								
        font-family: Segoe Print, Arial Black, Noto Sans, 'Segoe UI';
}

label.td_itm,
label.dn_itm {
    display    : grid;          position: relative;		
    color      : #000;		   margin  : 0 0 1ch 0;
    text-indent: -2.6ch;		padding : 1vh 1em .5em 2em;
    user-select: none;	        box-shadow 		: 0 0 1ch #000;
    text-align : left;          text-shadow		: -0.07ch 0.06ch .12ch #768;
    overflow   : hidden;        background-color: hsl(200, 10%, 86%);
    font-weight: 100;           border-radius	: 0.4em;
    line-height: 1.6ch;         border: 1px solid hsl(240, 8%, 70%);
}
label.td_itm {grid-column: 1}

label.dn_itm {  	            grid-column:  2;         		   	   
        	  		            box-shadow: 0 0 0.7ch #49a;
        text-indent: -3ch;		border	  : 1px solid #000;
        color      : #faa;    background-color: hsla(211, 71%, 8%, .4);
}
label.td_itm  {color: red !important;  font-size: 190% !important; font-weight: bold}
label.dn_itm > ::first-letter {font-size: 140%;  color: #0a7 }
label.dn_itm.hovr {opacity: 1;   color: #ace;   background-color: rgb(8, 28, 48)}

label.hovr  {  
        box-shadow 	: 0 0 1ch #fff !important;
        text-shadow	: 0 0 0.3ch #123;
        transform  	: scaleX(1.08)  scaleY(1.12);
        color       :black;
        background-color: #fff;
}
label:hover .trash   {opacity: .6}

label { /* scope start */
    font-family: CommitMono-Perfect, Noto Sans Condenced, Source Sans Pro, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu,'Helvetica', Arial;

    input[type = "checkbox"]  { display : none }

    .trash:hover:enabled {opacity: 1;   transform: scaleX(1.31) scaleY(1.28)}

    .trash {                    position : absolute;
        top   : 0;              width    : 2.7ch;
        right : .3ch;           height   : 100%;
        border: none;           opacity  : 0;
        cursor: pointer;        transition: opacity 0.3s;
        text-indent: -9999px;     /* accesiblity: a text for trash placed far away */
        background : no-repeat 60% 60% url(
        "data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg'  viewBox='0 0 24 24'%3E%3Cpath fill='%23676778' d='M12,2C17.53,2 22, 6.47 22, 12C22, 17.53  17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12, 2M17, 7H14.5L13.5,6H10.5L9.5, 7H7V9H17V7M9, 18H15A1, 1 0 0,0 16,17V10H8V17A1,1 0 0,0 9,18Z'%3E%3C/path%3E%3C/svg%3E");
        background-size: 1.7em 1.6em;
    }

} /* label scope End */

} /* .board SCOPE END */

@media screen and (orientation: portrait)
{   
    main.board  
    { 
        height: 90vh; 	    overflow  : scroll;
        gap   : 1vh;        overflow-y: scroll; 
        grid-template: repeat(2, minmax(20%, 60%)) 15%  / 98%; 

      .todo,  label.td_itm, 
      .done,  label.dn_itm  {grid-column: 1}

      .todo   {grid-row: 1}
      .done   {grid-row: 2}
      label.dn_itm    {grid-column: 1}
    }
}
</style>

<!-- To use default checkbox:
    input[type = "checkbox"]  { display : none; top : .6em;  position: absolute; left: .5em 
    .done.hovr> input[type = "checkbox"]  {	opacity: 1;  }   
    .done > input[type = "checkbox"]  {	
                display: block;         position: absolute;
                height : var(--size);   opacity: .4;
                width: var(--size) ;    transform: scale(1.2);
    }
-->