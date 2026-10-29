(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-autocomplete-02',
    'brand': 'Trip Details',
    'title': 'Destination',
    'instruction': 'top',
    'rail': '',
    'menu': '',
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
      const top = u.el('header', 'ds-nexa', document.body);
      u.el('span', 'ds-logo', top, 'NEXA');
      const tt = u.el('div', 'ds-tt', top);
      u.el('div', 'ds-t1', tt, 'Create Office Request');
      u.el('div', 'ds-t2', tt, 'Set the details below to submit your request.');
      const nv = u.el('nav', 'ds-nv', top);
      ['Requests', 'People', 'Offices', 'Settings'].forEach((t) => u.el('span', '', nv, t));
      const endR = ctx.rng.fork('chrome/end'),
        collideR = ctx.rng.fork('chrome/collide'),
        rawLabels = (ctx.content && ctx.content.END_LABELS) || [
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
        ],
        labels = rawLabels.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x))),
        label = endR.bool(0.5) ? 'Submit' : String(endR.pick(labels)),
        pickedPlacement = endR.pick(['footer', 'footer', 'footer', 'header', 'link']),
        placement =
          document.documentElement.clientWidth < 1250 && pickedPlacement === 'header' ? 'footer' : pickedPlacement,
        collisionPool = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase()),
        collision = collideR.bool(0.3) && collisionPool.length ? String(collideR.pick(collisionPool)) : null;
      u.el('span', 'ds-av', top, 'JD');
      let headerSubmit = null,
        collisionBtn = null;
      if (!ctx.finish && placement === 'header') {
        headerSubmit = u.el('button', 'ds-head-end', top, label);
        headerSubmit.type = 'button';
        headerSubmit.dataset.role = 'submit';
        headerSubmit.addEventListener('click', () => ctx.submit());
      }
      if (collision) {
        collisionBtn = u.el('button', 'ds-head-xtra', top, collision);
        collisionBtn.type = 'button';
        collisionBtn.dataset.role = 'xtra';
        collisionBtn.addEventListener('click', () => env.log('decoy', { label: collision, collide: true }));
      }
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
      let mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : natural;
      if ((mode === 'left' || mode === 'right' || mode === 'toast') && document.documentElement.clientWidth < 1250)
        mode = natural;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        u.el('span', 'ds-num', b, '1');
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
      const marker = u.el('div', 'ds-swiss-label', stage);
      u.el('strong', '', marker, '01');
      u.el('h1', '', marker, 'Trip Details');
      u.el('div', 'ds-redrule', marker);
      u.el('p', '', marker, 'Fill in your travel information to continue.');
      if (mode === 'toast') {
        const note = briefing(top, 'ds-toast');
        note.classList.add('ds-toast-note');
      }
      const foot = u.el('footer', 'ds-footer', content);
      const cancel = u.el('button', 'ds-travel-cancel', foot, 'Cancel');
      cancel.type = 'button';
      if (collisionBtn && document.documentElement.clientWidth < 1250) foot.appendChild(collisionBtn);
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'link') {
          submit = u.el('a', 'ds-endlink', foot, `${label} ›`);
          submit.href = '#';
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
        } else if (placement === 'footer') {
          submit = u.el('button', 'ds-submit', foot, label);
          submit.type = 'button';
          submit.addEventListener('click', () => ctx.submit());
        } else submit = headerSubmit;
        if (submit) submit.dataset.role = 'submit';
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
