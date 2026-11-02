(function () {
  'use strict';
  const palette = { bg: '#faf7f2', panel: '#faf7f2', fg: '#080808', muted: '#5f6670', line: '#e2ddd3' };
  const icon = (p) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>';
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
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('i', 'ds-logo', top).innerHTML = icon('<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M7 6h10M7 10h10M7 14h10M7 18h10M17 3v18"/>');
      u.el('span', 'ds-brand', top, 'Notebook');
      const win = u.el('span', 'ds-win', top);
      ['<path d="M4 12h16"/>', '<rect x="5" y="5" width="14" height="14"/>', '<path d="M5 5l14 14M19 5L5 19"/>'].forEach((p) => (u.el('i', '', win).innerHTML = icon(p)));
      const nav = u.el('nav', 'ds-menu', document.body);
      'File|Edit|View|Note|Format|Tools|Help'.split('|').forEach((t) => u.el('span', '', nav, t));
      const toolbar = u.el('div', 'ds-tools', document.body);
      const newb = u.el('span', 'ds-tb ds-newnote', toolbar);
      newb.innerHTML = icon('<path d="M5 2h10l5 5v15H5zM14 2v6h6"/>') + '<span>New Note</span>';
      [
        ['Save', '<path d="M3 3h15l3 3v15H3zM7 3v7h10V3M7 21v-8h10v8"/>'],
        ['Undo', '<path d="M8 4L3 9l5 5M3 9h10a7 7 0 010 14"/>'],
        ['Redo', '<path d="M16 4l5 5-5 5M21 9H11a7 7 0 000 14"/>'],
      ].forEach(([t, p], i) => {
        const e = u.el('span', 'ds-tb ds-action' + (i === 2 ? ' dim' : ''), toolbar);
        e.innerHTML = icon(p) + '<span>' + t + '</span>';
      });
      ['B', 'I', 'U'].forEach((t) => u.el('span', 'ds-tb ds-fmt ds-f' + t, toolbar, t));
      const font = u.el('span', 'ds-tb ds-font', toolbar, 'Monospace');
      u.el('i', 'ds-caret', font);
      const search = u.el('span', 'ds-tb ds-search', toolbar);
      search.innerHTML = icon('<circle cx="10" cy="10" r="7"/><path d="M15 15l6 6"/>') + '<span>Search notes...</span>';
      const shell = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', shell);
      '1|2|3|4|5|6|7|8|9|10|11|12'.split('|').forEach((t) => u.el('div', '', rail, t));
      const content = u.el('div', 'ds-content', shell);
      Object.assign(_c, { toolbar, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      const clear = _c.util.el('button', 'ds-clear', null, 'Clear All');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        _c.stage.querySelectorAll('input[type=checkbox]:checked').forEach((i) => i.click());
      });
      foot.insertBefore(clear, foot.firstChild);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
  env.site({
    name: 'design-choose-option-checkbox-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#f26f21'], LOW_ACCENTS: ['#f26f21'], parts,
    },
  });
})();
