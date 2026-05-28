(function(){
const input = document.getElementById('search');
const out = document.getElementById('search-results');
if (!input || !out) return;
function getIndex() { return window.DONGBLOG_INDEX || []; }
function escapeHtml(s) { return s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function highlight(text, q) {
  const e = escapeHtml(text || ''); if (!q) return e;
  const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
  return e.replace(re, '<mark>$1</mark>');
}
function snippet(content, q, len) {
  len = len || 140; if (!content) return '';
  if (!q) return content.slice(0, len) + (content.length > len ? '…' : '');
  const idx = content.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return content.slice(0, len) + (content.length > len ? '…' : '');
  const start = Math.max(0, idx - 50);
  const end = Math.min(content.length, idx + q.length + len - 50);
  return (start > 0 ? '…' : '') + content.slice(start, end) + (end < content.length ? '…' : '');
}
function search(q) {
  const idx = getIndex(); const ql = q.toLowerCase(); const scored = [];
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
function render(results, q) {
  if (results.length === 0) { out.innerHTML = '<div class="empty">결과 없음</div>'; out.hidden = false; return; }
  out.innerHTML = results.map(({page: p}) => {
    const tagsHtml = (p.tags || []).map(t => '#' + escapeHtml(t)).join(' ');
    return '<a class="result" href="' + p.slug + '.html">'
      + '<div class="result-title">' + highlight(p.title, q) + '</div>'
      + '<div class="result-meta">' + escapeHtml(p.cat_label || '') + ' &nbsp; ' + tagsHtml + '</div>'
      + '<div class="result-snippet">' + highlight(snippet(p.content, q), q) + '</div>'
      + '</a>';
  }).join('');
  out.hidden = false;
}
let debounce;
input.addEventListener('input', e => {
  clearTimeout(debounce);
  const q = e.target.value.trim();
  if (!q) { out.hidden = true; out.innerHTML = ''; return; }
  debounce = setTimeout(() => render(search(q), q), 60);
});
input.addEventListener('keydown', e => {
  if (e.key === 'Escape') { input.value = ''; out.hidden = true; input.blur(); }
});
document.addEventListener('click', e => {
  if (e.target.closest && e.target.closest('.tag-chip')) {
    const chip = e.target.closest('.tag-chip');
    input.value = chip.dataset.tag;
    input.dispatchEvent(new Event('input'));
    input.focus();
    return;
  }
  if (!out.contains(e.target) && e.target !== input) { out.hidden = true; }
});
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault(); input.focus(); input.select();
  }
});
})();
