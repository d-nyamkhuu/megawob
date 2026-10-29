(function () {
  'use strict';
  const C = {
    'site': 'design-type-text-password-03',
    'brand': 'Account Access',
    'title': '',
    'instruction': 'top',
    'rail': '',
    'menu': 'Home|Accounts|Settings|Help|Sign out',
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
      const display = ctx.display || 'panel';
      const endR = ctx.rng.fork('chrome/end');
      const collideR = ctx.rng.fork('chrome/collide');
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
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      let placement = 'form',
        label = 'Submit';
      if (!ctx.finish) {
        placement = endR.pick(['form', 'form', 'form', 'toolbar', 'link', 'link']);
        if (placement !== 'form') {
          const pool = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== 'submit');
          label = pool.length ? endR.pick(pool) : 'Done';
        }
      }
      const same = (x) => x.trim().toLowerCase() === label.trim().toLowerCase();
      const collisionPool = [...new Set(labels.map(labelOf))].filter((x) => !same(x));
      const collide = !ctx.finish && collisionPool.length && collideR.bool(0.3) ? collideR.pick(collisionPool) : null;
      const mode =
        display === 'hidden' ? 'hidden' : display === 'toast' ? 'toast' : display === 'header' ? 'header' : 'panel';
      const body = u.el('div', 'ds-body', document.body);
      const brief = u.el('aside', 'ds-brief', body);
      u.el('div', 'ds-eyebrow', brief, 'Setup');
      u.el('h2', 'ds-title', brief, 'Create Your Account');
      u.el('p', 'ds-lead', brief, 'Follow the instructions to set a secure password for your new account.');
      const addInstruction = (parent, cls) => {
        const imp = u.el('aside', cls, parent);
        u.el('div', 'ds-imp-ico', imp, '!');
        const tx = u.el('div', '', imp);
        u.el('div', 'ds-imp-tag', tx, 'IMPORTANT');
        const instruction = u.el('div', 'ds-instruction', tx);
        ctx.instruction
          .split(/("[^"]*")/g)
          .forEach((text, i) => u.el(i % 2 ? 'strong' : 'span', '', instruction, text));
        if (ctx.instruction.length > 75) imp.classList.add('ds-imp-long');
      };
      if (mode === 'panel') addInstruction(brief, 'ds-imp');
      u.el('div', 'ds-req-h', brief, 'Password requirements');
      const ul = u.el('ul', 'ds-req', brief);
      [
        'At least 8 characters',
        'Include upper and lower case letters',
        'Include a number',
        'Include a special character',
      ].forEach((t) => u.el('li', '', ul, t));
      u.el('hr', 'ds-hr', brief);
      if (mode !== 'hidden') {
        const nt = u.el(
          'p',
          'ds-note',
          brief,
          'You must enter the exact password shown above in both fields, then click ',
        );
        u.el('b', '', nt, 'Submit');
        nt.append('.');
      }
      const content = u.el('div', 'ds-right', body);
      u.el('div', 'ds-r-eyebrow', content, 'Account setup');
      u.el('h1', 'ds-r-title', content, 'Choose a password');
      u.el('p', 'ds-r-sub', content, 'This password will be used to sign in to your account.');
      if (mode === 'header') addInstruction(content, 'ds-imp ds-header-note');
      if (mode === 'toast') addInstruction(brief, 'ds-imp ds-brief-toast');
      let submit = null;
      const topTools = u.el('div', 'ds-top-tools', content);
      const addDecoy = (parent, text) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      if (collide) addDecoy(topTools, collide);
      if (!ctx.finish && placement === 'toolbar') {
        const b = u.el('button', 'ds-submit ds-top-submit', topTools, label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        submit = b;
      }
      const card = u.el('div', 'ds-card', content);
      const stage = u.el('main', 'ds-stage', card);
      const foot = u.el('footer', 'ds-footer', card);
      if (!ctx.finish && placement === 'form') {
        submit = u.el('button', 'ds-submit', foot, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', () => ctx.submit());
      } else if (!ctx.finish && placement === 'link') {
        submit = u.el('a', 'ds-endlink', foot, label + ' ›');
        submit.href = '#';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
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
