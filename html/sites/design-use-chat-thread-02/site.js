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
      // Native overlay windows retain the original text, choices and random draws.
      const title = (text) => {
        const heading = util.el('strong', 'nx-overlaytitle', null, text);
        box.prepend(heading);
      };
      if (kind === 'cookie') {
        title('We use cookies to improve your experience.');
        if (document.body.classList.contains('nx-bottom-control')) el.style.bottom = '48px';
      } else if (kind === 'chat') {
        title('TeamTalk Support');
        util.el('div', 'nx-supportdraft', box, 'Type a message…');
        if (document.body.classList.contains('nx-bottom-control')) el.style.bottom = '55px';
      } else if (kind === 'promo') {
        title('Stay in the loop');
        const field = util.el('input', 'nx-subscribe', box);
        field.placeholder = 'Enter your email';
        field.setAttribute('aria-label', 'Newsletter email');
        row.before(field);
        const close = util.el('button', 'nx-overlayclose', box, '×');
        close.type = 'button'; close.setAttribute('aria-label', word ? word('close') : 'Close');
        close.addEventListener('click', () => ctx.dismiss('close'));
      } else if (kind === 'banner') {
        const meta = document.querySelector('.nx-channelmeta');
        const sheet = document.querySelector('.nx-sheet');
        if (meta && sheet) {
          const a = meta.getBoundingClientRect(), b = sheet.getBoundingClientRect();
          Object.assign(el.style, { top: `${a.bottom}px`, left: `${b.left + 3}px`, width: `${b.width - 6}px`, right: 'auto' });
        }
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebarDraw = roomy && rng.bool(0.35);
      const navDraw = W >= 1180 && rng.bool(0.5);
      const sidebar = true;
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, sidebarDraw, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const menu = util.el('div', 'nx-menubar', header);
      util.el('strong', 'nx-nameplate', menu, 'TeamTalk');
      for (const item of ['File', 'Edit', 'View', 'Channel', 'Message', 'Meetings', 'Window', 'Help']) {
        util.el('span', 'nx-menuitem', menu, item);
      }
      const windowTools = util.el('div', 'nx-window-controls', menu);
      for (const symbol of ['_', '□', '×']) util.el('span', '', windowTools, symbol);
      if (display !== 'header' || nav) {
        rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'TeamHub');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of ['Chat', 'Meetings', 'People', 'Files']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header, menu, windowTools });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, rng, sidebar, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        rng.sample(content.NAV_ITEMS, rng.int(4, 7));
        util.el('div', 'ref-side-workspace', side, 'Rivermere Designs');
        const railArt = {
          Channels: '<path d="M4 3h21q3 0 3 4v14q0 4-4 4h-9l-7 6v-6H4q-3 0-3-4V7q0-4 3-4z"/>',
          Threads: '<path d="M3 2h24v25l-6-4H3z"/><path d="M7 8h16M7 13h16M7 18h12" fill="none" stroke="#222" stroke-width="2"/>',
          Mentions: '<text x="0" y="27" font-family="Arial" font-size="33" font-weight="bold" stroke="none">@</text>',
          Meetings: '<path d="M3 6h18v20H3q-2 0-2-3V9q0-3 2-3zM21 12l10-6v21l-10-6z"/>',
          People: '<circle cx="11" cy="9" r="6"/><circle cx="23" cy="10" r="5"/><path d="M1 29v-6q0-8 10-8t10 8v6zM21 17q10 0 10 9v3h-8v-7z"/>',
          Settings: '<path d="M12 1h7l1 5 4 2 5-1 3 6-4 4 1 5-5 2-2 6h-7l-1-5-5-2-4 1-3-6 4-4-1-5 5-2z"/><circle cx="17" cy="16" r="6" fill="#303233"/>',
        };
        for (const item of ['Channels', 'Threads', 'Mentions', 'Meetings', 'People', 'Settings']) {
          const a = util.el('a', 'ref-sidelink', side, item);
          const icon = util.svg('svg', { viewBox: '0 0 34 34', width: 32, height: 32, 'aria-hidden': 'true' }, a);
          icon.innerHTML = '<g fill="#ddd" stroke="#151617" stroke-width="1">' + railArt[item] + '</g>';
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
        util.el('div', 'ref-side-heading', side, 'Channels');
        for (const item of ['#  general', '#  announcements', '#  design-lab', '#  marketing', '#  product', '#  random']) {
          const a = util.el('a', 'ref-sidelink ref-channel', side, item);
          if (item.includes('design-lab')) a.classList.add('ref-selected');
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
        util.el('div', 'ref-side-heading', side, 'Direct messages');
        for (const item of ['●  Avery Chen', '●  Jordan Patel', '●  Shirin Tehrani', '●  Taylor Kim', '●  Morgan Lee']) {
          const a = util.el('a', 'ref-sidelink ref-dm', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
        const tip = util.el('div', 'ref-tip', side);
        util.el('strong', '', tip, '☼  Tips');
        util.el('div', '', tip, '• Click a message’s reply icon to view or add to a thread.');
        util.el('div', '', tip, '• Threads keep discussions organized and out of the main channel.');
      }
      Object.assign(_c, { body });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, header, headerTools, placement, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      // The widget places these existing episode controls in the channel window's title bar.
      stage.teamTools = headerTools;
      stage.teamInstruction = header.querySelector('.ref-instruction');
      document.body.classList.toggle('nx-bottom-control', placement === 'footer' || placement === 'link' || placement === 'floating');
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-chat-thread-02',
    template: 'site/base',
    design: { parts },
  });
})();
