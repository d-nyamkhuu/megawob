// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-undo-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'mac',
        'brand': 'Mail',
        'nav': '',
        'bg': '#fff',
        'surface': '#fff',
        'fg': '#080808',
        'line': '#d9dde3',
        'title': 'linear-gradient(#fafbfc,#f1f3f6)',
        'control': '#f7f8fa',
        'accent': '#1677f2',
        'accentfg': '#fff',
        'sel': '#1677f2',
        'selfg': '#fff',
        'font': '-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif',
        'note': 'right:2%;top:7%;width:25%',
        'end': 'left:2%;bottom:3%',
        'geo': {
          'folders': 'left:2%;top:6%;width:24%;height:35%',
          'ledger': 'left:14%;top:14%;width:56%;height:58%',
          'document': 'right:2%;top:58%;width:32%;height:39%',
          'editor': 'right:2%;top:50%;width:36%;height:47%',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-undo-03',
        'scenario': 'undo',
        'platform': 'desktop',
        'account': 'Mon Apr 14  10:24 AM',
        'noteTitle': 'Task',
        'folderLabels': {
          'sent': 'Sent',
          'drafts': 'Drafts',
          'junk': 'Junk',
          'spam': 'Spam',
          'templates': 'Templates',
          'compose': 'Compose',
        },
        'folderList': ['inbox', 'sent', 'drafts', 'archive', 'trash'],
        'rowHeight': 40,
        'stack': false,
        'dock': [],
      },
      parts: {
        frame: () => (ctx) => {
          const { util } = ctx;
          const display = ctx.display;
          const menu = util.el('div', 'mac-menu', document.body);
          util.el('span', 'mac-apple', menu).innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.2 2.1c-1.8.1-3.3 1.6-3.5 3.3 1.8.1 3.2-1.4 3.5-3.3ZM18.9 16.8c-.5 1.2-.8 1.8-1.4 2.8-.8 1.2-1.9 2.7-3.3 2.7-1.2 0-1.5-.7-3.1-.7-1.5 0-1.9.7-3.1.7-1.4.1-2.5-1.4-3.3-2.6C2.4 16.1 2 10.7 3.5 8.3 4.6 6.6 6.3 5.6 8.2 5.6c1.3 0 2.3.8 3.1.8.9 0 2.1-.9 3.6-.8 1.6.1 2.9.8 3.8 2-3.4 2-2.8 6.8.4 8.1l-.3.7Z"/></svg>';
          ['Mail', 'File', 'Edit', 'View', 'Mailbox', 'Message', 'Format', 'Window', 'Help'].forEach((label) => util.el('span', label === 'Mail' ? 'mac-menu-current' : '', menu, label));
          const win = util.el('div', 'mac-window', document.body);
          const bar = util.el('div', 'mac-toolbar', win);
          const lights = util.el('div', 'mac-lights', bar);
          ['red', 'yellow', 'green'].forEach((c) => util.el('i', c, lights));
          const newMessage = util.el('button', 'mac-new', bar);
          newMessage.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 3H4a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h15a2 2 0 0 0 2-2v-9M10 14l10-10 2 2-10 10-4 1z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg><span>New Message</span>';
          newMessage.type = 'button';
          newMessage.addEventListener('click', () => {
            const b = [...document.querySelectorAll('.am-app button, .am-app [role="button"]')].find((x) => /compose|new message/i.test(x.textContent || x.getAttribute('aria-label') || ''));
            if (b) b.click();
          });
          const actions = util.el('div', 'mac-actions', bar);
          const icons = {
            Delete:'<path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13M10 10v7m4-7v7"/>',
            Archive:'<rect x="3" y="5" width="18" height="4" rx="1"/><path d="M5 9v10h14V9M10 13h4"/>',
            Reply:'<path d="M9 5 3 11l6 6v-4c6-1 9 2 12 6-1-7-5-11-12-10V5Z"/>',
            'Reply All':'<path d="m10 5-6 6 6 6M15 5l-6 6 6 6M13 10c4-1 7 3 8 9-2-3-5-5-8-5"/>',
            Forward:'<path d="m15 5 6 6-6 6v-4C9 12 6 15 3 19c1-7 5-11 12-10V5Z"/>',
            Flag:'<path d="M5 21V3m1 1c5-2 8 3 13 0v11c-5 3-8-2-13 0"/>',
            More:'<circle cx="12" cy="12" r="9"/><circle cx="7.5" cy="12" r=".8" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r=".8" fill="currentColor" stroke="none"/><circle cx="16.5" cy="12" r=".8" fill="currentColor" stroke="none"/>'
          };
          ['Delete', 'Archive', 'Reply', 'Reply All', 'Forward', 'Flag', 'More'].forEach((label) => {
            const b = util.el('button', 'mac-action', actions);
            b.type = 'button';
            util.el('span', 'mac-action-icon', b).innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${icons[label]}</svg>`;
            util.el('span', '', b, label);
            b.addEventListener('click', () => {
              const candidates = [...document.querySelectorAll('.am-app button, .am-app [role="button"]')].filter((x) => x.getBoundingClientRect().width > 0);
              const named = (text) => candidates.find((x) => (x.textContent || x.getAttribute('aria-label') || '').trim().toLowerCase() === text.toLowerCase());
              const match = named(label) || (label === 'Flag' ? named('Star') : label === 'More' ? named('Move to') : null);
              if (match) match.click();
            });
          });
          const search = util.el('input', 'mac-search', bar);
          search.placeholder = 'Search';
          search.setAttribute('aria-label', 'Search');
          search.addEventListener('input', () => {
            const real = document.querySelector('.am-app .am-search input');
            if (real && real !== search) { real.value = search.value; real.dispatchEvent(new Event('input', {bubbles:true})); }
          });
          const rr = ctx.rng.fork('mac/end');
          const lr = ctx.rng.fork('mac/end-label');
          const pr = ctx.rng.fork('mac/end-placement');
          const label = lr.bool(0.6) ? 'Done' : ctx.content.endLabel(lr);
          const placement = label === 'Done' ? 'toolbar' : pr.pick(['footer','link','icon']);
          const controls = util.el('div', 'mac-end-controls', bar);
          if (!ctx.finish) {
            if (rr.bool(0.3)) {
              const options = ctx.content.END_LABELS.filter((s) => s !== label);
              const word = rr.pick(options);
              const dec = util.el('button', 'mac-secondary', controls, word);
              dec.addEventListener('click', () => env.log('decoy', {label:word, collide:true}));
            }
            if (rr.bool(0.18)) {
              const dec = util.el('button', 'mac-secondary', controls, 'About');
              dec.addEventListener('click', () => env.log('decoy', {label:'About'}));
            }
          }
          let submit = null;
          const addEnd = (parent, cls, text) => {
            const el = util.el(cls === 'mac-end-link' ? 'a' : 'button', cls, parent, text);
            if (el.tagName === 'A') el.href = '#';
            else el.type = 'button';
            el.dataset.role = 'submit';
            el.title = label;
            el.setAttribute('aria-label', label);
            el.addEventListener('click', (e) => { e.preventDefault(); ctx.submit(); });
            return el;
          };
          if (!ctx.finish && ['toolbar','icon'].includes(placement)) submit = addEnd(controls, placement === 'icon' ? 'mac-end-icon' : 'mac-end', placement === 'icon' ? '✓' : label);
          if (display === 'header') util.el('div', 'mac-instruction', win, ctx.instruction);
          if (display === 'panel' || display === 'toast') util.el('div', `mac-instruction mac-fallback-${display}`, win, ctx.instruction);
          const body = util.el('div', 'mac-body', win);
          if (display === 'panel') {
            const panel = util.el('aside', 'mac-task-panel', body);
            util.el('div', 'mac-task-label', panel, 'Task');
            util.el('div', '', panel, ctx.instruction);
          }
          const stage = util.el('main', 'mac-stage', body);
          if (display === 'toast') {
            const note = util.el('div', 'mac-task-toast', win, ctx.instruction);
            const x = util.el('button', '', note, '×');
            x.setAttribute('aria-label', 'Close');
            x.addEventListener('click', () => { note.remove(); env.log('note-close'); });
          }
          if (!ctx.finish && ['footer','link'].includes(placement)) {
            const foot = util.el('div', 'mac-end-footer', win);
            submit = addEnd(foot, placement === 'link' ? 'mac-end-link' : 'mac-end', label);
          }
          return {stage, submit};
        },
        overlay: () => (ctx) => {
          const { util, rng, kind } = ctx;
          const orng = rng.fork('mac/overlay');
          const { text: copy } = ctx.content.bannerText(orng, kind === 'banner' ? 'notice' : kind);
          const el = util.el('div', `mac-overlay mac-overlay-${kind}`, document.body);
          el.dataset.role = 'overlay';
          if (kind === 'banner') {
            const note = document.querySelector('.mac-instruction:not(.mac-fallback-panel):not(.mac-fallback-toast)');
            el.style.top = `${note ? note.getBoundingClientRect().bottom : 116}px`;
          }
          const box = kind === 'promo' ? util.el('div', 'mac-overlay-box', el) : el;
          if (kind === 'promo') util.el('div', 'mac-overlay-title', box, 'Mail');
          util.el('div', 'mac-overlay-text', box, copy);
          const row = util.el('div', 'mac-overlay-actions', box);
          const button = (label, how, primary) => {
            const b = util.el('button', primary ? 'mac-overlay-button primary' : 'mac-overlay-button', row, label);
            b.type = 'button';
            b.addEventListener('click', () => how ? ctx.dismiss(how) : env.log('overlay-click', {label}));
            return b;
          };
          let dismiss;
          if (kind === 'cookie') {
            button('Settings', null, false);
            button('Necessary only', 'reject', false);
            dismiss = button('Accept all', 'accept', true);
          } else if (kind === 'promo') {
            dismiss = button('Not now', 'close', false);
            button('Learn more', null, true);
            const x = util.el('button', 'mac-overlay-close', box, '×');
            x.setAttribute('aria-label', 'Close');
            x.addEventListener('click', () => ctx.dismiss('close'));
          } else if (kind === 'banner') {
            dismiss = button('Dismiss', 'close', false);
          } else {
            dismiss = button('×', 'close', false);
            dismiss.setAttribute('aria-label', 'Close');
          }
          return {el, dismiss, ttlSteps: kind === 'toast' ? orng.int(3,5) : 0};
        },
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
      },
    },
  });
})();
