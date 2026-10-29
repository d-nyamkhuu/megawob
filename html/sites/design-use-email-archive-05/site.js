// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-archive-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        style: 'aero', brand: 'SkyMail', nav: 'Mail   Mail   Calendar   Tasks   Preferences',
        bg: '#d9f3ff', surface: '#fff', fg: '#071344', line: '#9fd6f6',
        title: 'linear-gradient(110deg,#54cdff,#0075c9)', control: '#eaf7ff', accent: '#69be12',
        accentfg: '#071344', sel: '#0075c9', selfg: '#fff', font: '"Segoe UI",Arial,sans-serif',
        note: 'right:2%;top:7%;width:25%', end: 'left:2%;bottom:3%',
        geo: { folders: 'display:none', ledger: 'left:0%;top:14%;width:100%;height:80%', document: 'display:none', editor: 'display:none', contacts: 'display:none' },
        site: 'design-use-email-archive-05', scenario: 'archive', platform: 'desktop', account: 'Signed in as Alex Carter',
        noteTitle: 'Task', folderLabels: { sent: 'Sent', drafts: 'Drafts', junk: 'Junk', spam: 'Spam', templates: 'Templates', compose: 'Compose' },
        folderList: ['inbox', 'sent', 'drafts', 'archive', 'trash'], rowHeight: 45, stack: false, dock: [],
      },
      parts: {
        'frame.4': () => ({ E, bar }) => {
          const brand = E('span', 'brand', bar);
          E('b', '', brand, 'Sky'); E('span', '', brand, 'Mail');
          const mark = E('span', 'sky-mark', bar);
          mark.innerHTML = '<svg viewBox="0 0 50 40"><defs><linearGradient id="logo-mail" x2="0" y2="1"><stop stop-color="#caff74"/><stop offset=".45" stop-color="#7bc918"/><stop offset="1" stop-color="#388e00"/></linearGradient><linearGradient id="logo-flap" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#9adf40"/></linearGradient></defs><rect x="1" y="1" width="48" height="37" rx="2" fill="url(#logo-mail)" stroke="#267500"/><path d="M2 2l23 21L48 2z" fill="url(#logo-flap)" stroke="#539900"/><path d="M2 37l16-17m30 17L32 20" stroke="#58a400" stroke-width="2"/></svg>';
        },
        'frame.5': (base) => (c) => {
          base(c);
          const envelope = '<rect x="2" y="5" width="28" height="23" rx="2" fill="#f4fff1" stroke="#62a233"/><path d="M3 6l13 13L29 6M3 27l9-11m17 11-9-11" fill="none" stroke="#62a233" stroke-width="1.6"/>';
          const icons = [envelope, '<path d="M3 9h25v19H3z" fill="#ffe649" stroke="#b88c03"/><path d="M3 9l12 12L28 9" fill="#fff79b" stroke="#b88c03"/><path d="M23 4l6 5-6 10-7-5z" fill="#6ac117" stroke="#438f00"/>', '<circle cx="11" cy="9" r="6" fill="#ffd852" stroke="#d2a922"/><circle cx="23" cy="12" r="5" fill="#ffe276" stroke="#d2a922"/><path d="M2 29V22q0-8 9-8t9 8v7z" fill="#72d534" stroke="#399a1f"/><path d="M17 29v-7q0-6 6-6t7 6v7z" fill="#53cfff" stroke="#2783c6"/>', '<rect x="3" y="5" width="26" height="25" rx="2" fill="#fff" stroke="#638eaa"/><path d="M3 5h26v8H3z" fill="#ee8b18"/><path d="M9 2v7m14-7v7" stroke="#545c67" stroke-width="2"/><text x="7" y="26" fill="#17315d" font-family="Arial" font-weight="bold" font-size="15">31</text>'];
          [...c.bar.querySelectorAll('.nav .chrome-nav')].forEach((b, i) => {
            const icon = c.E('span', 'sky-tab-icon', b);
            icon.innerHTML = i < icons.length ? '<svg viewBox="0 0 32 32">' + icons[i] + '</svg>' : '⚙';
            b.prepend(icon);
          });
        },
        'frame.7': () => () => {}, 'frame.8': () => () => {}, 'frame.9': () => () => {}, 'frame.10': () => () => {},
        'frame.19': (base) => (c) => {
          base(c);
          document.body.classList.toggle('has-end', !!c.submit);
          document.body.classList.remove('end-in-header');
          if (c.submit) {
            if (c.submit.classList.contains('end-menubar')) {
              c.submit.textContent = '✓';
              document.body.classList.add('end-in-header');
            } else {
              c.footer.hidden = false;
              c.footer.append(c.submit);
            }
          }
        },
        'frame.21': (base) => (c) => {
          document.body.style.setProperty('--note-h', '0px');
          document.body.style.setProperty('--toast-h', '0px');
          document.body.dataset.instruction = c.display;
          if (c.note) {
            const small = c.bar.getBoundingClientRect().width < 1350;
            if (small && c.display === 'panel') c.note.dataset.display = 'header';
            const mode = c.note.dataset.display;
            document.body.dataset.instruction = mode;
            if (mode === 'header') document.body.style.setProperty('--note-h', (c.note.getBoundingClientRect().height + 10) + 'px');
            if (mode === 'toast') document.body.style.setProperty('--toast-h', (c.note.getBoundingClientRect().height + 16) + 'px');
          }
          base(c);
        },
        'overlay.4': (base) => (c) => {
          base(c);
          if (c.ctx.kind === 'promo') c.e.querySelector('h3').textContent = 'Get the most out of SkyMail';
        },
        'overlay.5': (base) => (c) => {
          base(c);
          if (c.ctx.kind === 'promo') c.e.querySelector('p').textContent = 'Tips, product updates, and productivity ideas delivered to your inbox.';
        },
        'overlay.7': (base) => (c) => {
          base(c);
          if (c.ctx.kind !== 'promo') return;
          c.b.textContent = '×'; c.b.className = 'sky-close'; c.b.title = 'Close'; c.b.setAttribute('aria-label', 'Close');
          const el = c.ctx.util.el;
          const art = el('div', 'sky-offer-image', c.e);
          art.innerHTML = '<svg viewBox="0 0 140 140"><defs><linearGradient id="offer" x2="0" y2="1"><stop stop-color="#65d5ff"/><stop offset="1" stop-color="#0089ef"/></linearGradient></defs><path d="M10 61L70 9l60 52v67H10Z" fill="url(#offer)" stroke="#0082db" stroke-width="2"/><rect x="29" y="30" width="82" height="73" rx="4" fill="#fff" stroke="#87d3ff"/><path d="M42 47h55M42 60h55M42 73h38" stroke="#bac6d3" stroke-width="4"/><path d="M10 61l60 47 60-47v67H10Z" fill="url(#offer)" stroke="#007ddb" stroke-width="2"/><path d="M10 128l40-35m80 35-40-35" stroke="#0079d2" fill="none"/><path d="M17 19l-8-7m49-2V1m61 22 8-8M4 44l-4-2m131 1 9-3" stroke="#1ebfff" stroke-width="2"/></svg>';
          const form = el('div', 'sky-offer-form', c.e);
          const input = el('input', '', form); input.placeholder = 'Your email address'; input.type = 'text'; input.setAttribute('aria-label','Your email address');
          const sub = el('button', '', form, 'Subscribe'); sub.type = 'button'; sub.addEventListener('click', () => env.log('decoy', { label:'Subscribe' }));
          const opt = el('label', 'sky-offer-option', c.e);
          const cb = el('input', '', opt); cb.type = 'checkbox';
          el('span', '', opt, 'Send me product updates and tips');
        },
      },
    },
  });
})();
