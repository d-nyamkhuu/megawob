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
      if (kind === 'cookie') {
        const icon = util.el('span', 'relay-cookie-icon', el, '●');
        el.prepend(icon);
      }
      if (kind === 'chat') {
        const title = util.el('div', 'relay-chat-title', el, 'Chat with us');
        title.append(dismiss); el.prepend(title);
        const inputRow = util.el('div', 'relay-chat-input', el);
        const input = util.el('input', '', inputRow);
        input.placeholder = 'Type a message...'; input.setAttribute('aria-label','Chat message');
        const send = util.el('button','ref-ov-btn ref-ov-primary',inputRow,'Send');
        send.addEventListener('click',()=>env.log('overlay-click',{label:'Send'}));
      }
      if (kind === 'promo') {
        const title = util.el('strong', 'relay-promo-title', box, '✉　 Get the latest updates');
        box.prepend(title);
        const email = util.el('input','relay-promo-email',box); email.placeholder = 'Enter your email address...'; email.setAttribute('aria-label','Email address');
        row.before(email);
        const x = util.el('button','relay-promo-close',box,'×'); x.setAttribute('aria-label','Close');
        x.addEventListener('click',()=>ctx.dismiss('close'));
      }
      if (kind === 'banner') document.querySelector('.relay-header').after(el);
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
      const windowIcon = util.el('span', 'relay-window-icon', header);
      windowIcon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 3h15v18H4z" fill="#e8edf0" stroke="#253343" stroke-width="1.6"/><path d="M4 7h15M7 3v4" stroke="#253343" stroke-width="1.5"/><path d="M2 9h19v5H2z" fill="#aebdc9" stroke="#253343"/></svg>';
      const windowTools = util.el('div', 'relay-window-controls', header);
      for (const [name, glyph] of [['Minimize','_'],['Maximize','□'],['Close','×']]) {
        const control = util.el('span', 'relay-window-control', windowTools, glyph);
        control.setAttribute('aria-label', name);
      }
      if (display !== 'header' || nav) {
        if (display !== 'header' || navDraw) rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Relayboard');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        if (navDraw) rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of ['File', 'Edit', 'View', 'Workflow', 'Node', 'Window', 'Help']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header, windowIcon, windowTools });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      const search = util.el('div', 'relay-search', header, '⌕　Search workflows...');
      util.el('div', 'relay-bell', header, '♟');
      util.el('div', 'relay-avatar', header, 'JD');
      Object.assign(_c, { search });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body relay-layout', document.body);
      const summary = util.el('aside', 'relay-summary', body);
      util.el('strong', '', summary, 'Workflow Summary');
      const folderList = util.el('div', 'relay-folders', summary);
      for (const [icon, item] of [['📁','Order Processing'],['📁','Customer Support'],['📁','Inventory Sync'],['📁','Notifications'],['📁','Data Maintenance']]) {
        const row = util.el('div', 'relay-folder', folderList);
        util.el('span', 'relay-folder-icon', row, icon);
        util.el('span', '', row, item);
        if (item === 'Order Processing') row.classList.add('selected');
      }
      const details = util.el('div', 'relay-details', summary);
      util.el('strong', '', details, 'Details');
      util.el('div', '', details, 'Name:');
      util.el('b', '', details, 'Order Processing');
      util.el('div', '', details, 'Description:');
      util.el('span', '', details, 'Process new orders from multiple channels');
      util.el('div', '', details, 'Owner:');
      util.el('span', '', details, 'Operations');
      util.el('div', '', details, 'Last Modified:');
      util.el('span', '', details, 'Mar 12, 1999　10:24 AM');
      util.el('div', '', details, 'Nodes:　　　　 6');
      util.el('div', '', details, 'Connections:　 5');
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, details, folderList, summary });
    },
    'frame.panel': (base, S) => function (_c) {
      const { body, ctx, display, lr, rng, summary, util, word } = _c;
      const { K } = S;
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel', summary);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
      const editor = util.el('section', 'relay-editor', body);
      const edhead = util.el('div', 'relay-editor-head', editor);
      util.el('span', 'relay-app-icon', edhead, '⌘');
      const edtitle = util.el('div', 'relay-title', edhead);
      util.el('b', '', edtitle, 'Order Processing');
      util.el('span', '', edtitle, 'Last updated today at 10:24 AM');
      util.el('div', 'relay-controls', edhead, '−　 100%　 +　　⛶　 ▤');
      const toolrow = util.el('div', 'relay-toolrow', editor, 'Workflows　　Runs');
      const stage = util.el('main', 'ref-stage', editor);
      const stats = util.el('aside', 'relay-stats', body);
      const types = util.el('div', 'relay-card', stats);
      util.el('strong', '', types, 'Steps');
      for (const [ico, n, name, color] of [['➜','1','Trigger','green'],['■','2','Action','blue'],['◆','1','Condition','purple'],['▤','1','Transform','orange'],['▤','1','Data Store','red'],['✉','1','Send','blue'],['◷','1','Delay','green'],['▤','1','Log','orange']]) {
        const row = util.el('div', 'relay-type', types); util.el('b', color, row, ico); util.el('em', '', row, n); util.el('span', '', row, name);
      }
      const connections = util.el('div', 'relay-card relay-connections', stats);
      util.el('strong', '', connections, 'Connections');
      for (const [n, label, color] of [['5','Total','blue'],['0','Errors','red'],['0','Warnings','orange']]) {
        const row = util.el('div', 'relay-count', connections); util.el('b', color, row, n); util.el('span', '', row, label);
      }
      Object.assign(_c, { connections, edhead, editor, edtitle, stage, stats, toolrow, types });
    },
    'frame.stage': (base, S) => function (_c) {
      const { edhead, stage, toolrow, util } = _c;
      S.frameAlign(_c, stage);

      // The widget builds the canvas directly, without the inherited portal panels.
      edhead.remove();
      toolrow.remove();
      const dockbar = util.el('nav', 'relay-dock', document.body);
      const dockIcons = [
        '<path d="M4 4h12v9H4zm12 9h14v10H16zm-1 11h17v12H15z" fill="#87b0ff" stroke="#15243b" stroke-width="2"/><path d="M10 13v15h5m8-5v1" fill="none" stroke="#15243b" stroke-width="2"/>',
        '<path d="m5 33 4-29 6 1-4 29zm11 0V2h6v31zm10 0-2-27 6-1 3 28z" fill="#ffd833" stroke="#222" stroke-width="2"/><path d="m6 26 6 1M16 7h6m3 5h6" stroke="#0754ca" stroke-width="5"/>',
        '<path d="M4 3h28v33H4z" fill="#eee" stroke="#222" stroke-width="2"/><path d="M8 8h5v5H8zm0 9h5v5H8zm0 9h5v5H8z" fill="none" stroke="#444"/><path d="M17 9h11m-11 4h8m-8 5h11m-11 4h8m-8 5h11m-11 4h8" stroke="#444"/>',
        '<path d="m14 1 7 0 1 5 4 2 5-2 4 6-4 4v5l4 3-4 6-5-2-4 2-1 6h-7l-1-6-5-2-4 2-4-6 4-3v-5l-4-4 4-6 4 2 5-2z" fill="#82a5ef" stroke="#14223b" stroke-width="1.5"/><circle cx="17" cy="18" r="7" fill="#ccc" stroke="#14223b" stroke-width="2"/>'
      ];
      ['Workflows','Library','Activity','Settings'].forEach((name, i) => {
        const item = util.el('button', 'relay-dock-item' + (i === 0 ? ' selected' : ''), dockbar);
        item.type = 'button';
        const icon = util.el('span', 'relay-dock-icon', item);
        icon.innerHTML = '<svg viewBox="0 0 38 38">' + dockIcons[i] + '</svg>';
        util.el('span', '', item, name);
        item.addEventListener('click', () => env.log('decoy', {what:'nav', label:name}));
      });
      for (const b of document.querySelectorAll('button')) if (b.textContent.trim() === 'Full screen') b.style.display = 'none';
      Object.assign(_c, { dockIcons, dockbar });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-workflow-editor-reroute-04',
    template: 'site/base',
    design: { parts },
  });
})();
