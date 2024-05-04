
<script>    
    import {scale, fly, fade}   from    'svelte/transition'

    export  let     menu = false,
                    info   = false,
                    zoom   = false,
                    view   = false;

    let  inf;
    let  wait = false;
    let  vu   = '☰';  // ╋ ✚ ❚ ≣ ⚌ ░ 💾 📤 📥 🗺 🛠 🛒
    let  task_name = 'My Task'; //task_name= task_name.substring(6,-1);

    let  maxText;
    let  d = new Date();
    let  time = setInterval(()=>d.toLocaleTimeString(), 1000);
    let  date = d.toLocaleDateString();
    // to disappear the info menu in 3 seconds if is on and
    // there be no interaction. (info=true means info is visible)
function infade(t=3000) {if(menu)  inf = setTimeout( ()=>{menu=false}, t) }

function stay  () {  clearTimeout(inf)  }
    
function viu ()  {  view = !view;  //if user interact romoves timeout to delay
                    stay();
                    vu = (vu==='☰') ?  '☰ ☰'  : '☰';  //document.documentElement.style.
    }
//in case function been called by element.
function zum ()  {zoom=!zoom;  stay()}  //zm =(zm==='╋') ? '⚊'  :'╋';  //if(zoom) {e.target.style.color = '#3F3'}
//exit menu when info is selected.
function infu () {if(menu)  menu=false;  info=!info;  wait=true}

function fuut (e){   
                if (menu && e.target.tagName!=='FOOTER') return; //clicking other buttons on the menu.
                if(!wait) menu = !menu; //to prevent accidental mouseover when element in animation.
                if (menu) stay();
                if (info)   info = false;
    }

    //to modify the task name yet limit the text size and behaviour
    function taskName(e){   if(task_name.length < 14)  maxText = task_name;  
                            else {  e.target.setAttribute('contenteditable', 'false');
                                    task_name = task_name.substring(14,-1);
                                 }
                            e.target.setAttribute('contenteditable','true');
    } 
</script>


<var  id={task_name} style = 'display: none'> {task_name} </var>

{#if info}      
            <span   id = '_Help'
                    transition:fade
                    onpointerdown  = {infu}
                    onpointerleave = {infade}                            

                    > A Perfect Todo app !<br> <br>
                    Interact by touch/hold / key / mouse<br> 
                    Press Tab or select input to type<br> 
                    keys: arrows, enter, delete, tab, i<br> <br>
                    &copy Peyman Borhani.
            </span>


{:else if menu}
        
    <date   class ='btn'   transition:fly={{ y: -40 }}>     {date}  
    </date>

    <footer  onmouseleave  = {infade}
             transition:fly = {{ y: 100, duration: 1000 }} 
             onmousedown   = {fuut}
             onmouseover   = {stay}
             onx = {infade(7000)}
    >
            <span   id    = '#_Info'    onclick = {infu}
                    class = 'btn i'     class:pressed = {info}        
            >  About 
            </span>

            <span   id = '_Zoom'      class = 'btn'      transition:fade
                    class:pressed = {zoom}
                    onmousedown  = {zum}
                > 📥
            </span>

            <input  id    ='_Task-Name'   spellcheck ='false'
                    class ='btn'          placeholder={task_name}
                    type  ='text'         onkeypress = {taskName}
                                          bind:value = {task_name}
            >                                     
            <span   id = '_View'     class = 'btn'    class:pressed = {view}      
                    onmousedown = {viu}
                    transition:scale = "{{duration: 1000,  opacity: .3, start: 0.3}}"  
                > {vu}    
            </span>
    </footer>

{:else}     
        <span   class = 'btn i'
                transition:fly = "{{ y: +500, duration: 800 }}"
                onmouseover   = {fuut}
                onmousedown   = {fuut}
                onintroend    = { ()=> wait = false }
                onoutroend    = { ()=> wait = false }
                onintrostart  = { ()=> wait = true  }
                onoutrostart  = { ()=> wait = true  }
            >   i
        </span>
{/if}



<style>
    
  footer  {   
            display: flex;              position: fixed;
            margin : 0 -.5vw;           flex-direction: column;
            bottom : 0;                 align-items   : center;
            left   : .5vw;              align-content : center;
            width  : 100vw;             vertical-align: middle;
            height : 8ch;               font-family: calibri;
            color  : #def;            font-size  : var(--size);
            user-select: none;          background-color: rgba(4, 16, 28, .8);
}

  span,
  input  {   
            text-align: left;           border-radius   : 2ch;
            padding   : 2ch;            text-shadow     : 0 0  1ch  #5ff;
            color     : #def;         background-color: rgba(3, 10, 16, 1);
}

  .btn    {   
            position: fixed;            justify-self : center;                 
            font-size: 4.1vmax;         text-align   : center;
            bottom : 6pt;               line-height  : 1.7ch;
            color  : #0a9;            margin-left  : 1.5vw;
                                        border-radius: 3ch;
}

  .pressed{   
            color : #f5f;             text-shadow : 0 0  1.1ch  #2f9; 
            transform: scale(.9);       box-shadow  : 0 0  1.4ch  #3bf;
                                        background-color: rgba(4, 16, 30, .8);             
}

  #_Info    {font-size: 3.4ch;   font-weight: 500;   padding: 1.6vmax 1.2vmax}


  #_View   {   
            display: flex;              align-self: flex-start;
            left   : 12vw;              width: max-content;
            word-spacing: -1.9pt;       transform: scaleX(.8);
            font-weight : 500;          font-size: 4.6vmax;   
                                        padding  : 1vmax 2vmax;
}
  #_View.pressed   {left: 6.4vw;    transform: scaleX(.6) scaleY(1)}


  #_View, #_Zoom    {border-radius: 5ch}


  #_Zoom    {
            font-weight: 900;           align-self: flex-start;           
            font-size  : 3vmax;         padding: 1.8vmax 1.4vmax;                                           
}


  #_Task-Name {   
            font-size   : 3vmax;        padding  : 1.6vmax 1.2vmax 1.6vmax 1vmax;  
            font-weight : 500;          outline  : none;
            align-self  : center;       max-width: 42vw;
            left        : 31vw;         flex-wrap: nowrap !important;
            color       : #cdf;       border   : none;
            margin      : 0;            border-radius: 3ch;
                                        background-color: rgba(8, 0, 48, .7);
}

  #_Help  {   
            position: fixed;            width : fit-content !important;
            bottom  : 1vh;              height: fit-content !important;
            right   : 1vw;              background-color: rgba(4, 16, 28, .94);
}

  date  {   
            position: fixed;            width  : 12ch;
            left    : 9vw;              height : 2ch;
            top     : 1vh;              padding: .4ch 0;
            color   : #95a;           font-size: 3ch;
                                        background-color: rgba(4, 16, 28, .9);
}

  .i    {   
            align-self : flex-start;    padding: 2vmax 3vmax;
            font-weight: 600;           right  : 1vmin;  
            top: 2vh;                   width  : fit-content;                                            
}

@media  screen  and  (orientation: landscape) { 

            #_View { display: none}  
            #_Task-Name  {left:unset} 
            date { left: 8vw}
}
</style>