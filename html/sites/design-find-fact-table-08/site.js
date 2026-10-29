(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-table-08',
    'brand': 'Research Assistant',
    'instruction': 'top',
    'nav': 'Home|Lookup|Notes|Calculator|Settings',
    'briefTitle': 'Instructions',
  };
  const ICONS = {
    Home: '<path d="M4 11l8-7 8 7M6 10v10h4v-6h4v6h4V10"/>',
    Lookup: '<path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6"/>',
    Notes: '<path d="M5 4h14v12l-4 4H5zM15 20v-4h4M8 9h8M8 13h5"/>',
    Calculator:
      '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M5 8h14M8 11v6M6 14h4M13 12h3M13 15h3M13 18h3M7 19l3-3"/>',
    Settings:
      '<path d="M9.5 3h5l.6 3 2 .9 2.7-1 2.3 4-2.2 2.1v2l2.2 2.1-2.3 4-2.7-1-2 .9-.6 3h-5l-.6-3-2-.9-2.7 1-2.3-4L4.1 14v-2L1.9 9.9l2.3-4 2.7 1 2-.9z" transform="translate(1 0) scale(.88)"/><circle cx="11.6" cy="11.5" r="3.3"/>',
  };
  const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
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
      const logo = u.el('span', 'ds-logo', top);
      logo.innerHTML =
        '<svg viewBox="0 0 20 20" width="20" height="20"><rect width="20" height="20" rx="4" fill="#1b6fd8"/><path d="M6 14V9a4 4 0 018 0v5M10 7v7" stroke="#fff" stroke-width="1.5" fill="none"/></svg>';
      u.el('span', 'ds-brand', top, C.brand);
      const wc = u.el('div', 'ds-wctl', top);
      wc.innerHTML =
        '<svg viewBox="0 0 12 12"><path d="M1 6h10"/></svg><svg viewBox="0 0 12 12"><rect x="1.5" y="1.5" width="9" height="9" rx="1.5"/></svg><svg viewBox="0 0 12 12"><path d="M1 1l10 10M11 1L1 11"/></svg>';
      const endR = ctx.rng.fork('chrome/end');
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
          "I'm done",
        ]
      ).map(labelOf);
      const baseLabel = labels.find((x) => x.trim().toLowerCase() === 'submit') || 'Submit';
      const label = endR.bool(0.25)
        ? labelOf(endR.pick(labels.filter((x) => x.trim().toLowerCase() !== 'submit')) || 'Done')
        : baseLabel;
      const placement = ctx.finish ? null : endR.pick(['form', 'form', 'form', 'form', 'dock-link', 'titlebar']);
      const collideR = ctx.rng.fork('chrome/collide');
      const endWords = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
      const collide = !ctx.finish && collideR.bool(0.3) && endWords.length ? labelOf(collideR.pick(endWords)) : null;
      function decoy(parent, text, collides) {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
        );
        return b;
      }
      let topSubmit = null;
      if (!ctx.finish && placement === 'titlebar') {
        topSubmit = u.el('button', 'ds-top-submit', top, label);
        topSubmit.type = 'button';
        topSubmit.dataset.role = 'submit';
        topSubmit.title = label;
        topSubmit.setAttribute('aria-label', label);
        topSubmit.addEventListener('click', () => ctx.submit());
      }
      if (collide && placement === 'titlebar') decoy(top, collide, true);
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const natural = C.instruction;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? document.documentElement.clientWidth <= 1200
                ? 'top'
                : 'left'
              : natural;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        if (cls === 'ds-header-note')
          u.el(
            'div',
            'ds-sub',
            b,
            'Use the table below to find the correct values. Each field on the right corresponds to one item in the table.',
          );
        return b;
      }
      if (mode === 'top') {
        const note = briefing(content, 'ds-header-note');
        if (ctx.display === 'panel') note.classList.add('ds-panel-note');
      }
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const dock = u.el('footer', 'ds-dock', document.body);
      const nav = u.el('nav', 'ds-nav', dock);
      C.nav.split('|').forEach((t) => {
        const it = u.el('div', 'ds-navitem' + (t === 'Lookup' ? ' on' : ''), nav);
        const ic = u.el('span', 'ds-ico', it);
        ic.innerHTML =
          '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">' +
          ICONS[t] +
          '</svg>';
        u.el('span', '', it, t);
      });
      const end = u.el('div', 'ds-dockend', dock);
      const actions = u.el('div', 'ds-actions', document.body);
      let submit = null;
      if (collide && placement !== 'titlebar') decoy(placement === 'form' ? actions : end, collide, true);
      if (!ctx.finish && placement !== 'titlebar') {
        submit = u.el(
          'button',
          placement === 'dock-link' ? 'ds-submit ds-submit-link' : 'ds-submit',
          placement === 'form' ? actions : end,
          label,
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', () => ctx.submit());
      }
      const clk = u.el('div', 'ds-clock', end);
      u.el('div', '', clk, '10:24 AM');
      u.el('div', '', clk, 'Apr 28, 2021');
      return { stage, submit: submit || topSubmit };
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
