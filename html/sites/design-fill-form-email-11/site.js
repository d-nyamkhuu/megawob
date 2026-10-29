(function () {
  'use strict';
  const C = {
    'site': 'design-fill-form-email-11',
    'brand': 'Customer Intake',
    'instruction': 'top',
    'rail': '',
    'menu': '',
    'briefTitle': 'Your Task',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'cookie' },
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      const wc = u.el('span', 'ds-wc', top);
      u.el('i', '', wc, '–');
      u.el('i', '', wc, '□');
      u.el('i', 'x', wc, '✕');
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      }
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      const natural = C.instruction;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : natural;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
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
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x));
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const er = ctx.rng.fork('chrome/end');
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'form' : er.pick(['header', 'link']);
      const label = referenceEnd ? 'Submit' : er.pick(endLabels);
      let submit = null;
      let tools = null;
      const toolbar = () => {
        if (!tools) {
          tools = u.el('div', 'ds-tools', top);
          top.insertBefore(tools, wc);
        }
        return tools;
      };
      if (!ctx.finish) {
        const parent = placement === 'header' ? toolbar() : foot;
        const cls = placement === 'form' ? 'ds-submit' : 'ds-end ds-end-' + placement;
        submit = u.el('button', cls, parent, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', () => ctx.submit());
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = [...new Set(endLabels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const text = cr.pick(options);
          const decoy = u.el('button', 'ds-xtra', toolbar(), text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      if (ctx.kind === 'cookie') {
        const el = u.el('section', 'ds-overlay ds-initial ds-initial-consent ds-consent-overlay', document.body);
        el.dataset.role = 'overlay';
        u.el('h2', '', el, 'Data Consent');
        u.el('p', '', el, 'We need your consent to process and store\nthis information for customer intake purposes.');
        u.el('p', '', el, 'Do you agree to allow your entries to be stored\nin our system?');
        const btns = u.el('div', 'ds-btns', el);
        const dismiss = u.el('button', '', btns, 'Reject (optional)');
        const agree = u.el('button', 'ds-agree', btns, 'I Agree');
        dismiss.type = agree.type = 'button';
        dismiss.addEventListener('click', () => ctx.dismiss('close'));
        agree.addEventListener('click', () => ctx.dismiss('close'));
        return { el, dismiss, ttlSteps: 0 };
      }
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
