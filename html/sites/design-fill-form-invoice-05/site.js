(function () {
  'use strict';
  const C = {
    'site': 'design-fill-form-invoice-05',
    'brand': 'Acme Finance',
    'menu': 'Invoices|Expenses|Vendors|Reports|Admin',
    'util': 'Help|Sign out',
    'instruction': 'left',
    'notes':
      'Enter the information exactly as it appears on the invoice.|If the invoice does not mention a field, leave it empty.',
  };
  const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const er = ctx.rng.fork('chrome/end');
      const original = er.bool(0.5);
      const placement = original ? 'form' : er.pick(['toolbar', 'margin']);
      const labels = (
        ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map(labelOf);
      const label = original ? 'Submit' : er.pick(labels);
      const top = u.el('header', 'ds-top', document.body);
      const brand = u.el('span', 'ds-brand', top);
      u.el('b', '', brand, 'Acme');
      brand.append(' Finance');
      const nav = u.el('nav', 'ds-menu', top);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      const ut = u.el('nav', 'ds-util', top);
      C.util.split('|').forEach((t) => u.el('span', '', ut, t));
      const tools = u.el('div', 'ds-tools', top);
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : C.instruction;
      content.dataset.instruction = mode;
      const main = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'left' || mode === 'panel') {
        const b = u.el('aside', 'ds-brief' + (mode === 'panel' ? ' ds-brief-panel' : ''), main);
        if (mode === 'panel') u.el('b', 'ds-brief-title', b, 'Invoice entry instructions');
        u.el('div', 'ds-instruction', b, ctx.instruction);
      }
      if (mode === 'toast') {
        const b = u.el('aside', 'ds-toast', content);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        content.insertBefore(b, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      const btns = u.el('div', 'ds-btns', foot);
      const margin = u.el('div', 'ds-margin-end', foot);
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'toolbar' ? tools : placement === 'margin' ? margin : btns;
        submit = u.el(
          'button',
          'ds-submit' + (placement === 'toolbar' ? ' ds-toolbar-end' : placement === 'margin' ? ' ds-endlink' : ''),
          parent,
          label,
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', () => ctx.submit());
      }
      const cancel = u.el('button', 'ds-cancel', btns, 'Clear');
      cancel.type = 'button';
      cancel.addEventListener('click', () => env.log('decoy', { label: 'Clear' }));
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const pool = [...new Set(labels)].filter((t) => t.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) {
          const text = cr.pick(pool),
            decoy = u.el('button', 'ds-cancel ds-xtra', tools, text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      if (!tools.children.length) tools.remove();
      if (!margin.children.length) margin.remove();
      const notes = u.el('div', 'ds-notes', foot);
      u.el('b', '', notes, 'Notes:');
      const ul = u.el('ul', '', notes);
      C.notes.split('|').forEach((t, i) => {
        if (i === 2 && (ctx.finish || label !== 'Submit')) return;
        u.el('li', '', ul, t);
      });
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
