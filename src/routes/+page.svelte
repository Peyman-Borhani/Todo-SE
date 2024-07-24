<script>

import    {To, From} from    './animate.js'
import    { flip }        from    'svelte/animate';
import    Input           from    './Input.svelte';
import    Menu            from    './Menu.svelte' ;	
import    {make_Store}    from    '$lib/store.svelte.js';
  let Store  = make_Store();

  $effect(()=> Store.init());         //setTimeout(_=> Store.log(), 2000);

// user interaction states.  Input/Menu props
let  ui =$state( {menu: false,  info: false, L: true,
                  zoom: false,  view: false, focus: 0 }); 
//$inspect(ui.menu);      // L: left/todo  task_name; ⚙️ ✘
// let env = process.env; // console.log(process.env)//(env.DEV===true? '___Yesss_' :env)
</script>


<main	class = 'board'	  oncontextmenu = {false}>

    <div    class ='todo'
            onpointerenter = { ()=> ui.focus = -1 }
            onpointerleave = { ()=> ui.focus = -1 }
        >  <h1>Todo</h1>  
    </div>
    <div    class ='done'
            onpointerenter = { ()=> ui.focus = -1 }
            onpointerleave = { ()=> ui.focus = -1 }
        >   <h1>Done</h1>
    </div>

    <!-- class:hovr ={ !ui.L && id===ui.focus+1 } -->
    {#each  Store.Data.entries() as [id, item], i (id)}
        
      <label  class ={item.get('done')? 'dn_itm'  :'td_itm'}
              in:From ={{key: i}}   out:To ={{key: i}}
              class:hovr   ={i===ui.focus+1}
              animate:flip ={{duration: 600}}
            oncontextmenu  ={e=>alert(e.target)}
            onpointerenter ={e=>{e.currentTarget.classList.add('hovr')}}
            onpointerleave ={e=>e.currentTarget.classList.remove('hovr')}
        >
        <span>  {item.get('done')?  '🗸' : `${i}.`}   
                {item.get('title')} 
        </span>

        <input  type ='checkbox'   checked={item.done}   
                onchange = { ()=> Store.mark(id)}
        > 
        <button     class ='trash' 
                    onclick = {()=> Store.remove(id)} 
                > remove
        </button>
      </label>
    {/each}
    
    <!--Input  bind:L bind:menu bind:info bind:zoom  bind:view/ -->
    <Input  bind:ui/>
</main>

<!--Menu  bind:menu bind:info bind:zoom  bind:view/ -->
<Menu  bind:ui/>


<style>  

/* SCOPE START */
main.board 
{	    
        display : grid;		    background-color: #345;
        padding : 2.5%;	        border-radius	: 2ch;  
        height  : 100%;		    user-select     : none;
        margin  : 1%;           box-shadow	    : 0 0 4pt #000, inset 0 0 5pt #000, inset 0 0 8ch #000; 
        gap     : 3% 1%;        justify-content : center;
        overflow: hidden;     align-items     : center;
        grid-template:  28% auto-fit  / repeat(2, minmax(50%, 94%) );
        

.todo, 
.done {display: grid;  width:100%;   grid-row: 1}


.todo, .td_itm {grid-column: 1}        
.done, .dn_itm {grid-column: 2}
	
.done > ::first-letter {color:green}
.todo > ::first-letter{color:red}

h1  {
                                text-align : center;    
        font-weight : 1000;     letter-spacing  : .2ch;
        color       : #eee;   background-color: #002;
        width       : 92%;      border-radius   : 9pt;
        line-height : 150%;      box-shadow      : 0 0 3vmin #888;	        								
        font-family: Segoe Print, Arial Black, Noto Sans, 'Segoe UI';
}

label.td_itm,
label.dn_itm {
    display    : grid;          position: relative;		
    color      : #000;		   margin  : 0 0 1ch 0;
    text-indent: -2.6ch;		padding : 1vh 1em .2em 2em;
    user-select: none;	        box-shadow 		: 0 0 1ch #000;
    text-align : left;          text-shadow		: -0.07ch 0.06ch .12ch #768;
    overflow   : hidden;        background-color: hsl(200, 10%, 86%);
    font-weight: 100;           border-radius	: 0.4em;
    line-height: 1.6ch;         border: 1px solid hsl(240, 8%, 70%);
    text-wrap: nowrap;          transition: all .3s ;
}
label.td_itm {grid-column: 1}

label.dn_itm {  	            grid-column:  2;         		   	   
        	  		            box-shadow: 0 0 .8ch #112, inset 0 0 1.6ch #102;
        text-indent: -3ch;		border	  : 1px solid #101;
        color      : #a9b;    background-color: hsla(211, 71%, 8%, .4);
}
label.td_itm  {font-size: 120% !important; font-weight: bold}
label.dn_itm > ::first-letter {font-size: 140%;  color: #0a7 }
label.dn_itm.hovr {opacity: 1;   color: #ace;   background-color: rgb(8, 28, 48)}

label.hovr  {  
        box-shadow 	: 0 0 1ch #fff !important;
        text-shadow	: 0 0 0.3ch #123;
        transform  	: scaleX(1.1)  scaleY(1.16);
        color       :black;
        z-index: 2;
        background-color: #fff;
}
label:hover .trash   {opacity: .4}

label { /* scope start */
    font-family: CommitMono-Perfect, Noto Sans Condenced, Source Sans Pro, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu,'Helvetica', Arial;

    input[type = "checkbox"]  { display : none }

    .trash {                    position : absolute;
        top   : 0;              width    : 2.7ch;
        right : .4ch;           height   : 100%;
        border: none;           opacity  : 0;
        cursor: pointer;        transition: opacity .4s ease-in;
        text-indent: -9999px;     /* accesiblity: a text for trash placed far away */
        background : no-repeat 60% 60% url(
        "data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg'  viewBox='0 0 24 24'%3E%3Cpath fill='%23676778' d='M12,2C17.53,2 22, 6.47 22, 12C22, 17.53  17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12, 2M17, 7.2H14.4L13.5,6H10.4L9.6, 7.2H6.8V8.8H17.2V8M9, 18H15A1, 1 0 0,0 16.2,17V8.2H8V17A1,1 0 0,0 9,18Z'%3E%3C/path%3E%3C/svg%3E");
        background-size: 1.7em 1.6em;
    }
    .trash:hover:enabled {opacity: 1;  z-index: 3;  transform: translateX(-2pt) scaleX(1.5) scaleY(1.46)}

} /* label scope End */

} /* .board SCOPE END */

@media screen and (orientation: portrait)
{   
    main.board  
    {   display : grid;     position: absolute; 
        left    : 0;        margin  : 1ch 2pt;    
        width   : 93vw;     height  : 98vh;
        gap     : 1vh;      overflow: hidden;
                            grid-auto-flow: row;
        grid-template:  10% auto 10% auto / 96%;
        

      .todo,  label.td_itm, 
      .done,  label.dn_itm  {grid-column: 1;}

      .todo   {grid-row: 3}
      .done   {grid-row: 1}
      label.dn_itm {grid-row: 2}
      label.td_itm {grid-row: 4}

    }
} /* portrait .board SCOPE END */
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