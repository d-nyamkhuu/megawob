(function () {
  'use strict';
  const C = {
    'site': 'design-fill-form-receipt-04',
    'brand': 'FlowTrack',
    'title': 'Expense details',
    'instruction': 'top',
    'rail': '',
    'menu': 'Expenses|Reports|Cards|Approvals|Settings',
    'briefTitle': 'Instructions',
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
      document.body.dataset.flowtrack = 'true';
      document.body.dataset.display = ctx.display;
      const er = ctx.rng.fork('chrome/end');
      const bank = ctx.content && ctx.content.END_LABELS;
      const labels =
        Array.isArray(bank) && bank.length
          ? bank
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const preferred = labels.find((x) => labelOf(x).trim().toLowerCase() === 'confirm') || labels[0];
      const alternate = labels.filter((x) => labelOf(x).trim().toLowerCase() !== 'confirm');
      const original = !ctx.finish && er.bool(0.5);
      const endLabel = original ? labelOf(preferred) : labelOf(er.pick(alternate.length ? alternate : labels));
      const placement = ctx.finish ? null : original ? 'toolbar' : er.pick(['footer', 'icon', 'status', 'status']);
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const choices = [...new Set(labels.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
        );
        if (choices.length) collide = { label: cr.pick(choices), where: cr.pick(['toolbar', 'status']) };
      }
      document.body.dataset.end = placement || 'none';
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      const nav = u.el('nav', 'ds-menu', top);
      C.menu.split('|').forEach((t, i) => {
        const n = u.el('button', i === 0 ? 'active' : '', nav, t);
        n.type = 'button';
        n.addEventListener('click', () => env.log('navigation', { label: t }));
      });
      const ribbon = u.el('div', 'ds-ribbon', top);
      const topTools = u.el('div', 'ds-top-tools', top);
      const search = u.el('button', 'ds-search', topTools);
      search.type = 'button';
      search.title = 'Search';
      search.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/></svg>';
      u.el('span', 'ds-avatar', topTools, 'JD');
      let submit = null;
      const makeEnd = (parent, cls, text, tag = 'button') => {
        const b = u.el(tag, cls, parent, text);
        if (tag === 'button') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const decoy = (parent, text) => {
        const b = u.el('button', 'ds-end-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      if (placement === 'toolbar' || placement === 'icon')
        submit = makeEnd(
          ribbon,
          'ds-ribbon-end' + (placement === 'icon' ? ' ds-icon-end' : ''),
          placement === 'icon' ? '✓' : endLabel,
        );
      if (collide && collide.where === 'toolbar') decoy(ribbon, collide.label);
      const status = u.el('div', 'ds-statusbar', document.body);
      u.el('span', '', status, 'Ready');
      if (placement === 'status') submit = makeEnd(status, 'ds-status-end', endLabel, 'a');
      if (collide && collide.where === 'status') decoy(placement === 'status' ? status : ribbon, collide.label);
      u.el('span', '', status, '▤  ▦   100%   − ━━━━━━━ +');
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      const natural = C.instruction;
      let mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : natural;
      if (mode === 'toast' && ctx.instruction.length > 220 && content.clientWidth < 1180) {
        mode = 'top';
        document.body.dataset.display = 'header';
      }
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') {
        const note = briefing(top, 'ds-header-note');
        top.insertBefore(note, nav);
      }
      const main = u.el('div', 'ds-main', content);
      main.dataset.mode = mode;
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
        main.style.setProperty('--panel-note-h', b.offsetHeight + 48 + 'px');
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready');
      if (!ctx.finish && placement === 'footer') submit = makeEnd(foot, 'ds-submit', endLabel);
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      el.style.setProperty('--app-header-h', document.querySelector('.ds-top').offsetHeight + 'px');
      const copy = {
        cookie: [
          'We use cookies',
          'We use cookies to improve your experience, analyze traffic, and personalize content. You can configure your preferences.',
        ],
        toast: ['Changes synced', 'Your recent changes have been saved.'],
        chat: ['How can we help?', 'Ask a question or search for help.'],
        promo: ['Stay in the loop', 'Get product updates, tips, and resources delivered to your inbox.'],
        banner: [
          'New! Export expenses to your accounting software',
          'Sync your expenses with popular tools like QuickBooks and Xero in just a few clicks.',
        ],
      }[ctx.kind] || ['FlowTrack', 'Workspace notification'];
      const badge = u.el(
        'div',
        'ds-overlay-badge',
        el,
        ctx.kind === 'cookie' ? '◉' : ctx.kind === 'banner' ? '⚑' : ctx.kind === 'chat' ? '▤' : '',
      );
      const message = u.el('div', 'ds-overlay-message', el);
      u.el('h2', '', message, copy[0]);
      u.el('p', '', message, copy[1]);
      if (ctx.kind === 'chat') {
        const f = u.el('div', 'ds-chat-input', message, 'Type a message…');
        u.el('span', '', f, '➤');
      }
      if (ctx.kind === 'promo') {
        u.el('div', 'ds-newsletter-art', el, '✉');
        u.el('div', 'ds-newsletter-input', message, 'Enter your email address');
        const subscribe = u.el('button', 'ds-subscribe', message, 'Subscribe');
        subscribe.type = 'button';
        subscribe.addEventListener('click', () => ctx.dismiss('subscribe'));
        const decline = u.el('button', 'ds-decline', message, 'No thanks');
        decline.type = 'button';
        decline.addEventListener('click', () => ctx.dismiss('decline'));
      }
      if (ctx.kind === 'cookie' || ctx.kind === 'banner') {
        const secondary = u.el('button', 'ds-overlay-secondary', el, ctx.kind === 'cookie' ? 'Manage' : 'Learn more');
        secondary.type = 'button';
        secondary.addEventListener('click', () => env.log('decoy', { label: secondary.textContent }));
      }
      const dismiss = u.el(
        'button',
        'ds-overlay-dismiss',
        el,
        ctx.kind === 'cookie' ? 'Accept' : ctx.kind === 'toast' ? 'Close' : '×',
      );
      dismiss.type = 'button';
      dismiss.title = ctx.kind === 'cookie' ? 'Accept cookies' : 'Close';
      dismiss.setAttribute('aria-label', dismiss.title);
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
