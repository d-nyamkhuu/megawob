(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-autocomplete-09',
    'brand': 'Trip Details',
    'title': 'Destination',
    'instruction': 'top',
    'rail': '',
    'menu': '',
    'briefTitle': 'Instructions',
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
      const E = u.el;
      const sc = E('div', 'ds-scene', document.body);
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : 'header';
      let left = null;
      if (mode === 'header' || mode === 'panel') {
        left = E('aside', 'ds-left ds-note-' + mode, sc);
        if (mode === 'panel') {
          E('div', 'ds-panel-note-title', left, 'Your Task');
          E('div', 'ds-instruction', left, ctx.instruction);
        } else {
          E('div', 'ds-tag', left, 'Your Task');
          E('div', 'ds-instruction', left, ctx.instruction);
        }
      }
      if (mode === 'toast') {
        const n = E('aside', 'ds-toast', sc);
        E('div', 'ds-instruction', n, ctx.instruction);
      }
      const doc = E('div', 'ds-doc', sc);
      const hd = E('header', 'ds-head', doc);
      hd.innerHTML =
        '<svg class="ds-plane" viewBox="0 0 110 70"><path d="M46 29 30 5 38 2 67 19 64 24Z" fill="#bfd9ed"/><path d="M49 35 51 69 60 64 64 32Z" fill="#b3d4ed"/><path d="M3 49 11 48 85 12Q104 5 104 10Q101 15 93 18L18 51 7 59 5 53 0 51Z" fill="#e0eff8"/><path d="M11 48 89 13 99 10 95 16 19 51 7 56Z" fill="#c4e0f2"/><path d="M53 36 54 64 61 59 63 32Z" fill="#c6e2f5"/></svg>';
      E('div', 'ds-logo', hd, 'SkyWays');
      E('div', 'ds-logo2', hd, 'TRAVEL');
      E('div', 'ds-nav', hd, 'Plan  |  Search  |  Manage');
      const tab = E('div', 'ds-tab', doc);
      E('span', '', tab, 'Book a Flight');
      const bodyp = E('div', 'ds-docbody', doc);
      const tp = E('div', 'ds-panel-title', sc, 'Trip Details');
      [
        ['From', 'London (LHR)', 235, 1],
        ['Departure Date', 'Apr 12, 2025', 487, 2],
        ['Return Date', 'Apr 19, 2025', 557, 2],
        ['Passengers', '1 Adult', 628, 1],
        ['Class', 'Economy', 698, 1],
      ].forEach((r) => {
        const y = r[2];
        const l = E('div', 'ds-rl', sc, r[0]);
        l.style.top = 'calc(var(--u)*' + (y + 10) + ')';
        const f = E('div', 'ds-rf', sc, r[1]);
        f.style.top = 'calc(var(--u)*' + y + ')';
        const b = E('div', 'ds-rb', f);
        b.dataset.k = r[3];
        if (r[3] === 2)
          b.innerHTML =
            '<svg viewBox="0 0 30 32" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 5h24v24H3zM3 12h24M8 2v7M22 2v7"/><path stroke-width="3" stroke-dasharray="3 3" d="M7 17h17M7 23h17"/></svg>';
      });
      const sm = E('div', 'ds-sum', sc);
      E('div', 'ds-sum-t', sm, 'Trip Summary');
      [
        ['From', 'London (LHR)', 250],
        ['To', 'Not selected', 300],
        ['Departure', 'Apr 12, 2025', 394],
        ['Return', 'Apr 19, 2025', 445],
        ['Passengers', '1 Adult', 496],
        ['Class', 'Economy', 547],
      ].forEach((r) => {
        const a = E('div', 'ds-sk', sc, r[0]);
        a.style.top = 'calc(var(--u)*' + r[2] + ')';
        const b = E('div', 'ds-sv', sc, r[1]);
        b.style.top = 'calc(var(--u)*' + r[2] + ')';
        if (r[0] === 'To') b.dataset.role = 'destination-summary';
      });
      E('div', 'ds-sum-hr', sc);
      const stage = E('main', 'ds-stage', sc);
      const side = E('aside', 'ds-tools', sc);
      [
        [
          'Help',
          '<path d="M5 2h10l5 5v16H5zM15 2v6h5M8 12h9M8 16h9" fill="none" stroke="currentColor" stroke-width="1.7"/>',
        ],
        [
          'Settings',
          '<path d="m10 1 4 0 1 3 2 1 3-1 2 3-2 3v3l2 2-2 4-3-1-2 1-1 3h-4l-1-3-2-1-3 1-2-4 2-2v-3L2 7l2-3 3 1 2-1z" fill="currentColor"/><circle cx="12" cy="12" r="5" fill="#e1edf5"/>',
        ],
        [
          'Support',
          '<circle cx="12" cy="12" r="11" fill="currentColor"/><path d="M9 8c0-4 7-4 7 0 0 3-4 3-4 6M12 17v2" fill="none" stroke="#edf5fa" stroke-width="2.5"/>',
        ],
      ].forEach((t) => {
        const d = E('div', 'ds-tool', side);
        d.innerHTML = '<svg viewBox="0 0 24 26">' + t[1] + '</svg><span>' + t[0] + '</span>';
      });
      const foot = E('footer', 'ds-footer', sc);
      const cl = E('button', 'ds-hex ds-clear', foot, 'Clear');
      cl.type = 'button';
      const ff = E('button', 'ds-hex ds-find', foot, 'Find Flights');
      ff.type = 'button';
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const labels =
          ctx.content && Array.isArray(ctx.content.END_LABELS)
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete'];
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const words = [...new Set(labels.map(labelOf))];
        let placement = 'footer',
          label = 'Submit';
        if (!er.bool(0.5)) {
          const alternatives = words.filter((x) => x.trim().toLowerCase() !== 'submit');
          if (alternatives.length) label = er.pick(alternatives);
          placement = er.pick(['header', 'link']);
        }
        const end = (parent, cls, tag) => {
          const b = E(tag || 'button', cls, parent, placement === 'link' ? label + ' ›' : label);
          if (!tag || tag === 'button') b.type = 'button';
          else b.href = '#';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        if (placement === 'footer') submit = end(foot, 'ds-hex ds-submit');
        else if (placement === 'header') submit = end(hd, 'ds-end-header');
        else submit = end(sc, 'ds-end-link', 'a');
        const cr = ctx.rng.fork('chrome/collide');
        const alternatives = words.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (cr.bool(0.3) && alternatives.length) {
          const decoy = E('button', 'ds-xtra', foot, cr.pick(alternatives));
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent, collide: true }));
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
