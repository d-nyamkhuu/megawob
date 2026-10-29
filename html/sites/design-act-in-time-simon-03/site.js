(function () {
  'use strict';
  const C = { site: 'design-act-in-time-simon-03' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util,
        r = ctx.rng,
        content = ctx.content;
      const body = u.el('div', 'ds-body', document.body);
      const contentBox = u.el('div', 'ds-content', body);
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : 'header';
      document.body.dataset.simonbrief = mode;
      const header = u.el('header', 'ds-header', contentBox);
      u.el('div', 'ds-brand', header, 'MEMORY PAD');
      if (mode === 'header') {
        const b = u.el('section', 'ds-header-note', header);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        u.el('div', 'ds-subline', b, 'Watch the sequence, then repeat it.');
      }
      const main = u.el('div', 'ds-main', contentBox);
      const stage = u.el('main', 'ds-stage', main);
      const aside = u.el('aside', 'ds-console', main);
      if (mode === 'panel') {
        const b = u.el('section', 'ds-panel-note', aside);
        u.el('h2', '', b, 'INSTRUCTION');
        u.el('div', 'ds-instruction', b, ctx.instruction);
      } else if (mode === 'toast') {
        const b = u.el('section', 'ds-toast', contentBox);
        u.el('div', 'ds-instruction', b, ctx.instruction);
      }
      u.el('h2', 'ds-console-title', aside, 'STATUS');
      u.el('div', 'ds-console-state', aside, 'Watch…');
      const read1 = u.el('div', 'ds-readout', aside);
      u.el('span', '', read1, 'STEP');
      u.el('b', '', read1, '1 / 4');
      const read2 = u.el('div', 'ds-readout', aside);
      u.el('span', '', read2, 'ROUND');
      u.el('b', '', read2, '1');
      u.el('div', 'ds-seq-title', aside, 'SEQUENCE');
      const dots = u.el('div', 'ds-dots', aside);
      for (let i = 0; i < 4; i++) {
        const d = u.el('i', 'ds-dot', dots);
        if (i === 0) d.classList.add('active');
      }
      u.el('div', 'ds-small-note', aside, 'Repeat the colors in order.');
      const foot = u.el('footer', 'ds-footer', contentBox);
      u.el('span', 'ds-footer-label', foot, 'READY');
      let submit = null;
      if (!ctx.finish) {
        const placements = ['footer', 'footer', 'footer', 'header', 'link', 'icon'];
        const place = r.fork('chrome/end-placement').pick(placements),
          labelR = r.fork('chrome/end-label'),
          endLabels = content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const label = String(
          labelR.bool(0.5)
            ? 'Submit'
            : labelR.pick(
                endLabels.filter((x) => String(x).toLowerCase() !== 'submit').length
                  ? endLabels.filter((x) => String(x).toLowerCase() !== 'submit')
                  : endLabels,
              ),
        );
        const btn = (parent, cls, text) => {
          const b = u.el(cls === 'ds-end-link' ? 'a' : 'button', cls, parent, text);
          if (b.tagName === 'BUTTON') b.type = 'button';
          else b.href = '#';
          b.dataset.role = 'submit';
          b.title = label;
          b.setAttribute('aria-label', label);
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        const extra = content.DECOY_LABELS || ['Help', 'Save draft', 'History', 'Share'];
        const decoy = (parent, text, collide) => {
          const b = u.el('button', 'ds-xtra', parent, text);
          b.type = 'button';
          b.addEventListener('click', () =>
            env.log('decoy', collide ? { label: text, collide: true } : { label: text }),
          );
        };
        const cr = r.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = endLabels.map(String).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) decoy(foot, String(cr.pick(pool)), true);
        } else if (cr.bool(0.25)) decoy(foot, String(cr.pick(extra)), false);
        if (place === 'footer') submit = btn(foot, 'ds-submit', label);
        else if (place === 'link') submit = btn(foot, 'ds-end-link', label + ' ›');
        else if (place === 'icon') submit = btn(header, 'ds-submit ds-icon', '✓');
        else submit = btn(header, 'ds-submit', label);
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
