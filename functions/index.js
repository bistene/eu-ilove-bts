"use strict";
const {onCall,HttpsError}=require("firebase-functions/v2/https");
const {initializeApp}=require("firebase-admin/app");
const {getDatabase}=require("firebase-admin/database");
initializeApp();
const COOLDOWN_MS=1200;
exports.registerLove=onCall({region:"us-central1",enforceAppCheck:true,maxInstances:20},async request=>{
  if(!request.auth)throw new HttpsError("unauthenticated","Entre como visitante ou ARMY para clicar.");
  const amount=request.data?.amount;
  if(amount!==1&&amount!==10)throw new HttpsError("invalid-argument","Quantidade inválida.");
  const uid=request.auth.uid;
  const isAnonymous=request.auth.token.firebase?.sign_in_provider==="anonymous";
  const email=request.auth.token.email;
  const safeName=typeof request.data?.name==="string"?request.data.name.replace(/[<>\\u0000-\\u001f]/g,"").trim().slice(0,22):"";
  const displayName=safeName.length>=2?safeName:(email?email.split("@")[0].slice(0,22):"ARMY");
  const now=Date.now();
  // Single atomic transaction preserves the pre-existing totalClicks and updates score together.
  // For large datasets, migrate to a dedicated sharded backend before scaling.
  const result=await getDatabase().ref("/").transaction(root=>{
    if(!root||typeof root.totalClicks!=="number")return;
    const state=root.clickState||{};
    const last=state[uid]?.last||0;
    if(now-last<COOLDOWN_MS)return;
    state[uid]={last:now};
    root.clickState=state;
    root.totalClicks+=amount;
    if(!isAnonymous){
      root.scores=root.scores||{};
      const old=root.scores[uid]||{};
      root.scores[uid]={name:old.name||displayName,clicks:(old.clicks||0)+amount};
    }
    return root;
  },undefined,false);
  if(!result.committed)throw new HttpsError("resource-exhausted","Aguarde um instante e tente novamente.");
  return {ok:true};
});