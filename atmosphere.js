(() => {
 const root=document.documentElement;
 let theme='dawn',cursor=true;try{theme=localStorage.getItem('recom-theme')==='night'?'night':'dawn';cursor=localStorage.getItem('recom-cursor')!=='off';}catch{}
 function apply(){root.dataset.theme=theme;root.dataset.cursor=cursor?'keyblade':'normal';}
 apply();const tools=document.createElement('div');tools.className='appearance-tools';const select=document.createElement('select');select.setAttribute('aria-label','Tema visual');for(const [value,label] of [['dawn','Castelo claro'],['night','Noite no castelo']]){const o=document.createElement('option');o.value=value;o.textContent=label;select.append(o);}select.value=theme;select.onchange=()=>{theme=select.value;apply();try{localStorage.setItem('recom-theme',theme);}catch{}};
 const label=document.createElement('label'),check=document.createElement('input');check.type='checkbox';check.checked=cursor;check.onchange=()=>{cursor=check.checked;apply();try{localStorage.setItem('recom-cursor',cursor?'on':'off');}catch{}};label.append(check,document.createTextNode('Cursor Keyblade'));tools.append(select,label);document.querySelector('.index').append(tools);
 document.querySelectorAll('.nav-icon').forEach(icon=>{icon.textContent='';const im=document.createElement('img');im.src='assets/kingdom-key-art.png';im.alt='';icon.append(im);});
 document.querySelector('.library-brand>span').innerHTML='<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="25" r="12"/><circle cx="8" cy="10" r="8"/><circle cx="32" cy="10" r="8"/></svg>';
})();
