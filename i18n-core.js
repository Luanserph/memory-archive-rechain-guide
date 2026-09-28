/* Text-only localization: identifiers, form values and save keys never change. */
((root)=>{
 const normalize=s=>s.replace(/\s+/g,' ').trim();
 const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 function create(dictionary){
  const patterns=[];
  for(const [source,target] of Object.entries(dictionary)){
   if(source===target||!source.includes('{'))continue;
   const ids=[];let cursor=0,pattern='';
   for(const m of source.matchAll(/\{(\d+)\}/g)){pattern+=escape(source.slice(cursor,m.index))+'(.*?)';ids.push(m[1]);cursor=m.index+m[0].length;}
   pattern+=escape(source.slice(cursor));
   if(ids.length&&source.replace(/\{\d+\}/g,'').length>8)patterns.push({regex:new RegExp('^'+pattern+'$','u'),ids,target,weight:source.length});
  }
  patterns.sort((a,b)=>b.weight-a.weight);
  const fragments=Object.keys(dictionary).filter(k=>k!==dictionary[k]&&!k.includes('{')&&k.length<=180&&/[A-Za-zÀ-ÿ]/.test(k)).sort((a,b)=>b.length-a.length);
  const partial=fragments.length?new RegExp('(?<![\\p{L}\\p{N}_])(?:'+fragments.map(escape).join('|')+')(?![\\p{L}\\p{N}_])','gu'):null;
  return function translate(text){
   const key=normalize(text);if(!key)return text;
   let value=dictionary[key];
   if(value===undefined){for(const p of patterns){const m=key.match(p.regex);if(m){const captures=Object.fromEntries(p.ids.map((id,i)=>[id,m[i+1]]));value=p.target.replace(/\{(\d+)\}/g,(_,id)=>captures[id]);break;}}}
   if(value===undefined)value=partial?key.replace(partial,m=>dictionary[m]):key;
   return (text.match(/^\s*/)?.[0]||'')+value+(text.match(/\s*$/)?.[0]||'');
  };
 }
 root.GuideTranslation={create,normalize};
})(typeof module==='object'?module.exports:window);
