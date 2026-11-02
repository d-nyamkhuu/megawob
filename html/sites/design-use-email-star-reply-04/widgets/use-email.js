// Plain webmail design with a stacked message view and the site's compact header search and editor icons.
(function () {
  'use strict';
  const FORMAT_PATHS = [
    'M20 11l-8 8a5 5 0 0 1-7-7l8-8a3 3 0 0 1 4 4l-8 8a1 1 0 0 1-2-2l7-7',
    'M3 4h18v16H3z M3 16l5-5 4 4 3-3 6 6',
    'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M8 14c2 3 6 3 8 0 M9 9h.01 M15 9h.01',
    'M4 6h16 M4 10h16 M4 14h12 M4 18h8',
  ];
  const formatIcon = (d) =>
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' +
    d +
    '"/>' +
    (d.startsWith('M3 4h18')
      ? '<circle cx="8" cy="8" r="1.3" fill="currentColor" stroke="none"/><path d="m5 17 5-6 5 6z" fill="currentColor" stroke="none"/>'
      : '') +
    '</svg>';

  env.widget({
    task: 'use-email',
    site: 'design-use-email-star-reply-04',
    name: 'design',
    split: 'train',
    scenarios: ['star-reply'],
    template: 'use-email/mail',
    design: {
      rowHeight: 80,
      rowBasis: 'size',
      searchPlaceholder: 'Search mail...',
      replyPlaceholder: 'Write a reply...',
      parts: {
        searchInput: (base) => (searchline) => {
          const search = base(searchline);
          const chromeSearch = document.querySelector('.kde-search');
          if (chromeSearch) {
            const previousSearch = chromeSearch.querySelector('span,input');
            if (previousSearch) previousSearch.remove();
            chromeSearch.append(search);
          }
          return search;
        },
        docStart: (base, S) => (d) => {
          base(d);
          const priorBack = S.els.navTrigger.querySelector('.back-control');
          if (priorBack) priorBack.remove();
        },
        docBack: (base, S) => (tools) => {
          S.els.navTrigger.append(S.button(tools, 'Inbox', 'back', { back: true }, 'inbox', 'back-control'));
        },
        docMeta: (base, S) => (meta, e) => {
          const { el, spec } = S;
          el('h2', '', meta, e.subject);
          const who = el('div', 'who-row', meta);
          el('span', 'avatar', who, e.name.slice(0, 1));
          const wt = el('div', 'who-text', who);
          const nm = el('div', '', wt);
          el('strong', '', nm, e.name);
          el('span', 'address', nm, ' <' + e.addr + '>');
          el('div', 'to-line', wt, 'to me' + (e.cc.length ? ' · Cc: ' + e.cc.map((x) => x.name).join(', ') : ''));
          el('div', 'time-line', who, e.time);
        },
        editorFormat: (base, S) => () => {
          const fmt = S.el('div', 'formatbar', S.els.editor);
          for (const path of FORMAT_PATHS) S.el('span', '', fmt).innerHTML = formatIcon(path);
        },
      },
    },
  });
})();
