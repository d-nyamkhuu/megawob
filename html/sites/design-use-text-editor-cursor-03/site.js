// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const ICONS = {
    folder:
      '<path fill="#ffe68d" stroke="#302a12" d="M2 8h10l3-4h10l3 4v20H2z"/><path fill="#e9ad21" stroke="#302a12" d="M4 11h26l-5 17H1z"/><path fill="none" stroke="#fff8cf" d="M6 14h20M8 8h14"/>',
    page: '<path fill="#fff" stroke="#253547" d="M7 2h15l6 6v22H7z"/><path fill="#c0cbd7" stroke="#253547" d="M22 2v7h6"/><path fill="none" stroke="#7e8894" d="M10 12h14M10 15h14M10 18h14M10 21h14M10 24h14M10 27h14"/>',
    home: '<path fill="#ccd9ec" stroke="#111" d="M2 15 16 2l14 13-3 3L16 8 5 18z"/><path fill="#fff8dc" stroke="#111" d="M6 16v14h20V16L16 8z"/><path fill="#7898c2" stroke="#111" d="M14 20h7v10h-7zM8 17h5v5H8z"/><path stroke="#111" fill="#bb7942" d="M23 3h4v9l-4-4z"/>',
    search:
      '<circle fill="#b5e3ff" stroke="#111" cx="12" cy="12" r="10"/><path fill="#ffe26b" stroke="#111" d="m18 20 4-3 9 11-4 3z"/><path stroke="white" fill="none" d="M5 12a7 7 0 0 1 9-7"/>',
    news: '<path fill="#eee" stroke="#111" d="M4 2h23v27H4z"/><path fill="#fff" stroke="#111" d="M1 7h4v23h23v-3"/><path fill="none" stroke="#222" d="M8 6h15M8 10h15M8 23h15M8 26h15M8 14h6v6H8zM17 14h6M17 17h6M17 20h6"/>',
    people:
      '<g stroke="#111"><circle fill="#f6cf96" cx="10" cy="8" r="4"/><circle fill="#f6cf96" cx="23" cy="6" r="4"/><path fill="#c5d6f4" d="M3 17q0-7 7-7t7 7v12H3z"/><path fill="#f1cc78" d="M17 15q0-7 6-7t6 7v13H17z"/><circle fill="#f6cf96" cx="17" cy="15" r="4"/><path fill="#89afdd" d="M10 23q0-6 7-6t7 6v8H10z"/></g>',
    book: '<path fill="#648cdb" stroke="#111" d="M2 5q7-4 14 1 7-5 14-1v24q-7-4-14 0-7-4-14 0z"/><path fill="#b9d1ff" stroke="#111" d="M5 3q5-1 11 3 6-4 11-3v23q-5-2-11 1-6-3-11-1z"/><path stroke="#111" d="M16 6v21"/>',
    mail: '<path fill="#f5f5f5" stroke="#111" d="M1 6h30v21H1z"/><path fill="none" stroke="#111" d="m1 6 15 12L31 6M1 27l11-12m19 12L20 15"/>',
    alignLeft: '<path fill="none" stroke="#111" stroke-width="2" d="M5 6h23M5 12h15M5 18h23M5 24h15"/>',
    alignCenter: '<path fill="none" stroke="#111" stroke-width="2" d="M4 6h24M8 12h16M4 18h24M8 24h16"/>',
    alignRight: '<path fill="none" stroke="#111" stroke-width="2" d="M4 6h23M12 12h15M4 18h23M12 24h15"/>',
    bullets:
      '<path stroke="#111" stroke-width="2" d="M12 6h16M12 16h16M12 26h16"/><g fill="#111"><rect x="3" y="4" width="4" height="4"/><rect x="3" y="14" width="4" height="4"/><rect x="3" y="24" width="4" height="4"/></g>',
    numbers:
      '<path stroke="#111" stroke-width="2" d="M12 6h16M12 16h16M12 26h16"/><g fill="#111" font-family="Arial" font-size="9"><text x="2" y="9">1</text><text x="2" y="19">2</text><text x="2" y="29">3</text></g>',
    list: '<path stroke="#111" stroke-width="2" d="M13 6h15M13 16h15M13 26h15"/><g fill="#111"><circle cx="5" cy="6" r="2"/><circle cx="5" cy="16" r="2"/><circle cx="5" cy="26" r="2"/></g>',
    link: '<g transform="rotate(-28 16 16)" fill="none" stroke="#111" stroke-width="2.7"><rect x="2" y="11" width="18" height="10" rx="5"/><rect x="12" y="11" width="18" height="10" rx="5"/></g>',
    globe:
      '<defs><clipPath id="ww-earth"><circle cx="32" cy="32" r="30"/></clipPath><radialGradient id="ww-ocean" cx="35%" cy="25%"><stop stop-color="#1749ff"/><stop offset="1" stop-color="#0005aa"/></radialGradient></defs><circle cx="32" cy="32" r="30" fill="url(#ww-ocean)" stroke="#001492"/><g clip-path="url(#ww-earth)"><path fill="#75dc00" stroke="#188910" stroke-width=".5" d="m8 9 10-5 8 2 4 6-3 8-6 1-2 8-7-4 2-8-8-2zm17 22 8 1 7 8-3 10-8 10-1-15-5-7zm9-26 12 4 5 6 10 2 4 10-15 1-3-7-8 2-6-5zm5 20 12 3 4 8-7 11-7-2-2-10-6-6zm13 23 9-3 6 11-14 2z"/><g fill="none" stroke="#afc6ff" stroke-width=".65" opacity=".8"><ellipse cx="32" cy="32" rx="13" ry="30"/><ellipse cx="32" cy="32" rx="24" ry="30"/><path d="M2 32h60M6 17q26 8 52 0M6 47q26-8 52 0M32 2v60"/></g></g>',
  };

  function drawIcon(util, parent, name, cls) {
    const span = util.el('span', `ww-icon ${cls || ''}`, parent);
    span.innerHTML = `<svg viewBox="0 0 ${name === 'globe' ? '64 64' : '32 32'}" aria-hidden="true">${ICONS[name] || ICONS.page}</svg>`;
    return span;
  }

  const parts = {
    frame: (base, S) =>
      function frame(ctx) {
        const { ACCENTS, K, LOW_ACCENTS, LOW_THEME, THEMES, TITLES, endLabel } = S;
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
        root.style.setProperty('--accent', accent);
        root.dataset.theme = 'light';
        // Localized frame: same layout draws as English, texts from UI_WORDS (own stream).
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const lr = rng.fork('chrome/lang');
        const local = (list, keys) => (word ? lr.sample(keys, list.length).map(word) : list);
        const closeLabel = word ? word('close') : 'Close';

        const W = window.innerWidth;
        const H = window.innerHeight;
        const roomy = W >= 1260;
        const tall = H >= 700;
        let display = ctx.display || 'header';
        if (display === 'panel' && !roomy) display = 'header';
        if (display === 'toast' && !tall) display = 'header';
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');

        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebar = roomy && rng.bool(0.35);
        const nav = W >= 1180 && rng.bool(0.5);
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        const endDesign = rng.fork('webworks/end');
        if (!ctx.finish && endDesign.bool(0.5)) {
          placement = 'header';
          label = word ? word('apply') : 'Apply';
        }
        // A decoy that reads like an end control (another end word, never this episode's label).
        const cr = rng.fork('chrome/collide');
        let collide = null;
        if (cr.bool(0.3)) {
          let text = null;
          if (word) {
            const same = (x) => x.trim().toLowerCase() === label.trim().toLowerCase();
            const options = [...new Set(K.collide.map(word))].filter((x) => !same(x));
            if (options.length) text = cr.pick(options);
          } else text = content.collideLabel(cr, label);
          if (text !== null) collide = { text, where: cr.pick(['header', 'header', 'footer']) };
        }

        const header = util.el('header', 'ref-task', document.body);
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Document Workspace');
        brand.dataset.role = 'brand';
        brand.textContent = '';
        const logo = util.el('div', 'ww-logo', brand);
        drawIcon(util, logo, 'globe', 'ww-globe');
        const wordmark = util.el('span', 'ww-wordmark', logo);
        wordmark.innerHTML = '<b>Web</b><strong>Works</strong><small>™</small><em>Your Guide to the Internet</em>';
        const portal = util.el('div', 'ww-columns', header);
        for (const [heading, items] of [
          ['Search', ['Web Pages', 'Images', 'Newsgroups', 'People']],
          [
            'Directories',
            [
              'Arts & Humanities',
              'Business & Economy',
              'Computers & Internet',
              'Education',
              'Entertainment',
              'Health',
              'News & Media',
              'Science',
              'Society & Culture',
              'Sports & Recreation',
              'Reference',
              'Regional',
            ],
          ],
          ['My WebWorks', ['My Bookmarks', 'My Page', 'Preferences', 'Help']],
        ]) {
          const col = util.el('div', 'ww-column', portal);
          util.el('b', 'ww-strip', col, heading);
          items.forEach((item, i) => {
            const link = util.el('a', '', col, item);
            if (heading === 'Directories') {
              link.style.gridColumn = String(Math.floor(i / 4) + 1);
              link.style.gridRow = String((i % 4) + 2);
            }
          });
        }
        const search = util.el('div', 'ww-search', header);
        util.el('b', 'ww-strip', search, 'Quick Search');
        const searchRow = util.el('div', 'ww-search-row', search);
        const searchInput = util.el('span', '', searchRow, 'Search the Web');
        util.el('button', '', searchRow, 'Go');
        if (nav) {
          const n = util.el('nav', 'ref-nav', header);
          for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav)) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
        else util.el('div', 'ref-spacer', header);

        const decoyBtn = (parent, text, collides) => {
          const b = util.el('button', 'ref-xtra', parent, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () =>
            env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
          );
        };
        const endBtn = (parent, cls, text) => {
          const b = util.el(cls === 'ref-endlink' ? 'a' : 'button', cls, parent, text);
          if (b.tagName === 'BUTTON') b.type = 'button';
          else b.href = '#';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };

        let submit = null;
        const headerTools = util.el('div', 'ref-tools', header);
        const quick = (glyph, label) => {
          const b = util.el('button', 'ref-quick', headerTools, glyph);
          b.type = 'button';
          b.title = label;
          b.setAttribute('aria-label', label);
        };
        quick('⌕', 'Search');
        quick('ⓘ', 'Help');
        quick('⚙', 'Settings');
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }

        const body = util.el('div', 'ref-body', document.body);
        if (sidebar) {
          const side = util.el('aside', 'ref-side', body);
          for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav)) {
            const a = util.el('a', 'ref-sidelink', side, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'sidebar', label: item });
            });
          }
        }
        let taskPanel = null;
        if (display === 'panel') {
          const panel = util.el('aside', 'ref-panel', body);
          taskPanel = panel;
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
          if (rng.bool(0.5)) body.classList.add('ref-panel-right');
        }
        const stage = util.el('main', 'ref-stage', body);
        stage.style.justifyContent = rng.pick(['center', 'center', 'flex-start', 'flex-end']);
        stage.style.alignItems = rng.pick(['center', 'center', 'flex-start', 'flex-end']);

        // The rich document is a companion surface; the task editor remains the active task widget.
        const doc = util.el('section', 'ref-document', body);
        const docTab = util.el('div', 'ref-doc-tab', doc);
        drawIcon(util, docTab, 'page');
        util.el('strong', '', docTab, 'Release Notes');
        util.el('span', 'ref-doc-close', docTab, '×');
        const toolbar = util.el('div', 'ref-doc-toolbar', doc);
        util.el('button', 'ref-doc-style', toolbar, 'Arial　　▾');
        util.el('button', 'ref-doc-size', toolbar, '12　▾');
        const formatTools = util.el('div', 'ref-doc-tools', toolbar);
        for (const [text, title] of [
          ['B', 'Bold'],
          ['I', 'Italic'],
          ['U', 'Underline'],
          ['☰', 'Align left'],
          ['≡', 'Align centre'],
          ['☰', 'Align right'],
          ['☷', 'Bulleted list'],
          ['☷', 'Numbered list'],
          ['☷', 'List style'],
          ['↗', 'Link'],
        ]) {
          const button = util.el('button', '', formatTools, text);
          button.title = title;
          const graphic = {
            'Align left': 'alignLeft',
            'Align centre': 'alignCenter',
            'Align right': 'alignRight',
            'Bulleted list': 'bullets',
            'Numbered list': 'numbers',
            'List style': 'list',
            'Link': 'link',
          }[title];
          if (graphic) {
            button.textContent = '';
            drawIcon(util, button, graphic);
          }
        }
        util.el('button', 'ref-doc-mode', toolbar, 'Editing　　▾');
        const docBody = util.el('div', 'ref-doc-body', doc);
        const article = util.el('article', 'ref-article', docBody);
        util.el('h1', '', article, 'Site Tools – Release Notes');
        util.el(
          'p',
          '',
          article,
          'This release includes several improvements to the search and directory tools on WebWorks. The new formatting utilities make it easier to present results consistently across different browsers.',
        );
        util.el('h2', '', article, 'Key Changes');
        const bullets = util.el('ul', '', article);
        [
          'Improved result formatting for search and directory pages',
          'New card view for related links',
          'Updated styles for better readability',
          'Miscellaneous bug fixes',
        ].forEach((x) => util.el('li', '', bullets, x));
        util.el('h2', '', article, 'Known Issues');
        util.el(
          'p',
          '',
          article,
          'Some older browsers may not display certain styles correctly. We are continuing to test and refine the look and feel across platforms.',
        );
        const comments = util.el('aside', 'ref-comments', docBody);
        util.el('b', 'ww-strip ref-suggestions-title', comments, 'Suggestions (2)');
        for (const [person, message] of [
          ['Clarity', 'Consider a shorter introductory sentence for easier reading.'],
          ['Style', 'Use consistent capitalization for "WebWorks".'],
        ]) {
          const card = util.el('div', 'ref-comment', comments);
          const top = util.el('div', 'ref-comment-top', card);
          const who = util.el('div', 'ref-comment-who', top);
          util.el('strong', '', who, person);
          util.el('p', '', card, message);
          const apply = util.el('button', 'ref-suggestion-apply', card, 'Apply');
          apply.addEventListener('click', () => env.log('decoy', { label: `Apply ${person} suggestion` }));
        }
        if (taskPanel) comments.append(taskPanel);
        const docFoot = util.el('div', 'ref-doc-foot', doc);
        util.el('span', '', docFoot, 'Words: 54　　Characters: 318');
        util.el('span', 'ref-doc-view', docFoot, 'English (U.S.)');

        const properties = util.el('aside', 'ref-properties', body);
        util.el('h2', '', properties, 'Properties');
        const propSection = (name, rows) => {
          const section = util.el('section', 'ref-prop-section', properties);
          const heading = util.el('h3', '', section);
          drawIcon(util, heading, name.startsWith('Current') ? 'page' : 'folder');
          util.el('span', '', heading, name);
          for (const [label, value] of rows) {
            const row = util.el('div', 'ref-prop-row', section);
            util.el('span', '', row, label);
            util.el('b', '', row, value);
          }
        };
        propSection('Project: Site Tools', [
          ['Location:', '/webworks/site-tools/'],
          ['Files:', '12'],
          ['Last Modified:', 'Apr 14, 1998  10:24 AM'],
          ['Owner:', 'jsmith'],
        ]);
        propSection('Current File:　 formatter.js', [
          ['Path:', '/webworks/site-tools/formatter.js'],
          ['Type:', 'JavaScript'],
          ['Size:', '6.4 KB'],
          ['Modified:', 'Apr 14, 1998  10:24 AM'],
        ]);
        const contents = util.el('section', 'ww-project-contents', properties);
        const contentsHead = util.el('h3', '', contents);
        drawIcon(util, contentsHead, 'folder');
        util.el('span', '', contentsHead, 'Project Contents');
        util.el('small', '', contentsHead, 'Size');
        const fileList = util.el('div', 'ww-file-list', contents);
        for (const [file, size] of [
          ['index.html', '2.1 KB'],
          ['search.js', '4.8 KB'],
          ['formatter.js', '6.4 KB'],
          ['styles.css', '3.2 KB'],
          ['guide.html', '1.9 KB'],
        ]) {
          const row = util.el('div', file === 'formatter.js' ? 'ww-file selected' : 'ww-file', fileList);
          drawIcon(util, row, 'page');
          util.el('a', '', row, file);
          util.el('span', '', row, size);
        }

        const dock = util.el('nav', 'ww-dock', document.body);
        for (const [icon, label] of [
          ['home', 'Home'],
          ['search', 'Search'],
          ['folder', 'Directories'],
          ['news', 'News'],
          ['people', 'People'],
          ['book', 'Chat'],
          ['mail', 'Mail'],
          ['globe', 'My WebWorks'],
        ]) {
          const a = util.el('a', '', dock);
          drawIcon(util, a, icon);
          util.el('b', '', a, label);
        }

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
        }

        if (wantFooter) {
          const foot = util.el('footer', 'ref-foot', document.body);
          const footText = rng.pick([
            '© 2024 Example Co.',
            'All changes are saved automatically.',
            'Need help? Contact your administrator.',
            'v4.2.1 · Status: all systems normal',
          ]);
          util.el(
            'span',
            'ref-foot-text',
            foot,
            word
              ? lr.pick([
                  `© 2024 Example Co. ${word('footRights')}`,
                  word('footSaved'),
                  word('footHelp'),
                  `v4.2.1 · ${word('footStatus')}`,
                ])
              : footText,
          );
          const tools = util.el('div', 'ref-tools', foot);
          if (decoys.length > 1) decoyBtn(tools, decoys[1]);
          if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
          if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
          if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
        }
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        document.body.classList.toggle(
          'ww-footer-actions',
          !!document.querySelector('.ref-foot .ref-tools > *, .ref-float-dock'),
        );
        const note = document.querySelector('.ref-note');
        document.body.style.setProperty(
          '--note-height',
          note ? `${Math.ceil(note.getBoundingClientRect().height) + 7}px` : '0px',
        );
        return { stage, submit };
      },
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
        if (kind === 'banner') {
          el.style.top = `${document.querySelector('.ref-task').getBoundingClientRect().bottom}px`;
        }
        if (kind === 'cookie') {
          const cookie = util.el('span', 'ww-cookie-icon', el, '●');
          el.prepend(cookie);
        }
        if (kind === 'chat') {
          const heading = util.el('div', 'ww-chat-heading', el, 'WebWorks Assistant');
          el.prepend(heading);
          heading.append(dismiss);
          row.remove();
          const composer = util.el('div', 'ww-chat-composer', el);
          util.el('span', '', composer, 'Type a message...');
          const send = util.el('button', '', composer, 'Send');
          send.addEventListener('click', () => env.log('decoy', { label: 'Chat Send' }));
        }
        if (kind === 'promo') {
          const heading = util.el('div', 'ww-promo-heading', box, 'Join the WebWorks Newsletter');
          box.prepend(heading);
          const close = util.el('button', 'ww-promo-close', heading, '×');
          close.setAttribute('aria-label', 'Close');
          close.addEventListener('click', () => ctx.dismiss('close'));
          const newsletter = util.el('div', 'ww-newsletter', box);
          drawIcon(util, newsletter, 'mail');
          const details = util.el('div', '', newsletter);
          util.el('p', '', details, 'Get the latest WebWorks news, tips and feature updates delivered to your inbox.');
          const email = util.el('input', '', details);
          email.placeholder = 'Enter your email address';
          email.setAttribute('aria-label', 'Newsletter email');
          const subscribe = util.el('button', 'ww-subscribe', details, 'Subscribe');
          subscribe.addEventListener('click', () => env.log('decoy', { label: 'Subscribe' }));
          box.insertBefore(newsletter, box.querySelector('.ref-ov-text'));
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
  };

  env.site({
    name: 'design-use-text-editor-cursor-03',
    template: 'site/base',
    design: { parts },
  });
})();
