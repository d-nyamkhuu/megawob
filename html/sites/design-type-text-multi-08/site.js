(function () {
  'use strict';
  const C = {
    site: 'design-type-text-multi-08',
    title: 'Form Entry Task',
    menus: ['File', 'Edit', 'View', 'Window', 'Help'],
    overview: 'Task Overview',
    section: 'Contact Information',
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
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endWords = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'footer' : er.pick(['header', 'left']);
      const endLabel = referenceEnd ? 'Submit' : er.pick(endWords);
      const cr = ctx.rng.fork('chrome/collide');
      const otherWords = endWords.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collide = cr.bool(0.3) && otherWords.length ? cr.pick(otherWords) : null;
      const bar = u.el('header', 'ds-top', document.body);
      const apple = u.el('span', 'ds-apple', bar);
      apple.innerHTML =
        '<svg viewBox="0 0 26 30"><defs><linearGradient id="apple-rainbow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#69a653"/><stop offset=".24" stop-color="#69a653"/><stop offset=".25" stop-color="#e6ce52"/><stop offset=".4" stop-color="#e6ce52"/><stop offset=".41" stop-color="#d88a43"/><stop offset=".55" stop-color="#d88a43"/><stop offset=".56" stop-color="#c55c62"/><stop offset=".7" stop-color="#c55c62"/><stop offset=".71" stop-color="#876ca4"/><stop offset=".85" stop-color="#876ca4"/><stop offset=".86" stop-color="#5894b8"/></linearGradient></defs><path d="M13 7c0-4 3-6 6-6 0 3-2 5-5 6M13 9C8 5 2 8 2 15c0 6 4 13 7 13 2 0 3-2 5-2s3 2 5 2c3 0 6-5 6-9-5-1-6-7-1-9-3-4-6-4-11-1Z" fill="url(#apple-rainbow)" stroke="#303245" stroke-width="1.4"/></svg>';
      C.menus.forEach((t) => u.el('span', 'ds-mi', bar, t));
      u.el('span', 'ds-grow', bar);
      u.el('span', 'ds-mi ds-clock', bar, '9:27 AM');
      const speaker = u.el('span', 'ds-spk', bar);
      speaker.innerHTML =
        '<svg viewBox="0 0 36 32"><path d="M3 12h6l9-8v24l-9-8H3Z" fill="#838597" stroke="#242536" stroke-width="2"/><path d="M22 10q7 6 0 12M26 6q11 10 0 20M30 3q13 13 0 26" fill="none" stroke="#242536" stroke-width="2"/></svg>';
      const win = u.el('div', 'ds-win', document.body);
      const tb = u.el('div', 'ds-title', win);
      ['a', 'b', 'c'].forEach(() => u.el('i', 'ds-box', tb));
      u.el('span', 'ds-stripes', tb);
      u.el('span', 'ds-ttext', tb, C.title);
      u.el('span', 'ds-stripes', tb);
      u.el('i', 'ds-box ds-zoom', tb);
      const over = u.el('section', 'ds-over', win);
      const doc = u.el('div', 'ds-docicon', over);
      doc.innerHTML =
        '<svg viewBox="0 0 96 122"><path d="M2 2h70l23 23v95H2Z" fill="#e1e3eb" stroke="#343649" stroke-width="2"/><path d="M72 2v23h23" fill="#c4c8d6" stroke="#343649" stroke-width="2"/><path d="M16 21h40M16 39h64M16 49h64M16 59h64M16 69h64M16 79h64M16 89h64M16 99h64" stroke="#8b92ae" stroke-width="3" stroke-dasharray="12 2 7 2"/></svg>';
      u.el('h2', 'ds-h', over, C.overview);
      over.classList.add('ds-display-' + ctx.display);
      if (ctx.display !== 'hidden') {
        const note = u.el('div', 'ds-note', over);
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      u.el('div', 'ds-split', win);
      const lower = u.el('section', 'ds-lower', win);
      u.el('h2', 'ds-h2', lower, C.section);
      const cardicon = u.el('div', 'ds-cardicon', lower);
      cardicon.innerHTML =
        '<svg viewBox="0 0 146 110"><path d="M2 2h142v106H2Z" fill="#dfe1e9" stroke="#343649" stroke-width="2"/><path d="M4 4h138v100H4Z" fill="none" stroke="#fff"/><rect x="17" y="18" width="48" height="55" fill="#a2abc9" stroke="#8a92ae"/><path d="M18 73v-7c1-6 12-7 14-13-7-5-6-12-4-18 2-12 19-12 22 0 3 6 2 13-4 18 2 6 13 7 16 13v7Z" fill="#515872"/><path d="M83 26h42M83 46h30M83 66h42" stroke="#4f536e" stroke-width="5"/><path d="M17 90h112" stroke="#8a90aa" stroke-width="4"/></svg>';
      const stage = u.el('main', 'ds-stage', lower);
      const foot = u.el('footer', 'ds-footer', lower);
      const clear = u.el('button', 'ds-btn ds-clear', foot, 'Clear All');
      clear.type = 'button';
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'ds-btn ds-submit ds-end-' + placement, placement === 'header' ? over : foot, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', () => ctx.submit());
      }
      if (collide) {
        const decoy = u.el('button', 'ds-btn ds-xtra', foot, collide);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
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
