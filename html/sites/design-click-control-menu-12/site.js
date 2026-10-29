(function () {
  'use strict';
  const libraryIcon = (window.refLibraryIcon = function (kind) {
    const shapes = {
      book: '<path d="M21 8C15 4 8 4 3 6v29c5-2 12-2 18 1 6-3 13-3 18-1V6c-5-2-12-2-18 2z" fill="url(#ivory)"/><path d="M21 8v28M5 7v25c5-1 10-1 14 1M37 7v25c-5-1-10-1-14 1" fill="none" stroke="#514534" stroke-width="1.2"/>',
      search:
        '<circle cx="17" cy="17" r="13" fill="#302e2570"/><circle cx="17" cy="17" r="11" fill="none" stroke="url(#ivory)" stroke-width="3.5"/><path d="m26 26 12 12" stroke="#332c23" stroke-width="7" stroke-linecap="round"/><path d="m26 26 11 11" stroke="url(#ivory)" stroke-width="5" stroke-linecap="round"/>',
      catalog:
        '<path d="M3 7q8-4 17 0 8-4 18 0v8H3zM2 18h34v9H2zM4 29h35v9H4z" fill="url(#ivory)"/><path d="M20 7v8M5 11h5M26 10h8M7 20v5M12 21v4M25 21h6M8 31v5M13 31v5M29 32h5" stroke-width="1"/><path d="M3 16h35M2 28h34M4 39h35" stroke="#0b0805"/>',
      account:
        '<rect x="6" y="2" width="29" height="37" rx="2" fill="url(#ivory)"/><path d="M11 10h18M11 16h18M11 22h18M11 28h12M27 29h3v4h-3" stroke="#332b22" stroke-width="2"/>',
      help: '<circle cx="21" cy="21" r="18" fill="url(#ivory)"/><text x="21" y="34" font-family="Georgia,serif" font-size="35" font-weight="bold" fill="#31281f" stroke="none" text-anchor="middle">?</text>',
      menuHelp:
        '<circle cx="21" cy="21" r="18" fill="url(#bronze)"/><text x="21" y="33" font-family="Georgia,serif" font-size="33" fill="#f8efdb" stroke="none" text-anchor="middle">?</text>',
      person:
        '<path d="M7 37v-5c0-7 6-12 14-12s14 5 14 12v5z" fill="url(#bronze)"/><ellipse cx="21" cy="12" rx="8" ry="10" fill="url(#ivory)"/><path d="M13 11c-2-11 16-14 16 1l-4-7-9 2z" fill="#776952"/><path d="m16 23 5 9 5-9M21 32v5" fill="none" stroke="#dfd3bb" stroke-width="1"/>',
      gear: '<path d="m18 3 6 0 1 5 4 2 5-2 4 5-3 4 1 5 4 3-2 6-5-1-4 3-1 5h-6l-2-5-4-1-4 3-4-4 2-5-2-4-5-1v-6l5-1 3-4-1-5 5-3 4 3z" fill="url(#bronze)"/><circle cx="21" cy="21" r="7" fill="#f4ecdc"/>',
      security:
        '<path d="M21 3C16 7 10 8 5 8v13c0 9 6 15 16 19 10-4 16-10 16-19V8c-5 0-11-1-16-5z" fill="url(#bronze)"/><path d="M21 8v25c-7-3-10-7-10-13v-8c3 0 7-2 10-4z" fill="#e8dfc9"/><path d="M21 8v25c7-3 10-7 10-13v-8c-3 0-7-2-10-4z" fill="#9c9078"/>',
      exit: '<path d="M9 5h23v33H9z" fill="url(#ivory)"/><path d="m11 5 17-3v37l-17-4z" fill="url(#bronze)"/><path d="m13 8 12-2v29l-12-3z" fill="none" stroke="#ddd1b6" stroke-width="1"/><circle cx="23" cy="23" r="1.6" fill="#e8dcc0"/><path d="M5 17h12m-4-4 4 4-4 4" fill="none" stroke="#6c6252" stroke-width="2"/>',
    };
    return (
      '<svg viewBox="0 0 42 42" aria-hidden="true" fill="none" stroke="#3b3329" stroke-width="1.4" stroke-linejoin="round"><defs><linearGradient id="ivory" x2="1" y2="1"><stop stop-color="#f1e9d5"/><stop offset=".55" stop-color="#d5cab1"/><stop offset="1" stop-color="#a19479"/></linearGradient><linearGradient id="bronze" x2="1" y2="1"><stop stop-color="#c4b79e"/><stop offset=".5" stop-color="#8b7e66"/><stop offset="1" stop-color="#635744"/></linearGradient></defs>' +
      shapes[kind] +
      '</svg>'
    );
  });
  const RAIL = [
    [
      'Search',
      175,
      '<svg viewBox="0 0 40 40"><circle cx="17" cy="17" r="10" fill="none" stroke="#f1e6d0" stroke-width="4"/><path d="M25 25l11 11" stroke="#f1e6d0" stroke-width="5" stroke-linecap="round"/></svg>',
    ],
    [
      'Catalog',
      315,
      '<svg viewBox="0 0 40 40" fill="none" stroke="#f1e6d0" stroke-width="2.5"><rect x="3" y="6" width="34" height="12"/><rect x="3" y="21" width="34" height="12"/><path d="M12 12h16M12 27h16"/></svg>',
    ],
    [
      'My Account',
      455,
      '<svg viewBox="0 0 40 40" fill="none" stroke="#f1e6d0" stroke-width="2.5"><rect x="8" y="4" width="24" height="32"/><path d="M13 13h14M13 19h14M13 25h14"/></svg>',
    ],
    [
      'Help',
      615,
      '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="#f1e6d0"/><text x="20" y="28" font-size="24" font-weight="700" text-anchor="middle" fill="#6a1428" font-family="Georgia,serif">?</text></svg>',
    ],
  ];
  const ROWS = [
    ['A Short History of the Middle Ages', 'Barber, Malcolm', '1999', 'Main Stacks'],
    ['Medieval Europe: Society and Culture', 'Duby, Georges', '1988', 'Main Stacks'],
    ['The Medieval World', 'McKitterick, Rosamond', '2001', 'Main Stacks'],
    ['Daily Life in Medieval Times', 'Clark, Marjorie', '1994', 'Reference'],
  ];
  env.site({
    name: 'design-click-control-menu-12',
    styles: ['site.css', 'lib.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref lib';
      const endRng = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const endPlacement = endRng.pick(['reference', 'reference', 'header', 'link']);
      const endLabel = endPlacement === 'reference' ? 'Submit' : endRng.pick(endLabels);
      const shell = u.el('main', 'shell', document.body);
      const rail = u.el('nav', 'rail', shell);
      u.el('div', 'rail-menu-bg', rail);
      const mdec = u.el('div', 'rail-item', rail);
      mdec.style.top = '0px';
      mdec.style.paddingTop = 'calc(28 * var(--u))';
      mdec.innerHTML = libraryIcon('book') + '<span>Menu</span>';
      RAIL.forEach((r, i) => {
        const d = u.el('div', 'rail-item', rail);
        d.style.top = 'calc(' + (r[1] - 20) + ' * var(--u))';
        d.innerHTML = libraryIcon(['search', 'catalog', 'account', 'help'][i]);
        u.el('span', '', d, r[0]);
      });
      const page = u.el('div', 'page', shell);
      const head = u.el('header', 'lhead', page);
      const logo = u.el('div', 'logo', head);
      logo.setAttribute('aria-hidden', 'true');
      const tt = u.el('div', 'ltitle', head);
      u.el('h1', '', tt, 'Riverton Public Library');
      u.el('div', 'tag', tt, 'Books  •  Knowledge  •  A Brighter Tomorrow');
      const nav = u.el('div', 'lnav', head);
      nav.innerHTML =
        '<span>Catalog</span><i>|</i><span>Hours</span><i>|</i><span>Contact</span><div class="est">Est. 1896</div>';
      u.el('div', 'rule', page);
      const center = u.el('section', 'center', page);
      const note = u.el('div', 'instruction', center, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', center);
      const body = u.el('div', 'lbody', page);
      const s = u.el('div', 'lsearch', body);
      u.el('h2', '', s, 'Search the Catalog');
      const f = u.el('div', 'lform', s);
      f.innerHTML =
        '<div class="kw"><label>Keyword(s):</label><div class="fld">medieval history</div></div><div class="sel w1"><label>Material Type:</label><div class="fld">All Types<b>▼</b></div></div><div class="sel w2"><label>Publication Year:</label><div class="fld">Any Year<b>▼</b></div></div><div class="sel w3"><label>Sort By:</label><div class="fld">Relevance<b>▼</b></div></div><div class="sbtn">Search</div>';
      const low = u.el('div', 'llow', body);
      const res = u.el('div', 'lres', low);
      u.el('h2', '', res, 'Search Results');
      u.el('p', 'cnt', res, '4 results for “medieval history”');
      const tb = u.el('table', '', res);
      tb.innerHTML =
        '<thead><tr><th>Title</th><th>Author</th><th>Year</th><th>Location</th></tr></thead><tbody>' +
        ROWS.map(
          (r) =>
            '<tr><td class="ti">' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td></tr>',
        ).join('') +
        '</tbody>';
      const det = u.el('aside', 'ldet', low);
      u.el('h2', '', det, 'Item Details');
      const dr = u.el('div', 'drow', det);
      dr.innerHTML =
        '<div class="cover"><span>A SHORT<br>HISTORY<br>OF THE<br>MIDDLE AGES</span><em><svg viewBox="0 0 86 30" fill="none" stroke="currentColor"><path d="M43 4q-7 3-7 11t7 11q7-3 7-11T43 4zM43 9l5 6-5 6-5-6zM36 14C15-5 6 25 28 17c-12-13-20 10-29-2 10-8 14 10 28 1M50 14C71-5 80 25 58 17c12-13 20 10 29-2-10-8-14 10-28 1M36 18C26 8 17 2 11 12M50 18C60 8 69 2 75 12"/></svg></em><i class="corner c1">⌜</i><i class="corner c2">⌝</i><i class="corner c3">⌞</i><i class="corner c4">⌟</i></div><div class="meta"><h3>A Short History of the Middle Ages</h3><dl><dt>Author:</dt><dd>Barber, Malcolm</dd><dt>Year:</dt><dd>1999</dd><dt>Format:</dt><dd>Book</dd><dt>Location:</dt><dd>Main Stacks</dd><dt>Call Number:</dt><dd>D 105 .B37 1999</dd><dt>Status:</dt><dd class="av">Available</dd></dl></div>';
      u.el('div', 'drule', det);
      const acts = u.el('div', 'acts', det);
      const qa = u.el('button', 'qa', acts, 'Quick action');
      qa.type = 'button';
      qa.disabled = true;
      const addl = u.el('button', 'addl', acts, 'Add to List');
      addl.type = 'button';
      addl.addEventListener('click', () => env.log('decoy', { label: 'Add to List' }));
      let submit = null;
      if (!ctx.finish) {
        const parent = endPlacement === 'reference' ? det : endPlacement === 'header' ? head : page;
        submit = u.el(endPlacement === 'link' ? 'a' : 'button', 'submit end-' + endPlacement, parent, endLabel);
        if (endPlacement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        if (endPlacement === 'header') head.classList.add('has-end');
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const other = endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (other.length) {
          const label = collideRng.pick(other);
          const decoy = u.el('button', 'end-xtra', page, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
