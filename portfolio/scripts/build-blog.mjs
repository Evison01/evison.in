import { readdir, readFile, mkdir, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { marked } from 'marked';
const root = fileURLToPath(new URL('../', import.meta.url));
const home = await readFile(path.join(root, 'dist/index.html'), 'utf8');
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dateLabel = value => new Date(`${value}T12:00:00Z`).toLocaleDateString('en-GB', {day:'numeric',month:'short',year:'numeric', timeZone:'UTC'});
function metadata(source, file) {
  const match = source.replace(/\r\n/g,'\n').match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`${file}: start the post with the metadata block shown in WRITING.md`);
  const data = {};
  for (const line of match[1].split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const item = line.match(/^([a-z]+):\s*(.*?)\s*$/);
    if (!item) throw new Error(`${file}: invalid metadata line: ${line}`);
    data[item[1]] = item[2].replace(/^(['"])(.*)\1$/, '$2');
  }
  if (!['true','false'].includes(data.draft)) throw new Error(`${file}: draft must be true or false`);
  if (data.draft === 'true') return null;
  for (const key of ['title','description','date','category']) if (!data[key]) throw new Error(`${file}: ${key} is required`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || !Number.isFinite(Date.parse(data.date)) || new Date(data.date).toISOString().slice(0,10) !== data.date) throw new Error(`${file}: date must be a real YYYY-MM-DD date`);
  if (!['thoughts','projects'].includes(data.category)) throw new Error(`${file}: category must be thoughts or projects`);
  if (!match[2].trim()) throw new Error(`${file}: published posts cannot be empty`);
  const slug = file.replace(/\.md$/, '');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`${file}: use a lowercase, hyphenated filename`);
  return {...data, slug, body: match[2], minutes: Math.max(1,Math.ceil(match[2].split(/\s+/).length/200))};
}
const posts = [];
for (const file of (await readdir(path.join(root,'content/posts'))).filter(file => file.endsWith('.md'))) {
  const post = metadata(await readFile(path.join(root,'content/posts',file),'utf8'),file);
  if (post) posts.push(post);
}
posts.sort((a,b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
const head = home.match(/<head>([\s\S]*?)<\/head>/)[1]
  .replace(/href="(assets\/|style.css)/g, 'href="/$1')
  .replace(/<title>[\s\S]*?<\/title>/,'<title>__TITLE__</title>')
  .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="__DESCRIPTION__">');
const dock = home.match(/<nav class="dock"[\s\S]*?<\/nav>/)[0].replace('href="#main"','href="/"').replace('href="#projects"','href="/#projects"');
function page(title, description, content, route) {
  return `<!doctype html><html lang="en"><head>${head.replace('__TITLE__',esc(title)).replace('__DESCRIPTION__',esc(description))}<link rel="canonical" href="https://evison.in${route}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"></head><body><a class="skip" href="#main">Skip to content</a><main id="main" class="writing-page">${content}</main>${dock}<script src="/site.js"></script></body></html>`;
}
const output = path.join(root,'dist/blog');
await rm(output, {recursive:true,force:true});
await mkdir(output,{recursive:true});
const list = posts.map(p => `<li class="post-row" data-category="${p.category}"><a href="/blog/${p.slug}/"><div class="post-meta"><span>${esc(p.category === 'projects' ? 'Project notes' : 'Thoughts')}</span><time datetime="${p.date}">${dateLabel(p.date)}</time></div><h2>${esc(p.title)}</h2><p>${esc(p.description)}</p><span class="read-time">${p.minutes} min read</span></a></li>`).join('');
await writeFile(path.join(output,'index.html'),page('Writing — Evison','Thoughts, things I am learning, and notes from the projects I build.',`<a class="back-link" href="/">Evison</a><header class="writing-header"><span class="writing-kicker">A LITTLE SPACE TO THINK</span><h1>Writing</h1><p>Thoughts, things I'm learning, and notes from the projects I build.</p></header>${posts.length ? `<div class="post-filters" role="group" aria-label="Filter posts"><button aria-pressed="true" data-filter="all">All writing</button><button aria-pressed="false" data-filter="thoughts">Thoughts</button><button aria-pressed="false" data-filter="projects">Project notes</button></div><ul class="post-list">${list}</ul><p id="filter-empty" class="writing-empty" hidden>No posts in this category yet.</p><script src="/blog-filter.js" defer></script>` : '<div class="writing-empty"><h2>The first page is still unwritten.</h2><p>Thoughts and project notes will find their way here soon.</p></div>'}`,'/blog/'));
for (const p of posts) {
  const folder = path.join(output,p.slug); await mkdir(folder,{recursive:true});
  await writeFile(path.join(folder,'index.html'),page(`${p.title} — Evison`,p.description,`<a class="back-link" href="/blog/">All writing</a><article><header class="writing-header"><div class="post-meta"><span>${esc(p.category === 'projects' ? 'Project notes' : 'Thoughts')}</span><time datetime="${p.date}">${dateLabel(p.date)}</time><span>${p.minutes} min read</span></div><h1>${esc(p.title)}</h1><p>${esc(p.description)}</p></header><div class="prose">${marked.parse(p.body)}</div><a class="back-link end-link" href="/blog/">Back to all writing</a></article>`,`/blog/${p.slug}/`));
}
console.log(`Blog built: ${posts.length} published post(s); drafts excluded.`);
