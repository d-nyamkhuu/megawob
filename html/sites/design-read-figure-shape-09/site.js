(function () {
  'use strict';
  env.site({
    name: 'design-read-figure-shape-09',
    styles: ['ledger.css'],
    frame(ctx) {
      if (!document.body._fragGuard) {
        document.body._fragGuard = true;
        document.body.addEventListener('click', (e) => {
          const a = e.target.closest && e.target.closest('a[href]');
          if (a && /^#?$/.test(a.getAttribute('href'))) e.preventDefault();
        });
      }
      document.body.className = 'ledger-page instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body);
      const left = u.el('div', 'left', app);
      const h1 = u.el('h1', '', left);
      u.el('a', '', h1, 'Shape Ledger').href = '#';
      const stage = u.el('section', 'stage', left);
      const aside = u.el('aside', 'aside', app);
      const note = u.el('section', 'task-note', aside);
      const h2 = u.el('h2', '', note);
      u.el('a', '', h2, 'Task').href = '#';
      if (ctx.display !== 'hidden') u.el('div', 'brief', note, ctx.instruction);
      else note.remove();
      const c = u.el('h3', '', aside);
      u.el('a', '', c, 'Controls').href = '#';
      u.el('p', 'hint', aside, 'You can click a shape in the ledger.');
      const row = u.el('div', 'btnrow', aside);
      u.el('span', 'clear-slot', row);
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
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
        ]
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const original = er.bool(0.5),
        placement = original ? 'controls' : er.pick(['header', 'link']);
      const label = original ? 'Submit' : er.pick(labels.filter((x) => x !== 'Submit'));
      let submit = null;
      const l = u.el('h3', 'links-h', aside);
      u.el('a', '', l, 'Links').href = '#';
      const ul = u.el('ul', '', aside);
      ['Help', 'Instructions', 'Reset Task'].forEach((t) => {
        const li = u.el('li', '', ul);
        u.el('a', '', li, t).href = '#';
      });
      if (!ctx.finish) {
        let parent = row;
        if (placement === 'header') parent = ctx.display === 'hidden' ? c : h2;
        else if (placement === 'link') parent = u.el('li', 'end-item', ul);
        submit = u.el(placement === 'link' ? 'a' : 'button', 'submit end-' + placement, parent, label);
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      if (cr.bool(0.3)) {
        const choices = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (choices.length) {
          const text = cr.pick(choices),
            li = u.el('li', 'xtra-item', ul),
            b = u.el('button', 'xtra-btn', li, text);
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      const pv = u.el('div', 'preview', aside);
      const ph = u.el('div', 'pv-head', pv);
      u.el('a', '', ph, 'Preview').href = '#';
      u.el('div', 'pv-body', pv, 'No item selected.');
      aside.querySelectorAll('a').forEach((a) =>
        a.addEventListener('click', (e) => {
          e.preventDefault();
          if (a !== submit) env.log('decoy', { label: a.textContent });
        }),
      );
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
