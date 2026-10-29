(function () {
  'use strict';
  const C = { site: 'design-act-in-time-simon-11' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'promo' },
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-appicon', top);
      u.el('span', 'ds-brand', top, 'Memory Pads');
      const controls = u.el('div', 'ds-window-controls', top);
      ['−', '□', '×'].forEach((t, i) => u.el('span', 'ds-window-control c' + i, controls, t));
      const frame = u.el('div', 'ds-frame', document.body);
      const content = u.el('div', 'ds-content', frame);
      const main = u.el('div', 'ds-main', content);
      const brief = u.el('aside', 'ds-brief', main);
      u.el('h1', '', brief, 'Pattern Recall');
      if (ctx.display !== 'hidden' && ctx.display !== 'toast') {
        const instruction = u.el('div', 'ds-instruction', brief, ctx.instruction);
        instruction.dataset.mode = ctx.display;
      }
      u.el(
        'div',
        'ds-copy',
        brief,
        'A sequence of pads will light up. After the sequence finishes, click the pads in the same order.',
      );
      const readout = u.el('div', 'ds-readout', brief);
      u.el('div', 'ds-readout-line', readout, 'Round: 1');
      u.el('div', 'ds-readout-line', readout, 'Sequence length: 3');
      u.el('div', 'ds-readout-line', readout, 'Status: Watch…');
      const stage = u.el('main', 'ds-stage', main);
      if (ctx.display === 'toast' && ctx.instruction) {
        const n = u.el('div', 'ds-toast', brief);
        u.el('div', '', n, ctx.instruction);
        brief.insertBefore(n, brief.querySelector('.ds-copy'));
      }
      const foot = u.el('footer', 'ds-footer', content);
      const tools = u.el('div', 'ds-toolstrip', foot);
      const start = u.el('button', 'ds-tool ds-start', tools);
      u.el('span', 'ds-tool-icon', start, '▶');
      const starttext = u.el('span', 'ds-tool-text', start);
      u.el('b', '', starttext, 'Start');
      u.el('small', '', starttext, 'New Game');
      start.type = 'button';
      start.addEventListener('click', () => env.log('decoy', { label: 'Start' }));
      const reset = u.el('button', 'ds-tool ds-reset', tools);
      u.el('span', 'ds-tool-icon', reset, '⟳');
      const resettext = u.el('span', 'ds-tool-text', reset);
      u.el('b', '', resettext, 'Reset');
      u.el('small', '', resettext, 'Clear Progress');
      reset.type = 'button';
      reset.addEventListener('click', () => env.log('decoy', { label: 'Reset' }));
      const sound = u.el('div', 'ds-sound', tools);
      const bars = u.el('span', 'ds-sound-icon', sound);
      [1, 2, 3].forEach(() => u.el('i', '', bars));
      u.el('span', 'ds-tool-text', sound, 'Sound');
      const check = u.el('span', 'ds-check', sound, '✓');
      u.el('span', '', sound, 'On');
      let submit = null;
      if (!ctx.finish) {
        const holder = u.el('div', 'ds-submit-holder', foot);
        submit = u.el('button', 'ds-submit', holder, 'Submit');
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.addEventListener('click', () => ctx.submit());
      }
      if (submit) {
        const er = ctx.rng.fork('chrome/end');
        const bank = ctx.content && ctx.content.END_LABELS;
        const label =
          er.float() < 0.5
            ? 'Submit'
            : bank && bank.length
              ? er.pick(bank)
              : er.pick(['Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']);
        submit.textContent = label;
        const place = er.pick(['footer', 'footer', 'footer', 'title', 'link', 'icon']);
        if (place === 'title') {
          submit.parentElement.remove();
          controls.appendChild(submit);
          submit.className = 'ds-top-end';
        } else if (place === 'link') {
          submit.className = 'ds-end-link';
        } else if (place === 'icon') {
          submit.className = 'ds-submit ds-end-icon';
          submit.textContent = '✓';
          submit.title = label;
          submit.setAttribute('aria-label', label);
        }
        const cr = ctx.rng.fork('chrome/collide');
        const collBank = ctx.content && ctx.content.END_LABELS;
        if (cr.float() < 0.3 && collBank && collBank.length) {
          const pool = [
            ...new Set(
              collBank
                .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
                .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase()),
            ),
          ];
          if (pool.length) {
            const text = cr.pick(pool);
            const decoy = u.el('button', 'ds-pq', top, text);
            top.insertBefore(decoy, controls);
            decoy.type = 'button';
            decoy.dataset.role = 'xtra';
            decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const title = u.el('header', 'ds-update-title', el);
      u.el('span', 'ds-update-logo', title, '✦');
      u.el('b', '', title, 'Windows Update');
      const x = u.el('button', 'ds-update-x', title, '×');
      x.type = 'button';
      x.setAttribute('aria-label', 'Close');
      x.addEventListener('click', () => ctx.dismiss('close'));
      const body = u.el('div', 'ds-update-body', el);
      const shield = u.el('span', 'ds-shield', body);
      shield.innerHTML =
        '<svg viewBox="0 0 64 76" aria-hidden="true"><defs><linearGradient id="vista-shield" x2="1" y2="1"><stop stop-color="#fff4ae"/><stop offset=".5" stop-color="#ffc63e"/><stop offset="1" stop-color="#da8a08"/></linearGradient></defs><path d="M32 3C23 10 14 13 4 15L6 41C8 55 17 65 32 73C47 65 56 55 58 41L60 15C50 13 41 10 32 3Z" fill="#aebbc1" stroke="#3d4850" stroke-width="3"/><path d="M32 8C24 14 17 16 9 18L11 40C13 52 20 61 32 67C44 61 51 52 53 40L55 18C47 16 40 14 32 8Z" fill="url(#vista-shield)" stroke="#fff0a0" stroke-width="2"/><path d="M32 9V66C21 60 14 52 12 40L10 19C18 17 25 14 32 9Z" fill="#fff" opacity=".18"/><path d="M28 22H36L34.5 45H29.5ZM28.5 51H35.5V58H28.5Z" fill="#253c47"/></svg>';
      const message = u.el('div', 'ds-update-message', body);
      u.el('b', '', message, 'New updates are available');
      u.el('p', '', message, 'Keep your computer more secure and performant with the latest updates from Microsoft.');
      const actions = u.el('div', 'ds-update-actions', el);
      const later = u.el('button', 'ds-remind', actions, 'Remind me later');
      later.type = 'button';
      later.addEventListener('click', () => ctx.dismiss('close'));
      const view = u.el('button', 'ds-view-updates', actions, 'View updates');
      view.type = 'button';
      view.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss: later };
    },
  });
})();
