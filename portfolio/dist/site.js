const themeButton = document.querySelector('#theme');
function updateThemeLabel() {
  const dark = document.documentElement.dataset.theme === 'dark';
  themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
  themeButton.setAttribute('aria-pressed', String(dark));
  document.querySelector('meta[name="theme-color"]').content = dark ? 'hsl(210 11.1% 3.53%)' : '#fafaf9';
}
themeButton.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('theme', theme); } catch {}
  updateThemeLabel();
});
updateThemeLabel();
// Magnify the hovered dock item and its neighbours; restore on pointer exit.
const dock = document.querySelector('.dock');
const dockItems = [...dock.querySelectorAll('a, button')];
function magnifyDock(active) {
  dockItems.forEach((item, index) => {
    const distance = Math.abs(index - active);
    item.style.setProperty('--dock-size', active < 0 ? '36px' : distance === 0 ? '48px' : distance === 1 ? '41px' : '36px');
    item.style.setProperty('--icon-size', active >= 0 && distance === 0 ? '21px' : '18px');
  });
}
dockItems.forEach((item, index) => {
  item.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') magnifyDock(index); });
  item.addEventListener('focus', () => magnifyDock(index));
});
dock.addEventListener('pointerleave', () => magnifyDock(-1));
dock.addEventListener('focusout', event => { if (!dock.contains(event.relatedTarget)) magnifyDock(-1); });
