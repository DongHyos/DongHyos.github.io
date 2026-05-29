(function(){
  let isOpen = false;
  const backdrop = document.createElement('div');
  backdrop.id = 'search-backdrop';
  backdrop.className = 'hidden';
  const modal = document.createElement('div');
  modal.id = 'search-modal';
  modal.className = 'hidden';
  modal.innerHTML = '<input type="search" id="search-input" placeholder="검색 (제목·태그·내용)" autocomplete="off"><div id="search-output"></div>';
  document.body.appendChild(backdrop);
  document.body.appendChild(modal);

  const input = document.getElementById('search-input');
  const output = document.getElementById('search-output');

  function openSearch() {
    backdrop.classList.remove('hidden');
    modal.classList.remove('hidden');
    input.focus();
    isOpen = true;
  }
  function closeSearch() {
    backdrop.classList.add('hidden');
    modal.classList.add('hidden');
    input.value = '';
    output.innerHTML = '';
    isOpen = false;
  }

  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      isOpen ? closeSearch() : openSearch();
    }
    if (e.key === 'Escape' && isOpen) closeSearch();
  });
  backdrop.addEventListener('click', closeSearch);
  document.getElementById('search-toggle')?.addEventListener('click', openSearch);

  function escapeHtml(s) {
    return s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  }
  function highlight(text, q) {
    const e = escapeHtml(text || '');
    if (!q) return e;
    const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
    return e.replace(re, '<mark>$1</mark>');
  }
  function snippet(content, q, len) {
    len = len || 140;
    if (!content) return '';
    if (!q) return content.slice(0, len) + (content.length > len ? '…' : '');
    const idx = content.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return content.slice(0, len) + (content.length > len ? '…' : '');
    const start = Math.max(0, idx - 50);
    const end = Math.min(content.length, idx + q.length + len - 50);
    return (start > 0 ? '…' : '') + content.slice(start, end) + (end < content.length ? '…' : '');
  }
  function search(q) {
    const idx = window.DONGBLOG_INDEX || [];
    const ql = q.toLowerCase();
    const scored = [];
    for (const p of idx) {
      let score = 0;
      if (p.title.toLowerCase().includes(ql)) score += 10;
      if ((p.tags || []).some(t => t.toLowerCase().includes(ql))) score += 5;
      if ((p.content || '').toLowerCase().includes(ql)) score += 1;
      if (score > 0) scored.push({page: p, score});
    }
    scored.sort((a, b) => b.score - a.score || a.page.title.localeCompare(b.page.title));
    return scored.slice(0, 30);
  }
  function renderResults(results, q) {
    if (results.length === 0) {
      output.innerHTML = '<div class="empty">결과 없음</div>';
      return;
    }
    output.innerHTML = results.map(({page: p}) => {
      const tagsHtml = (p.tags || []).map(t => '#' + escapeHtml(t)).join(' ');
      return '<a class="result" href="/posts/' + p.slug + '/">'
        + '<div class="result-title">' + highlight(p.title, q) + '</div>'
        + '<div class="result-meta">' + escapeHtml(p.cat_label || '') + ' &nbsp; ' + tagsHtml + '</div>'
        + '<div class="result-snippet">' + highlight(snippet(p.content, q), q) + '</div>'
        + '</a>';
    }).join('');
  }
  let debounce;
  input.addEventListener('input', e => {
    clearTimeout(debounce);
    const q = e.target.value.trim();
    if (!q) { output.innerHTML = ''; return; }
    debounce = setTimeout(() => renderResults(search(q), q), 60);
  });
})();
