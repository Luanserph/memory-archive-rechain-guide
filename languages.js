(() => {
 'use strict';
 const locales=window.GUIDE_LOCALES||{},allowed=['pt-BR','en','es','ja'];
 let language='pt-BR';
 try{const requested=new URL(location.href).searchParams.get('lang')||localStorage.getItem('recom-language');if(allowed.includes(requested))language=requested;}catch{}
 const translators=Object.fromEntries(Object.entries(locales).map(([code,dict])=>[code,window.GuideTranslation.create(dict)]));
 const originals=new WeakMap(),attributes=new WeakMap();
 const skip='script,style,svg,textarea,[translate="no"],[data-no-translate]';
 const t=s=>language==='pt-BR'?s:(translators[language]?.(s)||s);
 const box=document.createElement('label');box.className='language-control';box.setAttribute('translate','no');
 const label=document.createElement('span');label.textContent='Idioma / Language';
 const select=document.createElement('select');select.id='guide-language';select.setAttribute('aria-label','Idioma / Language');
 for(const [code,name] of [['pt-BR','Português (Brasil)'],['en','English'],['es','Español'],['ja','日本語']]){const option=document.createElement('option');option.value=code;option.textContent=name;option.lang=code;select.append(option);}
 select.value=language;box.append(label,select);document.querySelector('.bar-in').append(box);
 const note=document.createElement('p');note.className='translation-note';note.setAttribute('role','status');note.setAttribute('translate','no');document.querySelector('main').before(note);
 function translateText(node){
  if(node.parentElement?.closest(skip))return;
  const record=originals.get(node);const source=record&&node.nodeValue===record.output?record.source:node.nodeValue;
  const output=t(source);if(node.nodeValue!==output)node.nodeValue=output;
  originals.set(node,{source,output});
 }
 function refresh(){
  observer.disconnect();
  try{
   const walk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);while(walk.nextNode())translateText(walk.currentNode);
   for(const el of document.querySelectorAll('[aria-label],[placeholder],[title],[alt]')){
    if(el.closest(skip))continue;const saved=attributes.get(el)||{};
    for(const key of ['aria-label','placeholder','title','alt']){if(!el.hasAttribute(key))continue;const current=el.getAttribute(key),record=saved[key];const source=record&&current===record.output?record.source:current;const output=t(source);if(current!==output)el.setAttribute(key,output);saved[key]={source,output};}attributes.set(el,saved);
   }
   document.documentElement.lang=language;
   document.title=t('Castelo Oblivion — Guia 100% de KINGDOM HEARTS Re:Chain of Memories (Steam)');
   note.hidden=language==='pt-BR';note.textContent=t('Tradução automática; revisão linguística pendente. Os nomes do jogo foram preservados.');
  }finally{observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','placeholder','title','alt']});}
 }
 let scheduled=false;
 const observer=new MutationObserver(()=>{if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;refresh();});});
 select.addEventListener('change',()=>{
  language=select.value;try{localStorage.setItem('recom-language',language);const url=new URL(location.href);url.searchParams.set('lang',language);history.replaceState(null,'',url);}catch{}
  refresh();document.dispatchEvent(new CustomEvent('guide-language-change'));
 });
 // Browser confirmation messages use the selected language as well.
 const confirmOriginal=window.confirm.bind(window);window.confirm=message=>confirmOriginal(t(String(message)));
 window.GUIDE_I18N={translate:t,get language(){return language;},refresh};refresh();
})();
