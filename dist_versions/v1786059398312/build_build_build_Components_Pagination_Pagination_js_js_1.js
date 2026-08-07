(function(){
  window.SahakarComponents = window.SahakarComponents || {};

  function uid(prefix='pg'){ return prefix + '-' + Date.now().toString(36) + '-' + Math.floor(Math.random()*0xffff).toString(36); }
  function ensureElement(container){ if (typeof container === 'string') return document.querySelector(container); return container instanceof Element ? container : null; }
  function cloneTemplate(){ const tpl = document.getElementById('pagination-template'); if (!tpl || !('content' in tpl)) throw new Error('Pagination template not found. Include Components/Pagination/Pagination.html'); return tpl.content.firstElementChild.cloneNode(true); }

  function create(container, cfg){
    const host = ensureElement(container);
    if (!host) throw new Error('Invalid container for Pagination.create');
    const config = Object.assign({ currentPage:1, pageSize:10, totalRecords:0, pageSizes:[10,25,50,100], maxButtons:5, showFirstLast:true, showPrevNext:true, showInfo:true, disabled:false, callbacks:{} }, cfg || {});

    const node = cloneTemplate();
    const id = config.id || uid('pagination'); node.id = id;
    const ul = node.querySelector('.pagination');
    const info = node.querySelector('.pagination-info');
    const pagesizeWrap = node.querySelector('.pagination-pagesize');

    function totalPages(){ return Math.max(1, Math.ceil(config.totalRecords / config.pageSize)); }

    function render(){ ul.innerHTML = '';
      const tp = totalPages();
      const current = Math.max(1, Math.min(tp, config.currentPage));

      // first
      if (config.showFirstLast){ const li = createButton('first', '<<', current===1); ul.appendChild(li); }
      // prev
      if (config.showPrevNext){ const li = createButton('prev','<', current===1); ul.appendChild(li); }

      // numeric buttons
      const max = Math.max(1, config.maxButtons || 5);
      let start = Math.max(1, current - Math.floor(max/2));
      let end = Math.min(tp, start + max - 1);
      if (end - start + 1 < max){ start = Math.max(1, end - max + 1); }
      for (let p=start; p<=end; p++){
        const li = document.createElement('li'); li.className='page-item' + (p===current ? ' active' : ''); li.setAttribute('role','presentation');
        const a = document.createElement('button'); a.type='button'; a.className='page-link'; a.textContent = String(p); a.setAttribute('aria-label','Page '+p); if (p===current) a.setAttribute('aria-current','page'); a.addEventListener('click', ()=> goTo(p)); li.appendChild(a); ul.appendChild(li);
      }

      // next
      if (config.showPrevNext){ const li = createButton('next','>', current===tp); ul.appendChild(li); }
      // last
      if (config.showFirstLast){ const li = createButton('last','>>', current===tp); ul.appendChild(li); }

      // info
      if (config.showInfo){ info.classList.remove('d-none'); const startRec = (current-1)*config.pageSize + 1; const endRec = Math.min(config.totalRecords, current*config.pageSize); info.textContent = `${config.totalRecords} records — ${startRec}-${endRec}`; } else { info.classList.add('d-none'); }

      // page size selector
      pagesizeWrap.innerHTML = '';
      if (Array.isArray(config.pageSizes) && config.pageSizes.length){ const sel = document.createElement('select'); sel.className='form-select form-select-sm'; sel.setAttribute('aria-label','Page size'); config.pageSizes.forEach(s=>{ const opt = document.createElement('option'); opt.value = s; opt.textContent = String(s); if (s===config.pageSize) opt.selected = true; sel.appendChild(opt); }); sel.addEventListener('change', ()=> setPageSize(Number(sel.value))); pagesizeWrap.appendChild(sel); }

      // accessible keyboard support
      ul.addEventListener('keydown', (e)=>{ if (e.key === 'ArrowLeft') previous(); else if (e.key === 'ArrowRight') next(); });
    }

    function createButton(type, label, disabled){ const li = document.createElement('li'); li.className = 'page-item' + (disabled ? ' disabled' : ''); li.setAttribute('role','presentation'); const btn = document.createElement('button'); btn.type='button'; btn.className='page-link'; btn.innerHTML = label; btn.setAttribute('aria-label', type); if (!disabled){ btn.addEventListener('click', ()=>{ if (type==='prev') previous(); else if (type==='next') next(); else if (type==='first') first(); else if (type==='last') last(); }); } li.appendChild(btn); return li; }

    function goTo(p){ const tp = totalPages(); const np = Math.max(1, Math.min(tp, p)); if (np === config.currentPage) return; config.currentPage = np; render(); if (typeof config.callbacks.onPageChange === 'function') config.callbacks.onPageChange(np); if (typeof instance.onPageChange === 'function') instance.onPageChange(np); }
    function next(){ goTo(config.currentPage + 1); }
    function previous(){ goTo(config.currentPage -1); }
    function first(){ goTo(1); }
    function last(){ goTo(totalPages()); }
    function setPage(p){ goTo(p); }
    function setTotal(t){ config.totalRecords = Number(t) || 0; if (config.currentPage > totalPages()) config.currentPage = totalPages(); render(); }
    function setPageSize(size){ config.pageSize = Number(size) || config.pageSize; config.currentPage = 1; render(); if (typeof config.callbacks.onPageSizeChange === 'function') config.callbacks.onPageSizeChange(config.pageSize); if (typeof instance.onPageSizeChange === 'function') instance.onPageSizeChange(config.pageSize); }

    function setVisible(v){ if (v) node.classList.remove('d-none'); else node.classList.add('d-none'); }

    // public API
    function show(){ setVisible(true); if (config.callbacks && typeof config.callbacks.onShow === 'function') config.callbacks.onShow(); }
    function hide(){ setVisible(false); if (config.callbacks && typeof config.callbacks.onHide === 'function') config.callbacks.onHide(); }
    function update(newCfg){ if (!newCfg) return; Object.assign(config, newCfg); render(); }
    function destroy(){ node.remove(); }

    // mount
    host.appendChild(node);
    render();

    const instance = { id, el: node, show, hide, update, destroy, goTo, next, previous, first, last, setPage, setTotal, setPageSize };
    // convenience assignable handlers
    instance.onPageChange = null; instance.onPageSizeChange = null;

    return instance;
  }

  window.SahakarComponents.Pagination = { create };
})();