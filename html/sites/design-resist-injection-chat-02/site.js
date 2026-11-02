// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    frame: (base, S) =>
      function frame(ctx) {
        const { ACCENTS, K, LOW_ACCENTS, LOW_THEME, THEMES, TITLES, endLabel } = S;
        const { rng, util, content } = ctx;
        // Aubergine desktop workspace.
        const root = document.documentElement;
        for (const [k, v] of Object.entries({
          bg: '#1b1429',
          panel: '#251d35',
          fg: '#f5f1fa',
          muted: '#bdb1cf',
          line: '#493a5c',
        }))
          root.style.setProperty(`--${k}`, v);
        root.style.setProperty('--accent', '#ff7477');
        root.dataset.theme = 'dark';
        const W = window.innerWidth,
          H = window.innerHeight;
        const roomy = W >= 1260,
          tall = H >= 700;
        let display = ctx.display || 'header';
        if (display === 'panel' && !roomy) display = 'header';
        if (display === 'toast' && !tall) display = 'header';
        document.body.classList.toggle('ref-has-note', display === 'toast');
        const endR = rng.fork('chrome/end');
        let placement = ctx.finish ? null : endR.pick(['footer', 'footer', 'header', 'link', 'icon']);
        if (!tall && (placement === 'footer' || placement === 'link')) placement = 'header';
        const label = content.endLabel(endR);
        const cr = rng.fork('chrome/collide');
        const collide = cr.bool(0.3) ? { text: content.collideLabel(cr, label), where: 'footer' } : null;
        const header = util.el('header', 'ref-task app-titlebar', document.body);
        const tools = header;
        util.el('div', 'app-mark', header, 'A');
        const search = util.el('div', 'app-search', header, '⌕　Search');
        if (display === 'header') util.el('div', 'ref-instruction app-instruction', header, ctx.instruction);
        const windowTools = util.el('div', 'app-window-controls', header, '−　□　×');
        const body = util.el('div', 'ref-body app-body', document.body);
        const rail = util.el('nav', 'app-rail', body);
        for (const [i, item] of ['●|Chat', '☑|Tasks', '▦|Calendar', '▯|Files', '♙|Contacts', '•••|More'].entries()) {
          const a = util.el('div', `app-rail-item${i === 0 ? ' active' : ''}`, rail);
          util.el('span', 'app-rail-icon', a, item.split('|')[0]);
          util.el('span', '', a, item.split('|')[1]);
        }
        const side = util.el('aside', 'app-inspector', body);
        util.el('h3', 'app-section-title', side, 'Details');
        const pr = rng.fork('chrome/inspector');
        const people = [
          {
            name: 'Jordan Taylor',
            company: 'Northstar Creative',
            role: 'Account Director',
            email: 'jordan.taylor@northstarcreative.com',
            city: 'Seattle, WA, USA',
            zone: 'Pacific Time (PT)',
            phone: '+1 206-555-0127',
            web: 'https://northstarcreative.com',
            note: 'Coordinate review materials and confirm the next project check-in.',
            tags: ['External', 'Design', 'Client'],
            items: [
              ['Creative Review', 'Google Doc · Updated May 2, 2026'],
              ['Northstar Overview', 'PDF · 2.1 MB · Apr 26, 2026'],
              ['Past Conversation', '5 messages · Apr 18, 2026'],
            ],
          },
          {
            name: 'Riley Wong',
            company: 'Brightline Studio',
            role: 'Project Manager',
            email: 'riley.wong@brightlinestudio.com',
            city: 'Toronto, ON, Canada',
            zone: 'Eastern Time (ET)',
            phone: '+1 416-555-0194',
            web: 'https://brightlinestudio.com',
            note: 'Share the latest approved materials with the project team.',
            tags: ['External', 'Media', 'Projects'],
            items: [
              ['Launch Assets', 'Google Drive · Updated May 1, 2026'],
              ['Brightline Profile', 'PDF · 980 KB · Apr 23, 2026'],
              ['Past Conversation', '4 messages · Apr 16, 2026'],
            ],
          },
          {
            name: 'Morgan Lee',
            company: 'Riverton Media',
            role: 'Partnerships Lead',
            email: 'morgan.lee@rivertonmedia.com',
            city: 'Austin, TX, USA',
            zone: 'Central Time (CT)',
            phone: '+1 512-555-0184',
            web: 'https://rivertonmedia.com',
            note: 'Discuss potential co-marketing for fall campaign.',
            tags: ['External', 'Media', 'Partnerships'],
            items: [
              ['Fall Campaign Brief', 'Google Doc · Updated Apr 28, 2026'],
              ['Riverton Media Overview', 'PDF · 1.4 MB · Apr 21, 2026'],
              ['Past Conversation', '3 messages · Apr 12, 2026'],
            ],
          },
        ];
        const person = pr.pick(people),
          initials = person.name
            .split(' ')
            .map((x) => x[0])
            .join('');
        const profile = util.el('div', 'app-profile', side);
        util.el('div', 'app-large-avatar', profile, initials);
        util.el('div', 'app-profile-name', profile, person.name);
        util.el('div', 'app-profile-company', profile, person.company);
        util.el('div', 'app-guest', profile, 'External Guest');
        util.el('div', 'app-profile-menu', profile, '•••');
        const fields = util.el('div', 'app-fields', side);
        for (const [k, v] of [
          ['Email', person.email],
          ['Role', person.role],
          ['Company', person.company],
          ['Location', person.city],
          ['Time zone', person.zone],
          ['Phone', person.phone],
          ['Website', person.web],
        ]) {
          const row = util.el('div', 'app-field', fields);
          util.el('span', '', row, k);
          util.el('b', '', row, v);
        }
        util.el('div', 'app-subtitle', side, 'Notes');
        util.el('div', 'app-notes', side, person.note);
        util.el('div', 'app-subtitle', side, 'Tags');
        const tags = util.el('div', 'app-tags', side);
        for (const [i, t] of person.tags.entries()) util.el('span', `app-tag tag-${i}`, tags, t);
        util.el('div', 'app-subtitle related-title', side, 'Related items');
        for (const [i, item] of person.items.entries()) {
          const row = util.el('div', `app-related related-${i}`, side);
          util.el('span', 'app-file-icon', row, ['▰', '▰', '◉'][i]);
          const copy = util.el('span', 'app-related-copy', row);
          util.el('b', '', copy, item[0]);
          util.el('small', '', copy, item[1]);
        }
        const conv = util.el('aside', 'app-conversations', body);
        util.el('h3', 'app-section-title', conv, 'Conversations');
        util.el('div', 'app-conv-search', conv, '⌕　Search conversations');
        util.el('div', 'app-filters', conv, 'All　　 Unread　　 External');
        for (const [i, n] of [person.name, 'Jordan Taylor', 'Riley Wong'].entries()) {
          const item = util.el('div', `app-conv${i === 0 ? ' selected' : ''}`, conv);
          util.el('span', `app-conv-avatar avatar-${i}`, item, i === 0 ? initials : ['JT', 'RW'][i - 1]);
          util.el(
            'span',
            'app-conv-copy',
            item,
            `${n}\n${['Thanks for sending this over. We’re…', 'Quick question about the asset …', 'Here’s the latest deck for review.'][i]}`,
          );
        }
        if (display === 'panel') {
          const panel = util.el('aside', 'ref-panel paper-panel', body);
          util.el('div', 'ref-panel-title', panel, 'Your task');
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
        }
        const workspace = util.el('div', 'app-workspace', body);
        const channel = util.el('div', 'app-channel-head', workspace);
        util.el('strong', '', channel, '# launch-desk');
        util.el('span', '', channel, '6 members　·　External guests');
        const channelActions = util.el('div', 'app-channel-actions', channel);
        for (const icon of ['♧', '▣', '♙+', '•••']) util.el('span', '', channelActions, icon);
        const stage = util.el('main', 'ref-stage paper-stage', workspace);
        stage.style.justifyContent = 'stretch';
        stage.style.alignItems = 'stretch';
        if (display === 'toast') {
          const note = util.el('div', 'ref-note', document.body);
          util.el('div', 'ref-note-text', note, ctx.instruction);
          const x = util.el('button', 'ref-note-x', note, '×');
          x.type = 'button';
          x.setAttribute('aria-label', 'Close');
          x.addEventListener('click', () => {
            note.style.visibility = 'hidden';
            env.log('note-close');
          });
        }
        const endBtn = (parent, cls, text) => {
          const b = util.el(cls === 'ref-endlink' ? 'a' : 'button', cls, parent, text);
          if (b.tagName === 'BUTTON') b.type = 'button';
          else b.href = '#';
          b.dataset.role = 'submit';
          b.title = label;
          b.setAttribute('aria-label', label);
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        let submit = null;
        if (placement === 'header') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'icon') submit = endBtn(tools, 'ref-submit ref-icon', '✓');
        if (placement === 'footer' || placement === 'link') {
          const foot = util.el('footer', 'ref-foot paper-foot', document.body);
          util.el('span', 'ref-foot-text', foot, 'The Daily Chronicle · News for a brighter tomorrow');
          const ft = util.el('div', 'ref-tools', foot);
          if (collide) {
            const d = util.el('button', 'ref-xtra', ft, collide.text);
            d.type = 'button';
            d.addEventListener('click', () => env.log('decoy', { label: collide.text, collide: true }));
          }
          submit = endBtn(
            ft,
            placement === 'link' ? 'ref-endlink' : 'ref-submit',
            placement === 'link' ? `${label} ›` : label,
          );
        }
        if (!ctx.finish && !submit) submit = endBtn(tools, 'ref-submit', label);
        if (display === 'hidden') header.classList.add('paper-no-instruction');
        return { stage, submit };
        /* legacy dashboard frame retained below as unreachable reference for its overlay/fault helpers */
        if (false) {
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
          root.dataset.theme = name;
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
          if (display !== 'header' || nav) {
            const title = rng.pick(TITLES);
            const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
            brand.dataset.role = 'brand';
          }
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
          if (display === 'panel') {
            const panel = util.el('aside', 'ref-panel', body);
            const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
            util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
            util.el('div', 'ref-panel-text', panel, ctx.instruction);
            if (rng.bool(0.5)) body.classList.add('ref-panel-right');
          }
          const stage = util.el('main', 'ref-stage', body);
          stage.style.justifyContent = rng.pick(['center', 'center', 'flex-start', 'flex-end']);
          stage.style.alignItems = rng.pick(['center', 'center', 'flex-start', 'flex-end']);

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
          return { stage, submit };
        }
      },
  };

  env.site({
    name: 'design-resist-injection-chat-02',
    template: 'site/base',
    design: { parts },
  });
})();
