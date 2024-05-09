<script>
   //import  {Date}  from  'svelte/reactivity';

    import   {fade}     from   'svelte/transition';
    //import { Data } from './store.svelte';
        
    let        
            k = '',     // current Keyboard key press
            prvKey,     // previous Keyboard key press 
            focus = 0,
            inp_el,
            ISO  =false; // Local/ISO Time switch
    // App/Menu kb control props
    let  {menu  =$bindable(false),  info =$bindable(false), L = $bindable(true),// L means Keyboard focus on left side (todo)
          zoom  =$bindable(false),  view =$bindable(false)
    } = $props();
   
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
if(evk.target.id==='typin' || evk.target.id==='task-name')  return; 
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

<!-- onmouseover|once = {()=> document.documentElement.requestFullscreen()} -->
<svelte:window	onkeydown ={kb_Control} />

<section>
        <input   id = 'Typin'       bind:this={inp_el}  
                maxlength   = 38    autocomplete= 'off'  
                placeholder = {'❯❯  Enter a new item... '}
                onfocus     = {e=> e.target.setAttribute('placeholder', '') }
                onblur      = {e=> e.target.setAttribute('placeholder', '❯❯  Enter a new item... ') }
                onkeydown   = {add_Item}
              >

        <button   onpointerdown={add_Item}>   ↩
        </button>
        
        <time   class:timer ={true}    transition:fade
                onclick     ={()=> ISO=!ISO}>   {time}    
        </time>
</section>


<style>

section  {     /* Section Scope Start */
            bottom  : -2pt;         display      : grid;         
            left    : 0;            position     : absolute;          
            border  : solid 3pt;    border-radius: 0 2.4vmin 0 1pt;   
            width   : 98dvi;        grid-template: auto / 70% 24% 18%;
            height  : auto;         box-shadow   : inset 0 0 1ch #000;       
            align-self: end;        background-color: #dec;
            font-family:  'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;


  button  {                         line-height : 0;
            font-size: 6ch;         font-weight : 1000;
            height   : 100%;        text-shadow : 0 0 3pt #fff;
            rotate   : -90deg;      box-shadow  : 0 0 6pt #a8c;
            color    : #ace;      border      : solid 1pt #000;
            position : absolute;    align-self  : center;
            justify-self: end;      border-radius: 0 0 2.4vmin 2.4vmin;
            aspect-ratio: 1.1/1;    background-color: #003;
            margin-right: -4pt
                                    
                                    
}

  input[id = "typin"]   {           
                                    text-align      : left;
            width   : 100%;         font-weight     : 500;
            height  : auto;         font-size       : 2.8vw;
            outline : none;	        text-indent     : 1ch;
            border  : none;         grid-column     : 1;  
            padding : 0;            background-color: transparent;
                                    text-shadow: 0 0 1pt  #000;
}

  time {                          
            font-size: 2.8ch;       font-weight     : 600;
            width   : 100%;         text-align      : start;
            height  : auto;         padding-left    : 1ch;
            outline : none;         letter-spacing  : 3pt ; 
            border  : none;         text-shadow: 0 0 1pt #000;
            color   : #123;       background-color: #0008;
}
.timer {color:#000}

} /* Section Scope End  */

@media  screen and (orientation: portrait)
{   /* Section (portrait) Scope Start */
  section {     
            height: 8dvh;   position: fixed;
            width : 96dvw;  font-size: var(--size);    
            bottom: 0;      grid-template: auto / 60% 24% 11%;
            
    
    input[id="typin"]   {grid-column: 1;  text-overflow: ellipsis; align-self: center;}
    button{height: 94%}
    
    time  { 
            position    : relative;
            font-size   : 1.5ch !important; 
            line-height : 3.6ch;
            place-self  : center;
            height      : 100%;
            letter-spacing: .5pt;
    }
  } /* Section (portrait) Scope End */
}
</style>