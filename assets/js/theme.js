(function(){
  const key='wishlist.theme';
  const valid=value=>['light','dark','system'].includes(value);
  const media=window.matchMedia('(prefers-color-scheme: dark)');
  let preference='system';
  try{const saved=localStorage.getItem(key);if(valid(saved))preference=saved}catch{}
  function apply(){
    const resolved=preference==='system'?(media.matches?'dark':'light'):preference;
    document.documentElement.dataset.theme=resolved;
    document.documentElement.style.colorScheme=resolved;
    const control=document.getElementById('themeMode');if(control)control.value=preference;
  }
  function set(value){if(!valid(value))return;preference=value;try{localStorage.setItem(key,value)}catch{}apply()}
  if(media.addEventListener)media.addEventListener('change',()=>{if(preference==='system')apply()});
  else media.addListener(()=>{if(preference==='system')apply()});
  window.addEventListener('storage',event=>{if(event.key===key){preference=valid(event.newValue)?event.newValue:'system';apply()}});
  window.wishlistTheme={set,apply,get preference(){return preference}};
  apply();
})();
