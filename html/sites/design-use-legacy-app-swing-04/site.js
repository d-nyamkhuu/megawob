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
        if (kind === 'promo') {
          const title = util.el('div', 'ref-ov-title', box, 'Stay Informed');
          box.prepend(title);
          const close = util.el('button', 'ref-ov-window-close', title, '×');
          close.type = 'button';
          close.setAttribute('aria-label', word ? word('close') : 'Close');
          close.addEventListener('click', () => ctx.dismiss('close'));
          const mark = util.el('div', 'ref-ov-mail', box, '✉');
          const textNode = box.querySelector('.ref-ov-text');
          box.insertBefore(mark, textNode);
          const heading = util.el('strong', 'ref-ov-heading', box, 'Get product updates');
          box.insertBefore(heading, textNode);
          const input = util.el('input', 'ref-ov-email', box);
          input.type = 'email';
          input.placeholder = 'Enter your email address';
          input.setAttribute('aria-label', 'Email address');
          box.insertBefore(input, row);
        }
        if (kind === 'banner' || kind === 'toast') {
          el.style.top = `${document.querySelector('.ref-task').getBoundingClientRect().bottom + (kind === 'toast' ? 8 : 0)}px`;
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const titlebar = util.el('div', 'swing-titlebar', header);
        util.el('div', 'swing-company', titlebar, 'Operations Manager - Record Maintenance');
        util.el('div', 'swing-appname', titlebar, '');
        util.el('div', 'swing-meta', titlebar, '');
        const appnav = util.el('nav', 'swing-nav', header);
        for (const [i, item] of ['File', 'Edit', 'View', 'Record', 'Tools', 'Reports', 'Window', 'Help'].entries()) {
          const a = util.el('a', `swing-navlink${i === 3 ? ' active' : ''}`, appnav, item);
          a.href = '#';
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'nav', label: item });
          });
        }
        const iconbar = util.el('div', 'swing-iconbar', header);
        const iconSvg = {
          new: '<svg viewBox="0 0 36 36" aria-hidden="true"><path d="M7 2h16l7 7v25H7z" fill="#f6f6f3" stroke="#555" stroke-width="1.5"/><path d="M23 2v8h7M11 16h15M11 20h15M11 24h15" fill="none" stroke="#42608a" stroke-width="1.5"/></svg>',
          open: '<svg viewBox="0 0 36 36" aria-hidden="true"><path d="M2 9h12l4 4h16l-3 18H3z" fill="#f4d33f" stroke="#5d4b0b" stroke-width="1.5"/><path d="M2 16h31" stroke="#fff3a2" stroke-width="2"/></svg>',
          delete:
            '<svg viewBox="0 0 36 36" aria-hidden="true"><path d="M7 2h16l7 7v25H7z" fill="#e4e4e1" stroke="#555" stroke-width="1.5"/><path d="M23 2v8h7M11 16h15M11 20h15M11 24h15M11 28h15" fill="none" stroke="#777" stroke-width="1.5"/></svg>',
          first:
            '<svg viewBox="0 0 36 36" aria-hidden="true"><path d="M8 4v28M28 5 14 18l14 13z" fill="#1761b7" stroke="#111" stroke-width="1.5"/></svg>',
          prev: '<svg viewBox="0 0 36 36" aria-hidden="true"><path d="m27 5-15 13 15 13z" fill="#1761b7" stroke="#111" stroke-width="1.5"/></svg>',
          next: '<svg viewBox="0 0 36 36" aria-hidden="true"><path d="m9 5 15 13L9 31z" fill="#1761b7" stroke="#111" stroke-width="1.5"/></svg>',
          last: '<svg viewBox="0 0 36 36" aria-hidden="true"><path d="m8 5 14 13L8 31zM28 4v28" fill="#1761b7" stroke="#111" stroke-width="1.5"/></svg>',
          find: '<svg viewBox="0 0 36 36" aria-hidden="true"><path d="M5 11q0-5 6-5t6 5v8H5zM19 11q0-5 6-5t6 5v8H19zM8 21v5M14 21v5M22 21v5M28 21v5M8 26h6M22 26h6" fill="#dfe5e8" stroke="#222" stroke-width="1.8"/><path d="M11 6v13M25 6v13" stroke="#164a92" stroke-width="2"/></svg>',
          report:
            '<svg viewBox="0 0 36 36" aria-hidden="true"><path d="M7 2h16l7 7v25H7z" fill="#fff" stroke="#555" stroke-width="1.5"/><path d="M23 2v8h7M11 16h14M11 20h14M11 24h14M11 28h10" fill="none" stroke="#164a92" stroke-width="1.7"/></svg>',
          print:
            '<svg viewBox="0 0 36 36" aria-hidden="true"><path d="M10 3h16v9H10zM7 12h22q3 0 3 3v11h-6v7H10v-7H4V15q0-3 3-3z" fill="#e7e7e4" stroke="#333" stroke-width="1.5"/><path d="M10 23h16v10H10zM8 16h3" fill="#fff" stroke="#333" stroke-width="1.5"/><circle cx="27" cy="17" r="1.5" fill="#164a92"/></svg>',
        };
        for (const [icon, caption] of [
          ['new', 'New'],
          ['open', 'Open'],
          ['delete', 'Delete'],
          ['first', 'First'],
          ['prev', 'Prev'],
          ['next', 'Next'],
          ['last', 'Last'],
          ['find', 'Find'],
          ['report', 'Report'],
          ['print', 'Print'],
        ]) {
          const item = util.el('div', 'swing-iconitem', iconbar);
          util.el('span', 'swing-icon', item).innerHTML = iconSvg[icon];
          util.el('span', 'swing-caption', item, caption);
        }
        S.frameBrand(_c, header);
        Object.assign(_c, { appnav, header, iconSvg, iconbar, titlebar });
      },
    'frame.instruction': (base, S) =>
      function (_c) {
        const { ctx, display, header, titlebar, util } = _c;
        if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
        else util.el('div', 'ref-spacer', header);
        const headerNote = header.querySelector('.ref-instruction');
        if (headerNote) {
          headerNote.classList.add('swing-instruction');
          titlebar.appendChild(headerNote);
        }
        Object.assign(_c, { headerNote });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, header, iconbar, label, placement, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', header);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        iconbar.appendChild(headerTools);
        Object.assign(_c, { headerTools, submit });
      },
  };

  env.site({
    name: 'design-use-legacy-app-swing-04',
    template: 'site/base',
    design: { parts },
  });
})();
