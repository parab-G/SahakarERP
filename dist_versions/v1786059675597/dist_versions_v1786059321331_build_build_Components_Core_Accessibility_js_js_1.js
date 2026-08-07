(function(){
  var Shared = window.SahakarComponents && window.SahakarComponents.Core && window.SahakarComponents.Core.SharedHelpers;
  function trapFocus(container){ if (!container) return function(){}; var focusables = function(){ return Array.from(container.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')).filter(el=>el.offsetParent !== null); };
    function handle(e){ if (e.key !== 'Tab') return; var f = focusables(); if (!f.length) return; var first=f[0], last=f[f.length-1]; if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); } }
    document.addEventListener('keydown', handle);
    return function(){ document.removeEventListener('keydown', handle); };
  }
  function setAriaHidden(el, hidden){ if (!el) return; el.setAttribute('aria-hidden', hidden ? 'true' : 'false'); }
  function announceLive(text, polite){ var id='sahakar-live-'+Date.now(); var live = document.createElement('div'); live.setAttribute('aria-live', polite ? 'polite' : 'assertive'); live.className='visually-hidden'; live.style.position='absolute'; live.style.left='-9999px'; live.id=id; live.textContent=text; document.body.appendChild(live); setTimeout(()=>{ try{ live.remove(); } catch(e){} }, 2000); }
  window.SahakarComponents = window.SahakarComponents || {};
  window.SahakarComponents.Core = window.SahakarComponents.Core || {};
  window.SahakarComponents.Core.Accessibility = { trapFocus: trapFocus, setAriaHidden: setAriaHidden, announceLive: announceLive };
})();