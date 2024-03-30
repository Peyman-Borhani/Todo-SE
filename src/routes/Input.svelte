<script>
    
    import {fade} from    'svelte/transition';
        
    let d    = new Date();
    let time = d.toLocaleTimeString();
    let k, t = 0;

setInterval((d=new Date())=> { time=d.toLocaleTimeString(); t=time.slice(3,4)}, 1000);
$: k = ( t === 0 ) ?  true  : false;
//$: k = ((t+1)%10 === 0) ? true  : false;


function  insert(inp) {
                if (inp==='' || typeof inp!=='string') {inp.blur();      return}

                let todo = {    qID  : qN++, // 1
                                done : false,
                                text : inp.value //data.detail.input
                };  // console.log(todo.text);

            inp.value = ''; // updateID(2)
            inp.blur();
            todos = [todo, ...todos];
}   

function  updateID(qID=1) 	{todos.forEach(t=> (!t.done)? t.qID = qID++ : {})
                             todos.forEach(t=> (t.done) ? t.qID = qID++ : {})
                           } //update qID's to be in order

function  remove(todo)  	{  todos = todos.filter(t => t !== todo)  }

function  mark(todo, state) {   todo.done = state;
                                remove(todo);
                                todos = todos.concat(todo);
}


function  keyInput(evk) { // input handler (event or keyboard)
            // console.log(ev)
if(evk.target.id==='typin' || evk.target.id==='task-name' || todos.length===0)  return; 
//alert(k) //if user is typing or empty list return.
let c=0;    // counter to check if any element left over
let k = evk.which;// console.log(event.srcElement.style)

switch(k) { 
    case 32:    footer = !footer;	// space key Footer visible.
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
                break;                                // go down +1
    
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
                
    default: 	focus=-1;   evk.target.firstChild.firstChild.focus();
                break;
 }
prvKey = k; // saves the key so next time the previous will be known.
}

const  addItem= ev=>  { let k =  ev.key ? ev.key   :'',
                            t =  ev.target;
                        k===13 ?        insert(t.value) 
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
                  on:keydown={addItem}
              >
        <button   on:pointerdown={addItem}>    <time class:timer = {k}   >   {time}    </time>
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