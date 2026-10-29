// Design of this site on the use-email/mail template (templates/use-email/mail.js): minimal, the search box lives in
// the site header, the toolbar controls are folded away behind an "Expand tools" button until it is pressed.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-important-12',
    name: 'design',
    split: 'train',
    scenarios: ['important'],
    template: 'use-email/mail',
    design: {
      style: 'minimal',
      rowHeight: 42,
      folderList: ['inbox', 'starred', 'sent', 'drafts', 'archive', 'trash'],
      searchPlaceholder: 'Search email',
      searchLabel: 'Search email',
      parts: {
        searchInput: (base, S) => () => document.querySelector('.header-search input'),
        rowHeightPx: (base, S) => (avail) =>
          Math.floor(Math.min(avail / S.spec.rows, Math.max(27, (S.D.rowHeight * S.els.root.clientWidth) / 1672))),
        rowFlag: (base, S) => (row, i, op, primary) => {
          const b = base(row, i, op, primary);
          b.title = op === 'delete' ? 'Delete' : op === 'important' ? 'Mark important' : op;
          b.setAttribute('aria-label', b.title);
          b.innerHTML = S.P.icon(op);
          return b;
        },
        snapped: (base, S) => () => {
          const { el, button, action, ctx } = S;
          const { root, reg } = S.els;
          root.classList.add('controls-folded');
          const landscape = el('div', 'tools-landscape', root);
          landscape.innerHTML =
          '<svg viewBox="0 0 1432 140" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="mint-sky" x2="0" y2="1"><stop stop-color="#f0faf5"/>' +
          '<stop offset="1" stop-color="#e7f5ee"/>' +
          '</linearGradient><linearGradient id="mint-hills" x2="0" y2="1"><stop stop-color="#cdebdc"/>' +
          '<stop offset="1" stop-color="#b2dfc8"/>' +
          '</linearGradient><path id="mint-pine" d="M-5 62h10V51h14c5 0 5-5 2-8l-8-13h6c4 0 5-4 2-8L9 7C6-6-6-6-9 7l-7 15c-3 4-2 8 2 8h6l-8 13c-3 3-3 8 2 8h9z"/>' +
          '</defs><rect width="1432" height="140" fill="url(#mint-sky)"/>' +
          '<circle cx="142" cy="47" r="30" fill="#c3e9d6"/>' +
          '<path d="M0 100 62 60Q70 53 78 61L132 104 157 90Q164 86 176 92L222 113 348 111 489 118 569 81Q580 75 591 83L621 96Q631 99 644 90L688 65Q695 59 705 68L772 113 852 111 953 64 1062 30Q1072 23 1081 31L1178 83 1274 97 1432 58V140H0Z" fill="#e1f2e9"/>' +
          '<path d="M0 84Q11 72 22 80L70 109 91 101Q99 97 109 102L162 122 230 140H0Z" fill="url(#mint-hills)"/>' +
          '<path d="M560 140 683 83Q691 73 702 79L725 90Q731 95 739 91L773 74Q782 69 792 76L855 103 909 78 945 100Q956 109 970 107L1002 97 1061 62 1135 26Q1148 23 1158 32L1220 76 1279 102 1332 88 1432 68V140Z" fill="#cdebdc" opacity=".83"/>' +
          '<path d="M0 88Q45 96 95 113T244 137Q460 143 581 139T740 129Q785 125 824 129T967 131Q1030 123 1082 125T1200 131Q1310 124 1432 117V140H0Z" fill="#a9dcc2" opacity=".87"/>' +
          '<g fill="#a3d9be"><use href="#mint-pine" transform="translate(784 95) scale(.65)"/>' +
          '<use href="#mint-pine" transform="translate(818 92) scale(.72)"/>' +
          '<use href="#mint-pine" transform="translate(1076 98) scale(.57)"/>' +
          '<use href="#mint-pine" transform="translate(1112 66) scale(1.05)"/>' +
          '<use href="#mint-pine" transform="translate(1157 56) scale(1.15)"/>' +
          '<use href="#mint-pine" transform="translate(1377 43) scale(1.2)"/>' +
          '</g></svg>';
          const expand = el('button', 'expand-tools', root, 'Expand tools');
          reg.set('reveal', expand);
          expand.addEventListener('click', () => {
            root.classList.remove('controls-folded');
            expand.textContent = 'Tools expanded';
          });
          const strip = el('div', 'command-strip', root);
          button(strip, 'Mark important', 'action:important', () => action('important', ctx.model.open ?? 0), 'important');
          button(strip, 'Restore', 'action:inbox', () => action('inbox', ctx.model.open ?? 0), 'inbox');
        },
        docMeta: (base, S) => (meta, e, i, m) => {
          const { el, button, action, cc } = S;
          const { root, reg } = S.els;
          el('h2', '', meta, e.subject);
          el('span', 'preview-time', meta, e.time);
          const identity = el('div', 'preview-identity', meta);
          el('span', 'sender-avatar', identity, e.name.slice(0, 1));
          const names = el('div', 'preview-names', identity);
          el('div', '', names, e.name);
          el('div', 'address', names, 'To: ' + S.spec.me.name + cc(e));
          const quick = el('div', 'preview-quick', identity);
          button(
            quick,
            m.flags[i].starred ? 'Unstar' : 'Star',
            null,
            () => action('star', i),
            'star',
            'preview-icon' + (m.flags[i].starred ? ' on' : ''),
          );
          button(quick, 'Reply', null, () => action('reply', i), 'reply', 'preview-icon');
          const more = el('button', 'preview-icon preview-more', quick, '•••');
          more.type = 'button';
          more.setAttribute('aria-label', 'More message actions');
          more.addEventListener('click', () => {
            root.classList.remove('controls-folded');
            reg.get('reveal').textContent = 'Tools expanded';
          });
        },
        locateEarly: (base, S) => (t) => {
          if (S.els.root.classList.contains('controls-folded') && (t.action || t.rowIcon)) return S.center(S.els.reg.get('reveal'));
        },
      },
    },
  });
})();
