(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-datagrid-05',
    'brand': 'Staff Directory',
    'title': 'People you work with',
    'instruction': 'top',
    'rail': '',
    'tabs': 'Staff List|By Department|By Location|Extensions',
    'menu': 'People|Departments|Locations|Phone List|Search|Help',
    'briefTitle': 'Instructions',
  };
  const design = {
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      const fold = u.el('span', 'ds-folder', top);
      fold.innerHTML = '<svg viewBox="0 0 40 38" aria-hidden="true"><path d="M3 7h12l4 4h17v24H3z" fill="#d6b52f" stroke="#171717" stroke-width="2"/><path d="M6 4h12l4 4h12v24H6z" fill="#fff1a0" stroke="#333"/><path d="M11 12h17v20H11z" fill="#e7e5cb" stroke="#aaa"/><path d="M13 16h13m-13 3h13m-13 3h13m-13 3h13" stroke="#c2c1ac"/></svg>';
      u.el('span', 'ds-brand', top, C.brand);
      const wb = u.el('span', 'ds-wbtns', top);
      u.el('i', 'ds-wb', wb, '_');
      u.el('i', 'ds-wb', wb, '□');
      u.el('i', 'ds-wb ds-wclose', wb, '×');
      const nav = u.el('nav', 'ds-menu', document.body);
      C.menu.split('|').forEach((t, i) => {
        const it = u.el('span', 'ds-icon' + (i === 0 ? ' on' : ''), nav);
        const glyph = u.el('b', 'ds-glyph g' + i, it);
        const icons = [
          '<g stroke="#111" stroke-width="1.7"><path d="M7 22q-7 0-7 9v12h17V30q0-8-10-8" fill="#f4d119"/><circle cx="8" cy="17" r="6" fill="#ffdc39"/><path d="M41 21q-9 0-9 9v13h17V30q0-9-8-9" fill="#087cbe"/><circle cx="41" cy="16" r="6" fill="#2694d0"/><path d="M25 15q-9 0-9 11v13h18V25q0-10-9-10" fill="#d63d0b"/><circle cx="25" cy="8" r="6" fill="#f09720"/><path d="M24 31q-11 0-11 10v8h23v-8q0-10-12-10" fill="#0572c3"/><circle cx="24" cy="25" r="7" fill="#0074a9"/></g>',
          '<g stroke="#171717" stroke-width="2"><path d="M8 8l7-7h33v45l-7 4H8z" fill="#929292"/><path d="M8 8h33v42H8z" fill="#c2c2c2"/><path d="M41 8l7-7M41 8v42" fill="none"/><path d="M11 12h26v14H11zM11 29h26v17H11z" fill="#b1b1b1"/><path d="M20 17h10v5H20z" fill="#222"/><path d="M20 35h10v5H20z" fill="#7d6b32"/><path d="M12 12h24M12 30h24" stroke="#eee"/></g>',
          '<circle cx="25" cy="25" r="23" fill="#075ed6" stroke="#151515" stroke-width="2"/><path d="M14 4l10-2 2 7-7 3-2 8-8 2-5-6 5-8zm19 2l8 5 4 9-6 2-5-7-5-1zm-15 21l8-4 9 5-2 9-6 4-2 7-6-5 1-8-6-4zm24 2l5 2-4 11-6-2 2-7z" fill="#5ab616"/><path d="M11 7l4-2M36 39l4-5" stroke="#96d43a" stroke-width="3"/>',
          '<g stroke="#342b05" stroke-width="2"><path d="M4 9q21-10 43 0l2 12-10 1-3-9H16l-3 9-11-1z" fill="#eac20a"/><path d="M18 18h16l6 27H11z" fill="#dfba0b"/><path d="M20 20h12v7H20z" fill="#f5ec9b"/><path d="M19 31h4m3 0h4m3 0h3m-18 5h4m4 0h4m3 0h3m-19 5h4m4 0h4m3 0h3" stroke="#fff8bc" stroke-width="2"/><path d="M6 10h8m22 0h9" stroke="#fff0a0"/></g>',
          '<path d="M18 31L3 47l-3-4 15-17z" fill="#387b9c" stroke="#111" stroke-width="2"/><circle cx="29" cy="18" r="17" fill="#bbb" stroke="#111" stroke-width="2"/><circle cx="29" cy="18" r="13" fill="#92cfef" stroke="#fff" stroke-width="2"/><path d="M20 11l5-4 8 1" fill="none" stroke="#e5f6ff" stroke-width="3"/>',
          '<path d="M9 7Q23-4 38 6q12 8 7 23-3 9-13 12v8H19v-8Q6 36 5 25 1 14 9 7" fill="#2535a7" stroke="#172071" stroke-width="2"/><path d="M15 15q1-9 13-8 12 1 10 11-1 5-8 9-4 2-4 8" fill="none" stroke="#f2f2ff" stroke-width="5"/><path d="M24 40v5" stroke="#fff" stroke-width="5"/><path d="M10 11l4-4 5-2" fill="none" stroke="#6578d8" stroke-width="3"/>'
        ];
        glyph.innerHTML = '<svg viewBox="0 0 52 52" aria-hidden="true">' + icons[i] + '</svg>';
        u.el('span', '', it, t);
      });
      const body = u.el('div', 'ds-body', document.body);
      const tabs = u.el('div', 'ds-tabs', body);
      C.tabs.split('|').forEach((t, i) => u.el('span', i === 0 ? 'on' : '', tabs, t));
      const lower = u.el('div', 'ds-lower', body);
      const help = u.el('aside', 'ds-help', lower);
      u.el('h3', 'ds-h3', help, 'Using the staff list');
      u.el('p', '', help, 'The table shows all staff with their department, start year and telephone extension.');
      u.el('p', '', help, 'You can sort by clicking a column heading.');
      u.el('p', '', help, 'Use the scroll bars to see more rows or columns if needed.');
      u.el('hr', '', help);
      u.el('h3', 'ds-h3 tips', help, 'Tips');
      const ul = u.el('ul', '', help);
      ['Click a column heading to sort the list.', 'Use the horizontal scroll bar to see more columns.', 'You can also type in the filter box to show matching names.'].forEach((t) => u.el('li', '', ul, t));
      const content = u.el('div', 'ds-content', lower);
      const natural = C.instruction;
      let mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : natural;
      if ((mode === 'left' || mode === 'toast') && window.innerWidth < 1260) mode = 'top';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, cls === 'ds-brief' ? help : parent);
        if (cls === 'ds-brief') help.insertBefore(b, help.firstChild);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') {
        const note = briefing(content, 'ds-header-note');
        document.body.insertBefore(note, nav);
      }
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        briefing(document.body, 'ds-toast');
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready');
      let submit = null;
      const er = ctx.rng.fork('chrome/end');
      const labels = (
        (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          'Complete',
        ]
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const baseline = !ctx.finish && er.bool(0.5);
      const placement = ctx.finish ? null : baseline ? 'footer' : er.pick(['header', 'link']);
      const label = ctx.finish
        ? ''
        : baseline
          ? 'Confirm'
          : er.pick(labels.filter((x) => String(x).toLowerCase() !== 'confirm'));
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const pool = labels.filter((x) => String(x).toLowerCase() !== String(label).toLowerCase());
        if (pool.length) collide = cr.pick(pool);
      }
      const decoy = (parent, text, isCollide) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', isCollide ? { label: text, collide: true } : { label: text }),
        );
      };
      const end = (parent, cls, text) => {
        const b = u.el(cls === 'ds-endlink' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const tools = u.el('div', 'ds-tools', top);
      if (collide) decoy(placement === 'footer' ? foot : tools, collide, true);
      if (placement === 'header') submit = end(tools, 'ds-submit ds-header-submit', label);
      if (placement === 'footer') submit = end(foot, 'ds-submit', label);
      if (placement === 'link') submit = end(foot, 'ds-endlink', label + ' ›');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      if (ctx.kind === 'banner') {
        el.style.setProperty('--ds-banner-top', document.querySelector('.ds-menu').getBoundingClientRect().bottom + 'px');
      }
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Dismiss' : ctx.kind === 'chat' || ctx.kind === 'banner' ? '×' : 'Close');
      dismiss.setAttribute('aria-label', ctx.kind === 'cookie' ? 'Dismiss' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    template: 'site/fill-form-receipt-03',
    design: { parts: { frame: () => design.frame, overlay: () => design.overlay } },
  });
})();
