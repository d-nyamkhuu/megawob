// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    endLabel: (base, S) => function (rng, content) {
      const sampled = base(rng, content);
      return rng.fork('relay/end-label').bool(.55) ? 'Finish' : sampled;
    },
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
      if (kind === 'chat') util.el('strong', 'relay-overlay-title', box, 'Chat with Support');
      if (kind === 'promo') {
        util.el('div', 'relay-promo-icon', box, '✉');
        util.el('strong', 'relay-overlay-title', box, 'Get product updates');
      }
      if (kind === 'banner') util.el('strong', 'relay-overlay-title', box, 'New integration available');
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : kind === 'chat' ? 'Need help with this workflow? I can answer questions or suggest changes.' : text);
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
      if (placement === 'floating') placement = 'header';
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
        const logo = util.el('span', 'relay-logo', header);
        logo.innerHTML = '<svg viewBox="0 0 46 38" fill="#eaf4ff" stroke="#365c87" stroke-width="1"><path d="M23 12v6M9 23v-5h28v5" fill="none" stroke="#ecf5ff" stroke-width="2"/><rect x="16" y="1" width="14" height="14"/><rect x="1" y="23" width="14" height="14"/><rect x="31" y="23" width="14" height="14"/></svg>';
        const brand = util.el('div', 'ref-brand', header, 'Relayboard');
        brand.dataset.role = 'brand';
        util.el('span', 'relay-subtitle', header, 'Workflow Editor');
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
      util.el('span', 'relay-clock', header, 'Mon, Apr 28, 2003  10:24 AM');
      Object.assign(_c, { bell, header, search });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body relay-layout', document.body);
      const record = util.el('div', 'relay-record', body);
      for (const [label, value] of [['Workflow Name:', 'Support Request Flow'], ['Description:', 'Routes and processes incoming support requests.'], ['Status:', 'Active'], ['Last Modified:', 'Apr 27, 2003　3:16 PM'], ['Modified By:', 'jcarter'], ['Version:', '1.0']]) {
        const row = util.el('div', 'relay-record-row', record);
        util.el('b', '', row, label); util.el('span', '', row, value);
      }
      const summary = util.el('aside', 'relay-summary', body);
      util.el('strong', '', summary, 'Workflow Summary');
      for (const [label, num] of [['Total Steps:', '7'],['Connections:', '7'],['Conditional Branches:', '2'],['Integrations:', '2']]) {
        const row = util.el('div', 'relay-metric', summary);
        util.el('span', '', row, label); util.el('b', '', row, num);
      }
      const band = util.el('section', 'relay-band', body);
      band.append(record, summary);
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
      util.el('b', '', edtitle, 'Workflow Canvas');
      util.el('div', 'relay-controls', edhead);
      const toolrow = util.el('div', 'relay-toolrow', editor, 'Workflows　　Runs');
      const stage = util.el('main', 'ref-stage', editor);
      const stats = util.el('aside', 'relay-stats', body);
      if (display === 'panel') {
        const taskPanel = body.querySelector('.ref-panel');
        taskPanel.querySelector('.ref-panel-title').textContent = 'Task Note';
        stats.appendChild(taskPanel);
        body.classList.add('relay-with-panel');
      }
      const types = util.el('div', 'relay-palette-space', stats);
      const connections = util.el('div', 'relay-card relay-connections', stats);
      util.el('strong', '', connections, 'Help & Tips');
      const tips = util.el('ul', 'relay-tips', connections);
      for (const tip of ['Drag components from the list to add them to the canvas.', 'Click a component to view or edit its settings.', 'Drag from a connection point to create a link between steps.', 'Use decision steps to route by condition (e.g., Yes/No, True/False).', 'Select a step to see more information.']) util.el('li', '', tips, tip);
      S.frameAlign(_c, stage);
      Object.assign(_c, { appIcon, connections, edhead, editor, edtitle, stage, stats, toolrow, types });
    },
    'frame.toast': (base, S) => function (_c) {
      const { W, closeLabel, ctx, display, editor, stats, util } = _c;
      if (display === 'toast') {
        const note = util.el('div', 'ref-note', document.body);
        const sidebarRect = stats.getBoundingClientRect();
        note.style.right = (W - sidebarRect.right) + 'px';
        note.style.width = Math.min(420, sidebarRect.width) + 'px';
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
      const { ctx, display, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction relay-goal-header', document.body, ctx.instruction);
    },
  };

  env.site({
    name: 'design-use-workflow-editor-reroute-05',
    template: 'site/base',
    design: { parts },
  });
})();
