// Design on templates/site/form-text-login-01.js: only what this site changed.
(function () {
  'use strict';
  const drawings = {
    atari: '<path d="M13 2v13c0 6-4 11-10 14M19 2v13c0 6 4 11 10 14M16 2v28" fill="none" stroke="currentColor" stroke-width="3"/>',
    home: '<path d="M2 15 16 3l14 12v15H20V19h-8v11H3V15ZM23 4h5v8l-5-4Z"/>',
    shirt: '<path d="m10 4 6 2 6-2 9 6-5 8-4-2v15H10V16l-4 2-5-8Z"/>',
    shoe: '<path d="m4 20 8-2 6-12 5 2-2 9 8 3v8H3L1 25l1-5Z" fill="currentColor" stroke="currentColor" stroke-width="2"/><path d="m10 21 5 2 11-1M14 16l6 2M16 12l5 2M4 26h24" fill="none" stroke="#e8e8e8" stroke-width="1.5"/>',
    bag: '<path d="M3 10h26v20H3Z"/><path d="M10 11V5q0-3 6-3t6 3v6" fill="none" stroke="currentColor" stroke-width="3"/><path d="M9 10v8h6v-5h10v17" fill="none" stroke="#e8e8e8" stroke-width="1.5"/>',
    paper: '<path d="M5 2h16l7 7v21H5Z" fill="#e8e8e8" stroke="currentColor" stroke-width="2.5"/><path d="M20 2v8h8M9 14h14M9 19h14M9 24h14M9 7h7" fill="none" stroke="currentColor" stroke-width="2"/>',
    floppy: '<path d="M3 2h24l3 4v25H3Z" fill="#e8e8e8" stroke="#080808" stroke-width="2"/><path d="M7 2h18v11H7Z"/><path d="M17 3h5v8h-5Z" fill="#e8e8e8"/><path d="M7 17h19v12H7Z" fill="white" stroke="#080808"/><path d="M10 20h13M10 23h13M10 26h9" stroke="#080808"/>',
    disk: '<path d="m3 6 5-4h23v24l-5 5H3Z" fill="#e8e8e8" stroke="#080808" stroke-width="2"/><path d="M3 9h24v22M27 9l4-7M7 15h15v9H7Z" fill="none" stroke="#080808" stroke-width="2"/><path d="M11 18h7v3h-7Z"/>',
    trash: '<path d="M5 8h23l-2 23H7Z" fill="#e8e8e8" stroke="#080808" stroke-width="2"/><path d="M3 5h27v4H3ZM12 2h9v3h-9Z" fill="#e8e8e8" stroke="#080808" stroke-width="2"/><path d="M12 12v16M17 12v16M22 12v16" stroke="#080808" stroke-width="2"/>',
    cart: '<path d="m2 4 4 1 5 18h15l4-14H8M11 18h16M17 10v7M24 10v7" fill="none" stroke="currentColor" stroke-width="3"/><path d="M14 27a2 2 0 1 0 0 .1M25 27a2 2 0 1 0 0 .1" fill="none" stroke="currentColor" stroke-width="3"/>',
  };
  const icon = (name) => '<svg viewBox="0 0 34 34" aria-hidden="true" fill="currentColor">' + drawings[name] + '</svg>';
  env.site({
    name: 'design-act-in-time-countdown-05',
    styles: ['site.css'],
    scripts: [],
    pauseOnOverlay: true,
    template: 'site/type-text-login-01',
    design: {
      C: {
        'site': 'design-act-in-time-countdown-05',
        'brand': 'ShopST',
        'title': 'Clothing',
        'instruction': 'top',
        'rail': '',
        'menu': 'Desk|File|View|Options',
        'briefTitle': 'Hold reservation',
      },
      parts: {
        'frame.8': (base, S) =>
          function (_c) {
            const { C } = S;
            const { u } = _c;
            document.querySelectorAll('.gem-icons,.gem-titlebar,.gem-categories,.gem-related,.gem-shirt-panel,.gem-toast-note,.ds-menu').forEach((n) => n.remove());
            document.body.classList.toggle('gem-no-note', _c.ctx.display === 'hidden');
            document.body.classList.toggle('gem-header-note', _c.ctx.display === 'header');
            document.body.classList.toggle('gem-panel-note', _c.ctx.display === 'panel');
            document.body.classList.toggle('gem-toast-mode', _c.ctx.display === 'toast');
            _c.nav = null;
            if (C.menu) {
              _c.nav = u.el('nav', 'ds-menu', document.body);
              u.el('span', 'gem-mark', _c.nav).innerHTML = icon('atari');
              C.menu.split('|').forEach((t) => u.el('span', '', _c.nav, t));
              u.el('span', 'gem-clock', _c.nav, '▣　Mon 27 Oct 10:24');
            }
            const desk = u.el('div', 'gem-icons', document.body);
            [['floppy','Floppy A'],['floppy','Floppy B'],['disk','Hard Disk'],['trash','Wastebasket']].forEach(([symbol,label]) => {
              const item = u.el('div', 'gem-icon', desk);
              u.el('b', '', item).innerHTML = icon(symbol);
              u.el('span', '', item, label);
            });
            const titlebar = u.el('div', 'gem-titlebar', document.body);
            u.el('span', 'gem-appmark', titlebar, '▣');
            u.el('b', '', titlebar, 'ShopST - Clothing');
            const gadgets = u.el('span', 'gem-winctrl', titlebar);
            ['−', '□', '×'].forEach((g) => u.el('i', '', gadgets, g));
            const tabs = u.el('nav', 'gem-categories', document.body);
            _c.gemTabs = tabs;
            [['home','Home'],['shirt','Clothing'],['shoe','Footwear'],['bag','Bags'],['paper','Accessories']].forEach(([symbol,label],i) => {
              const tab = u.el('div', 'gem-category' + (i === 1 ? ' active' : ''), tabs);
              u.el('b', '', tab).innerHTML = icon(symbol);
              u.el('span', '', tab, label);
            });
            const list = u.el('section', 'gem-related', document.body);
            u.el('strong', 'gem-list-title', list, 'More T-Shirts');
            const table = u.el('div', 'gem-list-table', list);
            [['Name','Color','Fit','Price'],['Ridge Line T-Shirt','Black','Relaxed','$18.00'],['Ridge Line T-Shirt','White','Relaxed','$18.00']].forEach((row,i) => {
              const line = u.el('div', 'gem-list-row' + (i === 1 ? ' chosen' : ''), table);
              row.forEach((cell) => u.el('span', '', line, cell));
            });
            const scroll = u.el('div', 'gem-list-scroll', table);
            ['▲', '▒', '▼'].forEach((symbol) => u.el('span', '', scroll, symbol));
            if (_c.ctx.display === 'toast') {
              const note = u.el('aside', 'gem-toast-note', document.body);
              u.el('span', 'gem-toast-copy', note, _c.ctx.instruction);
              const x = u.el('button', 'gem-toast-close', note, '×');
              x.type = 'button';
              x.setAttribute('aria-label', 'Close notification');
              x.addEventListener('click', () => { note.remove(); env.log('note-close'); });
            }
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { ctx, foot, top, u } = _c;
            const er = ctx.rng.fork('chrome/end');
            const labels = (
              ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                ? ctx.content.END_LABELS
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
            ).map((x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x));
            const submitWord = labels.find((x) => x.trim().toLowerCase() === 'apply') || labels[0] || 'Apply';
            const classic = er.bool(0.5);
            const placement = classic ? 'header' : er.pick(['footer', 'link']);
            const label = classic ? submitWord : er.pick(labels);
            const cr = ctx.rng.fork('chrome/collide');
            _c.collide = null;
            if (cr.bool(0.3)) {
              const options = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
              if (options.length)
                _c.collide = { label: cr.pick(options), where: cr.pick(['header', 'header', 'footer']) };
            }
            const makeEnd = (parent, cls, text, tag = 'button') => {
              const b = u.el(tag, cls, parent, text);
              if (tag === 'button') b.type = 'button';
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
            const decoy = (parent, text) => {
              const b = u.el('button', 'ds-xtra', parent, text);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
              return b;
            };
            _c.submit = null;
            if ((_c.gemTabs || _c.nav) && (placement === 'header' || (_c.collide && _c.collide.where === 'header'))) {
              const tools = u.el('span', 'ds-menu-tools', _c.gemTabs || _c.nav);
              if (_c.collide && _c.collide.where === 'header') decoy(tools, _c.collide.label);
              if (placement === 'header' && !ctx.finish) _c.submit = makeEnd(tools, 'ds-submit ds-head-submit', label);
            } else if (_c.collide && _c.collide.where === 'header') {
              const tools = u.el('span', 'ds-menu-tools', _c.nav || top);
              decoy(tools, _c.collide.label);
              if (placement === 'header' && !ctx.finish) _c.submit = makeEnd(tools, 'ds-submit ds-head-submit', label);
            }
            if (_c.collide && _c.collide.where === 'footer') decoy(foot, _c.collide.label);
            if (!ctx.finish && placement === 'footer') _c.submit = makeEnd(foot, 'ds-submit', label);
            if (!ctx.finish && placement === 'link') _c.submit = makeEnd(foot, 'ds-endlink', label + ' ›');
            Object.assign(_c, { classic, cr, decoy, er, label, labels, makeEnd, placement, submitWord });
          },
        'frame.23': () => () => {},
        'frame.24': () => () => {},
        'frame.25': () => () => {},
        'frame.26': () => () => {},
      },
    },
  });
})();
