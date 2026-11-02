// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const TITLES = ['Rivermere Public Library — Release Planner'];

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
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
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
          const heading = util.el(
            'div',
            'lib-overlay-heading',
            box,
            kind === 'chat' ? 'Library Support' : 'Stay in the loop',
          );
          box.prepend(heading);
          if (kind === 'chat') heading.append(dismiss);
          else {
            const close = util.el('button', 'lib-overlay-close', heading, '×');
            close.type = 'button';
            close.title = 'Close';
            close.setAttribute('aria-label', 'Close');
            close.onclick = () => dismiss.click();
            const envelope = util.el('div', 'lib-envelope', box);
            envelope.innerHTML =
              '<svg viewBox="0 0 90 75" aria-hidden="true"><path fill="#e5e3dc" stroke="#777" d="M5 21L45 3l40 18v49H5z"/><path fill="#9a1724" stroke="#61101a" d="M12 16h66v39H12z"/><path fill="#faf9f5" stroke="#777" d="M5 21l40 32 40-32v49H5z"/><path stroke="#999" d="M5 70l30-26m50 26L55 44"/></svg>';
          }
          const inputRow = util.el('div', 'lib-overlay-input', box);
          const field = util.el('input', '', inputRow);
          field.type = 'text';
          field.placeholder = kind === 'chat' ? 'Type a message…' : 'your@email.com';
          field.setAttribute('aria-label', kind === 'chat' ? 'Message' : 'Email address');
          if (kind === 'chat') {
            const send = util.el('button', 'lib-chat-send', inputRow, 'Send');
            send.type = 'button';
            send.onclick = () => env.log('overlay-click', { label: 'Send' });
          } else box.insertBefore(inputRow, row);
        }
        if (kind === 'cookie' || kind === 'banner') {
          util.el('span', 'lib-overlay-symbol', el, kind === 'cookie' ? '◉' : '⚑');
          const close = util.el('button', 'lib-overlay-close', el, '×');
          close.type = 'button';
          close.setAttribute('aria-label', 'Close');
          close.title = 'Close';
          close.onclick = () => dismiss.click();
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { display, lr, nav, rng, util, word } = _c;
        const { K } = S;
        const header = util.el('header', 'ref-task', document.body);
        const appIcon = util.el('span', 'lib-app-icon', header);
        appIcon.innerHTML =
          '<svg viewBox="0 0 24 28" aria-hidden="true"><path fill="#fffdf2" stroke="#36362c" d="M2 1h15l5 5v21H2z"/><path fill="#dbd2ab" stroke="#696550" d="M17 1v6h5"/><circle fill="#c45c2f" cx="11" cy="17" r="7"/><path fill="#438353" d="M9 9l10 5-6 8-5-6z"/><path fill="#faf3ce" d="M7 12h7v10H7z"/><path stroke="#ca623a" d="M9 15h4m-4 3h4"/></svg>';
        // Native desktop menu and planner toolbar sit directly below the window title.
        const menu = util.el('nav', 'gtk-menubar', document.body);
        header.after(menu);
        for (const item of ['File', 'Edit', 'View', 'Project', 'Tasks', 'Team', 'Tools', 'Help']) {
          const m = util.el('span', 'gtk-menu-item', menu, item);
          m.addEventListener('click', () => env.log('decoy', { what: 'menu', label: item }));
        }
        const appbar = util.el('div', 'gtk-toolbar', document.body);
        menu.after(appbar);
        const appActions = [
          ['▯', 'New'],
          ['▱', 'Open'],
          ['▤', 'Print'],
          ['✚', 'Add Task'],
          ['◆', 'Add Milestone'],
          ['🔗', 'Link Tasks'],
          ['↗', 'Unlink'],
          ['⊕', 'Zoom In'],
          ['⊖', 'Zoom Out'],
          ['▦', 'Today'],
        ];
        const toolArt = {
          'New':
            '<path fill="#fffefa" stroke="#171820" stroke-width="1.6" d="M7 3h15l6 6v24H7z"/><path fill="#d9d8d1" stroke="#171820" d="M22 3v7h6"/>',
          'Open':
            '<path fill="#fff5a5" stroke="#31352b" stroke-width="1.6" d="M3 12V7h11l4 4h14v20H3z"/><path fill="#e3cc5c" stroke="#31352b" stroke-width="1.6" d="M3 31l6-15h25l-7 15z"/><path stroke="#fffbdc" stroke-width="2" d="M10 18h20"/>',
          'Print':
            '<path fill="#fff" stroke="#26303b" stroke-width="1.5" d="M11 3h17v12H11z"/><path fill="#a9b6c1" stroke="#26303b" stroke-width="1.5" d="M5 15h29v15H5z"/><path fill="#fff" stroke="#26303b" stroke-width="1.5" d="M10 25h18v10H10z"/><path stroke="#fff" stroke-width="2" d="M8 18h23"/><path stroke="#153b67" stroke-width="2" d="M15 7h9m-9 4h7"/><path stroke="#111" stroke-width="2" d="M29 22h2"/>',
          'Add Task':
            '<path fill="#fffef7" stroke="#253529" stroke-width="1.6" d="M6 3h26v31H6z"/><path stroke="#448e3c" stroke-width="3" d="M19 7v14m-7-7h14"/><path stroke="#448e3c" stroke-width="1.7" fill="none" d="M12 25l3 3 5-5"/>',
          'Add Milestone':
            '<path stroke="#24222b" stroke-width="1.4" d="M19 2v34M3 19h32"/><path fill="#ed5554" stroke="#20212a" stroke-width="1.5" d="M19 6l10 13-10 11L9 19z"/><path stroke="#ffb0a1" stroke-width="2" d="M19 9l-6 10"/>',
          'Link Tasks':
            '<path stroke="#252b21" stroke-width="2" d="M8 8l23 23"/><g fill="#9dcb8e" stroke="#243528" stroke-width="1.4"><path d="M4 3h7v10H4zM12 11h7v10h-7zM20 19h7v10h-7zM28 27h7v8h-7z"/></g><path stroke="#fff" d="M6 5h3m5 8h3m5 8h3m5 8h3"/>',
          'Unlink':
            '<path stroke="#1c2119" stroke-width="3" d="M2 19h18"/><path fill="#df4a45" stroke="#1c2119" stroke-width="2" d="M22 13h8a6 6 0 010 12h-8z"/><path fill="#fffaf0" stroke="#1c2119" d="M24 16h6a3 3 0 010 6h-6z"/>',
          'Zoom In':
            '<path stroke="#1c202a" stroke-width="7" d="M25 25l9 9"/><path stroke="#afaca0" stroke-width="3" d="M25 25l9 9"/><circle cx="16" cy="15" r="12" fill="#fff" stroke="#142335" stroke-width="2"/><circle cx="16" cy="15" r="9" fill="#fff" stroke="#1764da" stroke-width="3"/><path stroke="#143680" stroke-width="2.7" d="M10 15h12m-6-6v12"/>',
          'Zoom Out':
            '<path stroke="#1c202a" stroke-width="7" d="M25 25l9 9"/><path stroke="#afaca0" stroke-width="3" d="M25 25l9 9"/><circle cx="16" cy="15" r="12" fill="#fff" stroke="#142335" stroke-width="2"/><circle cx="16" cy="15" r="9" fill="#fff" stroke="#1764da" stroke-width="3"/><path stroke="#143680" stroke-width="2.7" d="M10 15h12"/>',
          'Today':
            '<path fill="#fff" stroke="#14202d" stroke-width="1.7" d="M5 6h28v29H5z"/><path fill="#377abe" stroke="#14202d" d="M5 6h28v8H5z"/><path stroke="#14202d" stroke-width="3" d="M12 3v7m14-7v7"/><path stroke="#14202d" stroke-width="2.6" stroke-dasharray="3 3" d="M10 19h19M10 24h19M10 29h19"/>',
        };
        for (const [icon, labelText] of appActions) {
          const action = util.el('button', `gtk-tool${labelText === 'Unlink' ? ' is-disabled' : ''}`, appbar);
          action.type = 'button';
          action.dataset.role = 'xtra';
          const picture = util.el('span', 'gtk-tool-icon', action);
          picture.innerHTML = `<svg viewBox="0 0 38 38" aria-hidden="true">${toolArt[labelText]}</svg>`;
          util.el('span', '', action, labelText);
          action.addEventListener('click', () => env.log('decoy', { what: 'toolbar', label: labelText }));
        }
        if (display !== 'header' || nav) {
          const title = rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
          brand.dataset.role = 'brand';
        }
        if (!header.querySelector('.ref-brand')) util.el('div', 'ref-brand', header, TITLES[0]);
        Object.assign(_c, { appActions, appIcon, appbar, header, menu, toolArt });
      },
    'frame.toast': (base, S) =>
      function (_c) {
        const { closeLabel, ctx, display, util } = _c;
        if (display === 'toast') {
          const note = util.el('div', 'ref-note', document.body);
          util.el('div', 'ref-note-text', note, ctx.instruction);
          const x = util.el('button', 'ref-note-x', note, '×');
          x.type = 'button';
          x.setAttribute('aria-label', closeLabel);
          x.addEventListener('click', () => {
            note.style.visibility = 'hidden';
            env.log('note-close');
          });
          document.body.style.setProperty('--library-note-height', `${note.getBoundingClientRect().height}px`);
        }
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { endBtn, header, label, placement, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        const dockbar = util.el('nav', 'gtk-dock', document.body);
        for (const [icon, text] of [
          ['▣', 'Timeline'],
          ['▦', 'Board'],
          ['♟', 'Teams'],
          ['⬟', 'Releases'],
          ['▥', 'Reports'],
        ]) {
          const tab = util.el('button', `gtk-dock-tab${text === 'Timeline' ? ' active' : ''}`, dockbar);
          tab.type = 'button';
          tab.dataset.role = 'xtra';
          util.el('span', 'gtk-dock-icon', tab, icon);
          util.el('span', '', tab, text);
          tab.addEventListener('click', () => env.log('decoy', { what: 'navigation', label: text }));
        }
        const windowControls = util.el('div', 'lib-window-controls', header);
        for (const mark of ['−', '□', '×']) util.el('span', 'lib-window-control', windowControls, mark);
        Object.assign(_c, { dockbar, submit, windowControls });
      },
  };

  env.site({
    name: 'design-use-project-board-dependency-04',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
