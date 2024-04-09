<script>
    
    import   {fade}     from   'svelte/transition';
        
    let     k  = '',
            prvKey,     // The key pressed previously
            L = true,   // L means Keyboard focus on left side (todo)
            focus = 0,
            footer, info, zoom, view, // App keyboard controls, as props sent to info component
            tm = 0 ;
    const   time = ()=> new Date().toISOString().slice(11,24);

setInterval( ()=> tm=time(),  1000);
$: k = (tm===0) ?  true  : false;
//$: k = ((t+1)%10 === 0) ? true  : false;



function  mark(todo, state) {   todo.state = state;
                                remove(todo);
                                todos = todos.concat(todo);
}

//________input handler (event/KeyBoard)_________
function  keyInput(evk) {
            // console.log(evk)
  if(evk.target.id==='typin' || evk.target.id==='task-name' || todos.length===0)  return; 
  //alert(k) //if user is typing or empty list return.
  let c=0;    // counter to check if any element left over
  let k = evk.key;// console.log(event.srcElement.style)

  switch(k) { 
    case 'F2':    
        footer = !footer;	// space key Footer visible.
        if(info) {info = false;  footer = false}
        break;

    case 'i':	
        if(footer) {info = true; footer = false}
        else info = !info; // i key: show or remove app info 
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
        
    case "+":   
            zoom = !zoom;  
            //document.documentElement.style.setProperty('--size', 'calc((3vh + 4vw)/2)'); 
            save();  load();  
            break; // pressed +
                
    case 86:	view = !view;	break; // view button

    case 13:	 //if enter key pressed and keyboard focused	
            if(focus>=0) todos[focus].done = 
                (todos[focus].done) ?  false  : true;
            break;
    
    case 'F5':          //to save data press F5
                if(prvKey==='F5') save();   break;  
    
    case 'F9':          //to load data press F9
                if(prvKey==='F9') load();   break;  
                
    default:  
            focus=-1;  evk.target.firstChild.firstChild.focus();
            break;
  }
  prvKey = k; // saves pressed key to be known on next input
  console.log('Key Pressed: ', k);
}


const  add_Item= ev=>  { 
                        let t =  ev.target;
                        if(ev.key)  k=ev.key;   else return;
                        k==='Enter' ?  insert(t.value) 
                      : t==='button'?  insert(t.value)  :{};
}
//const insert = i=> console.log('yw', i)
</script>


<svelte:window	  on:keydown|once   = {()=> document.documentElement.requestFullscreen()}
                  on:touchstart|once= {()=> document.documentElement.requestFullscreen()}
                  on:mousemove|once = {()=> document.documentElement.requestFullscreen()}
                  on:mouseover|once = {()=> document.documentElement.requestFullscreen()}
                  on:keydown        = {keyInput}
              />
<div>
        <input    id = 'typin'  maxlength = 24
                  placeholder = '❯❯  Enter a new item...'
                  on:focus    = {e=> e.target.setAttribute('placeholder', '') }
                  on:blur     = {e=> e.target.setAttribute('placeholder', '❯❯  Enter a new item...') }
                  on:keydown  = {add_Item}
              >
        <button   on:pointerdown={add_Item}>    <time class:timer = {k}   >   {time}    </time>
        </button>
</div>


<style>

    div       {   grid-row: 1;                grid-column     : 1/3; }

    input[id = "typin"]   { 
                        width   : 90%;         text-align      : left;
                        position: sticky;       font-weight     : 650;
                        height  : 3ch;          font-size       : var(--size);
                        top     : .1vh;         transform       : scaleY(1.06);
                        outline : none;	        border-radius   : 2.4vmin;
                                                background-color: #dec;
}

    time        { 
                    position: fixed;            margin-top      : -.3ch;
                    right   : 2ch;              border-radius   : 1.5ch;
                    width   : 11ch;             text-align      : center;
                    padding : .6ch 0;           line-height     : 1.7ch;
                    color   : #123;           letter-spacing  : -.1pt;
                    font-size  : 2.5ch;         background-color: rgba(4, 16, 28, .2);
                    font-weight: 600;
}

    .timer      {   box-shadow: 0 0 1ch #0f0  }


    @media  screen and (orientation: portrait) {

    input[id="typin"]     {  grid-column: 1  }

    time      { 
                margin-top: -.5ch;      font-size: var(--size);
                right     : 1.8vw;      line-height: 3ch;
                                        letter-spacing: -.3pt;
                }
}

</style>