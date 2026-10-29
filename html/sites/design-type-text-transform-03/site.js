(function () {
  'use strict';
  const C = {
    'site': 'design-type-text-transform-03',
    'brand': 'Text Workshop',
    'instruction': 'top',
    'rail': [
      ['Text', 'M4 1h12l6 7v17H4zM16 1v7h6M7 7h5v1H7zM7 11h12v1H7zM7 15h12v1H7zM7 19h12v1H7z'],
      [
        'Transform',
        'M10 1h4l.6 2.6 2 .9 2.3-1.3 2.8 2.8-1.3 2.3.9 2L24 11v4l-2.7.6-.8 2 1.3 2.3-2.8 2.8-2.3-1.3-2 .9L14 25h-4l-.6-2.7-2-.9-2.3 1.3-2.8-2.8 1.3-2.3-.9-2L0 15v-4l2.7-.6.9-2L2.3 6 5.1 3.2l2.3 1.3 2-.9zM12 7a6 6 0 1 0 0 12 6 6 0 0 0 0-12z',
      ],
      ['Format', 'M4 2h20v5h-2v19H3V5zM6 7h13v2H6zM6 12h13v2H6zM6 17h13v2H6zM6 22h13v1H6z'],
      ['Tools', 'M15 1a7 7 0 0 0-6 10L1 21q-1 2 2 4t4-1l8-11a7 7 0 0 0 9-9l-5 5-5-3z'],
      ['Help', 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17v.5'],
    ],
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      /* Preserve any task-controlled initial focus and caret. */ const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      const logo = u.el('span', 'ds-logo', top, 'T');
      u.el('span', 'ds-brand', top, C.brand);
      const wc = u.el('span', 'ds-wc', top);
      ['_', '□', '×'].forEach((t) => u.el('i', '', wc, t));
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      C.rail.forEach((r, i) => {
        const it = u.el('div', 'ds-rail-item' + (i === 0 ? ' on' : ''), rail);
        it.innerHTML =
          '<svg viewBox="-1 0 27 27" stroke-linejoin="round" stroke-linecap="round"><defs><linearGradient id="brass-icon" x2=".6" y2="1"><stop stop-color="#f2dc9e"/><stop offset=".45" stop-color="#c5a666"/><stop offset="1" stop-color="#a7884b"/></linearGradient></defs><path fill-rule="evenodd" d="' +
          r[1] +
          '"/><path fill="none" stroke="#edd79c" stroke-width=".32" transform="translate(-.3,-.3)" d="' +
          r[1] +
          '"/></svg>';
        if (i === 4)
          it.querySelector('svg').innerHTML =
            '<circle cx="12" cy="12" r="11" fill="url(#brass-icon)" stroke="#36260e"/><circle cx="12" cy="12" r="8.8" fill="#382915" stroke="#d8bd7b"/><text x="12" y="19" text-anchor="middle" fill="#e0c68b" stroke="none" font-family="Georgia" font-size="21">?</text>';
        u.el('span', '', it, r[0]);
      });
      const content = u.el('div', 'ds-content', body);
      const head = u.el('div', 'ds-head', content);
      u.el('span', 'ds-head-title', head, 'Text Tools');
      u.el('em', '', head, 'Simple text tasks. Solid results.');
      const endR = ctx.rng.fork('chrome/end');
      const originalEnd = endR.bool(0.5);
      const endPlace = originalEnd ? 'footer' : endR.pick(['head', 'link']);
      const endLabels = (
        (ctx.content && ctx.content.END_LABELS) || [
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
        ]
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
      const endLabel = originalEnd ? 'Submit' : endR.pick(endLabels.filter((x) => x.toLowerCase() !== 'submit'));
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const options = [...new Set(endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase()))];
        if (options.length) collide = collideR.pick(options);
      }
      let submit = null;
      const endBtn = (parent, cls, label, tag) => {
        const b = u.el(tag || 'button', cls, parent, label);
        if (tag === 'a') b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const decoyBtn = (parent, label) => {
        const b = u.el('button', 'ds-chrome-xtra', parent, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        return b;
      };
      if (!ctx.finish && endPlace === 'head') {
        head.querySelector('em').remove();
        submit = endBtn(head, 'ds-chrome-end', endLabel);
      }
      const frame = u.el('div', 'ds-frame', content);
      ['tl', 'tr', 'bl', 'br'].forEach((c) => u.el('i', 'ds-screw ' + c, frame));
      const mode = ctx.display;
      if (mode === 'panel') frame.classList.add('panel-mode');
      if (mode !== 'hidden') {
        const b = u.el(
          'aside',
          mode === 'toast' ? 'ds-toast' : mode === 'panel' ? 'ds-panel-note' : 'ds-header-note',
          frame,
        );
        const instruction = u.el('div', 'ds-instruction', b, ctx.instruction);
        if (mode !== 'panel' && ctx.instruction.length > 42)
          instruction.style.fontSize = 4.6 * Math.sqrt(34 / ctx.instruction.length) + 'vw';
      }
      const main = u.el('div', 'ds-main', frame);
      const stage = u.el('main', 'ds-stage', main);
      stage.dataset.sourceInstruction = ctx.plainInstruction || ctx.instruction;
      const foot = u.el('footer', 'ds-footer', frame);
      if (!ctx.finish && endPlace !== 'head') {
        if (endPlace === 'link') submit = endBtn(foot, 'ds-chrome-link', endLabel + ' >', 'a');
        else submit = endBtn(foot, 'ds-submit', endLabel);
        if (endPlace === 'footer') ['tl', 'tr', 'bl', 'br'].forEach((c) => u.el('i', 'ds-screw ' + c, submit));
      }
      if (collide) {
        if (endPlace === 'head') decoyBtn(foot, collide);
        else decoyBtn(head, collide);
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
