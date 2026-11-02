// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const closeLabel = word ? word('close') : 'Close';
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
      if (kind === 'promo') {
        const caption = util.el('div', 'qt-modal-caption', box);
        const close = util.el('button', 'qt-modal-close', caption, '×');
        close.setAttribute('aria-label', closeLabel);
        close.addEventListener('click', () => ctx.dismiss('close'));
        box.insertBefore(caption, box.firstChild);
        const artwork = util.el('div', 'qt-newsletter-icon', box, '✉');
        artwork.setAttribute('aria-hidden', 'true');
        const heading = util.el('strong', 'qt-modal-heading', box, 'Get product updates');
        box.insertBefore(heading, box.querySelector('.ref-ov-text'));
        const email = util.el('label', 'qt-newsletter-email', box, 'Email address');
        const input = util.el('input', '', email);
        input.type = 'email';input.placeholder = 'name@company.com';
        box.insertBefore(email, row);
      } else if (kind === 'chat') {
        util.el('strong', 'qt-chat-heading', box, '▣  Need help?');
        const compose = util.el('div', 'qt-chat-compose', box);
        const input = util.el('input', '', compose);
        input.placeholder = 'Type a message…';input.setAttribute('aria-label', 'Chat message');
        const send = util.el('button', '', compose, '➤');
        send.setAttribute('aria-label', 'Send chat message');
        send.addEventListener('click', () => env.log('overlay-click', {label:'Send chat message'}));
      } else if (kind === 'cookie') {
        const close = util.el('button', 'qt-cookie-close', row, '×');
        close.setAttribute('aria-label', closeLabel);
        close.addEventListener('click', () => ctx.dismiss('close'));
      }
      const titleBottom = document.querySelector('.motif-titlebar').getBoundingClientRect().bottom;
      const endDock = document.querySelector('.ref-float-dock') || document.querySelector('.ref-foot');
      const bottomSpace = endDock ? endDock.getBoundingClientRect().height : 0;
      if (kind === 'banner') {
        document.body.insertBefore(el, document.querySelector('.ref-body'));
        el.style.top = titleBottom + 'px';
      } else if (kind === 'promo') {
        el.style.top = titleBottom + 'px';
        el.style.bottom = bottomSpace + 'px';
      } else if (kind === 'cookie' || kind === 'chat') {
        el.style.bottom = (bottomSpace + (kind === 'chat' ? 20 : 10)) + 'px';
      } else if (kind === 'toast') el.style.top = (titleBottom + 10) + 'px';
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.layout': (base, S) => function (_c) {
      const { ctx, util } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');

      // Motif desktop frame: native title bar and the classic application menu row.
      const winbar = util.el('div', 'motif-titlebar', document.body);
      util.el('span', 'motif-appicon', winbar, '▤');
      util.el('strong', '', winbar, 'Survey Builder - Twin Rivers Hospital · Service feedback (Draft)');
      const wincontrols = util.el('span', 'motif-wincontrols', winbar);
      for (const mark of ['—', '□', '×']) util.el('i', '', wincontrols, mark);
      Object.assign(_c, { H, W, display, roomy, tall, winbar, wincontrols });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter, winbar, wincontrols } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      // The native title bar carries the task note and episode controls.
      winbar.insertBefore(headerTools, wincontrols);
      const titleNote = header.querySelector('.ref-instruction');
      if (titleNote) winbar.querySelector('strong').appendChild(titleNote);
      header.classList.add('qt-empty-header');
      Object.assign(_c, { headerTools, submit, titleNote });
    },
    'frame.panel': (base, S) => function (_c) {
      const { body, ctx, display, lr, rng, util, word } = _c;
      const { K } = S;
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel', body);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
      // Fixed Qt-style information docks surrounding the editor workspace.
      const overview = util.el('aside', 'qt-overview', body);
      util.el('strong', 'qt-dock-title', overview, 'Form Overview');
      util.el('strong', 'qt-form-name', overview, 'Twin Rivers Hospital · Service feedback');
      util.el('span', 'qt-draft', overview, 'Draft');
      util.el('div', 'qt-rule', overview);
      util.el('div', 'qt-date', overview, 'Created:      Apr 12, 2007');
      util.el('div', 'qt-date', overview, 'Modified:    Apr 12, 2007');
      util.el('div', 'qt-rule', overview);
      util.el('div', 'qt-count', overview, 'Sections                         3');
      util.el('div', 'qt-count', overview, 'Questions                    10');
      util.el('div', 'qt-count', overview, 'Estimated time        3 min');
      Object.assign(_c, { overview });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      const stats = util.el('aside', 'qt-stats', body);
      util.el('strong', 'qt-dock-title', stats, 'Form Content');
      util.el('div', 'qt-stat-label', stats, 'Total questions');
      util.el('strong', 'qt-stat-total', stats, '10');
      for (const [section, count] of [['About you','3'],['Your experience','5'],['Additional comments','2']]) {
        util.el('div', 'qt-rule', stats);
        util.el('div', 'qt-stat-label', stats, section);
        util.el('strong', 'qt-stat-number', stats, count);
      }
      util.el('div', 'qt-rule', stats);
      const taskPanel = body.querySelector('.ref-panel');
      if (taskPanel) stats.appendChild(taskPanel);
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage, stats, taskPanel });
    },
    'frame.toast': (base, S) => function (_c) {
      const { closeLabel, ctx, display, util } = _c;
      if (display === 'toast') {
        const note = util.el('div', 'ref-note', document.body);
        util.el('div', 'ref-note-text', note, ctx.instruction);
        const x = util.el('button', 'ref-note-x', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', closeLabel);
        x.addEventListener('click', () => { note.style.visibility = 'hidden'; env.log('note-close'); });
        document.body.style.setProperty('--qt-note-space', (note.getBoundingClientRect().height + 24) + 'px');
      }
    },
  };

  env.site({
    name: 'design-use-form-builder-addq-02',
    template: 'site/base',
    design: { parts },
  });
})();
