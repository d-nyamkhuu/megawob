(function () {
  'use strict';
  const C = { site: 'design-act-in-time-moving-11' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'banner' },
    frame(ctx) {
      const u = ctx.util,
        b = document.body;
      b.classList.add('gem-desktop');
      const menu = u.el('header', 'gem-menu', b);
      ['Desk', 'File', 'View', 'Options'].forEach((x) => u.el('span', '', menu, x));
      u.el('span', 'gem-date', menu, 'Mon  Apr 14  1986   10:24');
      const icons = u.el('aside', 'gem-icons', b);
      [
        ['▣', 'FLOPPY DISK'],
        ['▱', 'DOCUMENTS'],
        ['▱', 'GAMES'],
      ].forEach((x) => {
        const i = u.el('div', 'gem-icon', icons);
        u.el('b', '', i, x[0]);
        u.el('small', '', i, x[1]);
      });
      const trash = u.el('div', 'gem-trash', b);
      u.el('b', '', trash, '▤');
      u.el('small', '', trash, 'TRASH');
      const win = u.el('section', 'gem-window', b);
      const title = u.el('div', 'gem-titlebar', win);
      u.el('span', 'gem-gadget', title, '−');
      u.el('strong', '', title, 'Shape Clicker');
      u.el('span', 'gem-gadget', title, '×');
      u.el('div', 'gem-announcement-space', win);
      const d = ctx.display;
      let note = null;
      if (d === 'header') {
        note = u.el('div', 'gem-instruction', win, ctx.instruction);
      } else if (d === 'panel') {
        note = u.el('div', 'gem-panel-note', win, ctx.instruction);
      } else if (d === 'toast') {
        note = u.el('div', 'gem-toast-note', win, ctx.instruction);
      }
      const stage = u.el('main', 'gem-stage', win);
      if (note && d === 'panel') stage.classList.add('gem-with-panel-note');
      if (note && d === 'toast') stage.classList.add('gem-with-toast-note');
      const foot = u.el('footer', 'gem-foot', win);
      u.el(
        'span',
        'gem-foot-note',
        foot,
        d === 'hidden' ? 'Shape Clicker' : 'Click the shapes on the board. They move automatically.',
      );
      const r = ctx.rng.fork('chrome/end');
      let submit = null;
      const decoy = (parent, label, collide) => {
        const x = u.el('button', 'gem-xtra', parent, label);
        x.type = 'button';
        x.addEventListener('click', () => env.log('decoy', collide ? { label, collide: true } : { label }));
      };
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
      const referenceEnd = r.bool(0.5);
      const label = referenceEnd ? 'Submit' : r.pick(labels);
      const choices = ['footer', 'link', 'icon'];
      const place = ctx.finish ? null : referenceEnd ? 'window' : r.pick(choices);
      if (place === 'window') {
        submit = u.el('button', 'gem-submit gem-window-submit', win, label);
      } else if (place === 'footer') {
        submit = u.el('button', 'gem-submit', foot, label);
      } else if (place === 'link') {
        submit = u.el('a', 'gem-endlink', foot, label + ' ›');
        submit.href = '#';
      } else if (place === 'icon') {
        submit = u.el('button', 'gem-submit gem-icon-submit', foot, '✓');
        submit.title = label;
        submit.setAttribute('aria-label', label);
      }
      if (submit) {
        if (submit.tagName === 'BUTTON') submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const coll = r.fork('chrome/collide');
      if (!ctx.finish && coll.bool(0.3)) {
        const alt = labels.filter((x) => String(x).toLowerCase() !== String(label).toLowerCase());
        if (alt.length) decoy(foot, coll.pick(alt), true);
      }
      if (ctx.finish && place === null) foot.classList.add('gem-finish');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'gem-announcement', document.body);
      el.dataset.role = 'overlay';
      u.el('div', 'gem-info-icon', el, 'i');
      const copy = u.el('div', 'gem-announcement-copy', el);
      u.el('h2', '', copy, 'System Maintenance Today');
      u.el('p', '', copy, 'The system will be updated later this morning.');
      u.el('p', '', copy, 'You can continue using this application.');
      const dismiss = u.el('button', 'gem-collapse', el, 'Collapse');
      dismiss.setAttribute('aria-label', 'Collapse announcement');
      dismiss.addEventListener('click', () => {
        ctx.dismiss('close');
      });
      return { el, dismiss, ttlSteps: 0 };
    },
  });
})();
