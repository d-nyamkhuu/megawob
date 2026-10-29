// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
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
      if (kind === 'chat' || kind === 'promo') {
        const title = util.el('div', 'motif-overlay-title', box, kind === 'chat' ? 'TeamTalk Support' : 'Stay in the loop');
        box.prepend(title);
        if (kind === 'chat') {
          title.appendChild(row);
          util.el('div', 'motif-overlay-input', box, 'Type a message...');
        } else {
          const close = util.el('button', 'motif-overlay-close', title, '×');
          close.type = 'button'; close.title = word ? word('close') : 'Close';
          close.addEventListener('click', () => ctx.dismiss('close'));
          const field = util.el('div', 'motif-overlay-input', box, 'Enter your email address...');
          box.insertBefore(field, row);
        }
      }
      if (kind === 'banner' || kind === 'cookie') {
        const icon = util.svg('svg', { viewBox: '0 0 32 32', width: 36, height: 36, 'aria-hidden': 'true' }, el);
        icon.classList.add('motif-overlay-symbol');
        icon.innerHTML = kind === 'banner'
          ? '<g fill="#294780" stroke="#294780" stroke-width="1.6"><path d="M4 12h7L24 5v22l-13-7H4zM9 20l2 9h5l-3-8"/><path d="M27 9l4-3M27 16h5M27 23l4 3" fill="none"/></g>'
          : '<g fill="#c5c2ba" stroke="#111" stroke-width="1.6"><path d="M28 17A12 12 0 1 1 16 4c0 5 3 7 7 7 0 3 2 5 5 6z"/><circle cx="10" cy="12" r="1.5"/><circle cx="18" cy="18" r="1.5"/><circle cx="11" cy="23" r="1.5"/></g>';
        el.prepend(icon);
      }
      const headerBottom = document.querySelector('.ref-task').getBoundingClientRect().bottom;
      const end = document.querySelector('[data-role="submit"]');
      const endRect = end && end.getBoundingClientRect();
      const bottomReserve = endRect && endRect.top > window.innerHeight / 2 ? window.innerHeight - endRect.top + 8 : 8;
      if (kind === 'banner' || kind === 'toast') el.style.top = `${headerBottom + 4}px`;
      if (kind === 'cookie' || kind === 'chat') el.style.bottom = `${bottomReserve}px`;
      if (kind === 'promo') {
        el.style.top = `${headerBottom + 4}px`;
        el.style.bottom = `${bottomReserve}px`;
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      document.body.classList.toggle('ref-header-note', display === 'header');
      document.body.classList.toggle('motif-hidden-finish', display === 'hidden' && !!ctx.finish);
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      const windowBar = util.el('div', 'motif-titlebar', document.body);
      util.el('span', 'motif-system-icon', windowBar, '▤');
      util.el('strong', 'motif-window-title', windowBar, 'TeamTalk');
      const windowControls = util.el('div', 'motif-window-controls', windowBar);
      for (const [label, symbol] of [['Minimize', '−'], ['Maximize', '□'], ['Close', '×']]) {
        const control = util.el('button', 'motif-window-control', windowControls, symbol);
        control.type = 'button'; control.title = label; control.setAttribute('aria-label', label);
      }
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter, windowBar, windowControls });
    },
    'frame.header': (base, S) => function (_c) {
      const { ctx, util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.toggle('motif-long-note', ctx.instruction.length > 180);
      S.frameBrand(_c, header);
      Object.assign(_c, { header });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const summary = util.el('aside', 'motif-summary', body);
      const section = (title, rows) => {
        const box = util.el('section', 'motif-box', summary);
        const heading = util.el('div', 'motif-box-title', box, title);
        if (title === 'People') {
          const count = util.el('span', 'motif-people-total', heading);
          const icon = util.svg('svg', { viewBox: '0 0 36 36', width: 28, height: 25, 'aria-hidden': 'true' }, count);
          icon.innerHTML = '<g fill="#111"><circle cx="18" cy="9" r="5"/><circle cx="6" cy="14" r="4"/><circle cx="30" cy="14" r="4"/><path d="M11 31V21c0-8 14-8 14 0v10zM0 31V23c0-7 9-7 9 0v8zM27 31V23c0-7 9-7 9 0v8z"/></g>';
          util.el('span', '', count, '12');
        }
        const list = util.el('div', 'motif-box-list', box);
        for (const [label, value] of rows) {
          const row = util.el('div', 'motif-row', list);
          const caption = util.el('span', '', row);
          if (title === 'Upcoming Meetings') {
            const icon = util.svg('svg', { viewBox: '0 0 24 24', width: 22, height: 22, 'aria-hidden': 'true' }, caption);
            icon.innerHTML = '<g stroke="#111" stroke-width="1.5" fill="none"><path d="M3 4h18v18H3zM3 9h18M7 1v6M17 1v6M7 12h2m3 0h2m3 0h1M7 16h2m3 0h2m3 0h1M7 19h2m3 0h2"/></g>';
            util.el('span', '', caption, label.replace(/^▦\s*/, ''));
            caption.style.display = 'inline-flex'; caption.style.alignItems = 'center'; caption.style.gap = '14px';
          } else if (title === 'Channels') {
            caption.className = 'motif-channel-label';
            util.el('b', '', caption, '#');
            util.el('span', 'motif-channel-name', caption, label.replace(/^#\s*/, ''));
          } else if (title === 'People') {
            caption.className = 'motif-person-label';
            util.el('i', 'motif-presence ' + value.toLowerCase(), caption);
            util.el('span', '', caption, label.replace(/^●\s*/, ''));
          } else caption.textContent = label;
          util.el('span', '', row, value);
        }
        if (title === 'Channels' || title === 'People') {
          const wrap = util.el('div', 'motif-summary-scroll', box);
          wrap.appendChild(list);
          const rail = util.el('div', 'motif-scrollbar', wrap);
          const up = util.el('button', 'motif-scroll-arrow', rail, '▲');
          const track = util.el('div', 'motif-scroll-track', rail);
          util.el('div', 'motif-scroll-thumb', track).style.height = title === 'Channels' ? '80%' : '40%';
          const down = util.el('button', 'motif-scroll-arrow', rail, '▼');
          up.type = down.type = 'button';
          up.setAttribute('aria-label', 'Scroll ' + title.toLowerCase() + ' up');
          down.setAttribute('aria-label', 'Scroll ' + title.toLowerCase() + ' down');
          up.addEventListener('click', () => { list.scrollTop -= 60; });
          down.addEventListener('click', () => { list.scrollTop += 60; });
        }
      };
      section('Team Overview', [['Members', '12'], ['Channels', '7'], ['Active Meetings', '1'], ['Unread Messages', '4']]);
      section('Channels', [['#  general', '1'], ['#  studio-news', '2'], ['#  design', '0'], ['#  engineering', '0'], ['#  marketing', '0'], ['#  research', '1'], ['#  random', '0']]);
      section('Upcoming Meetings', [['▦  Design Sync', 'Today 10:00 AM'], ['▦  Product Review', 'Today 2:00 PM'], ['▦  All Hands', 'Tomorrow 9:00 AM']]);
      section('People', [['●  Alex Chen', 'Online'], ['●  Priya Singh', 'Online'], ['●  Jelena Kovačević', 'Away'], ['●  Juliana Nascimento', 'Online'], ['●  Marco Rossi', 'Offline'], ['●  Daniel Kim', 'Online']]);
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, section, summary });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      // The channel-era design uses a compact global dock rather than workspace rails.
      const dock = util.el('nav', 'channel-dock', document.body);
      const dockItems = [['▣', 'Channels'], ['▤', 'Messages'], ['▦', 'Meetings'], ['♟', 'People'], ['▯', 'Files']];
      const dockArt = [
        '<path d="M4 12h20v16H4zM12 5h20v16H12z" fill="#7890ad"/><path d="M8 16h12v8H8zM16 9h12v8H16z" fill="#c5c2ba"/><path d="M11 28v4h8m5-11v5h6"/>',
        '<path d="M4 6h26v19H14l-9 7 2-7H4z" fill="#e8e6df"/><path d="M9 11h16M9 15h16M9 19h10"/>',
        '<path d="M4 7h27v26H4z" fill="#ddd9d0"/><path d="M4 13h27M10 3v9M25 3v9"/><path d="M9 18h3m4 0h3m4 0h3M9 23h3m4 0h3m4 0h3M9 28h3m4 0h3m4 0h3" stroke-width="3"/>',
        '<g fill="#111" stroke="none"><circle cx="18" cy="9" r="5"/><circle cx="6" cy="14" r="4"/><circle cx="30" cy="14" r="4"/><path d="M11 31V21c0-8 14-8 14 0v10zM0 31V23c0-7 9-7 9 0v8zM27 31V23c0-7 9-7 9 0v8z"/></g>',
        '<path d="M5 3h17l9 9v21H5z" fill="#e8e6df"/><path d="M22 3v9h9"/>',
      ];
      for (const [icon, title] of dockItems) {
        const item = util.el('div', 'channel-dock-item', dock);
        const glyph = util.el('span', 'channel-dock-icon', item);
        const svg = util.svg('svg', { viewBox: '0 0 36 36', width: 36, height: 36, 'aria-hidden': 'true' }, glyph);
        svg.innerHTML = `<g stroke="#111" stroke-width="1.6" fill="none">${dockArt[dockItems.findIndex(x => x[0] === icon)]}</g>`;
        util.el('span', '', item, title);
      }
      Object.assign(_c, { dock, dockArt, dockItems, stage });
    },
  };

  env.site({
    name: 'design-use-chat-channel-04',
    template: 'site/base',
    design: { parts },
  });
})();
