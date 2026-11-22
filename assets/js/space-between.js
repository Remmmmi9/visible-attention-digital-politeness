
(function(){
  const canvas=document.getElementById('thoughtCanvas');
  const stage=document.querySelector('.space-stage');
  if(!canvas||!stage)return;
  const ctx=canvas.getContext('2d');
  const words=['thinking','translating','not ready','polite?','too direct?','care','hesitation','still checking','not ignoring','repair','soften','maybe later','visible','pressure','second language','face work','pause'];
  let particles=[], mouse={x:0,y:0,active:false}, progress=0;
  function resize(){
    const r=stage.getBoundingClientRect();
    canvas.width=r.width*devicePixelRatio; canvas.height=r.height*devicePixelRatio;
    canvas.style.width=r.width+'px'; canvas.style.height=r.height+'px';
    ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
    particles=words.map((word,i)=>({word,x:60+Math.random()*(r.width-130),y:60+Math.random()*(r.height-120),vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,h:i%4}));
  }
  function move(e){
    const r=canvas.getBoundingClientRect();
    mouse.x=e.clientX-r.left; mouse.y=e.clientY-r.top; mouse.active=true; progress=Math.min(1,progress+.012);
  }
  function draw(){
    const r=canvas.getBoundingClientRect();
    ctx.clearRect(0,0,r.width,r.height);
    if(mouse.active){
      ctx.beginPath(); ctx.moveTo(r.width*.36,r.height*.38); ctx.quadraticCurveTo(mouse.x,mouse.y,r.width*.72,r.height*.42);
      ctx.strokeStyle=`rgba(48,49,54,${.08+progress*.22})`; ctx.setLineDash([7,9]); ctx.stroke(); ctx.setLineDash([]);
    }
    particles.forEach((p,i)=>{
      p.x+=p.vx;p.y+=p.vy;if(p.x<40||p.x>r.width-120)p.vx*=-1;if(p.y<40||p.y>r.height-40)p.vy*=-1;
      const dx=p.x-mouse.x,dy=p.y-mouse.y,dist=Math.sqrt(dx*dx+dy*dy);
      let a=.25+progress*.55;if(mouse.active&&dist<160){a=.95;p.x+=dx/Math.max(1,dist)*.1;p.y+=dy/Math.max(1,dist)*.1;}
      const colors=[`rgba(123,90,67,${a})`,`rgba(95,120,140,${a})`,`rgba(143,152,135,${a})`,`rgba(200,91,75,${a})`];
      ctx.font=i%4===0?'30px Caveat':'15px Inter';ctx.fillStyle=colors[p.h];ctx.shadowColor=colors[p.h];ctx.shadowBlur=8;ctx.fillText(p.word,p.x,p.y);ctx.shadowBlur=0;
    });
    requestAnimationFrame(draw);
  }
  stage.addEventListener('pointermove',move);stage.addEventListener('pointerdown',move);window.addEventListener('resize',resize);resize();draw();
})();
