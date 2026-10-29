(function () {
  'use strict';
  const C = {
    site: 'design-type-text-password-05',
    rail: [
      ['Home', 'M4 16 L17 4 L30 16 V30 H4Z', '#b5442c'],
      ['Search', 'M14 4a9 9 0 1 0 0 18a9 9 0 1 0 0-18M21 21 L31 31', '#4a6a8a'],
      ['Categories', 'M2 10H14L17 14H32V30H2Z', '#e3b52e'],
      ['News', 'M5 4H29V30H5ZM9 9H25M9 14H25M9 19H25M9 24H25', '#445'],
      ['Mail', 'M3 8H31V28H3ZM3 8L17 20L31 8', '#2c6ab0'],
      [
        'People',
        'M10 6a5 5 0 1 0 0 10a5 5 0 1 0 0-10M24 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8M2 30V22H18V30M18 30V24H31V30',
        '#3f8a3a',
      ],
      ['Reference', 'M7 6H27V22H7ZM4 22H30V30H4Z', '#4a3a9a'],
      ['Help', 'M17 3a14 14 0 1 0 0 28a14 14 0 1 0 0-28', '#1b3fcf'],
    ],
    cats: [
      ['Arts & Humanities', ['Literature', 'History', 'Philosophy', 'Visual Arts', 'Performing Arts'], 287],
      ['Business & Economy', ['Companies', 'Investing', 'Employment', 'Small Business', 'Industry News'], 293],
      ['Computers & Internet', ['Software', 'Hardware', 'Networking', 'Programming', 'Web Resources'], 306],
      ['Science & Technology', ['Science', 'Space', 'Engineering', 'Medicine', 'Environmental Science'], 308],
      ['Society & Culture', ['People', 'Government', 'Education', 'Health', 'Travel', 'Recreation'], 297],
    ],
    foot: ['Home', 'Search', 'Categories', 'News', 'Mail', 'People', 'Reference', 'Help'],
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
      const NS = 'http://www.w3.org/2000/svg';
      const page = u.el('div', 'ds-page', document.body);
      const rail = u.el('aside', 'ds-rail', page);
      const logo = u.el('div', 'ds-logo', rail);
      const g = document.createElementNS(NS, 'svg');
      g.setAttribute('viewBox', '0 0 80 80');
      g.setAttribute('class', 'ds-globe');
      g.innerHTML =
        '<defs><clipPath id="globe-edge"><circle cx="40" cy="40" r="36"/></clipPath></defs><circle cx="40" cy="40" r="36" fill="#073baa" stroke="#eee" stroke-width="1.2"/><g clip-path="url(#globe-edge)" fill="#52c51a" stroke="#132925" stroke-width="1.2" stroke-linejoin="miter"><path d="M9 24L14 18L20 17L22 12L28 10L33 13L36 9L40 10L40 15L35 19L31 18L29 23L24 26L26 29L20 34L22 38L17 40L14 36L12 37L9 32Z"/><path d="M20 40L25 39L29 43L32 44L32 49L39 50L45 54L47 58L43 63L42 68L37 70L34 76L29 74L30 67L29 62L26 57L28 52L22 49Z"/><path d="M40 8L46 7L49 11L47 15L43 15L42 19L38 17L37 13Z"/><path d="M49 14L55 12L60 16L62 20L66 21L70 28L66 31L62 28L58 30L58 35L53 35L49 30L44 29L45 24L50 24L51 21L47 19Z"/><path d="M65 36L72 36L76 44L73 50L71 57L67 56L66 50L61 48L60 41Z"/><path d="M24 9L29 7L30 11L27 14L24 13ZM33 29L37 27L40 29L38 32L35 32Z"/></g><circle cx="40" cy="40" r="36" fill="none" stroke="#ddd" stroke-width="1"/>';
      logo.appendChild(g);
      u.el('div', 'ds-logotext', logo, 'WorldWeb Directory');
      const icons = [
        '<path fill="#fff2bd" d="M5 15H28V32H5Z"/><path fill="#d93919" d="M2 16L16 2L31 16L29 19L16 7L4 19Z"/><path fill="#fff" d="M24 2H28V12H24Z"/><path fill="#c58b3b" d="M13 20H20V32H13Z"/><path fill="#bde8ff" d="M8 17H12V23H8ZM23 17H27V23H23Z"/><path fill="#8acefa" d="M13 12V17H19V12Z"/><path stroke="#fff" d="M7 29V19M4 16L16 4L29 16"/>',
        '<path fill="#bfbfb4" d="M20 20L30 30L28 33L17 23Z"/><path fill="#ddd" d="M21 23L28 30"/><path fill="#a5dbef" d="M3 8L7 3L14 2L20 6L23 13L20 19L14 23L7 21L2 15Z"/><path fill="#fff" stroke="none" d="M7 6H11V17H7Z"/><path fill="none" stroke="#6b8798" d="M5 7L8 5H15L19 9L20 15L17 19"/>',
        '<path fill="#fff2a4" d="M2 6H13L16 9H30V31H2Z"/><path fill="#dbc369" d="M3 12H31V31H3Z"/><path fill="#fff6bb" stroke="none" d="M4 13H29V16H4Z"/><path fill="none" stroke="#fff" d="M3 29V8H12M5 11H28"/>',
        '<path fill="#fafafa" d="M3 2H30V32H3Z"/><path fill="#ddd" d="M6 6H27V29H6Z"/><path fill="#444" stroke="none" d="M7 7H13V15H7ZM16 7H25V9H16ZM16 11H25V12H16ZM16 14H25V15H16ZM7 18H25V19H7ZM7 21H25V22H7ZM7 24H25V25H7ZM7 27H25V28H7Z"/>',
        '<path fill="#d7f1fc" d="M2 5H31V29H2Z"/><path fill="#fff" d="M3 6L16 19L30 6Z"/><path fill="none" stroke="#477288" d="M3 28L13 17M30 28L20 17"/><path stroke="#fff" d="M4 8V25"/>',
        '<path fill="#252218" d="M5 3L10 1L14 4V13H4ZM21 4L26 2L30 6V16H20Z"/><path fill="#e8b272" d="M6 5H12V12H6ZM22 6H28V14H22Z"/><path fill="#2b983d" d="M3 14L7 12L13 14L17 27H2Z"/><path fill="#e6a225" d="M19 16L23 13L29 16L33 28H18Z"/><path fill="#202016" d="M12 14L17 11L21 15V23H12Z"/><path fill="#e7b779" d="M14 16H19V23H14Z"/><path fill="#49b74f" d="M11 25L15 22L20 24L24 33H9Z"/><path stroke="#fff" d="M5 17L3 24M21 19L20 24M12 28L11 31"/>',
        '<path fill="#1529d0" d="M4 20H29L32 27V33H2V25Z"/><path fill="#c9caca" d="M6 3L22 1L29 5V21L21 27L6 23Z"/><path fill="#fff" d="M8 5L21 3L25 6L12 9Z"/><path fill="#7c9bad" d="M10 10H21V20H10Z"/><path fill="#eee" d="M23 9L27 7V20L23 23Z"/><path fill="#ffff8a" d="M7 28H26V31H7Z"/><path stroke="#fff" d="M3 25H8M12 12V18"/>',
        '<path fill="#0045db" d="M16 1L24 3L30 10L32 18L29 26L24 32L15 34L7 31L2 24L1 15L5 7L10 3Z"/><path fill="none" stroke="#71b5ff" d="M5 19L6 10L13 5L20 4"/><path fill="none" stroke="#fff" stroke-width="3" d="M11 12Q11 7 16 7Q23 7 22 13L17 19V23M17 26V29"/>',
      ];
      C.rail.forEach(([t, d, col], i) => {
        const r = u.el('div', 'ds-rl', rail);
        r.style.top = 'calc(var(--u)*' + (183 + i * 66) + ')';
        const s = document.createElementNS(NS, 'svg');
        s.setAttribute('viewBox', '0 0 34 34');
        s.setAttribute('class', 'ds-ico');
        s.innerHTML = '<g stroke="#242424" stroke-width="1" stroke-linejoin="miter">' + icons[i] + '</g>';
        r.appendChild(s);
        u.el('span', 'ds-lk', r, t);
      });
      const main = u.el('div', 'ds-main', page);
      u.el('div', 'ds-title', main, 'Global Directory');
      u.el('div', 'ds-sub', main, 'Your Guide to the Internet');
      const sb = u.el('div', 'ds-search', main);
      u.el('div', 'ds-sl', sb, 'Search the Web:');
      u.el('div', 'ds-sin', sb);
      u.el('div', 'ds-sbtn', sb, 'Search');
      const ln = u.el('div', 'ds-sl2', sb);
      ['Advanced Search', 'Site Map', 'Add a Site'].forEach((t, i) => {
        if (i) u.el('span', 'ds-bar', ln, '|');
        u.el('span', 'ds-a', ln, t);
      });
      u.el('div', 'ds-date', main, 'Wed, Apr 22, 1998');
      u.el('div', 'ds-rule', main).style.top = 'calc(var(--u)*142)';
      const cats = u.el('div', 'ds-cats', main);
      C.cats.forEach(([h, items, w]) => {
        const c = u.el('div', 'ds-cat', cats);
        c.style.width = 'calc(var(--u)*' + w + ')';
        const head = u.el('div', 'ds-cath', c);
        u.el('span', '', head, h);
        items.forEach((t) => u.el('div', 'ds-catl', c, t));
      });
      u.el('div', 'ds-rule', main).style.top = 'calc(var(--u)*394)';
      u.el('div', 'ds-band', main, 'Account Setup');
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : 'top';
      if (mode !== 'hidden') {
        const b = u.el('aside', mode === 'top' ? 'ds-header-note' : mode === 'toast' ? 'ds-toast' : 'ds-brief', main);
        const ins = u.el('div', 'ds-instruction', b, ctx.instruction);
        const n = String(ctx.instruction || '').length;
        if (n > 90) ins.style.fontSize = 'calc(var(--u)*34)';
        ins.style.lineHeight = '1.06';
      }
      u.el(
        'div',
        'ds-intro',
        main,
        'Create a password for your new account. Your password helps keep your information private.',
      );
      const stage = u.el('main', 'ds-stage', main);
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const bank =
          ctx.content && Array.isArray(ctx.content.END_LABELS)
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const alternatives = bank.filter((x) => String((x && (x.label || x.text || x.name)) || x) !== 'Submit');
        const original = er.bool(0.5);
        const placement = original ? 'form' : er.pick(['header', 'footer', 'link']);
        const choice = original ? 'Submit' : er.pick(alternatives.length ? alternatives : bank);
        const label =
          typeof choice === 'string'
            ? choice
            : String((choice && (choice.label || choice.text || choice.name)) || choice);
        submit = u.el(
          'button',
          placement === 'form'
            ? 'ds-submit'
            : placement === 'header'
              ? 'ds-submit ds-submit-head'
              : 'ds-submit ds-submit-foot',
          main,
          label,
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', () => ctx.submit());
        if (placement === 'link') {
          submit.className = 'ds-endlink';
          submit.textContent = label + ' ›';
        }
        const cn = u.el('button', 'ds-cancel', main, 'Cancel');
        cn.type = 'button';
      }
      if (!ctx.finish) {
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const labels =
            ctx.content && Array.isArray(ctx.content.END_LABELS)
              ? ctx.content.END_LABELS
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
          const endText = (x) => (typeof x === 'string' ? x : String((x && (x.label || x.text || x.name)) || x));
          const own = submit.className === 'ds-endlink' ? submit.textContent.replace(/ ›$/, '') : submit.textContent;
          const options = labels.map(endText).filter((x) => x && x !== own);
          if (options.length) {
            const d = u.el('button', 'ds-pq', main, endText(cr.pick(options)));
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
          }
        }
      }
      u.el('div', 'ds-rule', main).style.top = 'calc(var(--u)*890)';
      const fl = u.el('div', 'ds-foot', main);
      C.foot.forEach((t, i) => {
        if (i) u.el('span', 'ds-bar', fl, '|');
        u.el('span', 'ds-a', fl, t);
      });
      const fr = u.el('div', 'ds-foot ds-footr', main);
      ['About Global Directory', 'Contact Us'].forEach((t, i) => {
        if (i) u.el('span', 'ds-bar', fr, '|');
        u.el('span', 'ds-a', fr, t);
      });
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
