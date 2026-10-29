(function () {
  'use strict';
  const C = { site: 'design-act-in-time-simon-10' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util,
        top = u.el('header', 'ds-top', document.body);
      const brand = u.el('div', 'ds-brand', top);
      u.el('span', 'ds-mark', brand, '▦');
      u.el('b', '', brand, 'WorkSuite');
      u.el('i', 'ds-divider', brand, '');
      u.el('span', '', brand, 'Training & Assessment');
      const meta = u.el('div', 'ds-meta', top);
      u.el('span', '', meta, 'User: Alex Chen');
      u.el('span', '', meta, 'Role: Trainee');
      u.el('span', '', meta, 'Session: TS-4821');
      u.el('span', '', meta, 'Help');
      u.el('span', '', meta, 'Sign Out');
      const frame = u.el('div', 'ds-frame', document.body),
        tabs = u.el('nav', 'ds-tabs', frame);
      [
        ['1', 'Task'],
        ['2', 'Results'],
        ['3', 'Resources'],
      ].forEach((x, i) => {
        const t = u.el('div', 'ds-tab' + (i === 0 ? ' active' : ''), tabs);
        u.el('b', '', t, x[0]);
        u.el('span', '', t, x[1]);
      });
      u.el('strong', 'ds-program', tabs, 'Cognitive Skills Program');
      const bar = u.el('div', 'ds-titlebar', frame);
      u.el('b', '', bar, 'Sequence Recall');
      u.el('span', '', bar, 'Exercise 1 of 3');
      const content = u.el('div', 'ds-content', frame),
        width = document.documentElement.clientWidth,
        height = document.documentElement.clientHeight;
      let mode = ctx.display;
      if (mode === 'panel' && (width < 1180 || height < 680)) mode = 'header';
      if (mode === 'toast' && (width < 1100 || height < 680)) mode = 'header';
      function note(parent, cls) {
        const n = u.el('div', cls, parent, ctx.instruction);
        n.setAttribute('role', 'note');
        return n;
      }
      if (mode === 'header') note(content, 'ds-instruction ds-instruction-header');
      if (mode === 'panel') note(content, 'ds-instruction ds-instruction-panel');
      if (mode === 'toast') note(content, 'ds-instruction ds-instruction-toast');
      const stage = u.el('main', 'ds-stage', content);
      const foot = u.el('footer', 'ds-footer', frame);
      u.el('span', 'ds-ready', foot, ctx.finish ? 'Session ready' : 'Assessment workspace');
      if (ctx.finish) foot.dataset.finish = 'true';
      let submit = null;
      if (!ctx.finish) {
        const r = ctx.rng.fork('chrome/end'),
          labels = (ctx.content && ctx.content.END_LABELS) || [
            'Submit',
            'Done',
            'Finish',
            'Continue',
            'Save',
            'OK',
            'Confirm',
            'Apply',
          ];
        const picked = r.pick(labels),
          label = typeof picked === 'string' ? picked : picked.label || picked.text || picked.name || 'Submit',
          legacyPlace = r.int(0, 2),
          placementR = ctx.rng.fork('chrome/end/placement');
        const placement =
            legacyPlace === 0 || (legacyPlace === 1 && placementR.bool(0.5))
              ? 'footer'
              : placementR.pick(['header', 'link', 'icon']),
          holder = placement === 'header' || placement === 'icon' ? tabs : foot;
        const shown = placement === 'icon' ? '✓' : placement === 'link' ? label + ' ›' : label;
        submit = u.el(
          'button',
          placement === 'header'
            ? 'ds-submit ds-submit-head'
            : placement === 'link'
              ? 'ds-submit ds-submit-link'
              : placement === 'icon'
                ? 'ds-submit ds-submit-head ds-submit-icon'
                : 'ds-submit',
          holder,
          shown,
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', () => ctx.submit());
        const collides = r.fork('chrome/collide');
        if (collides.bool(0.3)) {
          const same = (x) => String(x).trim().toLowerCase() === label.trim().toLowerCase();
          const alternatives = labels
            .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || ''))
            .filter((x) => x && !same(x));
          if (alternatives.length) {
            const text = collides.pick(alternatives),
              where = collides.pick(['tabs', 'foot']),
              parent = where === 'tabs' ? tabs : foot,
              d = u.el('button', where === 'tabs' ? 'ds-xtra ds-xtra-head' : 'ds-xtra', parent, text);
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
        }
        const fillerR = r.fork('chrome/filler'),
          fillers = (ctx.content && ctx.content.DECOY_LABELS) || [
            'Help',
            'Feedback',
            'Preview',
            'Save draft',
            'Reset view',
            'Share',
            'Export',
            'History',
          ];
        if (fillerR.bool(0.24)) {
          const raw = fillerR.pick(fillers),
            text = typeof raw === 'string' ? raw : raw.label || raw.text || raw.name || 'Help',
            inTabs = placement === 'header' || placement === 'icon',
            d = u.el(
              'button',
              inTabs ? 'ds-xtra ds-filler ds-xtra-head' : 'ds-xtra ds-filler',
              inTabs ? tabs : foot,
              text,
            );
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.addEventListener('click', () => env.log('decoy', { label: text }));
        }
      }
      document.body.dataset.simonbrief = mode;
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
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
