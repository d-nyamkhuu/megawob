(function () {
  'use strict';
  const C = { 'site': 'design-find-fact-similar-12' };
  const NAV = [
    'Arts',
    'Business',
    'Computers',
    'Education',
    'Entertainment',
    'Health',
    'News',
    'Recreation',
    'Reference',
    'Society',
    'Travel',
  ];
  function links(u, parent, list, cls) {
    list.forEach((t, i) => {
      if (i) u.el('span', 'ds-sep', parent, '|');
      u.el('a', cls || 'ds-a', parent, t);
    });
  }
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'banner' },
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const wrap = u.el('div', 'ds-wrap', document.body);
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const original = er.bool(0.5);
      const placement = original ? 'margin' : er.pick(['toolbar', 'form-link']);
      const endLabel = original ? 'Submit' : er.pick(endLabels);
      const left = u.el('div', 'ds-left', wrap);
      const right = u.el('aside', 'ds-right', wrap);
      const hd = u.el('header', 'ds-hd', left);
      const globe = u.el('div', 'ds-globe', hd);
      globe.innerHTML =
        '<svg viewBox="0 0 110 120" aria-hidden="true"><defs><radialGradient id="ocean" cx="32%" cy="28%" r="75%"><stop stop-color="#72c4ff"/><stop offset=".42" stop-color="#1674ed"/><stop offset=".8" stop-color="#074db6"/><stop offset="1" stop-color="#00236a"/></radialGradient><radialGradient id="land"><stop stop-color="#a7e124"/><stop offset="1" stop-color="#55ab18"/></radialGradient><clipPath id="sphere"><ellipse cx="55" cy="55" rx="50" ry="52"/></clipPath><radialGradient id="shadow"><stop stop-color="#001955" stop-opacity=".5"/><stop offset="1" stop-color="#001955" stop-opacity="0"/></radialGradient></defs><ellipse cx="55" cy="111" rx="39" ry="7" fill="url(#shadow)"/><ellipse cx="55" cy="55" rx="50" ry="52" fill="url(#ocean)"/><g clip-path="url(#sphere)"><g stroke="#85bcff" stroke-width=".7" opacity=".55" fill="none"><ellipse cx="55" cy="55" rx="22" ry="52"/><ellipse cx="55" cy="55" rx="40" ry="52"/><path d="M5 36Q55 52 105 36M5 61Q55 80 105 61M14 83Q55 99 96 83M16 18Q55 32 94 18"/></g><g fill="url(#land)"><path d="M29 9L43 5 49 10 42 13 45 18 39 23 41 29 34 33 35 41 29 47 26 57 19 54 15 46 12 36 20 28 17 22 25 19 23 13Z"/><path d="M33 42L41 41 45 47 42 52 47 58 44 62 38 59 32 53 29 50Z"/><path d="M40 61L48 63 54 69 65 70 70 77 65 84 59 88 56 96 49 107 44 102 46 94 41 87 42 78 37 73Z"/><path d="M55 10L61 7 67 14 64 18 69 23 73 21 76 27 85 25 88 16 98 21 105 35 98 42 91 40 87 46 81 39 76 41 72 35 66 32 68 26 60 24 60 19 55 17Z"/><path d="M72 44L80 43 87 49 87 57 91 62 85 72 80 73 77 65 71 63 67 53Z"/><path d="M97 76L104 76 110 83 104 90 95 87 90 82Z"/><path d="M51 4L55 7 52 15 47 12Z"/></g></g></svg>';
      const tl = u.el('div', 'ds-title', hd);
      u.el('div', 'ds-t1', tl, 'WorldWeb Directory');
      u.el('div', 'ds-t2', tl, 'Your Guide to the Internet');
      const sb = u.el('div', 'ds-search', hd);
      u.el('b', '', sb, 'Search the Web:');
      const row = u.el('div', 'ds-srow', sb);
      u.el('span', 'ds-sbox', row);
      u.el('span', 'ds-sbtn', row, 'Search');
      const sl = u.el('div', 'ds-slinks', sb);
      links(u, sl, ['Web', 'Images', 'News', 'Directory']);
      const nav = u.el('nav', 'ds-nav', left);
      links(u, nav, NAV);
      const strip = u.el('div', 'ds-strip', left);
      u.el('span', 'ds-h', strip, 'Word Tools');
      const sr = u.el('span', 'ds-strlinks', strip);
      links(u, sr, ['Dictionary', 'Thesaurus', 'Word Games']);
      u.el('div', 'ds-sub', left, 'Find related words, synonyms and more.');
      const mode = ctx.display;
      wrap.dataset.instruction = mode;
      if (mode === 'header') {
        const h = u.el('div', 'ds-instruction', left, ctx.instruction);
      }
      const stage = u.el('main', 'ds-stage', left);
      const tc = u.el('div', 'ds-tc', left);
      u.el('span', 'ds-tri', tc);
      const tt = u.el('div', 'ds-tct', tc);
      u.el('b', '', tt, 'Task controls (collapsed)');
      u.el('div', '', tt, ctx.finish ? 'Open to check your answers.' : 'Open to check your answers and submit.');
      const show = u.el('button', 'ds-show', tc, 'Show controls');
      show.type = 'button';
      show.addEventListener('click', () => {
        tt.firstChild.textContent = 'Task controls';
        show.textContent = 'Controls open';
        stage.querySelector('input')?.focus();
      });
      u.el('div', 'ds-ph', left, 'Your Preferences');
      const pr = u.el('div', 'ds-prefs', left);
      const d1 = u.el('div', 'ds-pd', pr);
      u.el('b', '', d1, 'Display Settings');
      const prefrow = u.el('div', 'ds-prefrow', d1);
      u.el('span', '', prefrow, 'Text size:');
      u.el('span', 'ds-select', prefrow, 'Medium');
      u.el('span', '', prefrow, 'Color scheme:');
      u.el('span', 'ds-select', prefrow, 'Standard');
      const d2 = u.el('div', 'ds-pd', pr);
      u.el('b', '', d2, 'Directory Options');
      ['Show descriptions', 'Open links in new window'].forEach((text) => {
        const r = u.el('div', 'ds-option', d2);
        u.el('span', 'ds-prefcheck', r, '✓');
        u.el('span', '', r, text);
      });
      const ft = u.el('footer', 'ds-footer', left);
      const footerlinks = u.el('div', 'ds-footerlinks', ft);
      links(u, footerlinks, ['About WorldWeb', 'Contact Us', 'Add a Site', 'Terms of Use', 'Privacy Policy']);
      u.el('span', 'ds-copy', ft, '© 1998 WorldWeb Directory');
      u.el('div', 'ds-date', right, 'Monday, April 27, 1998');
      const hl = u.el('div', 'ds-hl', right);
      links(u, hl, ['Home', 'Help', 'Site Map']);
      u.el('div', 'ds-rh', right, 'Instructions');
      const ol = u.el('ol', 'ds-ol', right);
      [
        'Click Show controls to reveal the task controls.',
        mode === 'panel' ? ctx.instruction : 'Select the matching words.',
        ctx.finish ? 'Finish when your answers are ready.' : `Click ${endLabel}.`,
      ].forEach((t) => u.el('li', '', ol, t));
      u.el('div', 'ds-rh', right, 'Notes');
      u.el('p', 'ds-rp', right, 'All answers are in the current view.');
      u.el('p', 'ds-rp', right, 'The task timer will start after you open the controls.');
      if (mode === 'toast') u.el('div', 'ds-episode-note', right, ctx.instruction);
      u.el('div', 'ds-rh', right, 'Need Help?');
      const help = u.el('p', 'ds-rp', right);
      help.append('See the ');
      u.el('a', 'ds-a', help, 'Help page');
      help.append(' for tips on using the dictionary and thesaurus.');
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'toolbar' ? sr : placement === 'form-link' ? tc : right;
        submit = u.el(placement === 'form-link' ? 'a' : 'button', 'ds-submit ds-end-' + placement, parent, endLabel);
        if (placement === 'form-link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = [...new Set(endLabels)].filter((t) => t.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = cr.pick(options);
          const decoy = u.el('button', 'ds-xtra', right, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      wrap
        .querySelectorAll('a:not([data-role="submit"]),.ds-sbtn')
        .forEach((el) => el.addEventListener('click', () => env.log('decoy', { label: el.textContent })));
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      if (ctx.initial) {
        const stage = document.querySelector('.ds-stage'),
          tc = document.querySelector('.ds-tc');
        const a = stage.getBoundingClientRect(),
          b = tc.getBoundingClientRect();
        const el = u.el('section', 'ds-wrap ds-initial-overlay', document.body);
        el.dataset.role = 'overlay';
        el.style.cssText = `left:${a.left}px;top:${a.top}px;width:${a.width}px;height:${b.bottom - a.top}px`;
        const shield = u.el('div', 'ds-control-shield', el);
        shield.style.height = a.height + 'px';
        const bar = tc.cloneNode(true);
        bar.querySelectorAll('[data-role=submit]').forEach((e) => {
          e.removeAttribute('data-role');
          e.setAttribute('aria-hidden', 'true');
          e.tabIndex = -1;
        });
        bar.classList.add('ds-recovery');
        bar.style.top = b.top - a.top + 'px';
        el.append(bar);
        const dismiss = bar.querySelector('.ds-show');
        dismiss.addEventListener('click', () => {
          tc.querySelector('b').textContent = 'Task controls';
          tc.querySelector('.ds-show').textContent = 'Controls open';
          ctx.dismiss('close');
        });
        return { el, dismiss };
      }
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
