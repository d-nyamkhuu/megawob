(function () {
  'use strict';
  const C = {
    'site': 'design-set-date-typed-04',
    'brand': 'My Organizer',
    'title': 'New Task',
    'instruction': 'top',
    'rail': '',
    'menu': '',
    'briefTitle': 'Instructions',
  };
  const NAV = [
    ['Tasks', '▤'],
    ['Notes', '▥'],
    ['Calendar', '▦'],
    ['Contacts', '●'],
    ['Settings', '✲'],
  ];
  const RINGS = [10.3, 17.3, 24.3, 37.5, 47.7, 57.7, 66.9, 77.8, 86];
  const shapes = {
    Tasks:
      '<path fill="currentColor" d="M6 5h20v26H6z"/><path d="M10 3v6m12-6v6M10 13h12m-12 5h12m-12 5h8" stroke="#eee8d8" stroke-width="2"/>',
    Notes:
      '<path d="M6 3h14l7 7v21H6zM20 3v8h7M10 15h12m-12 5h12m-12 5h10" fill="none" stroke="currentColor" stroke-width="2.5"/>',
    Calendar:
      '<rect x="4" y="7" width="25" height="24" rx="2" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M10 3v8m13-8v8M5 13h23" stroke="currentColor" stroke-width="3"/><path d="M9 17h3v3H9zm6 0h3v3h-3zm6 0h3v3h-3zM9 23h3v3H9zm6 0h3v3h-3zm6 0h3v3h-3z" fill="currentColor"/>',
    Contacts:
      '<ellipse cx="16" cy="10" rx="6" ry="7" fill="currentColor"/><path d="M4 31v-3c0-13 24-13 24 0v3z" fill="currentColor"/>',
    Settings:
      '<path d="M13 2h6l1 5 4 2 5-1 3 5-4 4v4l4 4-3 5-5-1-4 2-1 4h-6l-1-4-4-2-5 1-3-5 4-4v-4l-4-4 3-5 5 1 4-2z" fill="currentColor"/><circle cx="16" cy="18" r="6" fill="#eee8da"/>',
    pencil:
      '<path d="M5 23L22 4l7 6-17 19-9 3z" fill="currentColor"/><path d="M19 8l7 6M5 23l7 6" stroke="#ece4d3" stroke-width="2"/>',
    bulb: '<path d="M11 25c0-5-6-8-6-14a11 11 0 0 1 22 0c0 6-6 9-6 14M11 25h10m-10 4h10m-8 3h6M16 0v-4M0 11h-4m36 0h4M3 0l-3-3m29 3l3-3M13 24l-2-13 5 4 5-4-2 13" fill="none" stroke="currentColor" stroke-width="2"/>',
    leaf: '<path d="M7 30C2 15 18 7 30 2c0 17-8 26-20 25" fill="currentColor"/><path d="M4 35L25 8" fill="none" stroke="#765538" stroke-width="1.4"/>',
  };
  function icon(el, key) {
    el.innerHTML = '<svg viewBox="0 0 34 36" aria-hidden="true">' + shapes[key] + '</svg>';
  }
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
      icon(u.el('span', 'ds-leaf', top), 'leaf');
      u.el('span', 'ds-brand', top, C.brand);
      const side = u.el('nav', 'ds-side', document.body);
      NAV.forEach((n, i) => {
        const it = u.el('div', 'ds-nav' + (i === 0 ? ' on' : ''), side);
        icon(u.el('span', 'ds-ico', it), n[0]);
        u.el('span', '', it, n[0]);
      });
      const quote = u.el('aside', 'ds-quote', document.body);
      u.el('span', 'ds-pin', quote);
      u.el('div', '', quote, '“A more organized day a brighter tomorrow.”');
      RINGS.forEach((t) => {
        const r = u.el('span', 'ds-ring', document.body);
        r.style.top = t + '%';
      });
      const today = u.el('aside', 'ds-today', document.body);
      u.el('div', 'ds-sh', today, 'Today');
      ['Review notes', 'Prepare slides', 'Follow up with team'].forEach((t) => {
        const l = u.el('div', 'ds-chk', today);
        u.el('span', 'ds-box', l);
        u.el('span', '', l, t);
      });
      const tools = u.el('aside', 'ds-tools', document.body);
      u.el('div', 'ds-sh', tools, 'Quick Tools');
      [
        ['pencil', 'Add Task'],
        ['Tasks', 'New Note'],
        ['Calendar', 'View Calendar'],
      ].forEach((t) => {
        const b = u.el('div', 'ds-tool', tools);
        icon(u.el('span', 'ds-tico', b), t[0]);
        u.el('span', '', b, t[1]);
      });
      const tip = u.el('aside', 'ds-tip', document.body);
      const tiphead = u.el('div', 'ds-sh', tip);
      icon(u.el('span', 'ds-tipicon', tiphead), 'bulb');
      u.el('span', '', tiphead, 'Tip');
      u.el('div', 'ds-tiptx', tip, 'Set a due date to keep your goals on track.');
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const head = u.el('div', 'ds-head', content);
      u.el('span', 'ds-htitle', head, C.title);
      u.el('span', 'ds-hdate', head, 'Thu, Apr 24, 2025');
      const natural = C.instruction;
      // A perimeter note needs the wider desktop rail; compact episodes use the page heading.
      const compact = (ctx.size ? ctx.size.width : document.documentElement.clientWidth) < 1200;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel' && !compact
              ? 'panel'
              : natural;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-task-panel') u.el('h2', 'ds-sh', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      if (mode === 'panel') {
        today.remove();
        briefing(document.body, 'ds-task-panel');
      }
      const main = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer' + (ctx.finish ? ' ds-finish' : ''), content);
      u.el('span', '', foot, 'Ready');
      let submit = null;
      if (!ctx.finish) {
        // Recompute from the episode's own streams on every reset: no cross-episode cache.
        const endRng = ctx.rng.fork('chrome/end'),
          labels =
            ctx.content && Array.isArray(ctx.content.END_LABELS)
              ? ctx.content.END_LABELS
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', '✓'];
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const alternatePlacement = endRng.pick(['footer', 'header', 'tools']);
        const alternateLabel = labelOf(endRng.pick(labels));
        const alternateForm = endRng.pick(['button', 'link']);
        const legacy = endRng.bool(0.5);
        const placement = legacy ? 'footer' : alternatePlacement,
          label = legacy ? 'Submit' : alternateLabel;
        let collide = null;
        const collideRng = ctx.rng.fork('chrome/collide');
        if (collideRng.bool(0.3)) {
          const other = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (other.length)
            collide = { label: collideRng.pick(other), where: collideRng.pick(['header', 'footer', 'tools']) };
        }
        const addEnd = (parent, cls) => {
          const link = !legacy && alternateForm === 'link';
          const b = u.el(link ? 'a' : 'button', cls + (link ? ' ds-endlink' : ''), parent, label);
          if (link) b.href = '#';
          else b.type = 'button';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        if (placement === 'footer') submit = addEnd(foot, 'ds-submit');
        else if (placement === 'header') submit = addEnd(head, 'ds-submit ds-submit-header');
        else submit = addEnd(tools, 'ds-submit ds-submit-tools');
        if (placement === 'footer') {
          const cancel = u.el('button', 'ds-cancel', foot, 'Cancel');
          cancel.type = 'button';
        }
        if (collide) {
          const parent = collide.where === 'header' ? head : collide.where === 'footer' ? foot : tools,
            b = u.el('button', 'ds-xtra', parent, collide.label);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: collide.label, collide: true }));
        }
      }
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
