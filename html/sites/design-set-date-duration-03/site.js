(function () {
  'use strict';
  const C = { site: 'design-set-date-duration-03' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const body = u.el('div', 'ds-body', document.body);
      const win = u.el('div', 'cad-window', body);
      const title = u.el('header', 'cad-titlebar', win);
      u.el('span', 'cad-gear', title, '✿');
      u.el('span', 'cad-title', title, 'Machining Operation');
      const controls = u.el('div', 'cad-window-controls', title);
      u.el('span', '', controls, '—');
      u.el('span', '', controls, '□');
      u.el('span', 'cad-close', controls, '×');
      const top = u.el('section', 'cad-summary', win);
      top.innerHTML =
        '<svg class="cad-drawing" viewBox="0 0 1030 362" preserveAspectRatio="none" aria-hidden="true"><defs><pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="#244056" stroke-width=".65" opacity=".55"/></pattern></defs><rect width="1030" height="362" fill="url(#grid)"/><g fill="none" stroke="#a9def0" stroke-width="2"><path d="M82 122h90v130H82zM172 132h60v110h-60zM232 122h20l12 12v108l-12 12h-20zM264 150h73v52h-73z"/><path d="M75 113v-31h260v31M75 79H335M75 68v22M335 68v22M69 122H42v130h27M42 122v130M82 186h255" stroke-dasharray="10 3 2 3"/><circle cx="490" cy="180" r="106"/><circle cx="490" cy="180" r="70" stroke-dasharray="7 4"/><circle cx="490" cy="180" r="40"/><circle cx="490" cy="91" r="11"/><circle cx="579" cy="180" r="11"/><circle cx="490" cy="269" r="11"/><circle cx="401" cy="180" r="11"/><path d="M490 51v258M351 180h278" stroke-dasharray="12 4 3 4"/></g><g fill="none" stroke="#f2d36c" stroke-width="1.5"><path d="M75 76v-9m260 9v-9M78 67h254M42 122h-8m8 130h-8M34 125v124M385 303v14m210-14v14M388 316h204"/><path d="M90 63l-12 4 12 4m230-8 12 4-12 4M30 136l4-11 4 11m-8 102 4 11 4-11M397 312l-9 4 9 4m191-8 9 4-9 4"/></g><g fill="#f5df88" font-family="monospace" font-size="17"><text x="196" y="57">120.0</text><text x="13" y="191">Ø50.0</text><text x="453" y="339">Ø70.0</text><text x="570" y="56">4 × Ø8.0</text><text x="344" y="194">Ø30.0</text></g><path d="M650 0v362M650 0H1030M650 361H1030" stroke="#637d90"/><g fill="#e0e9f2" font-family="monospace" font-size="17"><text x="680" y="70">Part No.</text><text x="817" y="70">AX-2307</text><text x="680" y="103">Revision</text><text x="817" y="103">B</text><text x="680" y="136">Material</text><text x="817" y="136">AISI 1045</text><text x="680" y="169">Process</text><text x="817" y="169">CNC Turning</text><text x="680" y="202">Operation</text><text x="817" y="202">OP-10 Face &amp; Turn</text><text x="680" y="235">Setup</text><text x="817" y="235">1</text><text x="680" y="268">Work Offset</text><text x="817" y="268">G54</text></g><rect x="862" y="27" width="150" height="225" fill="#101d2b" stroke="#61788b"/><g transform="translate(882 75)" fill="url(#metal)" stroke="#b8c5cf"><defs><linearGradient id="metal"><stop stop-color="#526171"/><stop offset=".3" stop-color="#d8dce0"/><stop offset=".6" stop-color="#707b88"/><stop offset="1" stop-color="#c5cbd1"/></linearGradient></defs><ellipse cx="60" cy="56" rx="28" ry="50"/><path d="M28 8h57v96H28z"/><ellipse cx="85" cy="56" rx="28" ry="50"/><path d="M84 26h37v60H84z"/><ellipse cx="121" cy="56" rx="17" ry="30"/><circle cx="121" cy="56" r="7" fill="#13202d"/></g></svg>';
      const main = u.el('main', 'cad-main', win);
      const stage = u.el('section', 'ds-stage', main);
      const help = u.el('aside', 'cad-help', main);
      u.el('h2', '', help, 'Duration');
      u.el('p', '', help, 'Enter the estimated time for this operation using hours and minutes.');
      u.el('div', 'cad-rule', help);
      u.el('h3', '', help, 'Tips');
      const ul = u.el('ul', '', help);
      [
        'Use the arrow buttons or type a value.',
        'Hours can be 0 or greater.',
        'Minutes must be between 0 and 59.',
        'You can also choose a preset duration for common values.',
      ].forEach((x) => u.el('li', '', ul, x));
      if (ctx.display !== 'hidden') {
        const note = u.el(
          'div',
          ctx.display === 'panel' ? 'ds-brief' : ctx.display === 'toast' ? 'ds-toast' : 'cad-instruction',
          win,
        );
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      const foot = u.el('footer', 'cad-footer', win);
      const endRng = ctx.rng.fork('chrome/end');
      const bank =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      let placement = null,
        label = 'Done';
      if (!ctx.finish) {
        const options = bank.map(labelOf).filter((x) => x.trim().toLowerCase() !== 'submit');
        if (endRng.bool(0.5)) placement = 'footer';
        else {
          label = options.length ? endRng.pick(options) : 'Done';
          placement = endRng.pick(['footer', 'footer', 'header', 'link']);
        }
      }
      let submit = null;
      const addEnd = (parent, cls, text, link) => {
        const b = u.el(link ? 'a' : 'button', cls, parent, text);
        if (link) b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (placement === 'footer') submit = addEnd(foot, 'ds-submit', label, false);
      if (placement === 'header') submit = addEnd(title, 'ds-end-header', label, false);
      if (placement === 'link') submit = addEnd(foot, 'ds-end-link', label + ' ›', true);
      if (!ctx.finish) {
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const words = bank.map(labelOf).filter((x) => x.toLowerCase() !== label.toLowerCase());
          if (words.length) {
            const text = cr.pick(words),
              d = u.el('button', 'ds-xtra', foot, text);
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
        }
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
