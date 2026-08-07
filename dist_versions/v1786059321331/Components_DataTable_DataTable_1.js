(function(){
  window.SahakarComponents = window.SahakarComponents || {};

  function uid(prefix='dt'){
    return prefix + '-' + Date.now().toString(36) + '-' + Math.floor(Math.random()*0xffff).toString(36);
  }
  function ensureElement(container){ if (typeof container === 'string') return document.querySelector(container); return container instanceof Element ? container : null; }
  function cloneTemplate(){ const tpl = document.getElementById('datatable-template'); if (!tpl || !('content' in tpl)) throw new Error('DataTable template not found. Include Components/DataTable/DataTable.html'); return tpl.content.firstElementChild.cloneNode(true); }

  function create(container, config){
    const host = ensureElement(container);
    if (!host) throw new Error('Invalid container for DataTable.create');
    config = Object.assign({ columns: [], rows: [], pageSize: 10, sortable: true, searchable: true, selectable: false, actions: [], emptyMessage: 'No records', loading: false }, config || {});

    const node = cloneTemplate();
    const id = config.id || uid('datatable');
    node.id = id;

    // parts
    const searchWrap = node.querySelector('.datatable-search');
    const searchInput = searchWrap.querySelector('input');
    const statusEl = node.querySelector('.datatable-status');
    const loadingOverlay = node.querySelector('.datatable-loading-overlay');
    const headersRow = node.querySelector('.datatable-headers');
    const body = node.querySelector('.datatable-body');
    const paginationEl = node.querySelector('.datatable-pagination');
    const emptyEl = node.querySelector('.datatable-empty');

    let state = { rows: config.rows.slice(), page: 1, pageSize: config.pageSize, sortKey: null, sortDir: null, selected: new Set(), filteredRows: null };
    const events = { onRowClick: config.onRowClick || null, onSelectionChanged: config.onSelectionChanged || null, onSort: config.onSort || null, onPageChange: config.onPageChange || null, onAction: config.onAction || null };

    // helpers
    function renderHeader(){ headersRow.innerHTML = '';
      if (config.selectable){ const th = document.createElement('th'); th.setAttribute('role','columnheader'); const cb = document.createElement('input'); cb.type='checkbox'; cb.className='form-check-input'; cb.addEventListener('change', (e)=>{ const checked = e.target.checked; if (checked) selectAllVisible(); else clearSelection(); }); th.appendChild(cb); headersRow.appendChild(th); }
      config.columns.forEach(col => {
        const th = document.createElement('th'); th.setAttribute('role','columnheader'); th.tabIndex = 0; th.dataset.key = col.key; th.className = 'align-middle'; th.textContent = col.title || col.key;
        if (config.sortable && (col.sortable !== false)){
          th.style.cursor = 'pointer';
          th.setAttribute('aria-sort','none');
          th.addEventListener('click', ()=> toggleSort(col.key));
          th.addEventListener('keydown', (e)=>{ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSort(col.key); } });
        }
        headersRow.appendChild(th);
      });
      if (config.actions && config.actions.length) { const th = document.createElement('th'); th.setAttribute('role','columnheader'); th.textContent = 'Actions'; headersRow.appendChild(th); }
    }

    function renderBody(){ body.innerHTML = '';
      const rows = getPagedRows();
      if (!rows.length){ emptyEl.classList.remove('d-none'); emptyEl.textContent = config.emptyMessage; } else { emptyEl.classList.add('d-none'); }
      rows.forEach((r, i)=>{
        const tr = document.createElement('tr'); tr.setAttribute('role','row'); tr.tabIndex = 0; tr.dataset.index = ((state.page-1)*state.pageSize)+i;
        if (config.selectable){ const td0 = document.createElement('td'); const cb = document.createElement('input'); cb.type='checkbox'; cb.className='form-check-input'; cb.checked = state.selected.has(getRowId(r)); cb.addEventListener('change', ()=> toggleRowSelection(r)); td0.appendChild(cb); tr.appendChild(td0); }
        config.columns.forEach(col=>{
          const td = document.createElement('td'); td.setAttribute('role','gridcell'); const val = r[col.key]; td.innerHTML = formatCell(val, col, r);
          tr.appendChild(td);
        });
        if (config.actions && config.actions.length){ const tdAct = document.createElement('td'); tdAct.setAttribute('role','gridcell'); config.actions.forEach(act=>{
          const btn = document.createElement('button'); btn.type='button'; btn.className = 'btn btn-sm btn-outline-secondary me-1'; btn.textContent = act.label || act.key; btn.addEventListener('click', (e)=>{ e.stopPropagation(); if (events.onAction) events.onAction(act.key, r); }); tdAct.appendChild(btn);
        }); tr.appendChild(tdAct); }

        tr.addEventListener('click', ()=>{ if (events.onRowClick) events.onRowClick(r, Number(tr.dataset.index)); });
        tr.addEventListener('keydown', (e)=>{ if (e.key === 'Enter') { if (events.onRowClick) events.onRowClick(r, Number(tr.dataset.index)); } else if (e.key === 'ArrowDown'){ focusRowByOffset(tr,1); } else if (e.key === 'ArrowUp'){ focusRowByOffset(tr,-1); } });
        body.appendChild(tr);
      });
    }

    function formatCell(val, col, row){ if (col.format && typeof col.format === 'function') return col.format(val, row); if (val === null || typeof val === 'undefined') return ''; if (col.type === 'badge') return '<span class="badge bg-secondary">'+String(val)+'</span>'; return String(val); }

    function getRowId(row){ return row.id || JSON.stringify(row); }

    function toggleRowSelection(row){ const id = getRowId(row); if (state.selected.has(id)) state.selected.delete(id); else state.selected.add(id); if (events.onSelectionChanged) events.onSelectionChanged(Array.from(state.selected)); }
    function selectAllVisible(){ getPagedRows().forEach(r=> state.selected.add(getRowId(r))); if (events.onSelectionChanged) events.onSelectionChanged(Array.from(state.selected)); }
    function clearSelection(){ state.selected.clear(); if (events.onSelectionChanged) events.onSelectionChanged([]); }

    function toggleSort(key){ if (state.sortKey === key){ state.sortDir = (state.sortDir === 'asc') ? 'desc' : 'asc'; } else { state.sortKey = key; state.sortDir = 'asc'; } applySort(); if (events.onSort) events.onSort(state.sortKey, state.sortDir); renderHeader(); renderBody(); }
    function applySort(){ if (!state.sortKey) return; const col = config.columns.find(c=>c.key===state.sortKey); if (!col) return; state.rows.sort((a,b)=>{ const av = a[state.sortKey], bv = b[state.sortKey]; if (av === bv) return 0; if (av == null) return 1; if (bv == null) return -1; if (typeof av === 'number' && typeof bv === 'number') return state.sortDir==='asc' ? av-bv : bv-av; return state.sortDir==='asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av)); }); }

    function getFilteredRows(){ if (!config.searchable || !searchInput || !searchInput.value) return state.rows; const q = searchInput.value.toLowerCase(); return state.rows.filter(r=> JSON.stringify(r).toLowerCase().includes(q)); }
    function getPagedRows(){ const rows = getFilteredRows(); state.filteredRows = rows; const start = (state.page-1)*state.pageSize; return rows.slice(start, start+state.pageSize); }

    function renderPagination(){ paginationEl.innerHTML = ''; const total = state.filteredRows ? state.filteredRows.length : state.rows.length; const totalPages = Math.max(1, Math.ceil(total/state.pageSize)); const info = document.createElement('div'); info.className='text-muted small'; info.textContent = `Page ${state.page} of ${totalPages}`; paginationEl.appendChild(info);
      const prev = document.createElement('button'); prev.className='btn btn-sm btn-outline-secondary'; prev.textContent='Prev'; prev.disabled = state.page === 1; prev.addEventListener('click', ()=> gotoPage(state.page-1)); paginationEl.appendChild(prev);
      const next = document.createElement('button'); next.className='btn btn-sm btn-outline-secondary ms-1'; next.textContent='Next'; next.disabled = state.page >= totalPages; next.addEventListener('click', ()=> gotoPage(state.page+1)); paginationEl.appendChild(next);
    }

    function gotoPage(p){ const total = state.filteredRows ? state.filteredRows.length : state.rows.length; const totalPages = Math.max(1, Math.ceil(total/state.pageSize)); state.page = Math.max(1, Math.min(totalPages, p)); renderBody(); renderPagination(); if (events.onPageChange) events.onPageChange(state.page); }

    function focusRowByOffset(currentRow, offset){ const rows = Array.from(body.querySelectorAll('tr')); const idx = rows.indexOf(currentRow); const next = rows[idx+offset]; if (next) next.focus(); }

    function setLoading(on){ if (on) loadingOverlay.classList.remove('d-none'); else loadingOverlay.classList.add('d-none'); }

    function setVisible(visible){ if (visible) node.classList.remove('d-none'); else node.classList.add('d-none'); }

    // search
    if (config.searchable){ searchWrap.classList.remove('d-none'); searchInput.addEventListener('input', ()=>{ state.page=1; renderBody(); renderPagination(); }); }

    // mount
    host.appendChild(node);

    // initial render
    renderHeader(); applySort(); renderBody(); renderPagination(); setLoading(config.loading); if (!getPagedRows().length) emptyEl.classList.remove('d-none'); else emptyEl.classList.add('d-none'); statusEl.textContent = '';

    // public API
    function show(){ setVisible(true); if (searchInput) searchInput.focus(); if (config.callbacks && typeof config.callbacks.onShow === 'function') config.callbacks.onShow(); }
    function hide(){ setVisible(false); if (config.callbacks && typeof config.callbacks.onHide === 'function') config.callbacks.onHide(); }
    function update(cfg){ if (!cfg) return; Object.assign(config, cfg); if (cfg.rows) state.rows = cfg.rows.slice(); if (cfg.pageSize) state.pageSize = cfg.pageSize; renderHeader(); applySort(); renderBody(); renderPagination(); }
    function destroy(){ node.remove(); }

    return { id, el: node, show, hide, update, destroy };
  }

  window.SahakarComponents.DataTable = { create };
})();