const grid=document.getElementById('newsLiveGrid');
const status=document.getElementById('newsLiveStatus');
const fmt=new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short',timeZone:'America/Sao_Paulo'});
async function loadNews(){
  try{
    const res=await fetch('./news.json?t='+Date.now(),{cache:'no-store'});
    if(!res.ok)throw Error('HTTP '+res.status);
    const data=await res.json();
    const items=Array.isArray(data.items)?data.items:[];
    grid.replaceChildren();
    for(const item of items.slice(0,9)){
      if(!/^https:\/\//.test(item.url))continue;
      const article=document.createElement('article');
      const heading=document.createElement('h4');
      const link=document.createElement('a');
      link.href=item.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent=item.title;
      heading.append(link);
      const meta=document.createElement('p');
      const date=new Date(item.published);
      meta.textContent=(item.source||'Fonte')+' · '+(Number.isNaN(date.getTime())?'':fmt.format(date));
      article.append(heading,meta);grid.append(article);
    }
    const stamp=data.updatedAt?new Date(data.updatedAt):null;
    status.textContent=grid.childElementCount
      ?'Última busca: '+(stamp&&!Number.isNaN(stamp.getTime())?fmt.format(stamp):'não informada')+' · '+grid.childElementCount+' notícias'
      :'Ainda não há notícias recentes verificadas. Confira os links oficiais abaixo.';
  }catch(err){console.warn('ARMY News:',err);status.textContent='Não foi possível atualizar as manchetes agora. As notícias editoriais e os links oficiais continuam disponíveis.';}
}
loadNews();
setInterval(loadNews,5*60*1000);
