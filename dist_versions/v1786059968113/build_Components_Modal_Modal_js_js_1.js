(function(){
  window.SahakarComponents = window.SahakarComponents || {};

  function uid(prefix='modal'){
    return prefix + '-' + Date.now().toString(36) + '-' + Math.floor(Math.random()*0xffff).toString(36);
  }
  function ensureElement(container){ if (typeof container === 'string') return document.querySelector(container); return container instanceof Element ? container : null; }
  function cloneTemplate(){ const tpl = document.getElementById('modal-template'); if (!tpl || !('content' in tpl)) throw new Error('Modal template not found. Include Components/Modal/Modal.html'); return tpl.content.firstElementChild.cloneNode(true); }

  function focusableElements(root){ return Array.from(root.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')).filter(el=>el.offsetParent !== null); }

  function create(container, config){
    const host = ensureElement(container) || document.body;
    if (!host) throw new Error('Invalid container for Modal.create');
    config = Object.assign({ title:'', subtitle:'', body:'', footer:'', size:'md', scrollable:false, centered:true, fullscreen:false, backdrop:true, keyboard:true, closeButton:true, primaryButton:null, secondaryButton:null, dangerButton:null, theme:'light', callbacks:{} }, config || {});

    const node = cloneTemplate();
    const backdrop = node.querySelector('.sahakar-modal-backdrop');
    const modalWrap = node.querySelector('.sahakar-modal');
    const dialog = node.querySelector('.modal-dialog');
    const content = node.querySelector('.modal-content');
    const titleEl = node.querySelector('.modal-title');
    const subtitleEl = node.querySelector('.modal-subtitle');
    const controlsEl = node.querySelector('.modal-controls');
    const bodyEl = node.querySelector('.modal-body');
    const footerEl = node.querySelector('.modal-footer');

    const id = config.id || uid('modal');
    node.id = id;

    let previouslyFocused = null;
    let trapListener = null;

    function applyConfig(cfg){
      cfg = cfg || {};
      Object.assign(config, cfg);
      if (config.title) titleEl.innerHTML = config.title; else titleEl.innerHTML = '';
      if (config.subtitle) subtitleEl.innerHTML = config.subtitle; else subtitleEl.innerHTML = '';

      // body
      if (config.body instanceof Element){ bodyEl.innerHTML = ''; bodyEl.appendChild(config.body); }
      else bodyEl.innerHTML = config.body || '';

      // footer
      footerEl.innerHTML = '';
      if (config.footer instanceof Element){ footerEl.appendChild(config.footer); }
      else if (config.footer) footerEl.innerHTML = config.footer;

      // controls (close button and actions)
      controlsEl.innerHTML = '';
      if (config.closeButton){ const btn = document.createElement('button'); btn.type='button'; btn.className='btn-close'; btn.setAttribute('aria-label','Close'); btn.addEventListener('click', hide); controlsEl.appendChild(btn); }

      // action buttons in footer
      const actions = [];
      if (config.dangerButton) actions.push(Object.assign({variant:'danger'}, config.dangerButton));
      if (config.secondaryButton) actions.push(Object.assign({variant:'secondary'}, config.secondaryButton));
      if (config.primaryButton) actions.push(Object.assign({variant:'primary'}, config.primaryButton));
      actions.forEach(a=>{
        const b = document.createElement('button'); b.type='button'; b.className = 'btn btn-sm ' + (a.variant==='primary' ? 'btn-primary' : a.variant==='danger' ? 'btn-danger' : 'btn-secondary'); b.textContent = a.text || 'Action'; b.addEventListener('click', (e)=>{ if (typeof a.onClick === 'function') a.onClick(e, instance); if (config.callbacks && typeof config.callbacks['on' + capitalize(a.variant)] === 'function') config.callbacks['on' + capitalize(a.variant)](e, instance); }); footerEl.appendChild(b);
      });

      // loading/error/success classes can be added by host via setLoading/setError/setSuccess
    }

    function capitalize(s){ return s && s.length ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

    function trapFocus(e){
      const focusables = focusableElements(node);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length-1];
      if (e.key === 'Tab'){
        if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
      }
    }

    function show(){
      previouslyFocused = document.activeElement;
      if (!node.parentElement) document.body.appendChild(node);
      backdrop.classList.remove('d-none');
      node.setAttribute('aria-hidden','false');
      node.querySelector('.sahakar-modal').setAttribute('role','dialog');
      node.querySelector('.sahakar-modal').setAttribute('aria-modal','true');
      node.querySelector('.sahakar-modal').setAttribute('aria-labelledby','modal-title');

      // focus management
      const focusables = focusableElements(node);
      if (focusables.length) focusables[0].focus();
      // attach trap and ESC handler
      trapListener = (e)=> trapFocus(e);
      document.addEventListener('keydown', trapListener);
      if (config.keyboard){ document.addEventListener('keydown', handleEsc); }
      if (config.backdrop){ node.addEventListener('click', backdropClick); }
      if (config.callbacks && typeof config.callbacks.onOpen === 'function') config.callbacks.onOpen(instance);
    }

    function handleEsc(e){ if (e.key === 'Escape'){ hide(); } }
    function backdropClick(e){ if (e.target === node || e.target === node.querySelector('.sahakar-modal')){ if (config.backdrop) hide(); } }

    function hide(){
      node.setAttribute('aria-hidden','true');
      backdrop.classList.add('d-none');
      document.removeEventListener('keydown', trapListener);
      if (config.keyboard) document.removeEventListener('keydown', handleEsc);
      if (config.backdrop) node.removeEventListener('click', backdropClick);
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') previouslyFocused.focus();
      if (config.callbacks && typeof config.callbacks.onClose === 'function') config.callbacks.onClose(instance);
    }

    function update(cfg){ if (!cfg) return; Object.assign(config, cfg); applyConfig(config); if (config.callbacks && typeof config.callbacks.onUpdate === 'function') config.callbacks.onUpdate(instance); }
    function destroy(){ try{ node.remove(); } catch(e){} if (config.callbacks && typeof config.callbacks.onDestroy === 'function') config.callbacks.onDestroy(instance); }

    function setTitle(t){ titleEl.innerHTML = t || ''; }
    function setBody(b){ if (b instanceof Element){ bodyEl.innerHTML=''; bodyEl.appendChild(b); } else bodyEl.innerHTML = b || ''; }
    function setFooter(f){ if (f instanceof Element){ footerEl.innerHTML=''; footerEl.appendChild(f); } else footerEl.innerHTML = f || ''; }
    function setButtons(btns){ config.primaryButton = btns.primary || null; config.secondaryButton = btns.secondary || null; config.dangerButton = btns.danger || null; applyConfig(config); }
    function setLoading(on, msg){ if (on){ footerEl.classList.add('opacity-75'); const s = document.createElement('div'); s.className='spinner-border spinner-border-sm me-2'; s.setAttribute('role','status'); s.innerHTML = '<span class="visually-hidden">Loading</span>'; footerEl.insertBefore(s, footerEl.firstChild); if (msg) { const m = document.createElement('span'); m.className='small text-muted ms-2'; m.textContent = msg; footerEl.insertBefore(m, s.nextSibling); } } else { // remove spinner if present
      const sp = footerEl.querySelector('.spinner-border'); if (sp) sp.remove(); footerEl.classList.remove('opacity-75'); }
    }

    function setError(msg){ // show error message above footer
      const ex = document.createElement('div'); ex.className='alert alert-danger mt-2 mb-0'; ex.role='alert'; ex.innerHTML = msg || 'Error'; bodyEl.parentNode.insertBefore(ex, bodyEl.nextSibling);
    }
    function setSuccess(msg){ const sx = document.createElement('div'); sx.className='alert alert-success mt-2 mb-0'; sx.role='status'; sx.innerHTML = msg || 'Success'; bodyEl.parentNode.insertBefore(sx, bodyEl.nextSibling); }

    // mount
    host.appendChild(node);
    applyConfig(config);
    if (config.autoShow) show();

    const instance = { id, el: node, show, hide, update, destroy, setTitle, setBody, setFooter, setButtons, setLoading, setError, setSuccess };
    return instance;
  }

  window.SahakarComponents.Modal = { create };
})();