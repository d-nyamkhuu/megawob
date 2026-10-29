// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) =>
      function overlay(ctx) {
        const { K } = S;
        const { rng, util, kind } = ctx;
        const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
        el.dataset.role = 'overlay';
        if (kind === 'banner') {
          const header = document.querySelector('.ref-task');
          el.style.top = header.getBoundingClientRect().bottom + 'px';
        }
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        if (kind === 'promo') {
          util.el('div', 'ref-ov-heading', box, 'Stay Connected with Riverton Library');
          util.el('div', 'ref-ov-illustration', box);
        }
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        if (kind === 'promo') {
          const label = util.el('label', 'ref-ov-email', box, 'Email address');
          const email = util.el('input', '', label);
          email.type = 'text';
          email.setAttribute('aria-label', 'Email address');
        }
        const row = util.el('div', 'ref-ov-row', box);
        const btn = (label, how, primary) => {
          if (word && K.button[label]) label = word(K.button[label]);
          const b = util.el('button', primary ? 'ref-ov-btn ref-ov-primary' : 'ref-ov-btn', row, label);
          b.type = 'button';
          b.addEventListener('click', () => (how ? ctx.dismiss(how) : env.log('overlay-click', { label })));
          return b;
        };
        let dismiss;
        if (kind === 'cookie') {
          if (rng.bool(0.5)) btn('Settings', null, false);
          btn(rng.pick(['Reject all', 'Necessary only']), 'reject', false);
          dismiss = btn(rng.pick(['Accept all', 'Accept', 'Got it']), 'accept', true);
        } else if (kind === 'promo') {
          dismiss = btn(rng.pick(['No thanks', 'Maybe later', 'Close']), 'close', false);
          btn(rng.pick(['Upgrade now', 'Start trial', 'Learn more']), null, true);
        } else if (kind === 'banner') {
          dismiss = btn('Dismiss', 'close', false);
        } else {
          dismiss = btn('×', 'close', false);
          dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { lr, rng, util, word } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        {
          const title = rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
          brand.dataset.role = 'brand';
        }
        const engraving = util.el('div', 'ref-engraving', header);
        engraving.innerHTML =
          '<svg class="ref-campus-art" viewBox="0 0 420 76" aria-hidden="true"><g fill="none" stroke="#54483a" stroke-width="1.25" opacity=".72"><path d="M5 61h408M16 56l18-13 16 13M39 55l13-18 17 18M348 57l17-17 19 17M379 56l16-12 17 12"/><path d="M109 55V31l28-20 27 20v24M119 54V34h36v20M126 35v19m9-19v19m10-19v19m9-19v19M166 55V27h49v28M172 32h37M172 39h37M172 46h37m-30-14v28m13-28v28m13-28v28M216 55V24h44v31M222 29h32M222 36h32M222 43h32m-22-14v33m13-33v33M260 55V32h40v23M267 37h27m-27 7h27m-18-7v18m10-18v18"/><path d="M99 57h213M103 59h209M109 63h197M115 67h187M121 71h175"/><path d="M22 62q4-15 9-1m-5-10q-7-12-12-8m31 18q5-16 10-1m-5-10q8-13 13-9m298 19q5-16 10-1m-4-10q-6-13-12-8m28 19q4-14 10-1m-3-10q7-13 13-8"/></g><g fill="#746453" opacity=".35"><path d="M14 61q-8-17 3-20 0-12 9-8 8-8 12 3 11-2 10 11 10 8 3 14zM365 60q-9-14 1-18 0-13 9-9 7-9 13 2 10-2 10 11 10 7 3 14z"/></g></svg>';
        util.el('div', 'ref-engraving-caption', engraving, 'Knowledge Serves a Wider World');
        // Fine, muted etching rather than the workspace's geometric building icon.
        engraving.querySelector('svg').outerHTML = '<div class="ref-campus-art" aria-hidden="true"></div>';
        Object.assign(_c, { engraving, header });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { header, util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const bookplate = util.el('div', 'ref-books-plate', header);
        bookplate.innerHTML = '';
        const vendors = util.el('aside', 'ref-vendors', body);
        util.el('div', 'ref-vendors-title', vendors, 'Vendors');
        const vendorList = util.el('div', 'ref-vendor-list', vendors);
        for (const item of [
          'All Vendors',
          'Arcadia Books',
          'Beacon Press',
          'Delacroix Atelier',
          'Eastern Library Supply',
          'Franklin Media',
          'Garner & Co.',
          'Gupta Electronics',
          'Hillside Bindery',
          'Ivory Tower Books',
          'Juniper Systems',
          'Kensington Books',
          'Linden Periodicals',
          'Maple Leaf Books',
          'Northshore Press',
          'Oakridge Distribution',
          'Pinecrest Library Supply',
          'Quill & Stone',
          'Riverside Audio',
          'Summit Educational',
          'Tanglewood Books',
          'Union Scientific',
          'Valley Bargain Books',
          'Westbrook Inc.',
          'Yorkshire Media',
        ]) {
          const a = util.el('a', item === 'All Vendors' ? 'ref-vendor active' : 'ref-vendor', vendorList, item);
          a.href = '#';
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'vendor-index', label: item });
          });
        }
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, bookplate, vendorList, vendors });
      },
    'frame.toast': (base, S) =>
      function (_c) {
        const { body, closeLabel, ctx, display, util } = _c;
        const dock = util.el('nav', 'ref-library-dock', document.body);
        for (const [icon, text] of [
          ['▤', 'Catalog'],
          ['▥', 'Acquisitions'],
          ['♟', 'Circulation'],
          ['▧', 'Reports'],
          ['⚙', 'Administration'],
        ]) {
          const a = util.el('a', text === 'Acquisitions' ? 'ref-dock-item current' : 'ref-dock-item', dock);
          a.href = '#';
          const dockIcon = util.el('span', 'ref-dock-icon', a);
          const dockPaths = {
            Catalog:
              '<path d="M3 8v29l18 4 18-4V8M7 6c7-2 11 0 14 3 3-3 8-5 14-3v27c-6-2-11 0-14 3-3-3-8-5-14-3zM21 9v27"/>',
            Acquisitions:
              '<path d="M7 5h29v8H7q-5-4 0-8zm0 12h29v8H7q-5-4 0-8zm0 12h29v8H7q-5-4 0-8zM10 6v6m0 6v6m0 6v6M33 6v6m0 6v6m0 6v6"/>',
            Circulation:
              '<g fill="currentColor" stroke="none"><circle cx="16" cy="10" r="8"/><circle cx="31" cy="15" r="6"/><path d="M1 38v-6c0-15 29-15 29 0v6zm29-16c10-1 12 6 12 11v5h-9v-6c0-4-1-7-3-10z"/></g>',
            Reports: '<path d="M8 4h28v35H8zM4 9v30M12 9h7v8h-7zm11 1h9m-9 5h9M12 22h20m-20 5h20m-20 5h20"/>',
            Administration:
              '<path fill="currentColor" stroke="none" d="M17 2h9l1 6 4 2 5-3 6 7-4 5 1 4 6 2-2 9-6-1-3 4 1 6-9 3-3-6-5-1-4 5-8-5 2-6-2-4-6-1 1-9 6-1 3-4-2-6 8-4 4 5zm5 13a9 9 0 100 18 9 9 0 000-18z"/>',
          };
          dockIcon.innerHTML =
            '<svg viewBox="0 0 46 46" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
            dockPaths[text] +
            '</svg>';
          util.el('span', '', a, text);
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'library-nav', label: text });
          });
        }
        if (display === 'toast') {
          body.classList.add('ref-toast-note');
          const note = util.el('div', 'ref-note', document.body);
          util.el('div', 'ref-note-text', note, ctx.instruction);
          const x = util.el('button', 'ref-note-x', note, '×');
          x.type = 'button';
          x.setAttribute('aria-label', closeLabel);
          x.addEventListener('click', () => {
            note.style.visibility = 'hidden';
            env.log('note-close');
          });
        }
        Object.assign(_c, { dock });
      },
  };

  env.site({
    name: 'design-use-data-grid-bulk-03',
    template: 'site/base',
    design: { parts },
  });
})();
