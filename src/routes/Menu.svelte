
<script>    
    import {scale, fly, fade}   from    'svelte/transition'

    export  let     footer = false,
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
    function infade(t=3000) { console.log('y...es'); if(footer)  inf = setTimeout( ()=>{footer=false}, t) }

    function stay  () {  clearTimeout(inf)  }
    

    function viu ()  {   view = !view;    //if user interact romoves timeout to delay
                         stay();
                         vu =  ( vu==='☰') ?  '☰ ☰'  : '☰';   //document.documentElement.style.
    }

    function zum ()  {   zoom = !zoom;    //in case function been called by element.
                         stay();                //zm = (zm==='╋') ? '⚊'  : '╋';  // if(zoom) {  e.target.style.color = '#3F3'  } 
    }

    function infu () {   if(footer)  footer = false; info = !info; wait = true; } //exit footer when info is selected.

    function fuut (e){   if (footer && e.target.tagName!=='FOOTER') return; //clicking other buttons on the footer.
                         if(!wait) footer = !footer; //to prevent accidental mouseover when element in animation.
                         if (footer) stay();
                         if (info)   info = false;
    }

    //to modify the task name yet limit the text size and behaviour
    function taskName(e){   if(task_name.length < 14)  maxText = task_name;  
                            else {  e.target.setAttribute('contenteditable','false');
                                    task_name = task_name.substring(14,-1);
                                 }
                            e.target.setAttribute('contenteditable','true');
                            
    } 
</script>


<var  id={task_name} style = 'display: none'> {task_name} </var>

{#if info}      
            <span   id = 'help'
                    transition:fade
                    on:pointerdown  = {infu}
                    on:pointerleave = {infade}                            

                    > A Perfect Todo app !<br> <br>
                    Interact by touch/hold / key / mouse<br> 
                    Press Tab or select input to type<br> 
                    keys: arrows, enter, delete, tab, i<br> <br>
                    &copy Peyman Borhani.


            </span>


{:else if footer}
        
    <date   class ='btn'   transition:fly={{ y: -40 }}>     {date}  
    </date>

    <footer  on:mouseleave  = {infade}
             transition:fly = {{ y: 100, duration: 1000 }} 
             on:mousedown   = {fuut}
             on:mouseover   = {stay}
             on:x = {infade(7000)}
    >
            <span   id    = '#_Info'    on:click = {infu}
                    class = 'btn i'     class:pressed = {info}        
            >  About 
            </span>

            <span   id = 'zoom'      class = 'btn'      transition:fade
                    class:pressed = {zoom}
                    on:mousedown  = {zum}
                > 📥
            </span>


            <input   id    = 'task-name'        spellcheck  = "false"
                        class = 'btn'              placeholder = {task_name}
                        type  = 'text'             on:keypress = {taskName}
                                                bind:value = {task_name}
            >                                     
            <span   id = 'view'     class = 'btn'    class:pressed = {view}      
                    on:mousedown = {viu}
                    transition:scale = "{{duration: 1000,  opacity: .3, start: 0.3}}"  
                > {vu}    
            </span>
    </footer>

{:else}     
        <span   class = 'btn i'
                transition:fly = "{{ y: -400, duration: 1000 }}"
                on:mouseover   = {fuut}
                on:mousedown   = {fuut}
                on:introend    = { ()=> wait = false }
                on:outroend    = { ()=> wait = false }
                on:introstart  = { ()=> wait = true  }
                on:outrostart  = { ()=> wait = true  }
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

  .i     {   
            align-self : flex-end;      padding: 2vmax 3vmax;
            font-weight: 600;           right  : 4vmin;  
                                        width  : fit-content;                                            
}

  #info    {font-size: 3.4ch;   font-weight: 500;   padding: 1.6vmax 1.2vmax}


  #view   {   
            display: flex;              align-self: flex-start;
            left   : 12vw;              width: max-content;
            word-spacing: -1.9pt;       transform: scaleX(.8);
            font-weight : 500;          font-size: 4.6vmax;   
                                        padding  : 1vmax 2vmax;
}
  #view.pressed   {left: 6.4vw;    transform: scaleX(.6) scaleY(1)}


  #view, #zoom    {border-radius: 5ch}


  #zoom    {
            font-weight: 900;           align-self: flex-start;           
            font-size  : 3vmax;         padding: 1.8vmax 1.4vmax;                                           
}


  #task-name {   
            font-size   : 3vmax;        padding  : 1.6vmax 1.2vmax 1.6vmax 1vmax;  
            font-weight : 500;          outline  : none;
            align-self  : center;       max-width: 42vw;
            left        : 31vw;         flex-wrap: nowrap !important;
            color       : #cdf;       border   : none;
            margin      : 0;            border-radius: 3ch;
                                        background-color: rgba(8, 0, 48, .7);
}

  #help  {   
            position: fixed;            width : fit-content !important;
            bottom  : 1vh;              height: fit-content !important;
            right   : 1vw;              background-color: rgba(4, 16, 28, .94);
}

  date  {   
            position: fixed;            width  : 12ch;
            left    : 25vw;             height : 2ch;
            top     : 1vh;              padding: .4ch 0;
            color   : #95a;           font-size: 3ch;
                                        background-color: rgba(4, 16, 28, .9);
}

@media  screen  and  (orientation: landscape) { 

            #view { display: none}  
            #task-name  {left:unset} 
            date { left: 8vw}
}
</style>