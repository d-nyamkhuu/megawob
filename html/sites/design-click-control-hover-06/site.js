(function () {
  'use strict';
  env.site({
    name: 'design-click-control-hover-06',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ext';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const brand = u.el('div', 'brand', head);
      u.el('div', 'brand-name', brand, 'GlobalLink Extranet');
      const sub = u.el('div', 'brand-sub', brand);
      ['Partners', 'Projects', 'Resources'].forEach((s, i) => {
        if (i) u.el('i', '', sub, '|');
        u.el('span', '', sub, s);
      });
      const user = u.el('div', 'userbar', head);
      const l1 = u.el('div', '', user);
      ['Welcome, Alex Carter', '|', 'Help', '|', 'Log Out'].forEach((s) => u.el('span', '', l1, s));
      u.el('div', 'date', user, 'Mon, Mar 15, 1999');
      const tabs = u.el('nav', 'utab', head);
      ['Home', 'Accounts', 'Orders', 'Support', 'Documents', 'Reports'].forEach((s) => u.el('span', '', tabs, s));
      const work = u.el('div', 'work', shell);
      const rail = u.el('nav', 'rail', work);
      for (let i = 1; i <= 20; i++) u.el('div', i === 6 ? 'active' : '', rail, (i < 10 ? '0' : '') + i);
      const center = u.el('section', 'center', work);
      u.el('div', 'crumb', center, 'Partner Training  >  Interaction Task');
      const display = ctx.display || 'header';
      const note =
        display === 'header' || display === 'toast'
          ? u.el('div', 'instruction ' + (display === 'toast' ? 'instruction-toast' : ''), center)
          : null;
      if (note) {
        note.textContent = ctx.instruction;
        note.dataset.display = display;
      }
      const stage = u.el('div', 'stage', center);
      const foot = u.el('footer', 'footer', center);
      const notes = u.el('section', 'notes', foot);
      u.el('h2', '', notes, display === 'panel' ? 'Episode settings' : 'Notes');
      if (display === 'panel') {
        const p = u.el('div', 'episode-panel-text', notes, ctx.instruction);
        p.dataset.display = 'panel';
      }
      const ul = u.el('ul', '', notes);
      [
        'The blue square moves to different positions within the area.',
        'Keep the mouse over the square. The time counts only while the pointer is over it.',
        'Keep going until the total reaches the required time.',
      ].forEach((t) => u.el('li', '', ul, t));
      const acts = u.el('div', 'acts', foot);
      const er = ctx.rng.fork('chrome/end');
      const labels = (ctx.content && ctx.content.END_LABELS) || [
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
      ];
      const picked = er.pick(labels);
      const label = er.bool(0.5) ? 'Submit' : picked.label || picked.text || picked;
      const placement = ctx.finish ? null : er.pick(['footer', 'footer', 'header', 'link']);
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (cr.bool(0.3)) {
        const pool = labels
          .map((x) => x.label || x)
          .filter((x) => String(x).toLowerCase() !== String(label).toLowerCase());
        if (pool.length) collide = cr.pick(pool);
      }
      let submit = null;
      const end = (parent, cls, text) => {
        const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'footer') {
          submit = end(acts, 'submit', label);
        } else if (placement === 'link') {
          submit = end(acts, 'end-link', label + '  ›');
        } else {
          submit = end(head, 'header-end', label);
        }
      }
      if (collide) {
        const b = u.el('button', 'xtra-end', acts, collide);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
