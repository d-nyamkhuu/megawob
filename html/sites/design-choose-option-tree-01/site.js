(function () {
  'use strict';
  const C = { site: 'design-choose-option-tree-01' };
  const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util,
        content = ctx.content || {},
        rng = ctx.rng;
      const win = u.el('div', 'ds-window', document.body);
      const rail = u.el('aside', 'ds-rail', win);
      const icon = (parent, cls, paths) => {
        const ns = 'http://www.w3.org/2000/svg',
          s = document.createElementNS(ns, 'svg');
        s.setAttribute('class', cls);
        s.setAttribute('viewBox', '0 0 24 24');
        s.setAttribute('fill', 'none');
        s.setAttribute('stroke', 'currentColor');
        s.setAttribute('stroke-width', '1.7');
        s.setAttribute('stroke-linecap', 'round');
        s.setAttribute('stroke-linejoin', 'round');
        parent.appendChild(s);
        paths.forEach((d) => {
          const p = document.createElementNS(ns, 'path');
          p.setAttribute('d', d);
          s.appendChild(p);
        });
        return s;
      };
      const mark = u.el('div', 'ds-mark', rail);
      icon(mark, 'ds-logo', ['M4 18C4 8 10 4 21 3c0 11-4 17-14 18', 'M4 20 16 8']);
      const navIcons = [
        ['Home', ['M3 10.5 12 3l9 7.5', 'M5.5 9.5V21h13V9.5', 'M9.5 21v-6h5v6']],
        ['Search', ['M20 20l-4.4-4.4', 'M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0']],
        ['Preferences', ['M4 6h16', 'M4 12h16', 'M4 18h16', 'M9 4v4', 'M15 10v4', 'M8 16v4']],
        ['Orders', ['M5 8h14l1 13H4L5 8Z', 'M9 8V6a3 3 0 0 1 6 0v2']],
        ['Products', ['M12 3 21 8v8l-9 5-9-5V8l9-5Z', 'm3.5 8 8.5 5 8.5-5', 'M12 13v8']],
        ['Messages', ['M3 5h18v14H3z', 'm4 7 8 6 8-6']],
        ['Rewards', ['m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z']],
        [
          'Help',
          [
            'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
            'M9.7 9a2.4 2.4 0 1 1 4 1.8c-1.2.8-1.7 1.2-1.7 2.7',
            'M12 17.5h.01',
          ],
        ],
      ];
      navIcons.forEach((x, i) => {
        const r = u.el('div', 'ds-nav' + (i === 2 ? ' active' : ''), rail);
        icon(r, 'ds-icon', x[1]);
        u.el('span', '', r, x[0]);
      });
      const shell = u.el('div', 'ds-shell', win),
        top = u.el('header', 'ds-titlebar', shell),
        title = u.el('span', 'ds-brand', top, '◈');
      u.el('div', 'ds-window-controls', top, '−　□　×');
      const work = u.el('div', 'ds-work', shell),
        side = u.el('aside', 'ds-preferences', work);
      const sideHead = u.el('div', 'ds-prefhead', side);
      u.el('strong', '', sideHead, 'Preferences');
      u.el('span', 'ds-plus', sideHead, '＋');
      const search = u.el('div', 'ds-search', side);
      u.el('span', '', search, '⌕');
      u.el('span', 'ds-searchtext', search, 'Search preferences');
      const list = u.el('div', 'ds-pref-list', side);
      const rows = [
        ['♙', 'My account', 'Profile, security, details', 'Updated Apr 12, 2026'],
        ['♧', 'Notifications', 'Email, SMS, in-app', 'Updated Apr 10, 2026'],
        ['◇', 'Privacy', 'Data, visibility, sharing', 'Updated Apr 5, 2026'],
        ['▤', 'Payment methods', 'Cards, wallets, billing', 'Updated Mar 28, 2026'],
        ['♧', 'Delivery preferences', 'Addresses, options', 'Updated Mar 22, 2026'],
        ['◈', 'Dietary filters', 'Food preferences', 'Updated Mar 18, 2026'],
        ['⚝', 'Accessibility', 'Display, interaction', 'Updated Mar 12, 2026'],
        ['◎', 'Language & region', 'Language, currency', 'Updated Mar 6, 2026'],
        ['☆', 'Rewards', 'Points and offers', 'Updated Feb 25, 2026'],
      ];
      rows.forEach((x, i) => {
        const row = u.el('div', 'ds-prefrow' + (i === 0 ? ' selected' : ''), list);
        u.el('span', 'ds-rowicon', row, x[0]);
        const t = u.el('div', 'ds-rowtext', row);
        u.el('div', 'ds-rowname', t, x[1]);
        u.el('div', 'ds-rowdesc', t, x[2]);
        u.el('div', 'ds-rowdate', t, x[3]);
      });
      const contentRoot = u.el('div', 'ds-content', work),
        width = window.innerWidth,
        height = window.innerHeight;
      let mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : 'header';
      if ((mode === 'panel' && width < 1260) || (mode === 'toast' && height < 700)) mode = 'header';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, 'Task details');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'header') briefing(contentRoot, 'ds-header-note');
      if (mode === 'panel') briefing(contentRoot, 'ds-brief');
      const heading = u.el('h1', 'ds-heading', contentRoot, 'Notifications & filters');
      const stage = u.el('main', 'ds-stage', contentRoot);
      if (mode === 'toast') {
        const note = briefing(contentRoot, 'ds-toast');
        contentRoot.insertBefore(note, heading);
      }
      const endRng = rng.fork('chrome/end'),
        collideRng = rng.fork('chrome/collide');
      const labels = (
        Array.isArray(content.END_LABELS) && content.END_LABELS.length
          ? content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map(labelOf);
      const decoyLabels = (
        Array.isArray(content.DECOY_LABELS) && content.DECOY_LABELS.length
          ? content.DECOY_LABELS
          : ['Help', 'Feedback', 'Preview', 'Save draft', 'Reset view']
      ).map(labelOf);
      let placement = null,
        label = null;
      if (!ctx.finish) {
        if (endRng.bool(0.5)) {
          placement = 'footer';
          label = 'Confirm';
        } else {
          placement = endRng.pick(['footer', 'link', 'header']);
          const alternatives = labels.filter((x) => !['submit', 'confirm'].includes(x.trim().toLowerCase()));
          label = alternatives.length ? endRng.pick(alternatives) : 'Done';
        }
      }
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const pool = [...new Set(labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase()))];
        if (pool.length) collide = { text: collideRng.pick(pool), where: collideRng.pick(['header', 'footer']) };
      }
      const decoyBtn = (parent, text, isCollide) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', isCollide ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      const endBtn = (parent, cls, text) => {
        const b = u.el(cls === 'ds-endlink' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
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
      const foot = u.el('footer', 'ds-footer', contentRoot);
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'header') {
          const tools = u.el('div', 'ds-header-tools', top);
          top.insertBefore(tools, top.lastElementChild.previousElementSibling);
          if (collide && collide.where === 'header') decoyBtn(tools, collide.text, true);
          submit = endBtn(tools, 'ds-submit ds-submit-head', label);
        } else {
          if (collide && collide.where === 'header') {
            const tools = u.el('div', 'ds-header-tools', top);
            top.insertBefore(tools, top.lastElementChild.previousElementSibling);
            decoyBtn(tools, collide.text, true);
          }
          if (collide && collide.where === 'footer') decoyBtn(foot, collide.text, true);
          submit = placement === 'link' ? endBtn(foot, 'ds-endlink', `${label} ›`) : endBtn(foot, 'ds-submit', label);
        }
      }
      const fillerRng = rng.fork('chrome/filler');
      if (!ctx.finish && fillerRng.bool(0.22)) decoyBtn(foot, fillerRng.pick(decoyLabels), false);
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
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
