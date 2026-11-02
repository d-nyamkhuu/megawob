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
      if (kind === 'banner') el.style.top = document.querySelector('.relay-editor-head').getBoundingClientRect().bottom + 'px';
      if (kind === 'cookie') util.el('strong', 'relay-overlay-title', box, 'We use cookies');
      if (kind === 'chat') util.el('strong', 'relay-overlay-title', box, 'Need help?');
      if (kind === 'promo') {
        util.el('div', 'relay-promo-icon', box, '✉');
        util.el('strong', 'relay-overlay-title', box, 'Get product updates');
      }
      if (kind === 'banner') util.el('strong', 'relay-overlay-title', box, 'New integration available');
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
      if (kind === 'chat') util.el('div', 'relay-chat-compose', box, 'Type a message...　 ➤');
      if (kind === 'promo') {
        const input = util.el('input', 'relay-promo-email', box);
        input.placeholder = 'Enter your email address';
        input.setAttribute('aria-label', 'Newsletter email address');
        box.insertBefore(input, row);
        const x = util.el('button', 'relay-promo-close', box, '×');
        x.type = 'button';
        x.setAttribute('aria-label', word ? word('close') : 'Close');
        x.addEventListener('click', () => ctx.dismiss('close'));
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
      const sidebar = roomy && rng.bool(0.35);
      const navDraw = W >= 1180 && rng.bool(0.5);
      const nav = W >= 760;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, nav, navDraw, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('relay-header');
      if (display !== 'header' || nav) {
        if (display !== 'header' || navDraw) rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Relayboard');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        if (navDraw) rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of ['Home', 'Workflows', 'Connections', 'Activity', 'Monitoring', 'Settings']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      util.el('div', 'ref-spacer', header);
      const search = util.el('div', 'relay-search', header, '⌕　Search workflows...');
      const bell = util.el('div', 'relay-bell', header);
      bell.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 17h14l-2-3V9a5 5 0 0 0-4-5V2h-2v2a5 5 0 0 0-4 5v5zm5 2a2 2 0 0 0 4 0z"/></svg>';
      util.el('div', 'relay-avatar', header, 'JD');
      Object.assign(_c, { bell, header, search });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body relay-layout', document.body);
      const summary = util.el('aside', 'relay-summary', body);
      util.el('strong', '', summary, 'Workflow Summary');
      for (const [num, label, cls] of [['6','Total Steps',''],['5','Connections',''],['0','Errors','good'],['0','Warnings','warn']]) {
        const row = util.el('div', 'relay-metric', summary);
        util.el('b', cls, row, num); util.el('span', '', row, label);
      }
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav)) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
        side.remove();
      }
      Object.assign(_c, { body, summary });
    },
    'frame.stage': (base, S) => function (_c) {
      const { W, body, ctx, display, util } = _c;
      const editor = util.el('section', 'relay-editor', body);
      const edhead = util.el('div', 'relay-editor-head', editor);
      const appIcon = util.el('span', 'relay-app-icon', edhead);
      appIcon.innerHTML = '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2"><rect x="13" y="3" width="6" height="6" rx="1.5"/><path d="M16 9v9M7 23v-5h18v5"/><rect x="4" y="23" width="6" height="6" rx="1.5"/><rect x="22" y="23" width="6" height="6" rx="1.5"/></svg>';
      const edtitle = util.el('div', 'relay-title', edhead);
      util.el('b', '', edtitle, 'Order Processing');
      if (display === 'header') util.el('div', 'ref-instruction', edtitle, ctx.instruction);
      else util.el('span', '', edtitle, 'Last updated today at 10:24 AM');
      util.el('div', 'relay-controls', edhead);
      const toolrow = util.el('div', 'relay-toolrow', editor, 'Workflows　　Runs');
      const stage = util.el('main', 'ref-stage', editor);
      const stats = util.el('aside', 'relay-stats', body);
      if (display === 'panel') {
        const taskPanel = body.querySelector('.ref-panel');
        stats.appendChild(taskPanel);
        if (W <= 1300) {
          taskPanel.classList.add('relay-panel-header');
          edtitle.lastElementChild.replaceWith(taskPanel);
        }
      }
      const types = util.el('div', 'relay-card', stats);
      util.el('strong', '', types, 'Step Types');
      for (const [ico, n, name, color] of [['ϟ','1','Trigger','green'],['⚙','2','Actions','blue'],['◆','1','Condition','orange'],['▤','1','Data','purple'],['■','1','End','red']]) {
        const row = util.el('div', 'relay-type', types);
        const symbol = util.el('b', color, row);
        const paths = {
          Trigger: 'M14 1 3 14h7l-1 9L21 9h-8z',
          Actions: 'm10 1-1 3-3 1-3-1-2 4 2 2v4l-2 2 2 4 3-1 3 1 1 3h4l1-3 3-1 3 1 2-4-2-2v-4l2-2-2-4-3 1-3-1-1-3z M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
          Condition: 'M12 1 23 12 12 23 1 12Z',
          Data: 'M3 5a9 4 0 0 1 18 0 9 4 0 0 1-18 0 M3 8c4 4 14 4 18 0v5c-4 4-14 4-18 0z M3 16c4 4 14 4 18 0v4c-4 4-14 4-18 0z',
          End: 'M5 2h14a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3',
        };
        symbol.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="' + paths[name] + '"/></svg>';
        util.el('em', '', row, n); util.el('span', '', row, name);
      }
      const connections = util.el('div', 'relay-card relay-connections', stats);
      util.el('strong', '', connections, 'Connections');
      for (const [n, label, color] of [['5','Total','blue'],['0','Errors','red'],['0','Warnings','orange']]) {
        const row = util.el('div', 'relay-count', connections); util.el('b', color, row, n); util.el('span', '', row, label);
      }
      S.frameAlign(_c, stage);
      Object.assign(_c, { appIcon, connections, edhead, editor, edtitle, stage, stats, toolrow, types });
    },
    'frame.toast': (base, S) => function (_c) {
      const { W, closeLabel, ctx, display, editor, util } = _c;
      if (display === 'toast') {
        const note = util.el('div', 'ref-note', document.body);
        const editorRect = editor.getBoundingClientRect();
        // Keep the toast in the frame band above the workflow canvas. Anchoring
        // it below the editor title lets it cover first-row nodes at some sizes.
        note.style.top = '64px';
        note.style.right = (W - editorRect.right + 18) + 'px';
        util.el('div', 'ref-note-text', note, ctx.instruction);
        const x = util.el('button', 'ref-note-x', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', closeLabel);
        x.addEventListener('click', () => { note.style.visibility = 'hidden'; env.log('note-close'); });
      }
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.instruction': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-workflow-editor-reroute-01',
    template: 'site/base',
    design: { parts },
  });
})();
