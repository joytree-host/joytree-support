/* ==========================================================================
   Joytree Support — app shell
   Hash-based router: #/  #/c/<group-key>  #/<page-key>  #/search/<query>
   ========================================================================== */

(function () {
  'use strict';

  // ---------------------------------------------------------------- state
  const KEY_TO_GROUP = {};
  NAV.forEach(group => {
    group.children.forEach(child => { KEY_TO_GROUP[child.key] = group; });
  });

  function articleCount(group) { return group.children.length; }
  function totalArticles() { return Object.keys(PAGES).length; }

  // ---------------------------------------------------------------- tiny markdown -> html
  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function inline(text) {
    const codeSpans = [];
    text = text.replace(/`([^`]+)`/g, (m, code) => {
      codeSpans.push(escapeHtml(code));
      return `\u0000${codeSpans.length - 1}\u0000`;
    });
    text = escapeHtml(text);
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, label, url) => {
      const isInternal = url.startsWith('#/');
      return `<a class="md-link" href="${url}" ${isInternal ? 'data-link' : 'target="_blank" rel="noopener"'}>${label}</a>`;
    });
    text = text.replace(/\u0000(\d+)\u0000/g, (m, i) => `<code>${codeSpans[+i]}</code>`);
    return text;
  }

  function renderMarkdown(md) {
    const lines = md.replace(/\r\n/g, '\n').split('\n');
    let html = '';
    let i = 0;
    let listBuffer = null;

    function flushList() {
      if (!listBuffer) return;
      const tag = listBuffer.type;
      html += `<${tag}>${listBuffer.items.map(it => `<li>${inline(it)}</li>`).join('')}</${tag}>`;
      listBuffer = null;
    }

    while (i < lines.length) {
      const line = lines[i];

      const fence = line.match(/^```(\w*)\s*$/);
      if (fence) {
        flushList();
        const lang = fence[1] || 'text';
        const buf = [];
        i++;
        while (i < lines.length && !/^```\s*$/.test(lines[i])) { buf.push(lines[i]); i++; }
        i++;
        const code = escapeHtml(buf.join('\n'));
        const id = 'cb' + Math.random().toString(36).slice(2, 9);
        html += `<div class="code-block"><pre><span class="code-lang">${escapeHtml(lang)}</span><button class="copy-btn" data-copy-target="${id}" aria-label="Copy code"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M5 15V5a2 2 0 0 1 2-2h10" stroke="currentColor" stroke-width="1.8"/></svg></button><code id="${id}">${code}</code></pre></div>`;
        continue;
      }

      const calloutStart = line.match(/^:::(tip|warn)\s*$/);
      if (calloutStart) {
        flushList();
        const type = calloutStart[1];
        const buf = [];
        i++;
        while (i < lines.length && !/^:::\s*$/.test(lines[i])) { buf.push(lines[i]); i++; }
        i++;
        const icon = type === 'tip'
          ? '<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M9 18h6M10 22h4M12 2a6.5 6.5 0 0 0-4 11.6c.6.5 1 1.3 1 2.1V16h6v-.3c0-.8.4-1.6 1-2.1A6.5 6.5 0 0 0 12 2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>'
          : '<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 9v5M12 17h.01M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6A2 2 0 0 0 22 18L13.7 3.9a2 2 0 0 0-3.4 0Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';
        html += `<div class="callout ${type}"><span class="callout-icon">${icon}</span><p>${inline(buf.join(' ').trim())}</p></div>`;
        continue;
      }

      if (/^\|/.test(line.trim()) && lines[i + 1] && /^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$/.test(lines[i + 1])) {
        flushList();
        const headerCells = line.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
        i += 2;
        const rows = [];
        while (i < lines.length && /^\|/.test(lines[i].trim())) {
          rows.push(lines[i].trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim()));
          i++;
        }
        html += '<table><thead><tr>' + headerCells.map(c => `<th>${inline(c)}</th>`).join('') + '</tr></thead><tbody>' +
          rows.map(r => '<tr>' + r.map(c => `<td>${inline(c)}</td>`).join('') + '</tr>').join('') +
          '</tbody></table>';
        continue;
      }

      let m;
      if ((m = line.match(/^###\s+(.*)$/))) { flushList(); html += `<h3 id="${slugify(m[1])}">${inline(m[1])}</h3>`; i++; continue; }
      if ((m = line.match(/^##\s+(.*)$/))) { flushList(); html += `<h2 id="${slugify(m[1])}">${inline(m[1])}</h2>`; i++; continue; }
      if ((m = line.match(/^#\s+(.*)$/))) { flushList(); html += `<h1>${inline(m[1])}</h1>`; i++; continue; }

      if ((m = line.match(/^-\s+(.*)$/))) {
        if (!listBuffer || listBuffer.type !== 'ul') { flushList(); listBuffer = { type: 'ul', items: [] }; }
        listBuffer.items.push(m[1]);
        i++; continue;
      }
      if ((m = line.match(/^\d+\.\s+(.*)$/))) {
        if (!listBuffer || listBuffer.type !== 'ol') { flushList(); listBuffer = { type: 'ol', items: [] }; }
        listBuffer.items.push(m[1]);
        i++; continue;
      }

      if (line.trim() === '') { flushList(); i++; continue; }

      flushList();
      html += `<p>${inline(line.trim())}</p>`;
      i++;
    }
    flushList();
    return html;
  }

  function slugify(text) {
    return text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
  }

  const groupIcon = (key) => (COLLECTION_META[key] && COLLECTION_META[key].icon) || '<circle cx="12" cy="12" r="9"/>';
  const groupDesc = (key) => (COLLECTION_META[key] && COLLECTION_META[key].desc) || '';

  function svgIcon(pathInner, size) {
    size = size || 20;
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${pathInner}</svg>`;
  }

  // ---------------------------------------------------------------- views
  const views = {
    home: document.getElementById('view-home'),
    collection: document.getElementById('view-collection'),
    article: document.getElementById('view-article'),
    search: document.getElementById('view-search'),
  };
  function showView(name) {
    Object.keys(views).forEach(k => { views[k].hidden = k !== name; });
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    closeDrawer();
  }

  // ---------------------------------------------------------------- homepage render
  const POPULAR_KEYS = ['quickstart', 'deploy-github', 'ts_deploy_failed', 'projects-env', 'ts_login_stuck', 'account-apikey'];

  function renderHome() {
    const popular = document.getElementById('popularList');
    popular.innerHTML = POPULAR_KEYS.filter(k => PAGES[k]).map(k => {
      const p = PAGES[k];
      return `<li><a href="#/${k}" data-link>${svgIcon('<path d="M9 18l6-6-6-6"/>', 15)}${p.title}</a></li>`;
    }).join('');

    const grid = document.getElementById('collectionsGrid');
    grid.innerHTML = NAV.map(group => `
      <a class="collection-card" href="#/c/${group.key}" data-link>
        <div class="collection-card-icon">${svgIcon(groupIcon(group.key), 19)}</div>
        <h3 class="collection-card-title">${group.title}</h3>
        <p class="collection-card-desc">${groupDesc(group.key)}</p>
        <div class="collection-card-count">${articleCount(group)} article${articleCount(group) === 1 ? '' : 's'}</div>
      </a>
    `).join('');
  }

  // ---------------------------------------------------------------- collection render
  function renderCollection(key) {
    const group = NAV.find(g => g.key === key);
    if (!group) { location.hash = '#/'; return; }

    document.getElementById('collectionBreadcrumb').innerHTML =
      `<a href="#/" data-link>All Collections</a><span class="sep">/</span><span class="current">${group.title}</span>`;
    document.getElementById('collectionIcon').innerHTML = svgIcon(groupIcon(group.key), 22);
    document.getElementById('collectionTitle').textContent = group.title;
    document.getElementById('collectionDesc').textContent = groupDesc(group.key);

    document.getElementById('collectionArticleList').innerHTML = group.children.map(child => {
      const p = PAGES[child.key];
      return `<li><a href="#/${child.key}" data-link>
        <div class="al-title">${p.title}</div>
        <div class="al-lede">${p.lede || ''}</div>
      </a></li>`;
    }).join('');

    document.title = `${group.title} — Joytree Support`;
  }

  // ---------------------------------------------------------------- article render
  let currentArticleKey = null;

  function renderArticle(key) {
    const page = PAGES[key];
    if (!page) { location.hash = '#/'; return; }
    currentArticleKey = key;
    const group = KEY_TO_GROUP[key];

    document.getElementById('articleBreadcrumb').innerHTML =
      `<a href="#/" data-link>All Collections</a><span class="sep">/</span>` +
      (group ? `<a href="#/c/${group.key}" data-link>${group.title}</a><span class="sep">/</span>` : '') +
      `<span class="current">${page.title}</span>`;

    document.getElementById('articleTitle').textContent = page.title;
    document.getElementById('articleDate').textContent = 'Support article';
    document.getElementById('articleContent').innerHTML = renderMarkdown(page.md || '');

    document.getElementById('fbThanks').hidden = true;
    document.querySelectorAll('.fb-btn').forEach(b => b.classList.remove('selected'));
    document.getElementById('copyLlmBtn').classList.remove('copied');

    const relatedBlock = document.getElementById('relatedBlock');
    if (group && group.children.length > 1) {
      relatedBlock.hidden = false;
      document.getElementById('relatedList').innerHTML = group.children
        .filter(c => c.key !== key)
        .map(c => `<li><a href="#/${c.key}" data-link>
          <div class="al-title">${PAGES[c.key].title}</div>
          <div class="al-lede">${PAGES[c.key].lede || ''}</div>
        </a></li>`).join('');
    } else {
      relatedBlock.hidden = true;
    }

    document.title = `${page.title} — Joytree Support`;
  }

  // ---------------------------------------------------------------- search
  function searchPages(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return Object.keys(PAGES).map(key => {
      const p = PAGES[key];
      const group = KEY_TO_GROUP[key];
      const haystack = (p.title + ' ' + (p.lede || '') + ' ' + (p.eyebrow || '') + ' ' + (group ? group.title : '')).toLowerCase();
      let score = 0;
      if (p.title.toLowerCase().includes(q)) score += 3;
      if ((p.lede || '').toLowerCase().includes(q)) score += 2;
      if (haystack.includes(q)) score += 1;
      return { key, p, group, score };
    }).filter(r => r.score > 0).sort((a, b) => b.score - a.score);
  }

  function renderSearchDropdown(input, resultsEl) {
    const q = input.value;
    const results = searchPages(q).slice(0, 8);
    if (!q.trim()) { resultsEl.hidden = true; resultsEl.innerHTML = ''; return; }
    resultsEl.hidden = false;
    if (!results.length) {
      resultsEl.innerHTML = `<div class="sr-empty">No articles match “${escapeHtml(q)}”</div>`;
      return;
    }
    resultsEl.innerHTML = results.map(r => `
      <a class="sr-item" href="#/${r.key}" data-link>
        <div class="sr-item-title">${r.p.title}</div>
        <div class="sr-item-group">${r.group ? r.group.title : ''}</div>
      </a>`).join('');
  }

  function renderSearchView(query) {
    const results = searchPages(query);
    document.getElementById('searchResultsTitle').textContent =
      results.length ? `${results.length} result${results.length === 1 ? '' : 's'} for “${query}”` : `No results for “${query}”`;
    document.getElementById('searchResultsList').innerHTML = results.map(r => `
      <li><a href="#/${r.key}" data-link>
        <div class="al-title">${r.p.title}</div>
        <div class="al-lede">${r.p.lede || ''}</div>
      </a></li>`).join('') || `<li style="padding:16px 18px;color:var(--text-faint)">Try a different search term, or <a href="#/account-support" data-link class="md-link" style="color:var(--brand)">contact support</a> directly.</li>`;
  }

  // ---------------------------------------------------------------- topic drawer
  const drawerScrim = document.getElementById('drawerScrim');
  const topicDrawer = document.getElementById('topicDrawer');
  function openDrawer() { drawerScrim.classList.add('open'); topicDrawer.classList.add('open'); }
  function closeDrawer() { drawerScrim.classList.remove('open'); topicDrawer.classList.remove('open'); }
  document.getElementById('navToggle').addEventListener('click', openDrawer);
  document.getElementById('drawerClose').addEventListener('click', closeDrawer);
  drawerScrim.addEventListener('click', closeDrawer);

  function buildDrawer() {
    const nav = document.getElementById('drawerNav');
    nav.innerHTML = '';
    NAV.forEach(group => {
      const wrap = document.createElement('div');
      wrap.className = 'drawer-group';
      const btn = document.createElement('button');
      btn.className = 'drawer-group-btn';
      btn.innerHTML = `${svgIcon(groupIcon(group.key), 16)}<span>${group.title}</span><span class="drawer-group-count">${articleCount(group)}</span>`;
      btn.addEventListener('click', () => wrap.classList.toggle('open'));
      wrap.appendChild(btn);
      const ul = document.createElement('ul');
      ul.className = 'drawer-children';
      group.children.forEach(child => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#/${child.key}`;
        a.setAttribute('data-link', '');
        a.textContent = PAGES[child.key].title;
        li.appendChild(a);
        ul.appendChild(li);
      });
      wrap.appendChild(ul);
      nav.appendChild(wrap);
    });
  }

  // ---------------------------------------------------------------- theme
  const iconSun = document.getElementById('iconSun');
  const iconMoon = document.getElementById('iconMoon');
  function applyThemeIcon() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    iconSun.hidden = !isLight;
    iconMoon.hidden = isLight;
  }
  applyThemeIcon();
  document.getElementById('themeToggle').addEventListener('click', () => {
    const html = document.documentElement;
    const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    try { localStorage.setItem('jts_theme', next); } catch (e) {}
    applyThemeIcon();
  });

  // ---------------------------------------------------------------- copy for LLM
  document.getElementById('copyLlmBtn').addEventListener('click', function () {
    if (!currentArticleKey) return;
    const page = PAGES[currentArticleKey];
    const text = `# ${page.title}\n\n${(page.md || '').trim()}\n`;
    navigator.clipboard.writeText(text).then(() => {
      this.classList.add('copied');
      const original = this.innerHTML;
      this.innerHTML = `${svgIcon('<path d="M20 6 9 17l-5-5"/>', 14)} Copied`;
      setTimeout(() => { this.classList.remove('copied'); this.innerHTML = original; }, 1800);
    }).catch(() => {});
  });

  // ---------------------------------------------------------------- code copy buttons (delegated)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.copy-btn[data-copy-target]');
    if (!btn) return;
    const codeEl = document.getElementById(btn.dataset.copyTarget);
    if (!codeEl) return;
    navigator.clipboard.writeText(codeEl.textContent).then(() => {
      btn.classList.add('copied');
      setTimeout(() => btn.classList.remove('copied'), 1400);
    }).catch(() => {});
  });

  // ---------------------------------------------------------------- feedback
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.fb-btn');
    if (!btn) return;
    document.querySelectorAll('.fb-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    document.getElementById('fbThanks').hidden = false;
  });

  // ---------------------------------------------------------------- contact bubble
  const contactBubble = document.getElementById('contactBubble');
  const contactPanel = document.getElementById('contactPanel');
  contactBubble.addEventListener('click', () => { contactPanel.hidden = !contactPanel.hidden; });
  document.getElementById('contactPanelClose').addEventListener('click', () => { contactPanel.hidden = true; });

  // ---------------------------------------------------------------- mobile search expand/collapse
  const topbarInner = document.querySelector('.topbar-inner');
  const searchToggle = document.getElementById('searchToggle');
  const searchClose = document.getElementById('searchClose');
  if (searchToggle) {
    searchToggle.addEventListener('click', () => {
      topbarInner.classList.add('search-open');
      searchInput.focus();
    });
  }
  if (searchClose) {
    searchClose.addEventListener('click', () => {
      topbarInner.classList.remove('search-open');
      searchResults.hidden = true;
      searchInput.value = '';
    });
  }

  // ---------------------------------------------------------------- topbar search
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  searchInput.addEventListener('input', () => renderSearchDropdown(searchInput, searchResults));
  searchInput.addEventListener('focus', () => renderSearchDropdown(searchInput, searchResults));
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim()) {
      location.hash = '#/search/' + encodeURIComponent(searchInput.value.trim());
      searchResults.hidden = true;
    }
    if (e.key === 'Escape') {
      searchResults.hidden = true;
      searchInput.blur();
      if (topbarInner) topbarInner.classList.remove('search-open');
    }
  });
  document.addEventListener('click', (e) => {
    if (!document.getElementById('topbarSearchWrap').contains(e.target)) searchResults.hidden = true;
  });

  // ---------------------------------------------------------------- homepage search
  const homeSearchInput = document.getElementById('homeSearchInput');
  homeSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && homeSearchInput.value.trim()) {
      location.hash = '#/search/' + encodeURIComponent(homeSearchInput.value.trim());
    }
  });

  // ---------------------------------------------------------------- router
  function route() {
    const hash = location.hash.replace(/^#\/?/, '');
    searchResults.hidden = true;
    if (topbarInner) topbarInner.classList.remove('search-open');

    if (!hash) {
      renderHome();
      showView('home');
      document.title = 'Joytree Support — Help Center';
      return;
    }
    if (hash.startsWith('search/')) {
      const q = decodeURIComponent(hash.slice(7));
      renderSearchView(q);
      showView('search');
      document.title = `Search: ${q} — Joytree Support`;
      return;
    }
    if (hash.startsWith('c/')) {
      renderCollection(hash.slice(2));
      showView('collection');
      return;
    }
    if (PAGES[hash]) {
      renderArticle(hash);
      showView('article');
      return;
    }
    // Unknown route -> home
    renderHome();
    showView('home');
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-link]');
    if (!a) return;
    // let normal navigation happen; hashchange listener re-renders.
  });

  window.addEventListener('hashchange', route);
  document.getElementById('year').textContent = new Date().getFullYear();
  buildDrawer();
  route();
})();
