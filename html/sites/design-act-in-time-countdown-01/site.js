(function () {
  'use strict';
  const C = { site: 'design-act-in-time-countdown-01' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const win = u.el('div', 'lib-window', document.body);
      const top = u.el('header', 'lib-titlebar', win);
      u.el('span', 'lib-mini-icon', top, '');
      u.el('strong', '', top, 'Riverton Community Library');
      const meta = u.el('div', 'lib-window-meta', top);
      let submit = null,
        placement = null,
        label = 'Submit';
      const makeSubmit = (parent, cls) => {
        const b = u.el('button', cls, parent);
        b.textContent = label;
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (!ctx.finish) {
        const fallback = [
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
        const labels =
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : fallback;
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const er = ctx.rng.fork('chrome/end');
        const original = er.bool(0.5);
        label = original ? 'Apply' : labelOf(er.pick(labels));
        placement = original ? 'shelf' : er.pick(['shelf', 'title', 'status']);
        const collideRng = ctx.rng.fork('chrome/collide');
        if (collideRng.bool(0.3)) {
          const pool = labels.map(labelOf).filter((x) => String(x).trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) {
            const d = u.el('button', 'lib-pq', meta, String(collideRng.pick(pool)));
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
          }
        }
        ['−', '□', '×'].forEach((t) => {
          const b = u.el('button', 'lib-window-btn', meta, t);
          b.type = 'button';
        });
        if (placement === 'title') submit = makeSubmit(meta, 'lib-submit lib-submit-title');
      }
      const menu = u.el('nav', 'lib-menubar', win);
      ['File', 'Edit', 'View', 'Go', 'Tools', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const toolbar = u.el('nav', 'lib-toolbar', win);
      [
        ['⌂', 'Home'],
        ['▤', 'Catalog'],
        ['▦', 'My Account'],
        ['▦', 'Reservations'],
        ['?', 'Help'],
      ].forEach(([i, t]) => {
        const a = u.el('div', 'lib-tool', toolbar);
        u.el('b', '', a, i);
        u.el('span', '', a, t);
      });
      const banner = u.el('section', 'lib-banner', win);
      const building = u.el('div', 'lib-building', banner, '');
      building.innerHTML =
        '<svg viewBox="0 0 420 240" aria-hidden="true"><path fill="#556b47" d="M14 221Q105 210 205 220t201-2v13H14z"/><g fill="#24452e" stroke="#263b2b" stroke-width="2"><circle cx="52" cy="116" r="43"/><circle cx="80" cy="79" r="31"/><circle cx="108" cy="118" r="42"/><circle cx="324" cy="126" r="39"/><circle cx="353" cy="92" r="34"/><circle cx="382" cy="139" r="38"/></g><g fill="#65794e"><circle cx="38" cy="105" r="29"/><circle cx="84" cy="68" r="25"/><circle cx="117" cy="108" r="32"/><circle cx="323" cy="116" r="29"/><circle cx="356" cy="83" r="26"/><circle cx="385" cy="132" r="30"/></g><path fill="#9a7544" stroke="#342e23" stroke-width="5" d="M114 88 210 25l98 63-18 13H132z"/><path fill="#ddcca0" stroke="#342e23" stroke-width="4" d="M132 99h155v92H132z"/><path fill="#70583a" d="M119 89h181v13H119z"/><path fill="#ddd0ae" stroke="#493a2b" stroke-width="3" d="M190 46h39v39h-39z"/><path fill="#86704b" d="m190 47 19-14 20 14z"/><g fill="#395f55" stroke="#493a2b" stroke-width="3"><path d="M144 113h26v39h-26zM178 113h26v39h-26zM216 113h26v39h-26zM250 113h25v39h-25z"/><path d="M194 142h31v49h-31z"/></g><g fill="#d6bc7d"><path d="M148 117h18v4h-18zM182 117h18v4h-18zM220 117h18v4h-18zM254 117h17v4h-17z"/></g><path fill="#b08d55" stroke="#493a2b" stroke-width="3" d="M121 190h176v12H121zM108 202h202v10H108z"/><g fill="#3e5639"><path d="M20 195h78l-8 15H16zM311 190h85l9 18h-99z"/></g><g fill="#8f9a57"><circle cx="28" cy="187" r="7"/><circle cx="44" cy="193" r="6"/><circle cx="388" cy="184" r="7"/><circle cx="371" cy="195" r="6"/></g></svg>';
      const center = u.el('div', 'lib-banner-center', banner);
      const title = u.el('h1', '', center, 'Riverton Community Library');
      title.setAttribute('aria-hidden', 'true');
      u.el('div', 'lib-tagline', center, 'Books　•　People　•　A Stronger Community');
      u.el('div', 'lib-books', banner, '');
      const links = u.el('div', 'lib-links', banner);
      ['Reading Programs', 'Local Events', 'Library Hours', 'Community Links'].forEach((t) =>
        u.el('div', '', links, '❖　' + t),
      );
      const mode = ctx.display || 'header';
      const workspace = u.el('div', 'lib-workspace', win);
      const list = u.el('aside', 'lib-list', workspace);
      u.el('h2', '', list, 'Popular Items');
      if (mode !== 'hidden') {
        const note = u.el('aside', 'lib-note lib-note-' + mode, mode === 'panel' ? list : banner);
        u.el('b', '', note, mode === 'panel' ? 'Task note' : '');
        u.el('div', '', note, ctx.instruction);
      }
      const table = u.el('div', 'lib-table', list);
      const th = u.el('div', 'lib-table-head', table);
      u.el('span', '', th, 'Title');
      u.el('span', '', th, 'Type');
      const items = [
        ['▣', 'The Wind in the Willows', 'Book'],
        ['▣', 'Charlotte’s Web', 'Book'],
        ['▣', 'A Brief History of Time', 'Book'],
        ['▣', 'The Joy of Cooking', 'Book'],
        ['▤', 'National Geographic', 'Magazine'],
        ['▤', 'Time', 'Magazine'],
        ['▤', 'Garden Life', 'Magazine'],
        ['▣', 'The Concert (DVD)', 'Video'],
        ['▣', 'Baseball Highlights (VHS)', 'Video'],
        ['◉', 'World Atlas', 'Reference'],
        ['▣', 'Computers for Beginners', 'Book'],
        ['◉', 'Healthy Living', 'Book'],
        ['▣', 'Mystery Month Club', 'Book'],
        ['▤', 'Science Today', 'Magazine'],
      ];
      items.forEach((row, i) => {
        const r = u.el('div', 'lib-row' + (!i ? ' selected' : ''), table);
        u.el('span', 'lib-item-icon', r, row[0]);
        u.el('span', 'lib-item-name', r, row[1]);
        u.el('span', '', r, row[2]);
      });
      const area = u.el('section', 'lib-reservation', workspace);
      u.el('h2', '', area, 'Make a Reservation');
      const stage = u.el('main', 'ds-stage', area);
      const status = u.el('footer', 'lib-status', win);
      u.el('span', '', status, '');
      if (!ctx.finish && placement === 'shelf') submit = makeSubmit(status, 'lib-submit');
      if (!ctx.finish && placement === 'status') submit = makeSubmit(status, 'lib-submit lib-submit-status');
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
