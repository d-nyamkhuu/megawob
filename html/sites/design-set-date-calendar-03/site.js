(function () {
  'use strict';
  const C = {
    'site': 'design-set-date-calendar-03',
    'app': 'Calendar Manager',
    'doc': 'New Meeting',
    'menus': ['File', 'Edit', 'View', 'Options'],
    'task': 'Task',
  };
  const SUN =
    '<svg viewBox="0 0 44 44"><g transform="translate(22 22) rotate(-45)" fill="none" stroke="#183583" stroke-width="2.1"><path id="sun-u" d="M-14-14h11v11h-8v-8h5v5h-2M-14-11v11h14"/><use href="#sun-u" transform="rotate(90)"/><use href="#sun-u" transform="rotate(180)"/><use href="#sun-u" transform="rotate(270)"/></g></svg>';
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const endR = ctx.rng.fork('chrome/end');
      const collideR = ctx.rng.fork('chrome/collide');
      const display = ctx.display || 'header';
      const win = u.el('div', 'ol-win', document.body);
      const tb = u.el('header', 'ol-title', win);
      const logo = u.el('span', 'ol-logo', tb);
      logo.innerHTML = SUN + '<i>Sun</i>';
      const tt = u.el('span', 'ol-ttext', tb);
      u.el('span', '', tt, C.app);
      u.el('span', 'ol-dash', tt, '-');
      u.el('b', '', tt, C.doc);
      const wb = u.el('span', 'ol-wbtns', tb);
      u.el('span', 'ol-wb min', wb);
      u.el('span', 'ol-wb max', wb);
      u.el('span', 'ol-wb cls', wb);
      const mb = u.el('nav', 'ol-menu', win);
      C.menus.forEach((m) => {
        const s = u.el('span', '', mb);
        s.innerHTML = '<u>' + m[0] + '</u>' + m.slice(1);
      });
      const hp = u.el('span', 'ol-help', mb);
      hp.innerHTML = '<u>H</u>elp';
      let submit = null;
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
      const endLabel = labelOf(endR.pick(labels));
      const placements = ['footer', 'footer', 'footer', 'header', 'link', 'icon'];
      const placement = ctx.finish ? null : endR.pick(placements);
      let collide = null;
      if (collideR.bool(0.3)) {
        const same = (x) => labelOf(x).trim().toLowerCase() === endLabel.trim().toLowerCase();
        const choices = [...new Set(labels.map(labelOf).filter((x) => !same(x)))];
        if (choices.length) collide = { label: collideR.pick(choices), where: collideR.pick(['header', 'footer']) };
      }
      const endBtn = (parent, cls, text) => {
        const b = u.el(placement === 'link' ? 'a' : 'button', cls, parent, text);
        b.type = 'button';
        if (b.tagName === 'A') b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const decoyBtn = (parent, text) => {
        const b = u.el('button', 'ol-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      if (placement === 'header') submit = endBtn(mb, 'ol-end-head', endLabel);
      if (placement === 'icon') submit = endBtn(mb, 'ol-end-icon', '✓');
      if (collide && collide.where === 'header') decoyBtn(mb, collide.label);
      if (display === 'header') {
        const note = u.el('div', 'ol-instruction-strip', win, ctx.instruction);
        note.setAttribute('aria-label', 'Task instruction');
      }
      const main = u.el('div', 'ol-main', win);
      const stage = u.el('main', 'ds-stage', main);
      const pane = u.el('aside', 'ol-task', main);
      u.el('div', 'ol-taskhead', pane, C.task);
      const bodyp = u.el('div', 'ol-taskbody', pane);
      if (display === 'panel') u.el('div', 'ds-instruction ds-instruction-panel', bodyp, ctx.instruction);
      if (display === 'toast') u.el('div', 'ds-instruction ds-instruction-toast', bodyp, ctx.instruction);
      const foot = u.el('footer', 'ol-foot', pane);
      if (placement === 'footer') submit = endBtn(foot, 'ds-submit', endLabel);
      if (placement === 'link') submit = endBtn(foot, 'ol-end-link', endLabel + ' ›');
      if (collide && collide.where === 'footer') {
        decoyBtn(foot, collide.label);
        foot.classList.add('ol-foot-pq');
      }
      if (ctx.finish || ((placement === 'header' || placement === 'icon') && !(collide && collide.where === 'footer')))
        pane.classList.add('ol-no-footer');
      return { stage, submit: ctx.finish ? null : submit };
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
