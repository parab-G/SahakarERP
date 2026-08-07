(function(){
  window.SahakarComponents = window.SahakarComponents || {};

  function uid(prefix='spinner'){
    return prefix + '-' + Date.now().toString(36) + '-' + Math.floor(Math.random()*0xffff).toString(36);
  }

  function ensureElement(container){
    if (typeof container === 'string') return document.querySelector(container);
    return container instanceof Element ? container : null;
  }

  function cloneTemplate(){
    const tpl = document.getElementById('spinner-template');
    if (!tpl || !('content' in tpl)) throw new Error('Spinner template not found. Include Components/Spinner/Spinner.html');
    return tpl.content.firstElementChild.cloneNode(true);
  }

  function create(container, config={}){
    const host = ensureElement(container);
    if (!host) throw new Error('Invalid container for Spinner.create');

    const node = cloneTemplate();
    const id = uid('spinner');

    const backdrop = node.querySelector('.sahakar-spinner-backdrop');
    const content = node.querySelector('.sahakar-spinner-content');
    const placeholder = node.querySelector('.spinner-placeholder');
    const messageEl = node.querySelector('.spinner-message');
    const progressWrap = node.querySelector('.spinner-progress');
    const percentEl = node.querySelector('.spinner-percent');
    const inlinePlaceholder = node.querySelector('.spinner-placeholder-inline');
    const inlineMessage = node.querySelector('.spinner-message-inline');

    let delayTimer = null;
    let minTimer = null;
    let visibleSince = 0;

    // default config
    config = Object.assign({ mode: 'inline', type: 'border', size: 'medium', backdrop: false, backdropTransparent: false, delay: 100, minDuration: 200, zIndex: 1050 }, config || {});

    function sizeClass(size){
      if (size === 'small') return 'spinner-border-sm';
      if (size === 'large') return 'spinner-border-lg';
      return ''; // medium default
    }

    function createSpinnerElement(){
      const type = config.type === 'grow' ? 'spinner-grow' : 'spinner-border';
      const span = document.createElement('div');
      let cls = type + ' text-primary';
      if (config.size === 'small') cls += ' spinner-border-sm';
      span.className = cls;
      span.setAttribute('role','status');
      span.innerHTML = '<span class="visually-hidden">Loading</span>';
      return span;
    }

    function applyConfig(cfg){
      cfg = cfg || {};
      Object.assign(config, cfg);
      // standard fields
      if (config.id) node.id = config.id;
      if (config.className) node.classList.add(...config.className.split(' '));
      if (typeof config.visible !== 'undefined') { if (config.visible) node.classList.remove('d-none'); else node.classList.add('d-none'); }
      if (typeof config.disabled !== 'undefined') { if (config.disabled) { node.setAttribute('aria-disabled','true'); node.classList.add('disabled'); } else { node.removeAttribute('aria-disabled'); node.classList.remove('disabled'); } }
      if (config.theme) node.dataset.theme = config.theme;
      if (config.callbacks && typeof config.callbacks === 'object') node._callbacks = config.callbacks;

      // backdrop
      if (config.mode === 'fullscreen' || config.mode === 'overlay'){
        backdrop.classList.remove('d-none');
        if (config.backdrop){
          backdrop.classList.add('bg-dark','bg-opacity-50');
        } else {
          backdrop.classList.remove('bg-dark','bg-opacity-50');
        }
        if (config.backdropTransparent){
          backdrop.classList.remove('bg-dark','bg-opacity-50');
        }
        // position handling
        if (config.mode === 'fullscreen'){
          // make backdrop fixed to viewport
          backdrop.classList.add('position-fixed','top-0','start-0','w-100','h-100');
          // z-index via style
          backdrop.style.zIndex = config.zIndex;
        } else {
          backdrop.classList.remove('position-fixed');
          backdrop.classList.add('position-absolute');
          backdrop.style.zIndex = config.zIndex;
        }
      } else {
        backdrop.classList.add('d-none');
      }

      // spinner elements
      const s = createSpinnerElement();
      placeholder.innerHTML = '';
      placeholder.appendChild(s);
      inlinePlaceholder.innerHTML = '';
      inlinePlaceholder.appendChild(s.cloneNode(true));

      // message
      setMessage(config.message || 'Loading...');
      // progress
      if (typeof config.progress === 'number') setProgress(config.progress);
      else setProgress(null);
    }

    function setMessage(text){
      messageEl.textContent = text || '';
      inlineMessage.textContent = text || '';
      if (!text) { messageEl.classList.add('d-none'); inlineMessage.classList.add('d-none'); }
      else { messageEl.classList.remove('d-none'); inlineMessage.classList.remove('d-none'); }
    }

    function setProgress(pct){
      if (pct === null || typeof pct === 'undefined') { progressWrap.classList.add('d-none'); percentEl.textContent = ''; return; }
      pct = Math.max(0, Math.min(100, Math.round(pct)));
      progressWrap.classList.remove('d-none');
      percentEl.textContent = pct + '%';
    }

    function applyAria(busy){
      try{ host.setAttribute('aria-busy', busy ? 'true' : 'false'); } catch(e){}
    }

    function show(){
      // delayed show to avoid flicker
      clearTimers();
      if (config.delay && config.delay > 0){
        delayTimer = setTimeout(()=>{
          doShow();
        }, config.delay);
      } else {
        doShow();
      }
    }

    function doShow(){
      visibleSince = Date.now();
      applyAria(true);
      if (config.mode === 'inline'){
        // ensure inline wrapper visible
        node.classList.remove('d-none');
      } else if (config.mode === 'overlay' || config.mode === 'fullscreen'){
        // attach to host if not already
        if (!node.parentElement) host.style.position = host.style.position || 'relative';
        if (!host.contains(node)) host.appendChild(node);
        backdrop.classList.remove('d-none');
        // set proper placement for fullscreen
        if (config.mode === 'fullscreen'){
          // ensure appended to body as fixed
          if (node.parentElement !== document.body){ document.body.appendChild(node); }
        }
      }
      minTimer = setTimeout(()=>{ minTimer = null; }, config.minDuration || 0);
    }

    function hide(){
      // ensure visible for minDuration
      const elapsed = Date.now() - (visibleSince || 0);
      const remaining = (config.minDuration || 0) - elapsed;
      clearTimers();
      const doHideNow = ()=>{
        applyAria(false);
        // hide visuals
        if (config.mode === 'inline') node.classList.add('d-none');
        else backdrop.classList.add('d-none');
      };
      if (remaining > 0){ setTimeout(doHideNow, remaining); } else { doHideNow(); }
    }

    function clearTimers(){ if (delayTimer){ clearTimeout(delayTimer); delayTimer=null; } if (minTimer){ clearTimeout(minTimer); minTimer=null; } }

    function destroy(){ clearTimers(); try{ node.remove(); } catch(e){} applyAria(false); }

    // initial apply
    applyConfig(config);
    // mount inline by default
    if (!host.contains(node)) host.appendChild(node);
    if (config.mode === 'inline' && !config.autoShow) node.classList.add('d-none');
    if (config.autoShow) show();

    function update(cfg){ if (!cfg) return; Object.assign(config, cfg); applyConfig(config); if (node._callbacks && typeof node._callbacks.onUpdate === 'function') node._callbacks.onUpdate(cfg); }
    return { id, el: node, show, hide, update, setMessage, setProgress, destroy };
  }

  window.SahakarComponents.Spinner = { create };
})();