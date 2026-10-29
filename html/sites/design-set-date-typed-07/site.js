(function () {
  'use strict';
  const C = {
    'site': 'design-set-date-typed-07',
    'brand': 'OS/2 Workplace Shell  -  Task Manager',
    'instruction': 'left',
    'menu': 'File|Edit|View|Tools|Help',
    'briefTitle': 'Task Briefing',
    'tabs': 'Task|Notes|Attachments|Recurrence',
    'tools': 'New Task|Open|Save|Delete|Print|Clear Form',
  };
  const ICONS = {
    'New Task':
      '<svg viewBox="0 0 24 28"><path d="M3 1h14l5 5v21H3z" fill="#fff" stroke="#111" stroke-width="1.5"/><path d="M17 1v6h5M6 8h9M6 12h13M6 16h13M6 20h13M6 24h13" fill="none" stroke="#111" stroke-width="1.2"/><path d="M4 2v24h16" fill="none" stroke="#999" stroke-width=".6"/></svg>',
    'Open':
      '<svg viewBox="0 0 28 27"><path d="M3 12l3-8h8l3 4h8v16H3z" fill="#ddd" stroke="#111" stroke-width="1.5"/><path d="M1 12h26l-2 13H3z" fill="#e5e5e5" stroke="#111" stroke-width="1.5"/><path d="M3 13h22M4 14l1 9" stroke="#fff" fill="none"/></svg>',
    'Save':
      '<svg viewBox="0 0 26 28"><path d="M2 3h20l2 2v21H2z" fill="#555" stroke="#111" stroke-width="1.5"/><path d="M5 3h15v11H5z" fill="#fff" stroke="#111"/><path d="M14 4h3v7h-3z" fill="#333"/><path d="M5 18h16v8H5z" fill="#eee" stroke="#111"/><path d="M8 20h10v4H8z" fill="#aaa" stroke="#111"/><path d="M3 4v21M23 6v19" stroke="#eee"/></svg>',
    'Delete':
      '<svg viewBox="0 0 24 28"><path d="M3 7h18l-1 2H4zM8 4l1-2h6l2 2M5 9l1 17h12l1-17" fill="#eee" stroke="#111" stroke-width="1.3"/><ellipse cx="12" cy="5" rx="10" ry="2" fill="#fff" stroke="#111" stroke-width="1.2"/><path d="M8 11v12M11 11v12M14 11v12M17 11v12" stroke="#111" stroke-width="1"/></svg>',
    'Print':
      '<svg viewBox="0 0 30 28"><path d="M7 10l2-9h17l-2 9" fill="#fff" stroke="#111" stroke-width="1.4"/><path d="M11 4h10M11 7h9" stroke="#111"/><path d="M2 10h27v13H2z" fill="#ddd" stroke="#111" stroke-width="1.5"/><path d="M4 12h23v7H4z" fill="#eee" stroke="#111"/><path d="M7 19h17v7H7z" fill="#fff" stroke="#111" stroke-width="1.4"/><path d="M8 23h15M3 22h3M25 14h1" stroke="#111"/></svg>',
    'Clear Form':
      '<svg viewBox="0 0 28 24"><path d="M3 13l8 8L26 3" fill="none" stroke="#000" stroke-width="5"/></svg>',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      const ic = u.el('span', 'ds-sysicon', top);
      ic.innerHTML =
        '<svg viewBox="0 0 20 20"><path d="M2 2h15v5H2zM4 8h15v5H4zM2 14h15v4H2z" fill="#111"/><path d="M3 3h12M6 5h10M5 9h10M8 11h10M3 15h10M6 17h10" stroke="#eee" stroke-width="1"/><path d="M2 6H0M17 4h3M3 12H1M18 16h2" stroke="#111"/></svg>';
      u.el('span', 'ds-brand', top, C.brand);
      const wc = u.el('span', 'ds-wctl', top);
      ['_', '□', '×'].forEach((t) => u.el('i', '', wc, t));
      const nav = u.el('nav', 'ds-menu', document.body);
      C.menu.split('|').forEach((t) => {
        const s = u.el('span', '', nav);
        const uu = document.createElement('u');
        uu.textContent = t[0];
        s.append(uu, t.slice(1));
      });
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'header'
              ? 'header'
              : ctx.display === 'panel'
                ? 'left'
                : C.instruction;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') {
          u.el('h2', '', b, C.briefTitle);
          const intro = u.el('div', 'ds-intro', b);
          intro.innerHTML =
            '<svg viewBox="0 0 30 40"><path d="M2 2h26v36H2z" fill="#fff" stroke="#111" stroke-width="1.7"/><path d="M5 6l2 1M24 5v2M7 9h16M7 13h16M7 17h16M7 21h16M7 25h16M7 29h16M7 33h16" stroke="#111" stroke-width="1.3"/><path d="M4 3v33h22" stroke="#999" stroke-width=".6" fill="none"/></svg>';
          u.el('span', '', intro, 'Create a new task with the following details.');
        }
        if (mode !== 'hidden') u.el('div', 'ds-instruction', b, ctx.instruction);
        if (cls === 'ds-brief') {
          const t = u.el('div', 'ds-facts', b);
          [
            ['Task Type:', 'Personal'],
            ['Priority:', 'Normal'],
            ['Category:', 'Planning'],
          ].forEach(([k, v]) => {
            u.el('span', '', t, k);
            u.el('span', '', t, v);
          });
          u.el('hr', '', b);
          u.el('div', 'ds-fill', b, 'Fill in the information on the right.');
        }
        return b;
      }
      if (mode === 'header') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const right = u.el('div', 'ds-right', main);
      const tabs = u.el('div', 'ds-tabs', right);
      C.tabs.split('|').forEach((t, i) => u.el('span', i ? '' : 'on', tabs, t));
      const stage = u.el('main', 'ds-stage', right);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      const tools = u.el('div', 'ds-tools', foot);
      C.tools.split('|').forEach((t) => {
        const b = u.el('div', 'ds-tool' + (t === 'Print' || t === 'Clear Form' ? ' sep' : ''), tools);
        const i = u.el('span', '', b);
        i.innerHTML = ICONS[t];
        u.el('span', '', b, t);
      });
      const endR = ctx.rng.fork('chrome/end');
      const placementR = ctx.rng.fork('chrome/end-placement');
      const placements = ['footer', 'footer', 'footer', 'titlebar', 'link', 'link'];
      const placement = ctx.finish ? null : placementR.pick(placements);
      const endBank =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const endText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      let endLabel = 'Submit';
      if (!ctx.finish) {
        const alternatives = endBank.map(endText).filter((x) => x.trim().toLowerCase() !== 'submit');
        const labelChoices = alternatives.length
          ? [
              'Submit',
              alternatives[0],
              'Submit',
              alternatives[1] || alternatives[0],
              'Submit',
              alternatives[2] || alternatives[0],
              'Submit',
              alternatives[3] || alternatives[0],
              'Submit',
              alternatives[4] || alternatives[0],
            ]
          : ['Submit'];
        endLabel = endR.pick(labelChoices);
      }
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const candidates = [
          ...new Set(endBank.map(endText).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase())),
        ];
        if (candidates.length) collide = collideR.pick(candidates);
      }
      let submit = null;
      const btns = u.el('div', 'ds-btns', foot);
      if (!ctx.finish && placement === 'footer') {
        submit = u.el('button', 'ds-submit', btns, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', () => ctx.submit());
      } else if (!ctx.finish && placement === 'link') {
        const a = u.el('a', 'ds-end-link', btns, endLabel + ' ›');
        a.href = '#';
        a.dataset.role = 'submit';
        a.title = endLabel;
        a.setAttribute('aria-label', endLabel);
        a.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        submit = a;
      }
      if (!ctx.finish && placement === 'titlebar') {
        const b = u.el('button', 'ds-title-submit', top, endLabel);
        top.insertBefore(b, wc);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = endLabel;
        b.setAttribute('aria-label', endLabel);
        b.addEventListener('click', () => ctx.submit());
        submit = b;
      }
      if (collide) {
        const d = u.el('button', 'ds-pq', tools, collide);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      const close = u.el('button', 'ds-close', btns, 'Close');
      close.type = 'button';
      const sb = u.el('div', 'ds-status', document.body);
      const statusIcon = u.el('span', 'ds-sb-ic', sb);
      statusIcon.innerHTML =
        '<svg viewBox="0 0 28 28"><g fill="#ddd" stroke="#111" stroke-width="1.6"><path d="M5 2h4v24H5zM9 5h12v4H9zM9 12h12v4H9zM9 19h12v4H9zM2 26h10M21 3l4-2v4l-2 2v14l2 3v3l-4-2"/></g><path d="M6 3v21M10 6h10M10 13h10M10 20h10" stroke="#fff"/></svg>';
      u.el('span', 'ds-sb-ready', sb, 'Ready');
      u.el('span', 'ds-sb-time', sb, 'Mon 27 Jun 1994  10:24 AM');
      return { stage, submit };
    },
    overlay(ctx) {
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
  });
})();
