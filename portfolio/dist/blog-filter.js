const filters = [...document.querySelectorAll('[data-filter]')];
const rows = [...document.querySelectorAll('[data-category]')];
for (const button of filters) button.addEventListener('click', () => {
  filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
  let visible = 0;
  rows.forEach(row => {
    row.hidden = button.dataset.filter !== 'all' && row.dataset.category !== button.dataset.filter;
    if (!row.hidden) visible++;
  });
  document.querySelector('#filter-empty').hidden = visible > 0;
});
