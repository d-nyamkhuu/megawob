// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    frame: (base, S) =>
      function frame(ctx) {
        const { ACCENTS, K, LOW_ACCENTS, LOW_THEME, THEMES, TITLES, endLabel } = S;
        const { rng, util, content } = ctx;
        // Newspaper desk frame. The widget itself remains the task widget in .ref-stage.
        const root = document.documentElement;
        for (const [k, v] of Object.entries({
          bg: '#f7f5f0',
          panel: '#fffefa',
          fg: '#171513',
          muted: '#77736f',
          line: '#d4d1cc',
        }))
          root.style.setProperty(`--${k}`, v);
        root.style.setProperty('--accent', '#b71920');
        root.dataset.theme = 'paper';
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
        const header = util.el('header', 'ref-task', document.body);
        const mast = util.el('div', 'paper-mast', header);
        util.el('div', 'paper-logo', mast, 'The Daily Chronicle');
        util.el('div', 'paper-tagline', mast, 'NEWS FOR A BRIGHTER TOMORROW');
        const nav = util.el('nav', 'paper-nav', header);
        for (const item of ['Home', 'Newsroom', 'Tasks', 'Calendar', 'Channels', 'Contacts', 'Files']) {
          const a = util.el('a', `paper-tab${item === 'Channels' ? ' active' : ''}`, nav, item);
          a.href = '#';
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'nav', label: item });
          });
        }
        const tools = util.el('div', 'paper-account', header);
        util.el('span', 'paper-search', tools, '⌕  Search');
        util.el('span', 'paper-user', tools, '◉  Taylor Kim⌄');
        if (display === 'header') util.el('div', 'ref-instruction paper-instruction', header, ctx.instruction);
        const body = util.el('div', 'ref-body paper-body', document.body);
        const side = util.el('aside', 'paper-side', body);
        util.el('h3', '', side, 'Channels');
        for (const [i, item] of [
          '#  general',
          '#  launch-desk',
          '#  newsroom',
          '#  editorial',
          '#  design',
          '#  marketing',
          '#  events',
        ].entries())
          util.el('div', `paper-channel${i === 1 ? ' selected' : ''}`, side, item);
        util.el('h3', 'paper-dm-title', side, 'Direct Messages');
        for (const [i, item] of ['Taylor Kim', 'Jordan Lee', 'Morgan Chen', 'Riley Patel'].entries())
          util.el('div', 'paper-dm', side, `${i === 0 ? '🟢' : '●'}  ${item}`);
        if (display === 'panel') {
          const panel = util.el('aside', 'ref-panel paper-panel', body);
          util.el('div', 'ref-panel-title', panel, 'Your task');
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
        }
        const workspace = util.el('div', 'paper-workspace', body);
        const band = util.el('section', 'paper-band', workspace);
        util.el('h1', '', band, '# launch-desk');
        util.el(
          'div',
          'paper-description',
          band,
          'Coverage planning, logistics and day-of coordination for product launch.',
        );
        const stats = util.el('div', 'paper-stats', band);
        for (const [value, caption] of [
          ['12', 'Members'],
          ['3', 'Online'],
          ['28', 'Messages'],
          ['◆  1', 'Pinned Item'],
        ]) {
          const item = util.el('div', 'paper-stat', stats);
          util.el('strong', '', item, value);
          util.el('span', '', item, caption);
        }
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
    name: 'design-resist-injection-chat-01',
    template: 'site/base',
    design: { parts },
  });
})();
