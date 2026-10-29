(function () {
  'use strict';
  env.site({
    name: 'design-read-figure-addition-12',
    styles: ['site.css'],
    frame(ctx) {
      const endR = ctx.rng.fork('chrome/end'),
        labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name),
        endLabels = ctx.content.END_LABELS.map(labelOf),
        referenceEnd = endR.bool(0.5),
        placement = referenceEnd ? 'drawer' : endR.pick(['header', 'footer']),
        endLabel = referenceEnd ? 'Submit' : endR.pick(endLabels);
      document.body.className =
        'kinetic instruction-' + ctx.display + ' end-' + placement + (ctx.finish ? ' finish-mode' : '');
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        brand = u.el('aside', 'brand', document.body);
      u.el('strong', 'brand-name', brand, 'BLOCK\nMATH');
      u.el('div', 'brand-tag', brand, 'SMALL\nTASKS\nBIGGER\nMINDS');
      u.el('i', 'brand-rule', brand);
      u.el('div', 'brand-links', brand, 'TOOLS\nSETTINGS\nHELP');
      const head = u.el('header', 'top', app),
        meta = u.el('div', 'module', head);
      u.el('span', '', meta, 'MODULE 01');
      u.el('strong', 'dialog-title', head, 'ADD THE BLOCKS');
      const progress = u.el('div', 'progress', head);
      u.el('span', '', progress, 'STEP 1 OF 1');
      u.el('i', '', progress);
      const main = u.el('div', 'center', app),
        stage = u.el('section', 'stage', main);
      const controls = u.el('section', 'task-drawer', main);
      const taskhead = u.el('div', 'drawer-head', controls);
      u.el('b', '', taskhead, 'Task controls');
      const show = u.el('button', 'show-controls', taskhead, 'Show controls');
      show.type = 'button';
      show.setAttribute('aria-expanded', 'false');
      show.addEventListener('click', () => {
        document.body.classList.toggle('controls-open');
        const open = document.body.classList.contains('controls-open');
        show.textContent = open ? 'Hide controls' : 'Show controls';
        show.setAttribute('aria-expanded', String(open));
        if (open) {
          const input = stage.querySelector('input');
          if (input) input.focus();
        }
      });
      const drawerBody = u.el('div', 'drawer-body', controls);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'submit episode-end end-' + placement, drawerBody, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', ctx.submit);
      }
      const collideR = ctx.rng.fork('chrome/collide');
      if (collideR.bool(0.3)) {
        const pool = endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (pool.length) {
          const label = collideR.pick(pool),
            decoy = u.el('button', 'chrome-xtra', head, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      const prefs = u.el('section', 'preferences', main);
      u.el('b', 'preferences-title', prefs, 'Preferences');
      const groups = u.el('div', 'pref-groups', prefs);
      function segmented(parent, title, labels, active) {
        const group = u.el('div', 'pref-group', parent);
        u.el('label', '', group, title);
        const row = u.el('div', 'segments', group);
        labels.forEach((label, i) => {
          const b = u.el('button', i === active ? 'active' : '', row, label);
          b.type = 'button';
          b.addEventListener('click', () => {
            row.querySelectorAll('button').forEach((x) => x.classList.remove('active'));
            b.classList.add('active');
          });
        });
      }
      segmented(groups, 'Theme', ['Light', 'Dark', 'System'], 0);
      segmented(groups, 'Text size', ['A', 'A', 'A'], 1);
      const sound = u.el('div', 'pref-group sound', groups);
      u.el('label', '', sound, 'Sounds');
      const toggle = u.el('button', 'toggle on', sound, '');
      toggle.type = 'button';
      toggle.setAttribute('aria-label', 'Toggle sounds');
      toggle.addEventListener('click', () => toggle.classList.toggle('on'));
      u.el('span', '', sound, 'On');
      if (ctx.display !== 'hidden') {
        const note = u.el('aside', 'instruction-note', document.body);
        u.el('span', 'note-kicker', note, 'FOCUS MODE');
        const copy = u.el('div', 'note-copy', note, ctx.display === 'hidden' ? '' : ctx.instruction);
        u.el('i', 'note-rule', note);
        u.el('span', 'note-foot', note, 'ONE STEP CLOSER');
        let fs = parseFloat(getComputedStyle(copy).fontSize);
        const over = () =>
          copy.scrollHeight > copy.clientHeight + 1 ||
          note.scrollHeight > note.clientHeight + 1 ||
          note.getBoundingClientRect().bottom > innerHeight - 8;
        while (fs > 11 && over()) {
          fs -= 1;
          copy.style.fontSize = fs + 'px';
        }
      }
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
