(function(){
  window.SahakarComponents = window.SahakarComponents || {};

  function uid(prefix='alert'){
    return prefix + '-' + Date.now().toString(36) + '-' + Math.floor(Math.random()*0xffff).toString(36);
  }

  function ensureElement(container){
    if (typeof container === 'string') return document.querySelector(container);
    return container instanceof Element ? container : null;
  }

  function cloneTemplate(){
    const tpl = document.getElementById('alert-template');
    if (!tpl || !('content' in tpl)) throw new Error('Alert template not found. Include Components/Alert/Alert.html');
    return tpl.content.firstElementChild.cloneNode(true);
  }

  // toast container singleton
  function getToastContainer(){
    let c = document.querySelector('.sahakar-alert-toast-container');
    if (!c){
      c = document.createElement('div');
      c.className = 'sahakar-alert-toast-container position-fixed top-0 end-0 p-3';
      c.setAttribute('aria-live','polite');
      c.setAttribute('aria-atomic','true');
      document.body.appendChild(c);
    }
    return c;
  }

  function create(container, config={}){
    const host = ensureElement(container) || (config.mode === 'toast' ? getToastContainer() : null);
    if (!host) throw new Error('Invalid container for Alert.create');

    const node = cloneTemplate();
    const id = uid('alert');
    const alertEl = node.querySelector('.alert');
    const iconEl = node.querySelector('.alert-icon');
    const titleEl = node.querySelector('.alert-title');
    const messageEl = node.querySelector('.alert-message');
    const actionsEl = node.querySelector('.alert-actions');
    const progressWrap = node.querySelector('.alert-progress');
    const progressBar = node.querySelector('.progress-bar');

    let timeoutId = null;
    let progressInterval = null;
    let startTs = 0;
    let duration = 0;

    function applyConfig(cfg){
      cfg = cfg || {};
      // standard fields
      if (cfg.id) node.id = cfg.id;
      if (cfg.className) node.classList.add(...cfg.className.split(' '));
      if (typeof cfg.visible !== 'undefined') { if (cfg.visible) node.classList.remove('d-none'); else node.classList.add('d-none'); }
      if (typeof cfg.disabled !== 'undefined') { if (cfg.disabled) { node.setAttribute('aria-disabled','true'); node.classList.add('disabled'); } else { node.removeAttribute('aria-disabled'); node.classList.remove('disabled'); } }
      if (cfg.theme) node.dataset.theme = cfg.theme;
      if (cfg.callbacks && typeof cfg.callbacks === 'object') node._callbacks = cfg.callbacks;

      // type
      const type = cfg.type || 'info';
      const typeClass = 'alert-' + (['success','danger','warning','info','primary','secondary'].includes(type) ? type : 'info');
      alertEl.className = 'alert ' + typeClass;

      // icon
      if (cfg.icon){
        iconEl.innerHTML = '';
        const i = document.createElement('i');
        i.className = cfg.icon;
        iconEl.appendChild(i);
        iconEl.classList.remove('d-none');
      } else {
        iconEl.classList.add('d-none');
      }

      // title & message
      titleEl.innerHTML = cfg.title || '';
      if (cfg.message){
        messageEl.innerHTML = cfg.message;
        messageEl.classList.remove('d-none');
      } else {
        messageEl.classList.add('d-none');
      }

      // actions: dismiss by default
      actionsEl.innerHTML = '';
      const dismiss = document.createElement('button');
      dismiss.type = 'button';
      dismiss.className = 'btn-close';
      dismiss.setAttribute('aria-label','Dismiss');
      dismiss.addEventListener('click', ()=> hide(true));
      actionsEl.appendChild(dismiss);

      if (cfg.showClose === false){ dismiss.classList.add('d-none'); }

      // progress
      if (cfg.progress && cfg.autoClose && cfg.timeout > 0){
        progressWrap.classList.remove('d-none');
        // set initial height via JS to avoid inline CSS in template
        progressBar.style.height = (cfg.progressHeight || '6px');
        progressBar.style.width = '100%';
      } else {
        progressWrap.classList.add('d-none');
      }

      // mode
      if (cfg.mode === 'toast'){
        node.classList.add('mb-2');
      }

      // auto close
      if (cfg.autoClose && cfg.timeout && cfg.timeout > 0){
        setAutoClose(cfg.timeout, (typeof node._callbacks?.onClose === 'function') ? node._callbacks.onClose : cfg.onClose);
      }
    }

    function setAutoClose(ms, onClose){
      clearTimers();
      duration = ms;
      startTs = Date.now();
      if (ms <= 0) return;
      timeoutId = setTimeout(()=>{ hide(true); if (typeof onClose === 'function') onClose(); }, ms);
      // progress animation
      if (progressBar && !progressWrap.classList.contains('d-none')){
        const step = 100; // ms
        progressInterval = setInterval(()=>{
          const elapsed = Date.now() - startTs;
          const pct = Math.max(0, 100 - Math.floor((elapsed/duration)*100));
          progressBar.style.width = pct + '%';
        }, step);
      }
    }

    function clearTimers(){
      if (timeoutId){ clearTimeout(timeoutId); timeoutId = null; }
      if (progressInterval){ clearInterval(progressInterval); progressInterval = null; }
    }

    function show(){
      // append to host (for toast mode host may be toast container)
      if (!node.parentElement) host.appendChild(node);
      node.classList.remove('d-none');
      node.setAttribute('aria-hidden','false');
      // focus dismiss button for accessibility in toast mode
      const dismissBtn = node.querySelector('.btn-close');
      if (dismissBtn && node.classList.contains('mb-2')){
        try{ dismissBtn.focus(); } catch(e){}
      }
      if (node._callbacks && typeof node._callbacks.onShow === 'function') node._callbacks.onShow();
    }

    function hide(fromUser){
      node.classList.add('d-none');
      node.setAttribute('aria-hidden','true');
      clearTimers();
      if (typeof config.onClose === 'function') config.onClose(fromUser === true);
    }

    function update(cfg){
      // merge basic config
      Object.assign(config, cfg);
      applyConfig(config);
    }

    function destroy(){
      clearTimers();
      node.remove();
    }

    // allow stacking by simply appending multiple nodes to same host
    host.appendChild(node);
    // keep node hidden until show called unless auto show
    if (config.autoShow !== false){ show(); }

    applyConfig(config);

    return { id, el: node, show, hide, update, destroy };
  }

  window.SahakarComponents.Alert = { create };
})();