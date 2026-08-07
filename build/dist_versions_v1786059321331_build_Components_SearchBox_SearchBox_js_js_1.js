(function(){
  window.SahakarComponents = window.SahakarComponents || {};

  function uid(prefix='searchbox'){ return prefix + '-' + Date.now().toString(36) + '-' + Math.floor(Math.random()*0xffff).toString(36); }
  function ensureElement(container){ if (typeof container === 'string') return document.querySelector(container); return container instanceof Element ? container : null; }
  function cloneTemplate(){ const tpl = document.getElementById('searchbox-template'); if (!tpl || !('content' in tpl)) throw new Error('SearchBox template not found. Include Components/SearchBox/SearchBox.html'); return tpl.content.firstElementChild.cloneNode(true); }

  function create(container, cfg){
    const host = ensureElement(container);
    if (!host) throw new Error('Invalid container for SearchBox.create');
    const config = Object.assign({ id: null, className: '', visible: true, disabled: false, theme: 'light', callbacks: {}, placeholder: 'Search', value: '', debounce: 250, clearButton: true, icon: 'bi bi-search', size: 'md' }, cfg || {});

    const node = cloneTemplate();
    const id = config.id || uid('searchbox');
    node.id = id;
    if (config.className) node.classList.add(...config.className.split(' '));
    if (!config.visible) node.classList.add('d-none');
    if (config.disabled) node.querySelector('input').setAttribute('disabled','disabled');

    const input = node.querySelector('input');
    const iconSpan = node.querySelector('.searchbox-icon i');
    const clearBtn = node.querySelector('.searchbox-clear');

    // apply config to DOM
    input.placeholder = config.placeholder || '';
    input.value = config.value || '';
    if (config.icon){ iconSpan.className = config.icon; }
    if (!config.clearButton) clearBtn.classList.add('d-none');

    // callbacks/events
    let onInput = config.callbacks && typeof config.callbacks.onInput === 'function' ? config.callbacks.onInput : null;
    let onSearch = config.callbacks && typeof config.callbacks.onSearch === 'function' ? config.callbacks.onSearch : null;
    let onClear = config.callbacks && typeof config.callbacks.onClear === 'function' ? config.callbacks.onClear : null;
    let onFocus = config.callbacks && typeof config.callbacks.onFocus === 'function' ? config.callbacks.onFocus : null;
    let onBlur = config.callbacks && typeof config.callbacks.onBlur === 'function' ? config.callbacks.onBlur : null;

    // instance-level assignable handlers (convenience)
    let instanceOnSearch = null;

    // debounce helper
    let debounceTimer = null;
    function doDebouncedInput(){ if (debounceTimer) clearTimeout(debounceTimer); debounceTimer = setTimeout(()=>{ if (onInput) onInput(input.value); if (typeof instance.onInput === 'function') instance.onInput(input.value); }, config.debounce); }

    // update clear button visibility
    function refreshClear(){ if (input.value && config.clearButton){ clearBtn.classList.remove('d-none'); } else { clearBtn.classList.add('d-none'); } }

    // handlers
    input.addEventListener('input', (e)=>{ refreshClear(); doDebouncedInput(); });
    input.addEventListener('keydown', (e)=>{
      if (e.key === 'Enter'){
        if (onSearch) onSearch(input.value);
        if (typeof instance.onSearch === 'function') instance.onSearch(input.value);
        if (typeof instanceOnSearch === 'function') instanceOnSearch(input.value);
      } else if (e.key === 'Escape'){
        instance.clear();
      }
    });
    input.addEventListener('focus', ()=>{ if (onFocus) onFocus(); if (typeof instance.onFocus === 'function') instance.onFocus(); });
    input.addEventListener('blur', ()=>{ if (onBlur) onBlur(); if (typeof instance.onBlur === 'function') instance.onBlur(); });

    clearBtn.addEventListener('click', ()=>{ instance.clear(); if (onClear) onClear(); if (typeof instance.onClear === 'function') instance.onClear(); });

    // methods
    function show(){ node.classList.remove('d-none'); input.focus(); if (config.callbacks && typeof config.callbacks.onShow === 'function') config.callbacks.onShow(); }
    function hide(){ node.classList.add('d-none'); if (config.callbacks && typeof config.callbacks.onHide === 'function') config.callbacks.onHide(); }
    function update(newCfg){ if (!newCfg) return; Object.assign(config, newCfg); if (newCfg.placeholder) input.placeholder = newCfg.placeholder; if (typeof newCfg.value !== 'undefined') { input.value = newCfg.value; } if (typeof newCfg.debounce !== 'undefined') config.debounce = newCfg.debounce; if (typeof newCfg.clearButton !== 'undefined') { if (newCfg.clearButton) clearBtn.classList.remove('d-none'); else clearBtn.classList.add('d-none'); } if (newCfg.icon) { iconSpan.className = newCfg.icon; } if (typeof newCfg.disabled !== 'undefined') { if (newCfg.disabled) disable(); else enable(); } if (config.callbacks) { if (typeof config.callbacks.onInput === 'function') onInput = config.callbacks.onInput; if (typeof config.callbacks.onSearch === 'function') onSearch = config.callbacks.onSearch; if (typeof config.callbacks.onClear === 'function') onClear = config.callbacks.onClear; if (typeof config.callbacks.onFocus === 'function') onFocus = config.callbacks.onFocus; if (typeof config.callbacks.onBlur === 'function') onBlur = config.callbacks.onBlur; } if (config.className) node.classList.add(...config.className.split(' ')); }
    function destroy(){ clearTimeout(debounceTimer); node.remove(); }
    function getValue(){ return input.value; }
    function setValue(v){ input.value = v; refreshClear(); }
    function clear(){ input.value = ''; refreshClear(); if (onClear) onClear(); if (typeof instance.onClear === 'function') instance.onClear(); }
    function focus(){ input.focus(); }
    function enable(){ input.removeAttribute('disabled'); config.disabled = false; }
    function disable(){ input.setAttribute('disabled','disabled'); config.disabled = true; }

    // mount
    host.appendChild(node);
    refreshClear();

    const instance = { id, el: node, show, hide, update, destroy, getValue, setValue, clear, focus, enable, disable };
    // convenience assignable handlers
    instance.onInput = null; instance.onSearch = null; instance.onClear = null; instance.onFocus = null; instance.onBlur = null;

    // expose a traditional onSearch setter too
    instance.setOnSearch = function(fn){ instanceOnSearch = fn; };

    return instance;
  }

  window.SahakarComponents.SearchBox = { create };
})();