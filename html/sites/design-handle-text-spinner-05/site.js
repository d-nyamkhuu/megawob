(function () {
  'use strict';
  const cfg = {
    title: 'Personal Settings',
    theme: 'material',
    layout: 'horizontal',
    tools: 'Home|Email|Calendar|Tasks|Settings',
    side: '',
  };
  env.site({
    name: 'design-handle-text-spinner-05',
    styles: ['site.css', 'web2.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title brandrow', head);
      const brand = u.el('div', 'brand', title);
      u.el('strong', 'brand-work', brand, 'Work');
      u.el('strong', 'brand-space', brand, 'Space');
      u.el('span', 'brand-divider', title, '|');
      u.el('span', 'section-name', title, cfg.title);
      const account = u.el('div', 'account', title);
      u.el('span', '', account, 'Welcome, Alex');
      u.el('i', '', account, '|');
      u.el('a', '', account, 'My Account');
      u.el('i', '', account, '|');
      u.el('a', '', account, 'Sign Out');
      const tabs = u.el('nav', 'tools', head);
      cfg.tools.split('|').forEach((s, i) => u.el('div', i === 4 ? 'active' : '', tabs, s));
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const appearance = u.el('section', 'appearance-heading', center);
      u.el('h2', '', appearance, 'Audio Settings');
      u.el('p', '', appearance, '');
      const note = u.el('div', 'instruction', center, ctx.instruction);
      let display = ctx.display || 'header';
      note.dataset.display = display;
      note.hidden = display === 'hidden';
      if (display === 'panel') note.classList.add('instruction-panel');
      if (display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', center);
      const heading = u.el('div', 'stage-heading', stage);
      u.el('h2', '', heading, 'Audio Settings');
      const meter = u.el('div', 'volume-meter', stage);
      u.el('span', 'speaker low', meter, '◀');
      u.el('span', 'meter-track', meter);
      u.el('span', 'speaker high', meter, '◖)))');
      const foot = u.el('footer', 'footer', shell);
      u.el('span', 'ready', foot, '');
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const ends = (
        (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
        ]
      ).map(labelOf);
      const er = ctx.rng.fork('chrome/end');
      const standard = er.bool(0.5);
      const placement = ctx.finish ? null : standard ? 'footer' : er.pick(['header', 'link']);
      const label = standard ? 'Submit' : er.pick(ends.filter((x) => x.trim().toLowerCase() !== 'submit'));
      const endButton = (parent, cls, text) => {
        const b = u.el(cls === 'footer-link' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const pool = [...new Set(ends.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase()))];
        if (pool.length) collide = { text: cr.pick(pool), where: cr.pick(['header', 'footer']) };
      }
      const decoy = (parent, text) => {
        const b = u.el('button', 'chrome-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        return b;
      };
      if (placement === 'header') {
        if (collide && collide.where === 'header') decoy(tabs, collide.text);
        endButton(tabs, 'header-end', label);
      } else if (collide && collide.where === 'header') decoy(tabs, collide.text);
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'footer') submit = endButton(foot, 'submit', label);
        if (placement === 'link') submit = endButton(foot, 'footer-link', label + ' ›');
        if (collide && collide.where === 'footer') decoy(foot, collide.text);
      }
      return { stage, submit: submit || (!ctx.finish ? tabs.querySelector('[data-role=submit]') : null) };
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
