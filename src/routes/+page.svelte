<script>
    import  {send,  receive}    from  './animate.js'
    import  { flip     }	    from  'svelte/animate';
    import	  Input		        from  './Input.svelte';
    import	  Menu				from  './Menu.svelte' ;	
    import  { init, insert,  Data}   from  './store.svelte.js';

let L =true;

 let focus = 0;    //qN   = 1, task_name;

setTimeout(init, 2000);
/*
    let input = $state('');
    $effect(_=>console.log(input));
    let x= $derived(input)*/
    setTimeout(_=> {console.table(Data)}, 4000); 
</script>


<main	class = 'board'	  on:contextmenu = {false}>

    <Input />

    <h1 class = 'todo'>  Todo  </h1>
    <h1 class = 'done'> Done </h1> 

    <div	class = 'todo' 
            on:pointerenter = { ()=> focus = -1 }
            on:pointerleave = { ()=> focus = -1 }
        >
        {#each  Data.entries() as [id, todo] (id)}
            <label  class ='todo_itm'
                    animate:flip    = {{duration: 600}}
                    in:receive      = {{key: id }}
                    out:send        = {{key: id }}
                    on:contextmenu  = {e=>alert(e.target)}
                    on:pointerenter = {e=>e.currentTarget.classList.add('hovr')}
                    on:pointerleave = {e=>e.currentTarget.classList.remove('hovr')}
                    class:hovr      = {L && id===focus+1}
                >
                    <input    type = checkbox   on:change = { ()=>{mark(id)} }
                            > {todo.item} 
                
                    <button   class = 'trash'   on:click  = { ()=> {remove(id)} }
                            > remove 
                    </button>
            </label>
        {/each}
    </div>


    <div    class = 'done'
            on:pointerenter = {()=>focus=-1}
            on:pointerleave = {()=>focus=-1}
        >
        {#each  Data.entries()  as  [id, done] (id)}
            <label  class ='done_itm'
                    animate:flip    = {{duration: 600}}
                    in:receive      = {{key: id}}
                    out:send        = {{key: id}}
                    on:pointerenter = { e=> e.currentTarget.classList.add('hovr')    }
                    on:pointerleave = { e=> e.currentTarget.classList.remove('hovr') }
                    class:hovr      = { !L && id===focus+1 }
                >
                    <input    type = checkbox   checked   on:change = { ()=> mark(id)}
                            > ✔ &nbsp {done.item}

                    <button   class= 'trash'   on:click = {() => remove(id)} 
                            > remove
                    </button>
            </label>
        {/each}
    </div>
</main>

<Menu  />



<style>

:global(body) { 
    overflow : hidden;          --size      : calc((3vmin + 2vw)/2);
    width    : 100vw;           user-select : none; 
    height   : 100vh;           font-size   : var(--size);
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


h1.todo, h1.done { grid-row: 2 }	
h1.todo,   .todo  { grid-column: 1}        
h1.done,  .done { grid-column: 2 }

h1  {
        text-align : center;    border-radius   : 6vmin;
        font-weight: 400;       letter-spacing  : .2ch;
        color      : #eee;    background-color: #002;
                                box-shadow      : 0 0 3vmin #888;	        								
}


label.todo_itm,
label.done_itm {		
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

                                    
label.done_itm {  	
        color: #aaa;		   	   
        line-height: 1;		  		box-shadow: 0 0 0.7ch #49a;
        text-indent: -3ch;			border	  : 1px solid #000;
                                    background-color: hsla(211, 71%, 8%, .4);
}

label.done_itm::first-letter {   color: #0b9;	  font-size: 2.4ch   }
                             
label.done_itm.hovr 	{   opacity: 1;   		background-color: rgb(8, 28, 48)   }


label:hover .trash   {opacity: 0.6}
label> .trash:hover:enabled {opacity: 1; 		transform: scaleX(1.31) scaleY(1.28)}

label> .trash {
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
    h1.done	{	grid-row   : 4   }

    h1.done, .done	{ 	grid-column: 1   }

    label	{	text-indent: -3.2ch   }		
    label.done_itm {grid-row: 5}
}
    /* To use default checkbox:
    input[type = "checkbox"]  { display : none; top : .6em;  position: absolute; left: .5em 
    .done.hovr> input[type = "checkbox"]  {	opacity: 1;  }   
    .done > input[type = "checkbox"]  {	display: block		        position: absolute;
                                    height : var(--size);		opacity: .4;
                                    width: var(--size) ;		transform: scale(1.2); 
    }*/
</style>