(function () {
  'use strict';
  const C = { site: 'design-choose-option-chips-03', brand: 'Newsletter Manager' };
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
        rng = ctx.rng,
        w = window.innerWidth,
        h = window.innerHeight;
      const mode =
        ctx.display === 'panel' && w < 1180
          ? 'header'
          : ctx.display === 'toast' && h < 680
            ? 'header'
            : ctx.display || 'header';
      const win = u.el('div', 'nm-window', document.body);
      const top = u.el('header', 'nm-titlebar', win);
      u.el('span', 'nm-appicon', top, '▤');
      u.el('span', 'nm-title', top, C.brand);
      const winbtns = u.el('div', 'nm-winbtns', top);
      ['−', '□', '×'].forEach((x) => u.el('button', '', winbtns, x));
      const menu = u.el('nav', 'nm-menu', win);
      ['File', 'Edit', 'View', 'Tools', 'Help'].forEach((x) => u.el('span', '', menu, x));
      const contentRoot = u.el('div', 'nm-content', win);
      const side = u.el('aside', 'nm-sidebar', contentRoot);
      const section = (title, rows, cls) => {
        const s = u.el('section', 'nm-section ' + (cls || ''), side);
        u.el('h2', '', s, title);
        const list = u.el('div', 'nm-rows', s);
        rows.forEach(([icon, text, count]) => {
          const r = u.el('div', 'nm-row', list);
          u.el('span', 'nm-rowicon', r, icon);
          u.el('span', 'nm-rowtext', r, text);
          if (count) u.el('span', 'nm-count', r, count);
        });
      };
      section('Newsletter', [
        ['✉', 'Subscribers', '248'],
        ['▤', 'Active', '230'],
        ['⊘', 'Unsubscribed', '18'],
      ]);
      section('Topics', [
        ['◩', 'Available Topics', '6'],
        ['▤', 'In Use', '4'],
        ['◌', 'Not In Use', '2'],
      ]);
      section(
        'Recent Activity',
        [
          ['▤', 'Newsletter sent', 'Apr 12, 2004'],
          ['♙', 'New subscriber', 'Apr 11, 2004'],
          ['⊘', 'Unsubscribed', 'Apr 9, 2004'],
        ],
        'nm-activity',
      );
      const main = u.el('main', 'nm-main', contentRoot);
      if (mode === 'header') {
        const note = u.el('div', 'nm-tasknote', win);
        u.el('div', 'nm-tasktext', note, ctx.instruction);
        win.insertBefore(note, contentRoot);
      }
      const heading = u.el('div', 'nm-mainhead', main);
      u.el('h1', '', heading, 'Subscriber Preferences');
      const tools = u.el('div', 'nm-headtools', heading);
      const identity = u.el('div', 'nm-identity', main);
      [
        ['Email Address:', 'r.martin@example.org'],
        ['Full Name:', 'Rachel Martin'],
      ].forEach(([label, value]) => {
        const row = u.el('div', 'nm-idrow', identity);
        u.el('label', '', row, label);
        const input = u.el('div', 'nm-idvalue', row, value);
      });
      u.el('div', 'nm-separator', main);
      if (mode === 'panel') {
        const note = u.el('aside', 'nm-panelnote', side);
        u.el('h3', '', note, 'Instructions');
        u.el('div', 'nm-tasktext', note, ctx.instruction);
      }
      if (mode === 'toast') {
        const note = u.el('aside', 'nm-toast', win);
        u.el('div', 'nm-tasktext', note, ctx.instruction);
        const x = u.el('button', 'nm-close', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close');
        x.addEventListener('click', () => {
          note.hidden = true;
        });
      }
      const pref = u.el('div', 'nm-pref', main);
      u.el('div', 'nm-pref-label', pref, 'Newsletter Topics:');
      const below = u.el('div', 'nm-below', main);
      const delivery = u.el('div', 'nm-delivery', below);
      u.el('div', 'nm-delivery-label', delivery, 'Delivery Format:');
      const radios = u.el('div', 'nm-radios', delivery);
      [
        ['◉', 'HTML (recommended)', true],
        ['◯', 'Plain Text', false],
      ].forEach(([icon, text, active]) => {
        const r = u.el('div', 'nm-radio', radios);
        r.classList.toggle('selected', active);
        u.el('span', '', r, icon);
        u.el('span', '', r, text);
      });
      const schedule = u.el('div', 'nm-schedule', below);
      u.el('span', '', schedule, 'Delivery Schedule:');
      const select = u.el('div', 'nm-select', schedule, 'Weekly (Monday)');
      u.el('span', 'nm-select-arrow', select, '▼');
      const stage = u.el('section', 'nm-stage', main);
      if (mode === 'panel' || mode === 'toast') {
      } // notes are distinct from task controls
      const endRng = rng.fork('chrome/end'),
        collideRng = rng.fork('chrome/collide'),
        fillerRng = rng.fork('chrome/filler');
      const labels = (
        Array.isArray(content.END_LABELS) && content.END_LABELS.length
          ? content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map(labelOf);
      let placement = null,
        label = null;
      if (!ctx.finish) {
        if (endRng.bool(0.5)) {
          placement = 'footer';
          label = 'Apply';
        } else {
          placement = endRng.pick(['footer', 'link', 'header', 'icon']);
          label = endRng.pick(labels.filter((x) => x.toLowerCase() !== 'apply')) || 'Done';
        }
      }
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const pool = [...new Set(labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase()))];
        if (pool.length) collide = { text: collideRng.pick(pool), where: collideRng.pick(['header', 'footer']) };
      }
      const decoy = (parent, text, isCollide) => {
        const b = u.el('button', 'nm-button nm-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', isCollide ? { label: text, collide: true } : { label: text }),
        );
      };
      const end = (parent, kind, text) => {
        const b = u.el(
          kind === 'link' ? 'a' : 'button',
          'nm-button nm-submit ' + (kind === 'header' ? 'nm-header-submit' : ''),
          parent,
          text,
        );
        b.type = kind === 'link' ? undefined : 'button';
        if (kind === 'link') b.href = '#';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'header') {
          if (collide && collide.where === 'header') decoy(tools, collide.text, true);
          submit = end(tools, 'header', label);
        } else if (placement === 'icon') {
          if (collide && collide.where === 'header') decoy(tools, collide.text, true);
          submit = end(tools, 'icon', '✓');
          submit.title = label;
          submit.setAttribute('aria-label', label);
        }
      }
      const dock = u.el('footer', 'nm-dock', win);
      const navs = [
        ['✉', 'Subscribers'],
        ['▤', 'Newsletters'],
        ['▱', 'Topics'],
        ['▥', 'Reports'],
        ['⚙', 'Settings'],
      ];
      navs.forEach(([icon, text], i) => {
        const b = u.el('button', 'nm-dockitem' + (!i ? ' active' : ''), dock);
        b.type = 'button';
        u.el('span', 'nm-dockicon', b, icon);
        u.el('span', '', b, text);
      });
      const foottools = u.el('div', 'nm-foottools', dock);
      if (!ctx.finish && placement !== 'header' && placement !== 'icon') {
        if (collide && collide.where === 'footer') decoy(foottools, collide.text, true);
        submit = end(foottools, placement === 'link' ? 'link' : 'footer', placement === 'link' ? `${label} ›` : label);
      } else if (!ctx.finish && collide && collide.where === 'footer') decoy(foottools, collide.text, true);
      if (!ctx.finish && fillerRng.bool(0.22)) {
        const dl = (
          Array.isArray(content.DECOY_LABELS) && content.DECOY_LABELS.length
            ? content.DECOY_LABELS
            : ['Help', 'Save draft', 'Preview']
        ).map(labelOf);
        decoy(foottools, fillerRng.pick(dl), false);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'nm-overlay nm-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'This application stores preferences on this computer.',
        toast: 'Newsletter preferences updated.',
        chat: 'Newsletter support. How can we help?',
        promo: 'Discover the new campaign tools.',
        banner: 'System notice: scheduled maintenance tonight.',
      };
      u.el('div', 'nm-overlay-text', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
