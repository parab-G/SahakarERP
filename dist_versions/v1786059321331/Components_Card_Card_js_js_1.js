(function () {
  // Ensure global namespace
  window.SahakarComponents = window.SahakarComponents || {};

  function uid(prefix = 'cid') {
    return prefix + '-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 0xffff).toString(36);
  }

  function ensureElement(container) {
    if (typeof container === 'string') return document.querySelector(container);
    return container instanceof Element ? container : null;
  }

  function cloneTemplate() {
    const tpl = document.getElementById('card-template');
    if (!tpl || !('content' in tpl)) throw new Error('Card template not found. Include Components/Card/Card.html in the page.');
    return tpl.content.firstElementChild.cloneNode(true);
  }

  function setVisibility(el, visible) {
    if (!el) return;
    if (visible) el.classList.remove('d-none'); else el.classList.add('d-none');
  }

  function create(container, config = {}) {
    const host = ensureElement(container);
    if (!host) throw new Error('Invalid container for Card.create');

    const el = cloneTemplate();
    const instanceId = uid('card');

    // find parts
    const header = el.querySelector('.card-header');
    const titleEl = el.querySelector('.card-title');
    const subtitleEl = el.querySelector('.card-subtitle');
    const iconEl = el.querySelector('.card-icon');
    const badgeEl = el.querySelector('.card-badge');
    const headerActionsEl = el.querySelector('.card-header-actions');
    const collapseWrapper = el.querySelector('.card-collapse');
    const bodyEl = el.querySelector('.card-body');
    const footerEl = el.querySelector('.card-footer');
    const loadingOverlay = el.querySelector('.card-loading-overlay');
    const emptyStateEl = el.querySelector('.card-empty-state');

    // accessibility
    const titleId = instanceId + '-title';
    titleEl.id = titleId;
    el.setAttribute('aria-labelledby', titleId);

    // apply initial config (standard keys supported: id, className, visible, disabled, theme, callbacks)
    function applyConfig(cfg) {
      if (!cfg) return;
      // standard fields
      if (cfg.id) el.id = cfg.id;
      if (cfg.className) el.classList.add(...cfg.className.split(' '));
      if (typeof cfg.visible !== 'undefined') {
        if (cfg.visible) el.classList.remove('d-none'); else el.classList.add('d-none');
      }
      if (typeof cfg.disabled !== 'undefined') {
        if (cfg.disabled) { el.setAttribute('aria-disabled', 'true'); el.classList.add('disabled'); }
        else { el.removeAttribute('aria-disabled'); el.classList.remove('disabled'); }
      }
      if (cfg.theme) el.dataset.theme = cfg.theme; // non-visual marker
      if (cfg.callbacks && typeof cfg.callbacks === 'object') { el._callbacks = cfg.callbacks; }

      // component-specific fields
      if (cfg.title) titleEl.textContent = cfg.title;
      if (cfg.subtitle) subtitleEl.textContent = cfg.subtitle;
      if (cfg.icon) {
        iconEl.className = 'card-icon d-inline-flex align-items-center';
        const i = document.createElement('i');
        i.className = cfg.icon; // expected to be bootstrap icon class or similar
        iconEl.innerHTML = '';
        iconEl.appendChild(i);
        iconEl.classList.remove('d-none');
      }
      if (cfg.badge) {
        badgeEl.innerHTML = '';
        const b = document.createElement('span');
        b.className = 'badge bg-primary';
        b.textContent = cfg.badge;
        badgeEl.appendChild(b);
      }
      if (cfg.headerActions && Array.isArray(cfg.headerActions)) {
        setHeaderActions(cfg.headerActions);
      }
      if (cfg.body) setBody(cfg.body);
      if (cfg.footer) setFooter(cfg.footer);
      if (cfg.collapsible) setCollapsible(true);
      if (cfg.loading) setLoading(true);
      if (cfg.empty) setEmpty(true, cfg.emptyMessage);
    }

    // header actions expects array of elements or HTML strings
    function setHeaderActions(actions = []) {
      headerActionsEl.innerHTML = '';
      actions.forEach(a => {
        if (a instanceof Element) headerActionsEl.appendChild(a);
        else if (typeof a === 'string') {
          const wrapper = document.createElement('div');
          wrapper.innerHTML = a;
          // append children (safe assuming trusted internal templates)
          Array.from(wrapper.children).forEach(c => headerActionsEl.appendChild(c));
        }
      });
    }

    function setBody(content) {
      if (content instanceof Element) {
        bodyEl.innerHTML = '';
        bodyEl.appendChild(content);
      } else if (typeof content === 'string') {
        bodyEl.innerHTML = content;
      }
      setEmpty(false);
    }

    function setFooter(content) {
      if (!content) { footerEl.innerHTML = ''; return; }
      if (content instanceof Element) {
        footerEl.innerHTML = '';
        footerEl.appendChild(content);
      } else if (typeof content === 'string') {
        footerEl.innerHTML = content;
      }
    }

    function setLoading(on) {
      setVisibility(loadingOverlay, on);
      // when loading, hide empty state
      if (on) setVisibility(emptyStateEl, false);
    }

    function setEmpty(isEmpty, message) {
      setVisibility(emptyStateEl, isEmpty);
      if (isEmpty && message) {
        emptyStateEl.querySelector('.text-center').textContent = message;
      }
    }

    // collapsible support
    let collapseButton = null;
    function setCollapsible(enabled) {
      if (!enabled) return;
      // create a collapse toggle in header actions if not present
      if (!collapseButton) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-sm btn-outline-secondary';
        btn.setAttribute('aria-expanded', 'true');
        btn.setAttribute('aria-controls', instanceId + '-collapse');
        btn.innerHTML = '<span class="visually-hidden">Toggle</span><i class="bi bi-chevron-up"></i>';
        btn.addEventListener('click', () => {
          toggle();
        });
        headerActionsEl.insertBefore(btn, headerActionsEl.firstChild);
        collapseButton = btn;

        // assign id to collapse wrapper for aria
        const cId = instanceId + '-collapse';
        collapseWrapper.id = cId;
      }
    }

    function collapse() {
      if (!collapseWrapper.classList.contains('show')) return; // already collapsed
      collapseWrapper.classList.remove('show');
      if (collapseButton) {
        collapseButton.setAttribute('aria-expanded', 'false');
        collapseButton.querySelector('i')?.classList.replace('bi-chevron-up', 'bi-chevron-down');
      }
    }

    function expand() {
      if (collapseWrapper.classList.contains('show')) return; // already expanded
      collapseWrapper.classList.add('show');
      if (collapseButton) {
        collapseButton.setAttribute('aria-expanded', 'true');
        collapseButton.querySelector('i')?.classList.replace('bi-chevron-down', 'bi-chevron-up');
      }
    }

    function toggle() {
      if (collapseWrapper.classList.contains('show')) collapse(); else expand();
    }

    // mount
    host.appendChild(el);

    // apply initial config
    applyConfig(config);

    // instance API - standardized lifecycle: show, hide, update, destroy
    function show(){ el.classList.remove('d-none'); if (el._callbacks && typeof el._callbacks.onShow === 'function') el._callbacks.onShow(); }
    function hide(){ el.classList.add('d-none'); if (el._callbacks && typeof el._callbacks.onHide === 'function') el._callbacks.onHide(); }
    function update(cfg){ if (!cfg) return; Object.assign(config, cfg); applyConfig(config); if (el._callbacks && typeof el._callbacks.onUpdate === 'function') el._callbacks.onUpdate(cfg); }

    const api = {
      id: instanceId,
      el,
      show,
      hide,
      update,
      setTitle: (t) => { titleEl.textContent = t; },
      setSubtitle: (s) => { subtitleEl.textContent = s; },
      setIcon: (iconClass) => { applyConfig({ icon: iconClass }); },
      setBadge: (text) => { applyConfig({ badge: text }); },
      setHeaderActions,
      setBody,
      setFooter,
      setLoading,
      setEmpty,
      setCollapsible,
      collapse,
      expand,
      toggle,
      destroy: () => { el.remove(); }
    };

    return api;
  }

  window.SahakarComponents.Card = { create };
})();
