// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) =>
      function overlay(ctx) {
        const { K } = S;
        const { rng, util, kind } = ctx;
        const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
        el.dataset.role = 'overlay';
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        if (kind === 'cookie' || kind === 'promo' || kind === 'chat') {
          util.el(
            'strong',
            'ref-ov-heading',
            box,
            kind === 'cookie' ? 'We use cookies' : kind === 'promo' ? 'Stay in the loop' : 'Need help?',
          );
        }
        if (kind === 'promo') {
          const envelope = util.el('div', 'ref-ov-envelope', box);
          envelope.innerHTML =
            '<svg viewBox="0 0 80 80" aria-hidden="true"><path d="m8 35 32-28 32 28v38H8z" fill="#ffd338" stroke="#222" stroke-width="2"/><path d="M17 13h46v46H17z" fill="#fff" stroke="#222" stroke-width="2"/><path d="M25 23h30M25 31h30M25 39h23" stroke="#222" stroke-width="2"/><path d="m8 35 32 25 32-25M8 73l23-21M72 73 49 52" fill="#ffd338" stroke="#222" stroke-width="2"/></svg>';
          util.el('strong', 'ref-ov-product-title', box, 'Get product updates');
        }
        if (kind === 'chat') {
          const bubble = util.el('span', 'ref-chat-bubble', box);
          bubble.innerHTML =
            '<svg viewBox="0 0 50 50" aria-hidden="true"><path d="M7 24a18 18 0 1 1 10 16L7 45l3-12z" fill="#0068ca"/><path d="M16 17h21v15H26l-6 5v-5h-4z" fill="none" stroke="#fff" stroke-width="2"/><path d="M20 24h2m4 0h2m4 0h2" stroke="#fff" stroke-width="2"/></svg>';
          util.el('strong', 'ref-chat-label', box, 'Chat with our team');
        }
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        if (kind === 'chat') {
          const start = util.el('button', 'ref-chat-start', box, 'Start a chat');
          start.type = 'button';
          start.addEventListener('click', () => env.log('overlay-click', { label: 'Start a chat' }));
        }
        if (kind === 'promo') {
          const email = util.el('input', 'ref-ov-email', box);
          email.type = 'email';
          email.placeholder = 'Your email address';
          email.setAttribute('aria-label', 'Your email address');
        }
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
        if (kind === 'cookie' || kind === 'promo') {
          const x = util.el('button', 'ref-ov-close', box, '×');
          x.type = 'button';
          x.setAttribute('aria-label', word ? word('close') : 'Close');
          x.addEventListener('click', () => ctx.dismiss('close'));
        }
        const help = document.querySelector('.ref-help');
        const clearance = (help?.getBoundingClientRect().height || 100) + 12;
        if (kind === 'cookie' || kind === 'chat') el.style.bottom = `${clearance}px`;
        if (kind === 'promo') {
          const area = document.querySelector('.ref-body').getBoundingClientRect();
          el.style.top = `${area.top}px`;
          el.style.bottom = `${clearance}px`;
        }
        if (kind === 'banner') {
          const body = document.querySelector('.ref-body');
          const top = body.getBoundingClientRect().top;
          el.style.top = `${top}px`;
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.layout': (base, S) =>
      function (_c) {
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
        document.body.dataset.instruction = display;
        Object.assign(_c, { H, W, display, roomy, tall });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const book =
          '<svg viewBox="0 0 48 42" aria-hidden="true"><path d="m5 5 16 2 6 5L44 8l-5 27-16 4-20-8z" fill="#d6a24b" stroke="#17100c" stroke-width="2"/><path d="m7 2 15 3 5 5 15-5-6 25-13 5-6-5L3 27z" fill="#fffaf0" stroke="#211a14" stroke-width="2"/><path d="m22 5-5 25 6 5 4-25M8 7l9 2M7 12l9 2M6 17l9 2M31 12l7-2M30 17l7-2M29 22l7-2" fill="none" stroke="#aaa18d"/><path d="m24 35 14-5" stroke="#572411" stroke-width="2"/></svg>';
        const appIcon = util.el('span', 'ref-app-icon', header);
        appIcon.innerHTML = book;
        util.el('span', 'ref-window-title', header, 'Form Author');
        const controls = util.el('div', 'ref-window-controls', header);
        for (const symbol of ['−', '□', '×']) util.el('span', '', controls, symbol);
        const toolbar = util.el('div', 'ref-toolbar', document.body);
        const toolbarIcons = [
          '<path d="M4 1h11l6 6v16H4z" fill="#fff" stroke="#10122e"/><path d="M15 1v6h6" stroke="#10122e"/>',
          '<path d="M1 7h8l3 3h11l-4 12H1z" fill="#ffd63e" stroke="#191a16"/><path d="M1 7V4h8l3 3h8v3M12 3h8m-3-2 3 2-3 3" stroke="#13284b"/>',
          '<path d="M3 7h18v12H3z" fill="#c0c5c5" stroke="#122039"/><path d="M6 1h12v9H6zM6 15h12v8H6z" fill="#fff" stroke="#122039"/><path d="M8 4h8M8 7h8M8 18h8M8 21h8" stroke="#316382"/><path d="M4 12h16" stroke="#12182b"/>',
          '<path d="m6 2 12 16M18 2 6 18" stroke="#797a78" stroke-width="2.5"/><circle cx="6" cy="19" r="3" stroke="#112352"/><circle cx="18" cy="19" r="3" stroke="#112352"/>',
          '<path d="M1 1h10l5 5v14H1z" fill="#fff" stroke="#171759"/><path d="M9 5h10l4 5v13H9z" fill="#fff" stroke="#171759"/><path d="M4 5h5M4 8h5M4 11h5M12 11h8M12 14h8M12 17h8M12 20h8" stroke="#262689"/>',
          '<path d="M2 3h16v20H2z" fill="#ffcf33" stroke="#211c12"/><path d="M7 7h16v16H7z" fill="#fff" stroke="#1f2344"/><path d="M6 1h8v5H6z" fill="#bcbcb5" stroke="#171717"/><path d="M10 11h10M10 14h10M10 17h10M10 20h10" stroke="#2a3887"/>',
          '<path d="M3 7v9h9l-4-4c10-7 16-1 11 7 10-9 1-19-12-11L3 7z" fill="#347ca3" stroke="#152342" stroke-width="1.3"/>',
          '<path d="M21 7v9h-9l4-4C6 5 0 11 5 19-5 10 4 0 17 8l4-1z" fill="#959592" stroke="#777" stroke-width="1.3"/>',
          '<path d="m12 2 9 10h-6v11H9V12H3z" fill="#2e7da7" stroke="#14253b" stroke-width="1.3"/>',
          '<path d="m12 23 9-10h-6V2H9v11H3z" fill="#2e7da7" stroke="#14253b" stroke-width="1.3"/>',
        ];
        toolbarIcons.forEach((paths, i) => {
          if ([3, 6, 8].includes(i)) util.el('span', 'ref-toolbar-sep', toolbar);
          const icon = util.el('span', 'ref-toolbar-icon', toolbar);
          icon.setAttribute('aria-hidden', 'true');
          icon.innerHTML = `<svg viewBox="0 0 24 24" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths}</g></svg>`;
        });
        S.frameBrand(_c, header);
        Object.assign(_c, { appIcon, book, controls, header, toolbar, toolbarIcons });
      },
    'frame.instruction': (base, S) =>
      function (_c) {
        const { book, ctx, display, header, util } = _c;
        if (display === 'header') {
          const note = util.el('div', 'ref-instruction', header, ctx.instruction);
          const icon = util.el('span', 'ref-note-book', note);
          icon.innerHTML = book;
        } else util.el('div', 'ref-spacer', header);
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, label, placement, toolbar, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', toolbar);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        Object.assign(_c, { headerTools, submit });
      },
    'frame.panel': (base, S) =>
      function (_c) {
        const { body, book, ctx, display, lr, rng, util, word } = _c;
        const { K } = S;
        if (display === 'panel') {
          const panel = util.el('aside', 'ref-panel', body);
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          const panelTitle = util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
          const icon = util.el('span', 'ref-panel-book', panelTitle);
          icon.innerHTML = book;
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
          if (rng.bool(0.5)) body.classList.add('ref-panel-right');
        }
      },
    'frame.toast': (base, S) =>
      function (_c) {
        const { book, closeLabel, ctx, display, util } = _c;
        const help = util.el('aside', 'ref-help', document.body);
        const helpIcon = util.el('div', 'ref-help-icon', help);
        helpIcon.innerHTML = book;
        const helpCopy = util.el('div', 'ref-help-copy', help);
        util.el('strong', 'ref-help-title', helpCopy, 'Routing rules');
        util.el(
          'div',
          'ref-help-text',
          helpCopy,
          'Use answer routing to send respondents to a specific section based on the answer they select. If no rule matches, respondents will continue to the next section.',
        );
        if (display === 'toast') {
          const note = util.el('div', 'ref-note', document.body);
          const icon = util.el('span', 'ref-toast-book', note);
          icon.innerHTML = book;
          util.el('div', 'ref-note-text', note, ctx.instruction);
          const x = util.el('button', 'ref-note-x', note, '×');
          x.type = 'button';
          x.setAttribute('aria-label', closeLabel);
          x.addEventListener('click', () => {
            note.style.visibility = 'hidden';
            env.log('note-close');
          });
        }
        Object.assign(_c, { help, helpCopy, helpIcon });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { body, endBtn, header, help, label, placement, toolbar, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        const headerNote = header.querySelector('.ref-instruction');
        if (headerNote)
          body.style.marginTop = `${toolbar.getBoundingClientRect().bottom + 2 + headerNote.getBoundingClientRect().height}px`;
        const toastNote = document.querySelector('.ref-note');
        if (toastNote)
          body.style.marginBottom = `${help.getBoundingClientRect().height + 13 + toastNote.getBoundingClientRect().height}px`;
        Object.assign(_c, { headerNote, submit, toastNote });
      },
  };

  env.site({
    name: 'design-use-form-builder-branching-02',
    template: 'site/base',
    design: { parts },
  });
})();
