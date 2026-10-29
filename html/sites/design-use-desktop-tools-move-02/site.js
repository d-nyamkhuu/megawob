(function () {
  'use strict';
  const D = {
    site: 'design-use-desktop-tools-move-02', brand: 'WorkSpace', mode: 'workspace',
    tokens: { bg: '#f4f0e5', panel: '#fbf8ef', fg: '#173b5c', accent: '#8d3444', font: 'Arial,sans-serif', line: '#d2cfc4', muted: '#77736f', 'button-fg': '#fff' },
    nav: 'Files|Tasks|Calendar|Notes|Preferences',
    obstruction: ['BeOS Newsletter', 'Be the first to know. Get news, tips and updates from the BeOS team.', 'Close'], footer: ''
  };
  env.site({
    name: D.site, styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util, root = document.documentElement;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      document.body.className = D.mode + ' instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', header, D.brand);
      const nav = u.el('nav', 'design-nav', header);
      const glyphs = ['▰', '☑', '▦', '▤', '⚙'];
      D.nav.split('|').forEach((label, i) => {
        const item = u.el('div', 'design-navitem' + (i === 0 ? ' active' : ''), nav);
        u.el('span', 'nav-glyph', item, glyphs[i]);
        u.el('span', '', item, label);
      });
      u.el('div', 'design-search', header, '⌕  Search');
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        if (D.mode.includes('side') || D.mode === 'twin') u.el('h2', '', note, 'Your Task');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const side = u.el('aside', 'records-panel', body);
      u.el('h2', 'records-title', side, 'Recent Files');
      const records = [
        ['W', 'draft v4 (final).doc', 'Apr 11, 2015', 'word'], ['X', 'plan.xlsx', 'Apr 07, 2015', 'sheet'],
        ['▤', 'research-notes.md', 'Apr 09, 2015', 'plain'], ['P', 'marketing-overview.pptx', 'Apr 06, 2015', 'slide'],
        ['X', 'budget.xlsx', 'Apr 05, 2015', 'sheet'], ['▧', 'design-mockup.png', 'Apr 04, 2015', 'image'],
        ['▤', 'brief.txt', 'Apr 02, 2015', 'plain'], ['▣', 'draft v3.doc', 'Apr 08, 2015', 'word']
      ];
      const recList = u.el('div', 'record-list', side);
      for (const [icon, name, date, type] of records) {
        const row = u.el('div', 'record-row', recList);
        u.el('span', 'file-mark ' + type, row, icon);
        u.el('span', 'record-name', row, name);
        u.el('time', '', row, date);
      }
      const cal = u.el('section', 'mini-calendar', side);
      u.el('h2', 'records-title', cal, 'Calendar');
      const month = u.el('div', 'calendar-month', cal);
      u.el('span', '', month, '‹'); u.el('b', '', month, 'April 2015'); u.el('span', '', month, '›');
      const calgrid = u.el('div', 'calendar-grid', cal);
      ['Sun|12','Mon|13','Tue|14','Wed|15','Thu|16','Fri|17','Sat|18'].forEach((x) => {
        const [day, n] = x.split('|'); const cell = u.el('div', 'cal-cell', calgrid); u.el('b', '', cell, day); u.el('strong', '', cell, n);
      });
      const events = u.el('div', 'calendar-events', cal);
      ['9 AM','10 AM','11 AM','12 PM','1 PM','2 PM','3 PM','4 PM','5 PM'].forEach((hour, i) => {
        const line = u.el('div', 'cal-hour', events); u.el('span', '', line, hour);
        if ([1,2,4,5,6].includes(i)) u.el('i', 'event e' + i, line, ['Team Standup','Project Review','Lunch w/ Alex','Client Call','Planning'][[1,2,4,5,6].indexOf(i)]);
      });
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, D.footer || 'Ready');

      let submit = null;
      let placement = null;
        let label = 'OK';
      let collide = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        placement = er.pick(['header', 'header', 'footer', 'link']);
        const values = ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const labelOf = x => typeof x === 'string' ? x : x && (x.label || x.text || x.name) || String(x);
        if (placement !== 'footer' && !er.bool(0.55)) label = labelOf(er.pick(values));

        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const options = [...new Set(values.map(labelOf))].filter(x => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (options.length) collide = { label: cr.pick(options), where: cr.pick(['header', 'footer']) };
        }
        const addActions = (parent, cls) => u.el('div', 'chrome-actions ' + cls, parent);
        const makeDecoy = parent => {
          const b = u.el('button', 'chrome-xtra', parent, collide.label);
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label: collide.label, collide: true }));
        };
        const makeEnd = (parent, cls) => {
          const tag = placement === 'link' ? 'a' : 'button';
          const b = u.el(tag, 'end-control ' + cls, parent, label);
          if (tag === 'a') {
            b.href = '#';
            b.addEventListener('click', e => e.preventDefault());
          } else b.type = 'button';
          b.addEventListener('click', () => ctx.submit());
          return b;
        };
        if (placement === 'header') {
          const tools = addActions(header, 'header-actions');
          if (collide && collide.where === 'header') makeDecoy(tools);
          submit = makeEnd(tools, 'header-end');
        } else if (placement === 'link') {
          if (collide && collide.where === 'header') makeDecoy(addActions(header, 'header-actions'));
          const tools = addActions(footer, 'footer-actions');
          if (collide && collide.where === 'footer') makeDecoy(tools);
          submit = makeEnd(tools, 'footer-link');
        } else {
          if (collide && collide.where === 'header') makeDecoy(addActions(header, 'header-actions'));
          if (collide && collide.where === 'footer') {
            const tools = addActions(footer, 'footer-actions');
            makeDecoy(tools);
            submit = makeEnd(tools, 'footer-end');
          } else submit = makeEnd(footer, 'footer-end');
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util, named = D.obstruction;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement']
      };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) [title, copy, label] = named;
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') {
        const accept = u.el('button', '', actions, 'Accept all');
        accept.addEventListener('click', () => ctx.dismiss());
      }
      if (/Tip/.test(title)) {
        const c = u.el('label', '', el);
        c.style.cssText = 'display:block;padding:0 22px 14px';
        const ch = u.el('input', '', c);
        ch.type = 'checkbox';
        c.append(' Do not show again');
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    }
  });
})();
