(function(){
  // Shared helpers for DOM and utilities
  function uid(prefix){ prefix = prefix || 'id'; return prefix + '-' + Date.now().toString(36) + '-' + Math.floor(Math.random()*0xffff).toString(36); }
  function ensureElement(container){ if (!container) return null; if (typeof container === 'string') return document.querySelector(container); return container instanceof Element ? container : null; }
  function cloneTemplateById(id){ var tpl = document.getElementById(id); if (!tpl || !('content' in tpl)) return null; return tpl.content.firstElementChild.cloneNode(true); }
  function debounce(fn, wait){ var t=null; return function(){ var args=arguments; clearTimeout(t); t=setTimeout(function(){ fn.apply(null,args); }, wait||200); }; }
  function throttle(fn, wait){ var last=0; return function(){ var now=Date.now(); if (now-last>= (wait||200)){ last=now; fn.apply(null,arguments); } }; }
  function safeInnerHTML(el, html){ if (!el) return; // basic sanitization not implemented — use trusted content only
    // remove scripts
    var sanitized = String(html).replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
    el.innerHTML = sanitized;
  }

  window.SahakarComponents = window.SahakarComponents || {};
  window.SahakarComponents.Core = window.SahakarComponents.Core || {};
  window.SahakarComponents.Core.SharedHelpers = {
    uid: uid,
    ensureElement: ensureElement,
    cloneTemplateById: cloneTemplateById,
    debounce: debounce,
    throttle: throttle,
    safeInnerHTML: safeInnerHTML
  };
})();