(function(){
  'use strict';
  const home=document.getElementById('studio-home');
  const button=document.getElementById('studio-open');
  const status=document.getElementById('studio-error');
  function open(){
    if(typeof window.openCreativeStudio!=='function'){
      status.textContent='Studio could not load. Refresh the page and try again.';
      return;
    }
    status.textContent='';
    try{
      const language=(navigator.language||'en').split('-')[0];
      // This entry point is intentionally a local-only tool, not an admin session.
      window.openCreativeStudio({isAuthorized:()=>true,dashboard:home,language});
    }catch(error){status.textContent='Could not open Studio. Refresh the page and try again.';}
  }
  button.addEventListener('click',open);
  open();
})();