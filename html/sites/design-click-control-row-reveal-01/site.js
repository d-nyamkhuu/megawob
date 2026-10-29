(function () {
  'use strict';
  env.site({
    name: 'design-click-control-row-reveal-01',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ipad';
      const icons = {
        home: '<path d="m3 10 9-7 9 7v11h-6v-8H9v8H3Z"/>',
        people:
          '<circle cx="10" cy="7" r="4"/><path d="M2 21v-3a8 8 0 0 1 16 0v3ZM17 3a4 4 0 0 1 0 8m3 3a7 7 0 0 1 2 5v2"/>',
        folder: '<path d="M2 6a2 2 0 0 1 2-2h5l3 4h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z"/>',
        calendar:
          '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M7 2v5m10-5v5M3 10h18M7 14h2m4 0h2m2 0h1M7 18h2m4 0h2"/>',
        chart: '<path d="M5 21v-7m7 7V8m7 13V2"/>',
        settings:
          '<path d="m9 2-.7 3-2 .9L3.6 5 2 8l2.2 2.1v2.3L2 15l1.6 3 2.8-.9 2 .9.6 3h4l.7-3 2-.9 2.7.9 1.6-3-2.2-2.3v-2.3L20 8l-1.6-3-2.8.9-2-.9L13 2Z"/><circle cx="11" cy="11.5" r="3.5"/>',
        pencil: '<path d="m4 17-1 5 5-1L21 8a2 2 0 0 0 0-3l-2-2a2 2 0 0 0-3 0ZM14 5l5 5"/>',
        note: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/>',
        check: '<path d="m5 12 5 5L20 6"/>',
      };
      const svg = (name) =>
        '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
        icons[name] +
        '</svg>';
      const shell = u.el('main', 'shell', document.body);
      shell.dataset.instr = ctx.display;
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const head = u.el('header', 'head', center);
      const heading = u.el('div', 'heading', head);
      const title = u.el('div', 'title', heading, 'Team Members');
      const toolbar = u.el('div', 'tools', head);
      const search = u.el('div', 'searchbox', toolbar);
      search.innerHTML =
        '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/></svg><span>Search members...</span>';
      const add = u.el('button', 'add-member', toolbar);
      add.type = 'button';
      add.innerHTML = '<span class="plus">＋</span><span>Add Member</span>';
      const note = u.el('div', 'instruction', heading, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      const stage = u.el('div', 'stage', center);
      const aside = u.el('aside', 'inspector', work);
      const endToolbar = u.el('div', 'end-toolbar', aside);
      if (ctx.display === 'panel') {
        note.classList.add('instruction-panel');
        aside.appendChild(note);
        const badge = u.el('span', 'note-icon', note);
        badge.innerHTML = svg('note');
        note.prepend(badge);
      }
      if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        center.appendChild(note);
        const badge = u.el('span', 'note-icon', note);
        badge.innerHTML = svg('check');
        note.prepend(badge);
      }
      const profile = u.el('div', 'profile', aside);
      profile.innerHTML =
        '<div class="profile-avatar">NN</div><div class="profile-identity"><strong class="profile-name">Nour Nasser</strong><span class="profile-email">nour.nasser@acmecorp.com</span><span class="profile-location">Austin, TX</span></div>';
      const fields = u.el('div', 'profile-fields', aside);
      [
        ['Role', 'Marketing Specialist'],
        ['Department', 'Marketing'],
        ['Location', 'Austin'],
        ['Manager', 'Elena Torres'],
        ['Last Active', 'Apr 22, 2019'],
      ].forEach(([a, b], i) => {
        const row = u.el('div', 'profile-row', fields);
        u.el('b', '', row, a);
        u.el('span', 'profile-value field-' + i, row, b);
      });
      const about = u.el('section', 'about-section', aside);
      u.el('h2', '', about, 'About');
      u.el(
        'p',
        'about-copy',
        about,
        'Nour creates content and campaigns to grow our brand and engage our audience. She works closely with the product and sales teams.',
      );
      const tips = u.el('section', 'tips-section', aside);
      u.el('h2', 'tips-title', tips, 'Quick Tips');
      const tip1 = u.el('div', 'tip', tips);
      tip1.innerHTML =
        '<i>' +
        svg('people') +
        '</i><span>To change a member’s role, hover over their row and use the more options button (…) at the end of the row.</span>';
      const tip2 = u.el('div', 'tip', tips);
      tip2.innerHTML =
        '<i class="purple">' +
        svg('pencil') +
        '</i><span>You can also view more details, send a message, or remove a member from the team.</span>';
      const foot = u.el('footer', 'footer', shell);
      const dock = u.el('nav', 'dock-nav', foot);
      [
        ['home', 'Home'],
        ['people', 'People'],
        ['folder', 'Projects'],
        ['calendar', 'Calendar'],
        ['chart', 'Reports'],
        ['settings', 'Settings'],
      ].forEach(([icon, label], i) => {
        const item = u.el('div', 'nav-item' + (i === 1 ? ' active' : ''), dock);
        const glyph = u.el('b', '', item);
        glyph.innerHTML = svg(icon);
        u.el('span', '', item, label);
      });
      const er = ctx.rng.fork('chrome/end'),
        bank =
          ctx.content && Array.isArray(ctx.content.END_LABELS)
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const val = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      const label = er.bool(0.5) ? 'Done' : val(er.pick(bank.filter((x) => val(x) !== 'Done')));
      const placement = er.pick(['header', 'header', 'footer', 'link', 'icon']);
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (cr.bool(0.3)) {
        const choices = [
          ...new Set(bank.map(val).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
        ];
        if (choices.length) collide = cr.pick(choices);
      }
      let submit = null;
      const addButton = (parent, text, cls, click) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        if (click) b.addEventListener('click', click);
        return b;
      };
      if (!ctx.finish) {
        submit = addButton(placement === 'header' ? endToolbar : foot, label, 'submit', ctx.submit);
        submit.classList.add('end-' + placement);
        if (placement === 'icon') {
          submit.innerHTML = svg('check');
          submit.title = label;
          submit.setAttribute('aria-label', label);
        }
      }
      if (collide) {
        const b = addButton(endToolbar, collide, 'xtra-task');
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      if (endToolbar.children.length) aside.classList.add('has-end-controls');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'perturb ' + ctx.kind, document.body);
      document.body.classList.add('has-overlay');
      const close = () => {
        document.body.classList.remove('has-overlay');
        ctx.dismiss();
      };
      const button = (parent, label, cls, fn) => {
        const b = u.el('button', cls, parent, label);
        b.type = 'button';
        b.addEventListener('click', fn || close);
        return b;
      };
      let dismiss;
      if (ctx.kind === 'cookie') {
        const icon = u.el('div', 'overlay-symbol', el);
        icon.innerHTML =
          '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M25 14a7 7 0 0 1-7-8 11 11 0 1 0 11 12 7 7 0 0 1-4-4Z"/><circle cx="10" cy="14" r="1"/><circle cx="16" cy="21" r="1"/><circle cx="10" cy="22" r="1"/><circle cx="24" cy="5" r="1"/></svg>';
        const copy = u.el('div', 'overlay-copy', el);
        u.el('strong', '', copy, 'We use cookies');
        u.el('p', '', copy, 'We use cookies to improve your experience, analyze traffic, and personalize content.');
        button(el, 'Accept all', 'overlay-primary');
        dismiss = button(el, 'Dismiss', 'dismiss overlay-secondary');
      } else if (ctx.kind === 'chat') {
        const h = u.el('div', 'chat-heading', el);
        u.el('i', 'chat-avatar member-photo', h);
        u.el('strong', '', h, 'Chat with our team');
        dismiss = button(h, '×', 'dismiss close-icon');
        dismiss.setAttribute('aria-label', 'Close chat');
        const copy = u.el('p', 'chat-greeting', el);
        copy.innerHTML = 'Hi! 👋<br>How can we help you today?';
        const compose = u.el('div', 'chat-compose', el);
        u.el('div', 'chat-input', compose, 'Type a message...');
        const send = button(compose, '➤', 'chat-send', () => env.log('decoy', { label: 'Send' }));
        send.setAttribute('aria-label', 'Send message');
      } else if (ctx.kind === 'promo') {
        dismiss = button(el, '×', 'dismiss close-icon');
        dismiss.setAttribute('aria-label', 'Close newsletter');
        const picture = u.el('div', 'newsletter-picture', el);
        picture.innerHTML =
          '<svg viewBox="0 0 120 140" fill="none"><circle cx="60" cy="70" r="57" fill="#f0f6ff"/><path d="m17 67 43-30 43 30v49H17Z" fill="#1670ff" stroke="#0861e5"/><rect x="35" y="35" width="50" height="65" rx="4" fill="white" stroke="#a5c8ff"/><path d="M43 48h34M43 57h34M43 66h24" stroke="#a5c8ff" stroke-width="3"/><path d="m17 68 43 31 43-31M17 116l31-29m55 29L72 87" stroke="#0751d4" stroke-width="2"/><path d="M60 14V4m-13 14-6-8m32 8 6-8" stroke="#1670ff" stroke-width="2"/></svg>';
        const copy = u.el('div', 'newsletter-copy', el);
        u.el('strong', '', copy, 'Stay in the loop');
        u.el('p', '', copy, 'Get product updates, tips, and best practices delivered to your inbox.');
        u.el('div', 'newsletter-email', copy, 'yourname@acmecorp.com');
        button(copy, 'Subscribe', 'newsletter-subscribe');
        u.el('small', '', copy, 'We respect your privacy. Unsubscribe at any time.');
      } else if (ctx.kind === 'banner') {
        const icon = u.el('div', 'overlay-symbol', el);
        icon.innerHTML =
          '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 11h7l13-6v21l-13-6H5Zm5 9 3 9h5l-4-9M28 11l3-2m-3 11 3 2"/></svg>';
        const copy = u.el('div', 'overlay-copy', el);
        u.el('strong', '', copy, 'New feature: Team permissions');
        u.el('p', '', copy, 'You can now assign custom permissions to team members.');
        dismiss = button(el, '×', 'dismiss close-icon');
        dismiss.setAttribute('aria-label', 'Dismiss announcement');
        const head = document.querySelector('.head');
        if (head) el.style.top = head.getBoundingClientRect().bottom + 10 + 'px';
      } else {
        const copy = u.el('div', 'overlay-copy', el);
        u.el('strong', '', copy, 'Notification');
        u.el('p', '', copy, 'Your workspace is ready.');
        dismiss = button(el, 'Close', 'dismiss');
      }
      return { el, dismiss };
    },
  });
})();
