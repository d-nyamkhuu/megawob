(function () {
  'use strict';
  const C = { site: 'design-act-in-time-simon-12', brand: 'Memory Trainer' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util,
        root = document.body;
      root.classList.add('yosemite');
      const top = u.el('header', 'ds-top', root);
      u.el('span', 'ds-traffic', top, '● ● ●');
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', 'ds-window-tools', top, '');
      const tabs = u.el('nav', 'ds-menu', root);
      const pref = u.el('button', 'ds-tab active', tabs, '⚙  Preferences');
      pref.type = 'button';
      const task = u.el('button', 'ds-tab', tabs, '▶  Task');
      task.type = 'button';
      const content = u.el('div', 'ds-content', root);
      const shelf = u.el('div', 'ds-prefview', content);
      const instruction = ctx.instruction;
      const display = ctx.display;
      root.dataset.display = display;
      u.el('h1', '', shelf, 'Preferences');
      u.el('p', 'ds-subtitle', shelf, 'Customize your experience. These settings do not start the task.');
      if (display !== 'hidden') u.el('p', 'ds-task-instruction', shelf, instruction);
      const prefs = [
        [
          'Sound',
          [
            ['Play sounds', true],
            ['Mute all audio', false],
          ],
        ],
        [
          'Display',
          [
            ['Show button labels', true],
            ['High contrast mode', false],
          ],
        ],
        [
          'Timing',
          [
            ['Show countdown', true],
            ['Longer pause between steps', false],
          ],
        ],
      ];
      prefs.forEach((section, idx) => {
        const row = u.el('section', 'ds-prefrow', shelf);
        u.el('div', 'ds-prefname', row, section[0]);
        const choices = u.el('div', 'ds-checks', row);
        section[1].forEach(([label, on]) => {
          const line = u.el('label', 'ds-checkline', choices);
          const box = u.el('input', '', line);
          box.type = 'checkbox';
          box.checked = on;
          u.el('span', '', line, label);
        });
        if (idx === 0) {
          const volume = u.el('div', 'ds-volume', row);
          u.el('span', '', volume, 'Volume:');
          const range = u.el('input', '', volume);
          range.type = 'range';
          range.value = '70';
          u.el('span', '', volume, '70%');
        }
      });
      const theme = u.el('section', 'ds-prefrow ds-theme-row', shelf);
      u.el('div', 'ds-prefname', theme, 'Theme');
      const select = u.el('button', 'ds-theme-select', theme, 'Light (Default)');
      select.type = 'button';
      u.el('span', 'ds-select-arrows', select, '⌃⌄');
      const main = u.el('div', 'ds-main', content);
      if (display === 'panel') {
        const note = u.el('aside', 'ds-brief', main);
        u.el('h2', '', note, 'Task');
        u.el('div', 'ds-instruction', note, instruction);
      }
      const stage = u.el('main', 'ds-stage', main);
      if (display === 'toast') {
        const note = u.el('aside', 'ds-toast', content);
        u.el('div', 'ds-instruction', note, instruction);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, '');
      const er = ctx.rng.fork('chrome/end-control');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const oldPlacement = er.pick(['footer', 'footer', 'toolbar', 'link']);
      const endR = ctx.rng.fork('chrome/end');
      const varied = endR.bool(0.5);
      const labels = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
      ];
      const endLabel = varied ? labelOf(endR.pick(labels)) : 'Submit';
      const placement = varied ? endR.pick(['toolbar', 'footer', 'link', 'titlebar', 'ledger']) : oldPlacement;
      let submit = null;
      if (!ctx.finish) {
        const parent =
          placement === 'toolbar' ? tabs : placement === 'titlebar' ? top : placement === 'ledger' ? content : foot;
        const extra =
          placement === 'titlebar' ? ' ds-submit-titlebar' : placement === 'ledger' ? ' ds-submit-ledger' : '';
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'ds-submit' +
            (placement === 'toolbar' ? ' ds-submit-tool' : '') +
            (placement === 'link' ? ' ds-submit-link' : '') +
            extra,
          parent,
          endLabel,
        );
        if (submit.tagName === 'A') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      if (er.bool(0.3)) {
        const decoys = ['Help', 'Save draft', 'History', 'Feedback'];
        const label = decoys[er.int(0, decoys.length - 1)];
        const d = u.el('button', 'ds-xtra', tabs, label);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.addEventListener('click', () => env.log('decoy', { label }));
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const pool = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (pool.length) {
          const collide = cr.pick(pool);
          const parent = cr.pick([tabs, tabs, foot]);
          const d = u.el('button', 'ds-xtra', parent, collide);
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
        }
      }
      task.addEventListener('click', () => {
        pref.classList.remove('active');
        task.classList.add('active');
        root.classList.add('task-selected');
        shelf.innerHTML = '';
        u.el('h1', '', shelf, 'Task');
        u.el('p', 'ds-subtitle', shelf, 'Sequence controls and round status appear in the preview.');
        if (display !== 'hidden') u.el('p', 'ds-task-instruction', shelf, instruction);
      });
      pref.addEventListener('click', () => {
        task.classList.remove('active');
        pref.classList.add('active');
        root.classList.remove('task-selected');
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
