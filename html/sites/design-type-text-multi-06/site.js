(function () {
  'use strict';
  const SVG = 'http://www.w3.org/2000/svg';
  function svg(parent, cls, html) {
    const s = document.createElementNS(SVG, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('class', cls);
    s.innerHTML = html;
    parent.appendChild(s);
    return s;
  }
  // Format the template's note in the utility window's original typography.
  function formatNote(note) {
    if (!note) return;
    const text = note.textContent;
    const match = text.match(/^(.*?[.:])\s+(?=[^"]+:\s*")/);
    note.textContent = '';
    note.classList.add('ds-instruction');
    const title = document.createElement('strong');
    title.className = 'ds-instruction-title';
    title.textContent = match ? match[0] : 'Enter these values: ';
    note.appendChild(title);
    const lines = text.slice(match ? match[0].length : 0).split(/(,\s*)(?=[^",]+:\s*")/);
    for (let i = 0; i < lines.length; i += 2) {
      const el = document.createElement('div');
      el.className = 'ds-instruction-line';
      el.textContent = lines[i] + (lines[i + 1] || '');
      note.appendChild(el);
    }
  }
  function fitInstructions() {
    document.querySelectorAll('.ds-instruction').forEach((note) => {
      const parent = note.closest('.ds-brief, .ds-toast') || note.parentElement, cs = getComputedStyle(parent);
      const room = parent.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      if (note.getBoundingClientRect().height <= room) return;
      const title = note.querySelector('strong');
      const original = parseFloat(getComputedStyle(note).fontSize);
      const ratio = parseFloat(getComputedStyle(title).fontSize) / original;
      const resize = (size) => {
        note.style.setProperty('font-size', size + 'px', 'important');
        title.style.fontSize = size * ratio + 'px';
      };
      let size = original;
      while (note.getBoundingClientRect().height > room && size > original * 0.8) resize(--size);
      if (note.getBoundingClientRect().height > room) {
        note.classList.add('ds-note-compact');
        note.style.setProperty('line-height', '1.3', 'important');
        size = original;
        resize(size);
        while (note.getBoundingClientRect().height > room && size > 12) resize(--size);
      }
    });
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const logo = u.el('span', 'ds-logo', top);
      svg(logo, 'ds-logo-ic', '<path d="M5 20l2-11h3V5h5l2 4h2l1 11H5zM10 9h5v11M8 12v2m0 2v2m5-11v2m0 2v2m0 2v2m5-5v2m0 2v2" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>');
      u.el('span', 'ds-brand', top, 'Address Entry');
      const wc = u.el('span', 'ds-wc', top);
      svg(wc, 'ds-wc-ic', '<path d="M5 12h14" stroke="#222" stroke-width="1.6" fill="none"/>');
      svg(wc, 'ds-wc-ic', '<rect x="5" y="5" width="14" height="14" rx="2" stroke="#222" stroke-width="1.6" fill="none"/>');
      svg(wc, 'ds-wc-ic', '<path d="M5 5l14 14M19 5L5 19" stroke="#222" stroke-width="1.6" fill="none"/>');
      const content = u.el('div', 'ds-content');
      const main = u.el('div', 'ds-main', content);
      const brief = u.el('aside', 'ds-brief', main);
      brief.hidden = !['header', 'panel'].includes(_c.display);
      Object.assign(_c, { top, wc, content, main, brief, header: brief });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      formatNote(_c.header.querySelector('.ref-instruction'));
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = h;
      _c.top.insertBefore(_c.headerTools, _c.wc);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', document.body);
      body.appendChild(_c.content);
      const side = u.el('aside', 'ds-side', body);
      u.el('h3', '', side, 'Details');
      const d = u.el('div', 'ds-detail', side);
      const ic = u.el('span', 'ds-doc', d);
      svg(ic, 'ds-doc-ic', '<path d="M5 3h9l5 5v13H5zM14 3v5h5" fill="none" stroke="#603be2" stroke-width="1.3" stroke-linejoin="round"/><path d="M8 11h8M8 14h8M8 17h5" stroke="#603be2" stroke-width="1.1"/>');
      const dt = u.el('div', '', d);
      u.el('div', 'ds-dt', dt, 'New address');
      u.el('div', 'ds-dd', dt, 'Fill in the requested information.');
      u.el('hr', '', side);
      u.el('h4', '', side, 'Required fields');
      ['Company', 'Address line 1', 'ZIP code'].forEach((t) => {
        const row = u.el('div', 'ds-req', side);
        u.el('span', 'ds-circ', row);
        u.el('span', '', row, t);
      });
      u.el('hr', '', side);
      u.el('h4', '', side, 'Tips');
      const tip = u.el('div', 'ds-tip', side);
      const ti = u.el('span', '', tip);
      svg(ti, 'ds-tip-ic', '<circle cx="12" cy="12" r="9" fill="none" stroke="#3b6fd8" stroke-width="1.6"/><path d="M12 11v6M12 7.5v1" stroke="#3b6fd8" stroke-width="1.8" stroke-linecap="round"/>');
      u.el('span', '', tip, 'Ensure the information matches the requested values exactly.');
      Object.assign(_c, { body, side });
    },
    'frame.panel': (base) => (_c) => {
      const b = _c.body;
      _c.body = _c.brief;
      base(_c);
      _c.body = b;
      formatNote(_c.brief.querySelector('.ref-panel-text'));
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        const wrap = _c.util.el('aside', 'ds-toast', _c.content);
        _c.content.insertBefore(wrap, _c.main);
        wrap.appendChild(note);
        formatNote(note.querySelector('.ref-note-text'));
      }
      fitInstructions();
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.main.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.side.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  const palette = { bg: '#ddd8f6', panel: '#eaf6f1', fg: '#0c102b', muted: '#54617b', line: '#c8d0e0' };
  env.site({
    name: 'design-type-text-multi-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#5539d3'], LOW_ACCENTS: ['#5539d3'], parts },
  });
})();
