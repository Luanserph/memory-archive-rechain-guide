/* Shared backup validation. Versions 1 and 2 preserve the original checklists. */
(() => {
 const keys=['recom-100','recom-floors','recom-cards'];
 const isMap=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&Object.values(value).every(v=>typeof v==='boolean');
 function validateBackup(input,knownCards){
  if(!input||![1,2].includes(input.version)||input.game!=='recom'||!input.data)throw Error('Formato de backup inválido.');
  const result={};
  for(const k of keys){
   if(k==='recom-cards'&&input.version===1&&!Object.hasOwn(input.data,k))continue;
   const value=input.data[k];
   if(!isMap(value))throw Error('Progresso inválido: '+k);
   if(k==='recom-cards'&&Object.keys(value).some(n=>!knownCards.includes(n)))throw Error('O backup contém cartas desconhecidas.');
   result[k]=value;
  }
  return result;
 }
 function restore(storage,data){
  const previous=Object.fromEntries(Object.keys(data).map(k=>[k,storage.getItem(k)]));
  const written=[];
  try{for(const [k,v] of Object.entries(data)){storage.setItem(k,JSON.stringify(v));written.push(k);}}
  catch(error){for(const k of written.reverse()){try{if(previous[k]===null)storage.removeItem(k);else storage.setItem(k,previous[k]);}catch{}}throw error;}
 }
 window.CARD_PROGRESS={keys,validateBackup,restore,isMap};
})();
