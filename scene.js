// ARMY rooftop: interacoes visuais, sem acessar Firebase ou dados pessoais.
(()=>{
 const stage=document.querySelector('.pixel-rooftop');
 if(!stage)return;
 const people=[...stage.querySelectorAll('.pixel-person')];
 const cats=[...stage.querySelectorAll('.pixel-cat')];
 const status=document.getElementById('sceneStatus');
 const motion=document.getElementById('sceneMotion');
 const theme=document.getElementById('sceneTheme');
 const messages=['BOR AHAE! 💜','I PURPLE YOU! ✨','ARMY FOREVER! ♡','SAME DREAM! 🌙','BTS + ARMY 💜','VOCÊ É INCRÍVEL! ✦','APOBANGPO! ♡'];
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 let active=!reduced;
 const setMotion=(enabled)=>{
   active=enabled;
   stage.classList.toggle('scene-paused',!enabled);
   motion.setAttribute('aria-pressed',String(enabled));
   motion.textContent=enabled?'⏸ PAUSAR ANIMAÇÕES':'▶ ATIVAR ANIMAÇÕES';
 };
 setMotion(active);
 motion.addEventListener('click',()=>setMotion(!active));
 theme.addEventListener('click',()=>{
   const dawn=stage.classList.toggle('scene-dawn');
   theme.setAttribute('aria-pressed',String(dawn));
   theme.textContent=dawn?'🌙 MODO NOITE':'☀ MODO AMANHECER';
   status.textContent=dawn?'O sol nasceu no terraço! ☀':'A noite ARMY voltou! 🌙';
 });
 function burst(el,emoji='💜'){
   const rect=el.getBoundingClientRect();
   const heart=document.createElement('span');
   heart.className='pop scene-heart';
   heart.textContent=emoji;
   heart.style.left=(rect.left+rect.width/2)+'px';
   heart.style.top=(rect.top+rect.height/3)+'px';
   document.body.append(heart);
   setTimeout(()=>heart.remove(),950);
 }
 people.forEach((el,i)=>{
   el.setAttribute('aria-label','Personagem '+(i+1)+': enviar carinho');
   el.addEventListener('click',()=>{
     const message=messages[i];
     status.textContent=message;
     el.classList.remove('scene-wave');
     void el.offsetWidth;
     el.classList.add('scene-wave');
     burst(el,i%2?'✨':'💜');
   });
   el.addEventListener('animationend',e=>{if(e.animationName==='scene-wave')el.classList.remove('scene-wave')});
 });
 cats.forEach((cat,i)=>{
   cat.addEventListener('click',()=>{
     status.textContent=i===0?'Miau! O gatinho recebeu carinho ♡':'Prrrr! Mais carinho, ARMY! 💜';
     cat.classList.remove('cat-happy');
     void cat.offsetWidth;
     cat.classList.add('cat-happy');
   });
   cat.addEventListener('animationend',e=>{if(e.animationName==='cat-happy')cat.classList.remove('cat-happy')});
 });
 const stars=document.createElement('div');stars.className='scene-stars';stars.setAttribute('aria-hidden','true');
 for(let i=0;i<22;i++){
   const star=document.createElement('i');
   star.style.left=((i*47+13)%97)+'%';
   star.style.top=((i*29+7)%52)+'%';
   star.style.animationDelay=((i*7)%17/10)+'s';
   stars.append(star);
 }
 stage.prepend(stars);
})();
