// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  // Small sculpted tool-shelf icons, drawn locally like the workstation originals.
  function shelfIcon(kind) {
    const shapes = {
      pyramid:
        '<path d="M25 5 5 38 45 38Z" fill="url(#sgi-light)"/><path d="M25 5 25 38 45 38Z" fill="#55527d"/><path d="M25 5 5 38 25 31Z" fill="#e7e3ff"/>',
      timeline:
        '<path d="M6 6H45V41H6Z" fill="url(#sgi-light)"/><path d="M11 11H40V36H11Z" fill="#4f4b73"/><path d="M16 31V23H20V31M24 31V18H28V31M32 31V14H36V31" stroke="#eeeaff" stroke-width="3"/>',
      board: '<path d="M6 6H24V31H6Z M16 12H34V37H16Z M26 18H44V43H26Z" fill="url(#sgi-light)" stroke="#35354c"/>',
      teams:
        '<g fill="url(#sgi-light)" stroke="#37364f"><circle cx="12" cy="15" r="6"/><circle cx="26" cy="11" r="7"/><circle cx="40" cy="15" r="6"/><path d="M3 40V29Q12 19 21 29V40Z M17 41V25Q26 16 35 25V41Z M33 40V29Q41 20 48 29V40Z"/></g>',
      diamond:
        '<path d="M25 5 42 23 25 42 8 23Z" fill="url(#sgi-light)"/><path d="m8 23 17 19 17-19-17 8Z" fill="#716aab"/>',
      reports:
        '<path d="M9 5H41V43H9Z" fill="url(#sgi-light)"/><path d="M15 13H35M15 21H35M15 29H35M15 36H31" stroke="#393650" stroke-width="3"/>',
      folder:
        '<path d="M4 14 17 13 21 8 35 8 35 16 46 16 41 40H5Z" fill="#a6acbd"/><path d="M6 24 21 17 46 16 41 40H5Z" fill="url(#sgi-light)"/>',
      hierarchy:
        '<path d="M20 6H35V20H20Z M7 31H22V46H7Z M33 31H48V46H33Z" fill="url(#sgi-light)"/><path d="M27 20V26H14V31M27 26H40V31" stroke="#ccd0e7" fill="none"/>',
      chart:
        '<path d="M5 43V28H15V43Z M22 43V18H32V43Z M39 43V7H49V43Z" fill="url(#sgi-light)"/><path d="M7 18 19 11 27 14 42 3" stroke="#3c4057" fill="none"/>',
    };
    return (
      '<svg viewBox="0 0 52 50" aria-hidden="true"><defs><linearGradient id="sgi-light" x2="1" y2="1"><stop stop-color="#fff"/><stop offset=".35" stop-color="#c5bff1"/><stop offset=".7" stop-color="#8d86b7"/><stop offset="1" stop-color="#4b4b6b"/></linearGradient></defs><g stroke="#37364f" stroke-width="1.4">' +
      shapes[kind] +
      '</g></svg>'
    );
  }

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
        if (kind === 'chat') {
          const head = util.el('div', 'sgi-overlay-heading', el);
          util.el('span', '', head, '☏  Need help?');
          head.appendChild(dismiss);
          el.prepend(head);
          const composer = util.el('div', 'sgi-chat-composer', el);
          util.el('span', 'sgi-placeholder', composer, 'Type a message…');
          const send = util.el('button', 'ref-ov-btn ref-ov-primary', composer, '➤');
          send.type = 'button';
          send.addEventListener('click', () => env.log('overlay-click', { label: 'Send' }));
        }
        if (kind === 'promo') {
          const head = util.el('div', 'sgi-overlay-heading', box);
          util.el('span', '', head, '✉  Stay up to date');
          box.prepend(head);
          const address = util.el('div', 'sgi-placeholder sgi-promo-field', box, 'Your email address');
          const agreement = util.el(
            'div',
            'sgi-promo-agreement',
            box,
            '☑  I agree to receive product updates and marketing emails.',
          );
          row.before(address, agreement);
        }
        if (kind === 'banner' || kind === 'promo') {
          const header = document.querySelector('.ref-task');
          if (header) el.style.top = header.getBoundingClientRect().bottom + 6 + 'px';
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.theme': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
        const { rng, util, content } = ctx;
        let name = rng.pick(Object.keys(THEMES));
        const root = document.documentElement;
        let accent = rng.pick(ACCENTS);
        const tr = rng.fork('chrome/theme');
        if (tr.bool(0.08)) {
          name = 'low';
          accent = tr.pick(LOW_ACCENTS);
        }
        for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name]))
          root.style.setProperty(`--${k}`, v);
        // SGI workstation palette: blue-grey desktop, lavender bevels and slate frame.
        root.style.setProperty('--bg', '#8c95a6');
        root.style.setProperty('--panel', '#edeef4');
        root.style.setProperty('--fg', '#111329');
        root.style.setProperty('--muted', '#4f526f');
        root.style.setProperty('--line', '#7d8498');
        root.style.setProperty('--accent', '#adaadb');
        root.dataset.theme = name;
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
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
        const irixEnd = rng.fork('chrome/irix-end-forms');
        const referenceEnd = irixEnd.bool(0.55);
        if (referenceEnd && !word) label = 'Confirm';
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        Object.assign(_c, { collide, cr, decoys, irixEnd, label, nav, placement, referenceEnd, sidebar, wantFooter });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        Object.assign(_c, { stage });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { body, display, endBtn, header, headerTools, irixEnd, label, placement, referenceEnd, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        const titlebar = util.el('div', 'sgi-titlebar', header);
        util.el('span', 'sgi-window-menu', titlebar, '▧');
        util.el('span', 'sgi-window-title', titlebar, 'ProjectPlanner 2.3  -  Release Timeline');
        titlebar.appendChild(headerTools);
        const windowTools = util.el('div', 'sgi-window-tools', titlebar);
        for (const mark of ['▁', '□', '×']) {
          const b = util.el('button', 'sgi-window-button', windowTools, mark);
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label: mark }));
        }
        const shelf = util.el('nav', 'sgi-navigation', header);
        for (const [text, icon] of [
          ['Overview', 'pyramid'],
          ['Timeline', 'timeline'],
          ['Board', 'board'],
          ['Teams', 'teams'],
          ['Milestones', 'diamond'],
          ['Reports', 'reports'],
        ]) {
          const item = util.el('button', 'sgi-nav-item' + (text === 'Timeline' ? ' selected' : ''), shelf);
          item.type = 'button';
          const art = util.el('span', 'sgi-icon', item);
          art.innerHTML = shelfIcon(icon);
          util.el('span', '', item, text);
          item.addEventListener('click', () => env.log('decoy', { label: text }));
        }
        const wordmark = util.el('div', 'sgi-wordmark', shelf);
        util.el('b', '', wordmark, 'sgi');
        util.el('span', '', wordmark, 'IRIX');
        header.prepend(titlebar, shelf);
        const rail = util.el('aside', 'sgi-rail', body);
        for (const kind of ['folder', 'hierarchy', 'reports', 'chart', 'teams']) {
          const tool = util.el('button', 'sgi-rail-tool', rail);
          tool.type = 'button';
          tool.setAttribute('aria-label', kind);
          tool.innerHTML = shelfIcon(kind);
          tool.addEventListener('click', () => env.log('decoy', { label: kind }));
        }
        const help = util.el('aside', 'sgi-help', body);
        util.el('div', 'sgi-panel-heading', help, 'Legend & Help');
        const legend = util.el('div', 'sgi-legend', help);
        for (const [kind, text] of [
          ['bar', 'Task bar (duration)'],
          ['arrow', 'Finish-to-start dependency'],
          ['diamond', 'Milestone'],
          ['weekend', 'Non-working day (weekend)'],
        ]) {
          const row = util.el('div', 'sgi-legend-row', legend);
          util.el('span', 'sgi-key sgi-key-' + kind, row);
          util.el('span', '', row, text);
        }
        const tips = util.el('div', 'sgi-tips', help);
        util.el('strong', '', tips, 'Tips');
        const list = util.el('ul', '', tips);
        for (const text of [
          'Drag a task bar to move its start date.',
          'Drag the right edge to change its duration.',
          'Tasks are linked finish-to-start.',
          'Milestones mark key dates on the timeline.',
        ])
          util.el('li', '', list, text);
        if (display === 'panel') {
          const column = util.el('div', 'sgi-right-column', body);
          column.append(body.querySelector('.ref-panel'), help);
        }
        if (submit) {
          const form = referenceEnd ? 'header' : irixEnd.pick(['footer', 'icon', 'link']);
          submit.className = form === 'link' ? 'ref-endlink' : 'ref-submit' + (form === 'icon' ? ' ref-icon' : '');
          submit.textContent = form === 'icon' ? '✓' : label;
          if (form === 'footer' || form === 'link') {
            const dock = util.el('div', 'sgi-end-footer', document.body);
            dock.appendChild(submit);
          } else shelf.insertBefore(submit, wordmark);
        }
        Object.assign(_c, { help, legend, list, rail, shelf, submit, tips, titlebar, windowTools, wordmark });
      },
  };

  env.site({
    name: 'design-use-project-board-gantt-resize-04',
    template: 'site/base',
    design: { parts },
  });
})();
