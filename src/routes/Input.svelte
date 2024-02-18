<script>
        import {fade} from    'svelte/transition';
        let d    = new Date();
        let time = d.toLocaleTimeString();
        let k, t = 0;

        setInterval((d=new Date())=> { time=d.toLocaleTimeString(); t=time.slice(3,4)}, 1000);
        $: k = ( t === 0 ) ?  true  : false;
        //$: k = ((t+1)%10 === 0) ? true  : false;
         


</script>


<svelte:window	  on:keydown|once    = {()=> document.documentElement.requestFullscreen()}
                  on:touchstart|once = {()=> document.documentElement.requestFullscreen()}
                  on:mousemove|once  = {()=> document.documentElement.requestFullscreen()}
                  on:mouseover|once  = {()=> document.documentElement.requestFullscreen()}
                  on:keydown
              />
<div>
        <input    id = 'typin'  maxlength = 24
                  placeholder = '❯❯  Enter a new item...'
                  on:focus    = {e=> e.target.setAttribute('placeholder', '') }
                  on:blur     = {e=> e.target.setAttribute('placeholder', '❯❯  Enter a new item...') }
                  on:keydown
              >
        <time class:timer = {k}    >   {time}    </time>    
</div>

 
     

<style>

                div       {   grid-row: 1;                grid-column     : 1/3; }

    input[id = "typin"]   {   width   : 92vw;             text-align      : left;
		                          position: sticky;           font-weight     : 650;
		                          height  : 3ch;              font-size       : var(--size);
		                        	top     : .1vh;             transform       : scaleY(1.06);
                              outline : none;	            border-radius   : 2.4vmin;
                                                          background-color: #dec;
}

                time      {   position: fixed;            margin-top      : -.3ch;
                              right   : 2ch;              border-radius   : 1.5ch;
                              width   : 11ch;             text-align      : center;
                              padding : .6ch 0;           line-height     : 1.7ch;
                              color   : #123;             letter-spacing  : -.1pt;
                              font-size  : 2.5ch;         background-color: rgba(4, 16, 28, .2); 
                              font-weight: 600;                                                                                     
}

                .timer    {   box-shadow: 0 0 1ch #0f0  }


    @media  screen and (orientation: portrait) {   
	
    input[id="typin"]     {  grid-column: 1  }

                time      { margin-top: -.5ch;            font-size: var(--size); 
                            right: 1.8vw;                 line-height: 3ch;
                                                          letter-spacing: -.3pt;
                          }	
}

</style>