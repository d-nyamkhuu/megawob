(function () {
  'use strict';
  env.site({
    name: 'design-use-shop-returns-05',
    template: 'site/base',
    design: {
      THEMES: { light: { bg: '#d9e6ef', panel: '#fffef8', fg: '#10224a', muted: '#52647b', line: '#aebdca' } },
      ACCENTS: ['#087b99'],
      LOW_ACCENTS: ['#087b99'],
      LOW_THEME: { bg: '#d9e6ef', panel: '#fffef8', fg: '#10224a', muted: '#52647b', line: '#aebdca' },
      parts: {
        overlay: (base) => function (ctx) {
          const result = base(ctx);
          if (ctx.kind !== 'promo') return result;
          const box = result.el.querySelector('.ref-ov-box');
          if (!box) return result;
          const u = ctx.util;
          const title = u.el('div', 'promo-title', box, 'Northwind News');
          box.insertBefore(title, box.firstChild);
          const x = u.el('button', 'promo-close', title, '×');
          x.type = 'button';
          x.setAttribute('aria-label', 'Close');
          x.addEventListener('click', () => ctx.dismiss('close'));
          const art = u.el('div', 'promo-art', box, '✉');
          const message = box.querySelector('.ref-ov-text');
          box.insertBefore(art, message);
          message.textContent = 'Get the latest from Northwind';
          const copy = u.el('p', 'promo-copy', box, 'Sign up for our newsletter to get new arrivals, exclusive offers and helpful tips.');
          message.after(copy);
          const email = u.el('input', 'promo-email', box);
          email.type = 'email';
          email.placeholder = 'Your email address';
          email.setAttribute('aria-label', 'Your email address');
          box.insertBefore(email, box.querySelector('.ref-ov-row'));
          const buttons = box.querySelectorAll('.ref-ov-btn');
          if (buttons[1]) buttons[1].textContent = 'Subscribe';
          return result;
        },
        frame: (_base, S) => function (ctx) {
          const u = ctx.util;
          const rng = ctx.rng.fork('returns/chrome');
          const root = document.documentElement;
          root.style.setProperty('--bg', '#d9e6ef');
          root.style.setProperty('--panel', '#fffef8');
          root.style.setProperty('--fg', '#10224a');
          root.style.setProperty('--muted', '#52647b');
          root.style.setProperty('--line', '#aebdca');
          root.style.setProperty('--accent', '#087b99');
          document.body.className = 'returns-app instruction-' + ctx.display;

          const iconShapes = {
            cart: '<path d="M3 5h4l3 16h15l3-12H9" fill="none" stroke="white" stroke-width="2.4"/><path d="M11 13h14M12 17h12" stroke="white" stroke-width="1.7"/><circle cx="13" cy="26" r="2" fill="white"/><circle cx="23" cy="26" r="2" fill="white"/>',
            home: '<path d="M2 14 16 3l14 11-3 3-3-2v14H8V15l-3 2z" fill="#1262ac" stroke="#091d43" stroke-width="2"/><path d="M14 20h5v9h-5z" fill="white" stroke="#091d43" stroke-width="1.5"/>',
            shop: '<path d="M7 10h18l2 19H5z" fill="#ffd44f" stroke="#091d43" stroke-width="2"/><path d="M11 10V8a5 5 0 0 1 10 0v2" fill="none" stroke="#091d43" stroke-width="2"/>',
            orders: '<path d="M8 4h18v26H6V6h5" fill="#f7fbff" stroke="#091d43" stroke-width="2"/><path d="M12 4h8v4h-8z" fill="#1b70bd" stroke="#091d43" stroke-width="1.5"/><path d="M10 13h12M10 18h12M10 23h12" stroke="#1262ac" stroke-width="2"/>',
            returns: '<path d="M3 8 17 3l13 5-13 5z" fill="#ffcf39" stroke="#091d43" stroke-width="2"/><path d="M3 8v17l14 5V13z" fill="#d99d1e" stroke="#091d43" stroke-width="2"/><path d="M17 13v17l13-5V8z" fill="#edb52b" stroke="#091d43" stroke-width="2"/><path d="M10 5 24 10v5" fill="none" stroke="#091d43" stroke-width="1.5"/>',
            account: '<circle cx="16" cy="9" r="6" fill="#0863b2" stroke="#091d43" stroke-width="2"/><path d="M5 29c1-9 5-12 11-12s10 3 11 12z" fill="#0863b2" stroke="#091d43" stroke-width="2"/>',
            help: '<circle cx="16" cy="16" r="14" fill="#1165b7" stroke="#091d43" stroke-width="2"/><text x="16" y="24" text-anchor="middle" fill="white" font-size="23" font-family="Arial" font-weight="bold">?</text>',
            policy: '<path d="M6 2h20v28H6z" fill="#f9ffff" stroke="#091d43" stroke-width="2"/><path d="M9 7h14v5H9z" fill="#1262ac"/><path d="M10 16h12M10 21h12M10 26h9" stroke="#1262ac" stroke-width="2"/>',
            cycle: '<path d="M26 11A11 11 0 0 0 7 8l-3-3v10h10l-4-4a7 7 0 0 1 12 2M6 21a11 11 0 0 0 19 3l3 3V17H18l4 4a7 7 0 0 1-12-2" fill="#1262ac" stroke="#091d43" stroke-width="1.5"/>',
            pickup: '<path d="M5 11h22v18H5z" fill="#f6c435" stroke="#091d43" stroke-width="2"/><path d="M4 5h24v8H4z" fill="#1262ac" stroke="#091d43" stroke-width="2"/><path d="M9 18h7v11H9zM19 18h5v5h-5z" fill="#d9f5ff" stroke="#091d43" stroke-width="1.5"/>',
          };
          const putIcon = (parent, cls, kind) => {
            const el = u.el('span', cls, parent);
            el.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">' + iconShapes[kind] + '</svg>';
            return el;
          };
          const windowButtons = (parent, cls) => {
            const wrap = u.el('span', cls, parent);
            for (const mark of ['−', '□', '×']) u.el('span', 'window-button', wrap, mark);
            wrap.setAttribute('aria-hidden', 'true');
          };

          const shell = u.el('div', 'returns-shell', document.body);
          const title = u.el('header', 'returns-titlebar', shell);
          putIcon(title, 'title-mark', 'cart');
          u.el('strong', '', title, 'Northwind Shop');
          windowButtons(title, 'outer-controls');
          if (ctx.display === 'header') {
            const note = u.el('div', 'header-instruction', title, ctx.instruction);
            note.dataset.role = 'instruction';
          }

          const menu = u.el('nav', 'returns-menubar', shell);
          for (const item of ['File', 'Edit', 'View', 'Orders', 'Account', 'Tools', 'Help']) {
            const a = u.el('span', 'menu-item', menu, item);
            a.setAttribute('role', 'presentation');
          }
          const bar = u.el('div', 'returns-toolbar', shell);
          const toolItems = [
            ['home', 'Home'], ['shop', 'Shop'], ['orders', 'Orders'], ['returns', 'Returns'], ['account', 'Account'], ['help', 'Help'],
          ];
          toolItems.forEach(([icon, label], i) => {
            const b = u.el('button', 'toolbar-button' + (i === 2 ? ' current' : ''), bar);
            b.type = 'button';
            putIcon(b, 'tool-icon', icon);
            u.el('span', '', b, label);
            b.addEventListener('click', () => env.log('decoy', { what: 'toolbar', label }));
          });

          const body = u.el('div', 'returns-body', shell);
          const side = u.el('aside', 'store-sidebar', body);
          const link = (label, icon, cls) => {
            const row = u.el('div', 'side-row ' + (cls || ''), side);
            putIcon(row, 'side-icon', icon);
            u.el('span', '', row, label);
            return row;
          };
          link('Home', 'home');
          link('Shop', 'shop');
          for (const label of ['New Arrivals', 'Women', 'Men', 'Kids', 'Accessories', 'Sale']) {
            u.el('div', 'side-sub', side, label);
          }
          link('Orders', 'orders', 'side-section');
          u.el('div', 'side-sub', side, 'Order History');
          link('Returns', 'returns', 'side-current');
          link('Account', 'account', 'side-section');
          for (const label of ['Profile', 'Addresses', 'Payment Methods']) u.el('div', 'side-sub', side, label);

          const content = u.el('main', 'returns-content', body);
          const stageFrame = u.el('section', 'returns-window', content);
          const winTitle = u.el('div', 'task-window-title', stageFrame);
          putIcon(winTitle, 'title-mark', 'cart');
          u.el('strong', '', winTitle, 'Returns');
          windowButtons(winTitle, 'inner-controls');
          const stage = u.el('main', 'ref-stage returns-stage', stageFrame);

          const help = u.el('aside', 'returns-help', content);
          u.el('h2', '', help, 'Returns Help');
          if (ctx.display === 'panel') {
            const task = u.el('section', 'help-task', help);
            task.dataset.role = 'instruction';
            u.el('h3', '', task, 'Your task');
            u.el('p', '', task, ctx.instruction);
          }
          const helpBlock = (icon, heading, text, list) => {
            const block = u.el('section', 'help-block', help);
            putIcon(block, 'help-icon', icon);
            const copy = u.el('div', 'help-copy', block);
            u.el('h3', '', copy, heading);
            if (Array.isArray(text)) {
              const ol = u.el('ol', '', copy);
              text.forEach((x) => u.el('li', '', ol, x));
            } else u.el('p', '', copy, text);
            if (list) {
              const ul = u.el('ul', '', copy);
              list.forEach((x) => u.el('li', '', ul, x));
            }
          };
          helpBlock('returns', 'How to return an item', [
            'Select your order from the list.', 'Choose the item you want to return.',
            'Provide the return details.', 'We’ll issue a return label.',
          ]);
          helpBlock('policy', 'Return policy', 'Items can be returned within 30 days of delivery. Items must be in original condition with tags attached, when applicable.');
          helpBlock('cycle', 'Accepted return reasons', '', ['Too large', 'Too small', 'Changed my mind', 'Item not as described', 'Defective or damaged', 'Other']);
          helpBlock('pickup', 'Return options', 'You can drop off at a staffed parcel counter or a self-service locker. A prepaid label will be provided after you complete your return request.');

          let toast = null;
          if (ctx.display === 'toast') {
            toast = u.el('aside', 'return-toast', shell, ctx.instruction);
            toast.dataset.role = 'instruction';
          }
          const footer = u.el('footer', 'returns-footer', shell);
          const labelBank = ctx.content && ctx.content.END_LABELS;
          const labels = Array.isArray(labelBank) && labelBank.length ? labelBank : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
          const asText = (x) => typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x);
          const endRng = ctx.rng.fork('chrome/end');
          const commonEnd = endRng.bool(0.5);
          const label = commonEnd ? 'OK' : asText(endRng.pick(labels));
          const placement = commonEnd ? 'footer' : endRng.pick(['footer', 'toolbar', 'link']);
          const cr = ctx.rng.fork('chrome/collide');
          if (cr.bool(0.3)) {
            const candidates = [...new Set(labels.map(asText))].filter(x => x.toLowerCase() !== label.toLowerCase());
            if (candidates.length) {
              const b = u.el('button', 'toolbar-xtra', bar, cr.pick(candidates));
              b.type = 'button'; b.dataset.role = 'xtra';
              b.addEventListener('click', () => env.log('decoy', { label: b.textContent, collide: true }));
            }
          }
          let submit = null;
          if (!ctx.finish) {
            const parent = placement === 'footer' ? footer : bar;
            const cls = placement === 'link' ? 'return-end-link' : placement === 'toolbar' ? 'return-end-icon' : 'return-end';
            const text = placement === 'toolbar' ? '✓' : placement === 'link' ? label + ' ›' : label;
            submit = u.el(placement === 'link' ? 'a' : 'button', cls, parent, text);
            if (submit.tagName === 'BUTTON') submit.type = 'button'; else submit.href = '#';
            submit.dataset.role = 'submit';
            submit.setAttribute('aria-label', label); submit.title = label;
            submit.addEventListener('click', (e) => { e.preventDefault(); ctx.submit(); });
          }
          if (ctx.display === 'toast' && toast) {
            const close = u.el('button', 'toast-close', toast, '×');
            close.type = 'button'; close.setAttribute('aria-label', 'Close');
            close.addEventListener('click', () => { toast.remove(); env.log('note-close'); });
          }
          return { stage, submit };
        },
      },
    },
  });
})();
