for (const skill of window.PROFILE.skills) {
  const badge = document.createElement('span'); badge.className = 'skill';
  badge.textContent = skill;
  badge.tabIndex = 0;
  document.querySelector('#skill-list').append(badge);
}
function validUrl(value) { try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; } catch { return null; } }
for (const project of window.PROFILE.projects) {
  const card = document.createElement('article'); card.className = 'project-card';
  const title = document.createElement('h3'); title.textContent = project.title;
  const description = document.createElement('p'); description.textContent = project.description;
  card.append(title, description);
  const tags = document.createElement('div'); tags.className = 'skills';
  for (const technology of project.technologies || []) { const tag = document.createElement('span'); tag.className='skill'; tag.textContent=technology; tags.append(tag); }
  card.append(tags);
  for (const [label, value] of [['Visit project',project.url],['Source code',project.github]]) {
    const url = validUrl(value); if (!url) continue;
    const link = document.createElement('a'); link.className='text-link'; link.href=url; link.target='_blank'; link.rel='noopener noreferrer'; link.textContent=label; link.style.marginRight='20px'; card.append(link);
  }
  document.querySelector('#project-list').append(card);
}
document.querySelector('#project-empty').hidden = window.PROFILE.projects.length > 0;
