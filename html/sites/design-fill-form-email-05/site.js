(function () {
  'use strict';
  const C = {
    'site': 'design-fill-form-email-05',
    'brand': 'Customer Info Entry',
    'title': 'Add Contact',
    'instruction': 'top',
    'rail': '',
    'menu': 'File|Edit|View|Tools|Help',
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
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const labels = (
        ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map(labelOf);
      const er = ctx.rng.fork('chrome/end');
      const original = er.bool(0.5);
      const placement = original ? 'form' : er.pick(['toolbar', 'status']);
      const endLabel = original ? 'Submit' : er.pick(labels);
      const cr = ctx.rng.fork('chrome/collide');
      const collidePool = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collide = cr.bool(0.3) && collidePool.length ? cr.pick(collidePool) : null;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-ico', top, '');
      u.el('span', 'ds-brand', top, C.brand);
      const wb = u.el('span', 'ds-wbtns', top);
      u.el('i', 'wb', wb, '_');
      u.el('i', 'wb', wb, '□');
      u.el('i', 'wb wbx', wb, '×');
      let nav = null;
      if (C.menu) {
        nav = u.el('nav', 'ds-menu', document.body);
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
      const side = u.el('aside', 'ds-side', body);
      u.el('h3', '', side, 'Task Status');
      const sl = u.el('div', 'ds-sidelead', side, 'Follow the instructions to complete the form.');
      ['Copy information from the email', 'Leave fields empty if not mentioned'].forEach(
        (t) => {
          const r = u.el('div', 'ds-step', side);
          u.el('i', '', r);
          u.el('span', '', r, t);
        },
      );
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready');
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'toolbar' ? nav || top : placement === 'status' ? side : foot;
        submit = u.el('button', placement === 'form' ? 'ds-submit' : 'ds-end ds-end-' + placement, parent, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', () => ctx.submit());
      }
      if (collide) {
        const decoy = u.el('button', 'ds-xtra', nav || top, collide);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.title = collide;
        decoy.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
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
