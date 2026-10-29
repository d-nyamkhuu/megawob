(function () {
  'use strict';
  const C = { site: 'design-act-in-time-toast-01' };
  env.site({
    name: C.site,
    styles: ['site.css', 'design.css', 'refinements.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      let submit = null,
        label = 'Save';
      const title = u.el('header', 'vista-title', body);
      u.el('i', 'mail-icon', title, '✉');
      u.el('span', '', title, 'Windows Mail');
      const win = u.el('div', 'win-controls', title);
      ['−', '□', '×'].forEach((x, i) => u.el('span', i === 2 ? 'close' : '', win, x));
      const menu = u.el('nav', 'vista-menu', body);
      ['File', 'Edit', 'View', 'Tools', 'Message', 'Help'].forEach((x) => u.el('span', '', menu, x));
      const bar = u.el('div', 'vista-toolbar', body);
      ['✉  New Mail⌄', '↶  Reply', '▣  Reply All', '➤  Forward', '✕  Delete', '▣  Junk⌄', '▤⌄'].forEach((x) =>
        u.el('span', '', bar, x),
      );
      u.el('div', 'vista-search', bar, 'Search　⌕');
      const workspace = u.el('div', 'vista-workspace', body);
      const app = u.el('div', 'mail-app', workspace);
      const folders = u.el('aside', 'folders', app);
      [
        '▾  Local Folders',
        '　📁  Inbox (3)',
        '　📁  Drafts',
        '　📁  Sent Items',
        '　📁  Junk E-mail',
        '　▧  Deleted Items',
        '▾  Contoso Mail',
        '　📁  Inbox',
        '　📁  Drafts',
        '　📁  Sent Items',
        '　📁  Junk E-mail',
        '　▧  Deleted Items',
      ].forEach((x, i) => u.el('div', i === 1 ? 'selected' : 'folder', folders, x));
      const inbox = u.el('section', 'inbox', app);
      const list = u.el('div', 'messages', inbox);
      [
        '',
        'From　　　　　　　　　　　　 Subject　　　　　　　　　　　　　　　 Received⌄',
        '▤　 Contoso Team　　　　　 Welcome to Contoso　　　　　　　　　4/12/2007 10:24 AM',
        '▤　 Account Security　　　 Your account settings　　　　　　　　　4/12/2007 9:18 AM',
        '▤　 PhotoShare　　　　　　See what’s new this week　　　　　　　　4/11/2007 4:03 PM',
      ].forEach((x, i) => u.el('div', 'message m' + i, list, x));
      const reader = u.el('aside', 'reader', app);
      u.el('h2', '', reader, 'Welcome to Contoso');
      u.el('div', 'reader-meta', reader, 'Contoso Team <team@contoso.com><br>4/12/2007 10:24 AM');
      u.el('hr', '', reader);
      u.el('h3', '', reader, 'Welcome to Contoso Mail!');
      u.el(
        'p',
        '',
        reader,
        'You can use this account to access your email, calendar, and more across Microsoft services.',
      );
      const dock = u.el('footer', 'vista-dock', body);
      ['✉  Mail', '▦  Calendar', '▣  Contacts', '▧  Feeds', '▤  Newsgroups'].forEach((x, i) =>
        u.el('span', i === 0 ? 'dock-selected' : '', dock, x),
      );
      const mode = ctx.display || 'hidden';
      let note = null;
      if (mode === 'header') {
        note = u.el('div', 'task-note note-header', body, ctx.instruction);
        body.insertBefore(note, workspace);
      } else if (mode === 'panel') {
        note = u.el('aside', 'task-note note-panel', workspace, ctx.instruction);
      } else if (mode === 'toast') {
        note = u.el('div', 'task-note note-toast', body, ctx.instruction);
        body.insertBefore(note, dock);
      }
      const stage = u.el('main', 'vista-stage', workspace);
      if (mode !== 'hidden') stage.classList.add('has-note');
      if (!ctx.finish) {
        const names = (ctx.content && ctx.content.END_LABELS) || ['Save', 'Submit', 'Done', 'Continue', 'Apply'];
        const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || 'Save');
        const r = ctx.rng.fork('chrome/end');
        label = r.bool(0.5) ? 'Save' : labelOf(r.pick(names));
        const where = r.pick(['footer', 'footer', 'header', 'link', 'icon']);
        const coll = ctx.rng.fork('chrome/collide');
        let decoy = null;
        if (coll.bool(0.3)) {
          const p = names.map(labelOf).filter((x) => x.toLowerCase() !== label.toLowerCase());
          if (p.length) decoy = coll.pick(p);
        }
        const mk = (parent, text, cls, active) => {
          const b = u.el('button', cls, parent, text);
          b.type = 'button';
          b.dataset.role = active ? 'submit' : 'decoy';
          b.title = text;
          b.setAttribute('aria-label', text);
          b.addEventListener('click', () => (active ? ctx.submit() : env.log('decoy', { label: text, collide: true })));
          return b;
        };
        if (where === 'header') {
          const b = mk(title, label, 'end-header', true);
          submit = b;
        } else if (where === 'icon') {
          submit = mk(title, '✓', 'end-header end-icon', true);
        } else {
          if (decoy) mk(dock, decoy, 'end-xtra', false);
          if (where === 'link') {
            const a = u.el('a', 'end-link', dock, label + ' ›');
            a.href = '#';
            a.dataset.role = 'submit';
            a.title = label;
            a.addEventListener('click', (e) => {
              e.preventDefault();
              ctx.submit();
            });
            submit = a;
          } else submit = mk(dock, label, 'end-footer', true);
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'vista-overlay vista-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'This website uses cookies to improve your experience.',
        toast: 'Your settings have been saved.',
        chat: 'Hello! How can we help you today?',
        promo: 'Discover what’s new in Windows Mail.',
        banner: 'Important service announcement.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const b = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      b.type = 'button';
      b.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
