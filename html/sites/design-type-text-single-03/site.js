(function () {
  'use strict';
  const C = { site: 'design-type-text-single-03' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const endR = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = endR.bool(0.5);
      const placement = referenceEnd ? 'footer' : endR.pick(['toolbar', 'link']);
      const endLabel = referenceEnd ? 'Submit' : endR.pick(endLabels);
      const collideR = ctx.rng.fork('chrome/collide');
      const collideLabels = endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collide = collideR.bool(0.3) && collideLabels.length ? collideR.pick(collideLabels) : null;
      const top = u.el('header', 'ds-top', document.body);
      const brand = u.el('div', 'ds-brand', top);
      u.el('span', 'ds-b1', brand, 'Task');
      u.el('span', 'ds-b2', brand, ' Flow');
      u.el('span', 'ds-tag', brand, 'Simple Tools for Getting Things Done');
      const who = u.el('div', 'ds-who', top);
      u.el('span', '', who, 'Welcome, Alex');
      u.el('i', '', who);
      u.el('span', '', who, 'Apr 28, 2025');
      const nav = u.el('nav', 'ds-tabs', document.body);
      ['Tasks', 'Notes', 'Files', 'Calendar', 'Contacts'].forEach((t, i) =>
        u.el('span', 'ds-tab' + (i === 0 ? ' on' : ''), nav, t),
      );
      const body = u.el('div', 'ds-body', document.body);
      const left = u.el('section', 'ds-left', body);
      const bar = u.el('h2', 'ds-bar', left, 'New Task');
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'panel'
            ? 'panel'
            : ctx.display === 'toast'
              ? 'toast'
              : 'left';
      if (mode === 'left' || mode === 'toast') {
        const b = u.el('aside', mode === 'toast' ? 'ds-toast' : 'ds-brief', left);
        if (mode === 'toast') u.el('span', 'ds-toast-title', b, 'Task reminder');
        u.el('div', 'ds-instruction', b, ctx.instruction);
      }
      const stage = u.el('main', 'ds-stage', left);
      const foot = u.el('footer', 'ds-footer', left);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          placement === 'toolbar' ? 'ds-submit ds-toolbar-end' : placement === 'link' ? 'ds-endlink' : 'ds-submit',
          placement === 'toolbar' ? bar : foot,
          endLabel,
        );
        if (submit.tagName === 'BUTTON') submit.type = 'button';
        else submit.href = '#';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const clear = u.el('span', 'ds-clear', foot, 'Clear');
      clear.setAttribute('aria-hidden', 'true');
      if (collide) {
        const decoy = u.el('button', 'ds-xtra', foot, collide);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      const right = u.el('aside', 'ds-right', body);
      function panel(title) {
        const p = u.el('div', 'ds-panel', right);
        u.el('h3', '', p, title);
        return u.el('div', 'ds-pbody', p);
      }
      const d = panel('Task Details');
      [
        ['Status', 'Not submitted'],
        ['Created', 'Apr 28, 2025'],
        ['Assignee', 'Me'],
        ['Priority', 'Normal'],
      ].forEach((r) => {
        const row = u.el('div', 'ds-row', d);
        u.el('span', '', row, r[0]);
        u.el('span', '', row, r[1]);
      });
      const t = panel(mode === 'panel' ? 'Task Instructions' : 'Helpful Tips');
      if (mode === 'panel') {
        t.parentElement.classList.add('ds-panel-instruction');
        u.el('div', 'ds-instruction', t, ctx.instruction);
      } else {
        const ul = u.el('ul', 'ds-tips', t);
        [
          'Read the instructions carefully.',
          'Enter the exact text in the specified field.',
          'You can complete the other fields if you want.',
        ].forEach((s) => u.el('li', '', ul, s));
        if (ctx.finish) u.el('li', '', ul, 'Complete the task when you are ready.');
        else {
          const li = u.el('li', '', ul, 'Click ');
          u.el('b', '', li, endLabel);
          li.append(' when you are ready.');
        }
      }
      const h = panel('Need Help?');
      u.el('p', '', h, 'If you have any questions, please contact your administrator.');
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
