(function(){
  window.SahakarComponents = window.SahakarComponents || {};

  function uid(prefix='tb'){
    return prefix + '-' + Date.now().toString(36) + '-' + Math.floor(Math.random()*0xffff).toString(36);
  }

  function ensureElement(container){
    if (typeof container === 'string') return document.querySelector(container);
    return container instanceof Element ? container : null;
  }

  function cloneTemplate(){
    const tpl = document.getElementById('toolbar-template');
    if (!tpl || !('content' in tpl)) throw new Error('Toolbar template not found. Include Components/Toolbar/Toolbar.html');
    return tpl.content.firstElementChild.cloneNode(true);
  }

  function setHtml(container, content){
    if (!container) return;
    if (content instanceof Element){ container.innerHTML=''; container.appendChild(content); }
    else if (typeof content === 'string'){ container.innerHTML = content; }
  }

  function create(container, config={}){
    const host = ensureElement(container);
    if (!host) throw new Error('Invalid container for Toolbar.create');

    const el = cloneTemplate();
    const id = uid('toolbar');

    // parts
    const breadcrumbEl = el.querySelector('.toolbar-breadcrumb');
    const titleEl = el.querySelector('.toolbar-title');
    const subtitleEl = el.querySelector('.toolbar-subtitle');
    const actionsWrapper = el.querySelector('.toolbar-actions');
    const leftActions = el.querySelector('.left-actions');
    const rightActions = el.querySelector('.right-actions');
    const customActions = el.querySelector('.custom-actions');
    const searchInput = el.querySelector('.toolbar-search');
    const filterInput = el.querySelector('.toolbar-filter');
    const ctaArea = el.querySelector('.toolbar-cta');
    const toggleBtn = el.querySelector('.toolbar-toggle');
    const collapsedArea = el.querySelector('#toolbar-collapsed-actions');
    const collapsedLeft = el.querySelector('.left-actions-collapsed');
    const collapsedCustom = el.querySelector('.custom-actions-collapsed');
    const collapsedRight = el.querySelector('.right-actions-collapsed');

    // aria and ids
    el.setAttribute('role','region');
    el.setAttribute('aria-label','Module toolbar');

    // hookup toggle behaviour for small screens
    function setCollapsedVisible(visible){
      if (visible){
        collapsedArea.classList.remove('d-none');
        collapsedArea.setAttribute('aria-hidden','false');
        toggleBtn.setAttribute('aria-expanded','true');
      } else {
        collapsedArea.classList.add('d-none');
        collapsedArea.setAttribute('aria-hidden','true');
        toggleBtn.setAttribute('aria-expanded','false');
      }
    }

    toggleBtn.addEventListener('click', ()=>{
      const hidden = collapsedArea.classList.contains('d-none');
      setCollapsedVisible(hidden);
    });

    // helper to render action items (array of element|string|config)
    function renderActions(target, items){
      target.innerHTML = '';
      if (!Array.isArray(items)) return;
      items.forEach(it => {
        if (it instanceof Element) target.appendChild(it);
        else if (typeof it === 'string'){
          const wrapper = document.createElement('div');
          wrapper.innerHTML = it;
          Array.from(wrapper.children).forEach(c=> target.appendChild(c));
        } else if (typeof it === 'object' && it !== null){
          const btn = document.createElement('button');
          btn.type = 'button';
          const classes = ['btn','btn-sm'];
          if (it.primary) classes.push('btn-primary');
          else if (it.secondary) classes.push('btn-secondary');
          else classes.push(it.className || 'btn-outline-secondary');
          btn.className = classes.join(' ');
          btn.textContent = it.text || 'Action';
          if (it.title) btn.setAttribute('title', it.title);
          if (it.ariaLabel) btn.setAttribute('aria-label', it.ariaLabel);
          if (typeof it.onClick === 'function') btn.addEventListener('click', it.onClick);
          target.appendChild(btn);
        }
      });
    }

    // initial config apply (standard keys supported: id, className, visible, disabled, theme, callbacks)
    function applyConfig(cfg){
      if (!cfg) return;
      // standard fields
      if (cfg.id) el.id = cfg.id;
      if (cfg.className) el.classList.add(...cfg.className.split(' '));
      if (typeof cfg.visible !== 'undefined') { if (cfg.visible) el.classList.remove('d-none'); else el.classList.add('d-none'); }
      if (typeof cfg.disabled !== 'undefined') { if (cfg.disabled) { el.setAttribute('aria-disabled','true'); el.classList.add('disabled'); } else { el.removeAttribute('aria-disabled'); el.classList.remove('disabled'); } }
      if (cfg.theme) el.dataset.theme = cfg.theme;
      if (cfg.callbacks && typeof cfg.callbacks === 'object') el._callbacks = cfg.callbacks;

      // component-specific fields
      if (cfg.breadcrumb) setBreadcrumb(cfg.breadcrumb);
      if (cfg.title) titleEl.textContent = cfg.title;
      if (cfg.subtitle) subtitleEl.textContent = cfg.subtitle;
      if (cfg.leftActions) renderActions(leftActions, cfg.leftActions);
      if (cfg.rightActions) renderActions(rightActions, cfg.rightActions);
      if (cfg.customActions) renderActions(customActions, cfg.customActions);
      if (cfg.searchPlaceholder) searchInput.placeholder = cfg.searchPlaceholder;
      if (cfg.filterPlaceholder) filterInput.placeholder = cfg.filterPlaceholder;
      if (cfg.primaryButton) setPrimary(cfg.primaryButton);
      if (cfg.secondaryButton) setSecondary(cfg.secondaryButton);
      if (cfg.exportButton) setExport(cfg.exportButton);
      if (cfg.importButton) setImport(cfg.importButton);
      if (cfg.refreshButton) setRefresh(cfg.refreshButton);

      // synchronize collapsed area for mobile
      syncCollapsed();
    }

    function setBreadcrumb(content){ setHtml(breadcrumbEl, content); }
    function setTitle(t){ titleEl.textContent = t || ''; }
    function setSubtitle(s){ subtitleEl.textContent = s || ''; }

    // CTA helpers
    function setPrimary(cfg){ renderActions(ctaArea, [{ text: cfg.text || 'Primary', primary: true, onClick: cfg.onClick }]); }
    function setSecondary(cfg){ renderActions(ctaArea, [{ text: cfg.text || 'Secondary', secondary: true, onClick: cfg.onClick }]); }
    function setExport(cfg){ renderActions(rightActions, [{ text: cfg.text || 'Export', className: cfg.className || 'btn-outline-secondary', onClick: cfg.onClick }]); }
    function setImport(cfg){ renderActions(rightActions, [{ text: cfg.text || 'Import', className: cfg.className || 'btn-outline-secondary', onClick: cfg.onClick }]); }
    function setRefresh(cfg){ renderActions(rightActions, [{ text: cfg.text || 'Refresh', className: cfg.className || 'btn-outline-secondary', onClick: cfg.onClick }]); }

    function setLeftActions(items){ renderActions(leftActions, items); syncCollapsed(); }
    function setRightActions(items){ renderActions(rightActions, items); syncCollapsed(); }
    function setCustomActions(items){ renderActions(customActions, items); syncCollapsed(); }

    // preserve actions into collapsed area for mobile
    function syncCollapsed(){
      collapsedLeft.innerHTML = '';
      collapsedCustom.innerHTML = '';
      collapsedRight.innerHTML = '';
      // clone children nodes
      Array.from(leftActions.children).forEach(c => collapsedLeft.appendChild(c.cloneNode(true)));
      Array.from(customActions.children).forEach(c => collapsedCustom.appendChild(c.cloneNode(true)));
      Array.from(rightActions.children).forEach(c => collapsedRight.appendChild(c.cloneNode(true)));
    }

    // search/filter events
    let searchHandler = null;
    let filterHandler = null;
    searchInput.addEventListener('input', (e)=>{ if (searchHandler) searchHandler(e.target.value); });
    filterInput.addEventListener('change', (e)=>{ if (filterHandler) filterHandler(e.target.value); });

    // mount
    host.appendChild(el);
    applyConfig(config);

    // standardized lifecycle
    function show(){ el.classList.remove('d-none'); if (searchInput) searchInput.focus(); if (el._callbacks && typeof el._callbacks.onShow === 'function') el._callbacks.onShow(); }
    function hide(){ el.classList.add('d-none'); if (el._callbacks && typeof el._callbacks.onHide === 'function') el._callbacks.onHide(); }
    function update(cfg){ if (!cfg) return; Object.assign(config, cfg); applyConfig(config); if (el._callbacks && typeof el._callbacks.onUpdate === 'function') el._callbacks.onUpdate(cfg); }

    const api = {
      id,
      el,
      show,
      hide,
      update,
      setBreadcrumb,
      setTitle,
      setSubtitle,
      setLeftActions,
      setRightActions,
      setCustomActions,
      setPrimary,
      setSecondary,
      setExport,
      setImport,
      setRefresh,
      onSearch: (fn)=>{ searchHandler = fn; },
      onFilter: (fn)=>{ filterHandler = fn; },
      showActions: ()=> setCollapsedVisible(true),
      hideActions: ()=> setCollapsedVisible(false),
      sync: syncCollapsed,
      destroy: ()=>{ el.remove(); }
    };

    return api;
  }

  window.SahakarComponents.Toolbar = { create };
})();