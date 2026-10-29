import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {getDatabase,ref,onValue,runTransaction,query,orderByChild,limitToLast,push,serverTimestamp,set} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
import {getAuth,onAuthStateChanged,signInAnonymously,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
const config={apiKey:"AIzaSyB9KkOfv8t5IcKo4fibFkO5jhyVa1zpAOo",authDomain:"eu-ilove-bts.firebaseapp.com",databaseURL:"https://eu-ilove-bts-default-rtdb.firebaseio.com",projectId:"eu-ilove-bts",storageBucket:"eu-ilove-bts.firebasestorage.app",messagingSenderId:"1075259955753",appId:"1:1075259955753:web:97fa18f8b0bfca2fdb1a38"};
const app=initializeApp(config),db=getDatabase(app),auth=getAuth(app),$=id=>document.getElementById(id);
let user=null,connected=false,busy=false,last=0,lastChat=0,unsubScore=null,unsubChat=null,authReady=false,profileName='',scoreNames={};
const member=()=>user&&!user.isAnonymous;
const name=()=>($('nick').value.trim()||profileName||'ARMY').replace(/[<>]/g,'').slice(0,22);
const buttons=()=>{$('loveBtn').disabled=$('bonusBtn').disabled=!connected||busy;$('loveBtn').textContent=connected?'💜 EU AMO O BTS!!! 💜':'💜 CONECTANDO… 💜'};
const note=(id,value)=>$(id).textContent=value;
function pop(x,y){for(let i=0;i<6;i++){const el=document.createElement('span');el.className='pop';el.textContent=['💜','✨','💗'][i%3];el.style.left=x+(Math.random()-.5)*100+'px';el.style.top=y+(Math.random()-.5)*60+'px';document.body.append(el);setTimeout(()=>el.remove(),950)}}
onValue(ref(db,'totalClicks'),snap=>{connected=typeof snap.val()==='number';if(connected){const n=snap.val();note('count',n.toLocaleString('pt-BR'));$('fill').style.width=n%101+'%';note('status',n<100?'ARMY EM TREINAMENTO 💜':'AMOR INFINITO DETECTADO 💜');note('connection','🟢 contador global conectado')}else note('connection','Configure totalClicks como número no Firebase');buttons()},()=>{connected=false;buttons();note('connection','Falha ao ler contador')});
async function click(amount,event){
  if(!connected||busy||!authReady||Date.now()-last<1200)return;
  if(!auth.currentUser){note('connection','Aguarde a autenticação de visitante 💜');return;}
  last=Date.now();busy=true;buttons();
  try{
    const result=await runTransaction(ref(db,'totalClicks'),n=>typeof n==='number'?n+amount:undefined,{applyLocally:false});
    if(!result.committed)throw Error('Clique não confirmado');
    if(member()){
      try{
        await runTransaction(ref(db,'scores/'+user.uid),old=>{
          if(old===null)return {name:name(),clicks:amount};
          if(typeof old.clicks!=='number')return;
          return {name:old.name,clicks:old.clicks+amount};
        },{applyLocally:false});
      }catch(error){console.error(error);note('connection','Clique global salvo, mas pontuação individual não atualizada');}
    }
    pop(event.clientX||innerWidth/2,event.clientY||innerHeight/2);
  }catch(error){console.error(error);note('connection','Clique recusado. Confira as regras do Firebase.')}
  finally{busy=false;buttons();}
}
$('loveBtn').onclick=e=>click(1,e);$('bonusBtn').onclick=e=>click(10,e);
onAuthStateChanged(auth,async current=>{authReady=true;user=current;profileName='';const logged=member();$('authFields').hidden=logged;$('logout').hidden=!logged;$('chatText').disabled=$('sendChat').disabled=!logged;note('authState',logged?'💜 Conectado à conta ARMY':'Visitante — cliques liberados 💜');if(unsubScore)unsubScore();if(unsubChat)unsubChat();if(logged){unsubScore=onValue(ref(db,'scores/'+current.uid),snap=>{profileName=String(snap.val()?.name||'').slice(0,22);const n=snap.val()?.clicks||0;note('myScore','💜 Seus cliques: '+n+' • Nível '+(Math.floor(Math.sqrt(n/25))+1))});unsubChat=onValue(query(ref(db,'chat'),orderByChild('createdAt'),limitToLast(40)),snap=>{const feed=$('chatFeed');feed.replaceChildren();snap.forEach(child=>{const m=child.val();if(typeof m?.text!=='string')return;const p=document.createElement('p');p.dataset.uid=String(m.uid||'');const b=document.createElement('strong');b.textContent=String(scoreNames[m.uid]||m.name||'ARMY').slice(0,22)+': ';p.append(b,document.createTextNode(m.text));feed.append(p)});feed.scrollTop=feed.scrollHeight},()=>note('chatFeed','Chat indisponível: confira regras'))}else{note('myScore','Entre para guardar cliques no ranking');note('chatFeed','Faça login para conversar 💜');if(!current)signInAnonymously(auth).catch(()=>note('authState','Ative login anônimo no Firebase'))}});
$('login').onclick=async()=>{try{await signInWithEmailAndPassword(auth,$('email').value,$('password').value);note('authError','Bem-vindo! 💜')}catch(e){note('authError','Login falhou: '+e.code)}};
$('signup').onclick=async()=>{if(name().length<2){note('authError','Digite um nome ARMY com pelo menos 2 caracteres');return}if($('password').value.length<6){note('authError','A senha precisa de pelo menos 6 caracteres');return}try{const chosenName=name();const c=await createUserWithEmailAndPassword(auth,$('email').value,$('password').value);await set(ref(db,'scores/'+c.user.uid),{name:chosenName,clicks:0});note('authError','Conta criada! 💜')}catch(e){note('authError','Cadastro falhou: '+e.code)}};
$('logout').onclick=async()=>{await signOut(auth);await signInAnonymously(auth)};
onValue(ref(db,'scores'),snap=>{scoreNames={};snap.forEach(child=>{const v=child.val();if(typeof v?.name==='string')scoreNames[child.key]=v.name});document.querySelectorAll('#chatFeed p').forEach(p=>{const uid=p.dataset.uid;if(uid&&scoreNames[uid])p.querySelector('strong').textContent=scoreNames[uid].slice(0,22)+': '});});
onValue(query(ref(db,'scores'),orderByChild('clicks'),limitToLast(10)),snap=>{const list=$('rankingList');list.replaceChildren();const items=[];snap.forEach(child=>items.push(child.val()));items.reverse().forEach(item=>{const li=document.createElement('li');li.textContent=String(item.name||'ARMY').slice(0,22)+' — '+Number(item.clicks||0).toLocaleString('pt-BR')+' 💜';list.append(li)});if(!items.length)note('rankingList','Sem participantes ainda')},()=>note('rankingList','Ranking indisponível: confira regras'));
$('chatForm').onsubmit=async e=>{e.preventDefault();if(!member())return;const input=$('chatText'),value=input.value.trim();if(!value||value.length>240)return;if(Date.now()-lastChat<5000){note('chatStatus','Espere 5 segundos antes de enviar outra mensagem 💜');return;}lastChat=Date.now();$('sendChat').disabled=true;try{await push(ref(db,'chat'),{uid:user.uid,name:name(),text:value,createdAt:serverTimestamp()});input.value=''}catch(err){note('chatStatus','Mensagem recusada: verifique as regras')}finally{$('sendChat').disabled=false}};
