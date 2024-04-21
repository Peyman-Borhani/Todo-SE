<script>
   //import  {Date}  from  'svelte/reactivity';

    import   {fade}     from   'svelte/transition';
    //import { Data } from './store.svelte';
        
    let        // L means Keyboard focus on left side (todo)
            k = '',     // current Keyboard key press
            prvKey,     // previous Keyboard key press 
            focus = 0,
            inp_el,
            ISO  =false; // Local/ISO Time switch
    // App/Menu kb control props
    let  {menu  =false,  info =false, L = true,
          zoom  =false,  view =false} = $props();
   
    let     time =  $state(' ');
    const   tm  =()=> time = ISO? new Date().toISOString().slice(0,19).replace('T', '  ') 
                                : new Date().toLocaleString().slice(0,22);

setInterval(tm, 1000);
//$: k = (time===0) ?  true  : false;
//$: k = ((t+1)%10 === 0) ? true  : false;
const log = (n, x=false)=>  console.log(n, x? x :'');


//________input handler (event/KeyBoard)_________
function  kb_Control(evk) {
//log(evk)//if user is typing or empty list return.
if(evk.target.id==='typin' || evk.target.id==='task-name' || Data.size===0)  return; 
  let   c=0,    // counter to check if any element left over
        k = evk.key,
        ctrl =(evk.ctrlKey || evk.metaKey) ? true  :false;
  log(k);
  
  switch(k) { 
    
    case 'i':
        if(info && !menu)  info=false; //info off
        else if(!info && menu) {menu=false;   info=true} //menu off - info on
        else menu=true; // menu visible.    //log(menu) 
        break;

    case 'ArrowLeft':  
    case 'ArrowRight':	// Left or Right keys pressed
        focus = 0; 	  // focus is the selected element virtual index
        L = (k==='ArrowLeft') ?   true   : false;
        //reaching the first todo(L) or done(R)
        if  (L)  while(todos[focus].done)  focus++;
        else     while(!todos[focus].done) focus++;
        break;

    case 'ArrowUp':   //up
        if(L) while( focus>0 && todos[focus-1].done  ) {focus--; c++} //todo
        else  while( focus>0 && !todos[focus-1].done ) {focus--; c++} //done
        if(c===todos.length) break; //if all is from opposite site
        if(focus>0) focus--; //go up -1
        else focus = todos.length-1;
        break;

    case 'ArrowDown':  //down
        if(focus+1===todos.length) focus = -1;
        if(L) while(todos[focus+1].done)  {focus++; c++} //todo
        else  while(!todos[focus+1].done) {focus++; c++} //done
        if(c!==todos.length) focus++; //if all is not from opposite side
        break;                                // go down +1
    
    case 'Delete':
        remove(todos[focus]);
        if (focus===0) {}
        else if (focus > 0) focus--;
        else if(focus+1 <= todos.length) focus++;
        updateID(); focus = 0;
        break;
        
    case '+':   
            zoom = !zoom;  
            document.documentElement.style.setProperty('--size', 'calc((4vh + 4vw)/2)'); 
            save();  load();  
            break; // pressed +
                
    case 'v':   view=!view;	 break;  //view button

    case 'Enter':	 //if enter key pressed and keyboard focused	
            if(focus>=0) todos[focus].done = 
                (todos[focus].done) ?  false  : true;
            break;
    
    case 'F5':          //to save data press F5
                if(prvKey==='F5') save();   break;  
    
    case 'F9':          //to load data press F9
                if(prvKey==='F9') load();   break;  
                
    default:  
            focus=-1;   inp_el.focus();
            break;
  }
  prvKey = k; //saves key, to remember as last key pressed.
  log('Key Pressed: ', k);
}


const  add_Item= ev=>  { 
                        let t =  ev.target;
                        if(ev.key)  k=ev.key;   else return;
                        k==='Enter' ?  insert(t.value)//insert(t.value) 
                      : t==='button'?  insert(inp_el.value)  :{};
}
const insert = i=> log('insert:', i)
</script>

<!-- on:mouseover|once = {()=> document.documentElement.requestFullscreen()} -->
<svelte:window	on:keydown ={kb_Control} />

<header>
        <input    id = 'typin'   maxlength = 36   bind:this={inp_el}
                  placeholder = {'❯❯  Enter a new item... '}
                  on:focus    = {e=> e.target.setAttribute('placeholder', '') }
                  on:blur     = {e=> e.target.setAttribute('placeholder', '❯❯  Enter a new item... ') }
                  on:keydown  = {add_Item}
              >
        <time   class:timer  ={true}
        transition:fade
                on:click ={()=> ISO=!ISO}>   {time}    
        </time>

        <button   on:pointerdown={add_Item}>   ↩
        </button>
</header>


<style>

  button  { 
            font-size: 4ch;         font-weight : 1000;
            rotate  : -90deg;       text-shadow : 0 0 3pt #fff;
            scale   : 1.4  1.1;     box-shadow  : 0 0 6pt #a8c;
            color   : #ace;       background-color: #003;
            border  : none;         border-radius   :0 0 2.4vmin 2.4vmin;
            height: 78%;            place-self: center;     
            aspect-ratio: 1/1 !important;
}

  header  { 
            display : grid;         position     : sticky;          
            gap     : 1pt;          border-radius: 2.4vmin;      
            height  : 100%;         grid-template: 100% / 60% 32% 5%;
            grid-row: 1;            grid-column  : 1/3;
            border  : solid 2pt;    background-color: #dec;
                                    box-shadow: inset 0 0 1ch #000
}

  input[id = "typin"]   {           
            padding : 0;            text-align      : left;
            width   : 100%;         font-weight     : 600;
            height  : auto;         font-size       : var(--size);
            outline : none;	        border-radius   : 2.4vmin 0 0 2.4vmin;
            border  : none;         grid-column     : 1;  
            text-indent: 1ch;       background-color: transparent;
}

  time {                          
            color   : #123;       font-weight     : 600;
            width   : 100%;         text-align      : left;
            height  : auto;         text-indent     : -2pt;
            padding : 0 1pt;        font-size       : 3ch;
            outline : none;          
            border  : none;         background-color: #0008;
}

.timer {color:#000;     }

@media  screen and (orientation: portrait) {

    input[id="typin"]   {grid-column: 1}

    time  { position      : relative;
            font-size     : var(--size);
            line-height   : 3ch;
            letter-spacing: .6pt;
    }
}

</style>