// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) =>
      function overlay(ctx) {
        const { K } = S;
        const { rng, util, kind } = ctx;
        const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
        el.dataset.role = 'overlay';
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        if (kind === 'promo') {
          util.el('div', 'ref-promo-photo', box);
          util.el('strong', 'ref-promo-title', box, 'Stay in the Loop');
        }
        if (kind === 'cookie') util.el('strong', 'ref-cookie-title', box, 'We use cookies');
        if (kind === 'chat') util.el('strong', 'ref-chat-title', box, 'Riverside Help');
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        if (kind === 'promo') {
          const email = util.el('input', 'ref-promo-email', box);
          email.type = 'text';
          email.placeholder = 'your@email.com';
          email.setAttribute('aria-label', 'Email address');
        }
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
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebar = roomy && rng.bool(0.35);
        const nav = W >= 1180 && rng.bool(0.5);
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        const referenceEnd = rng.fork('riverside/end-label').bool(0.5);
        if (!word && referenceEnd) label = 'Confirm';
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        const icon = (holder, label) => {
          const paths = {
            Home: '<path fill="#ad7850" d="M3 15L17 2l14 13-3 3-11-10L6 18z"/><path fill="#d9c59b" d="M7 16l10-9 10 9v15H7z"/><path fill="#785234" d="M14 21h7v10h-7z"/>',
            Projects: '<path fill="#d4a04d" d="M3 7h11l4 4h13v19H3z"/><path fill="#e9bb66" d="M2 12h30l-3 18H4z"/>',
            Tasks:
              '<rect x="4" y="4" width="25" height="26" rx="3" fill="#b9a783"/><path d="M8 16l7 8L31 6" fill="none" stroke="#fffdf0" stroke-width="5"/><path d="M8 14l7 8L30 4" fill="none" stroke="#534631" stroke-width="2"/>',
            Calendar:
              '<rect x="4" y="6" width="26" height="25" rx="2" fill="#ede4ca"/><path fill="#ad6348" d="M4 6h26v7H4z"/><path d="M10 2v9M24 2v9M9 18h4m4 0h4m4 0h2M9 24h4m4 0h4m4 0h2" stroke="#6b5033" stroke-width="3"/>',
            Contacts:
              '<circle cx="12" cy="10" r="6" fill="#8e7853"/><circle cx="24" cy="12" r="5" fill="#b3a17b"/><path fill="#8e7853" d="M3 31v-9c0-10 18-10 18 0v9z"/><path fill="#aa936b" d="M20 31v-9l-1-5c8-4 14 0 14 7v7z"/>',
            Documents:
              '<path fill="#a88e62" d="M7 3h16l7 7v22H7z"/><path fill="none" d="M22 3v8h8M11 16h14M11 22h14M11 27h12M3 8v24" stroke="#eee1c1" stroke-width="2"/>',
            Notebook:
              '<rect x="6" y="3" width="23" height="29" rx="1" fill="#d7c69c"/><path d="M12 3v29M3 7h6M3 13h6M3 19h6M3 25h6" stroke="#fff7dc" stroke-width="2"/>',
            Reports:
              '<path fill="#d9c497" d="M4 19h6v11H4zM14 12h6v18h-6zM24 3h6v27h-6z"/><path d="M1 33h33" stroke="#e1dfd0" stroke-width="3"/>',
            Settings:
              '<path fill="#c6c7c3" d="M13 1h8l1 6 4 2 5-2 4 7-5 4v4l5 4-4 7-6-2-4 2-1 5h-8l-1-6-4-2-5 2-4-7 5-4v-4l-5-4 4-7 6 2 4-2z"/><circle cx="17" cy="19" r="7" fill="#483728"/>',
          };
          holder.innerHTML =
            '<svg viewBox="0 0 36 38" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><g stroke="#6d5537" stroke-width=".9" stroke-linejoin="round">' +
            (paths[label] || paths.Documents) +
            '</g></svg>';
        };
        const masthead = util.el('div', 'organizer-head', document.body);
        const tree = util.el('div', 'organizer-tree', masthead);
        tree.innerHTML =
          '<svg viewBox="0 0 110 90" aria-hidden="true"><g fill="#40301f"><path d="M47 83l5-27-20-13 21 7-8-22 13 22 19-15-14 23 3 25 21 3H29z"/><path d="M8 44l-4-4 6-4-3-5 8-2-2-6 7 1-1-7 9 1 1-7 7 3 5-8 7 3 3-6 7 4 6-5 4 7 9-3 2 6 8-1-1 7 7-1 2 8 8 1-3 6 7 5-6 5 5 6-8 3 2 7-10-1-2 6-9-4-5 5-8-6-6 5-7-5-7 5-5-5-8 2-1-6-9-1 2-6-6-2z"/></g><g fill="#f4eddc"><path d="M26 41l12 5 10-1-7 5-8-1zM60 48l11-7 9 1-7 2-9 8zM45 27l3 9 6 5-8-3z"/><circle cx="29" cy="24" r="1.4"/><circle cx="62" cy="17" r="1.4"/><circle cx="81" cy="32" r="1.3"/><circle cx="19" cy="36" r="1"/><circle cx="73" cy="27" r="1"/><circle cx="47" cy="19" r="1"/><circle cx="92" cy="43" r="1"/></g></svg>';
        const mast = util.el('div', 'organizer-branding', masthead);
        util.el('div', 'organizer-name', mast, 'Riverside Organizers');
        util.el('div', 'organizer-tagline', mast, 'Plans　People　Progress');
        util.el('div', 'organizer-landscape', masthead);
        const date = util.el('div', 'organizer-date', masthead);
        util.el('span', '', date, 'Tuesday');
        util.el('span', '', date, 'April 27, 2010');
        const organizerNav = util.el('nav', 'organizer-side-nav', document.body);
        for (const [icon, label] of [
          ['⌂', 'Home'],
          ['▰', 'Projects'],
          ['☑', 'Tasks'],
          ['▦', 'Calendar'],
          ['♟', 'Contacts'],
          ['▤', 'Documents'],
        ]) {
          const item = util.el('div', `organizer-nav-item${label === 'Tasks' ? ' active' : ''}`, organizerNav);
          const glyph = util.el('span', 'organizer-nav-icon', item);
          const shapes = { Home: '⌂', Projects: '▰', Tasks: '☑', Calendar: '▦', Contacts: '♟', Documents: '▤' };
          glyph.textContent = shapes[label];
          util.el('span', '', item, label);
        }
        const pocket = util.el('div', 'organizer-pocket', document.body);
        util.el('div', 'organizer-photo', pocket);
        util.el('div', 'organizer-sticky', pocket, 'Good People\nGreat Results');
        const dock = util.el('div', 'organizer-dock', document.body);
        for (const [icon, label] of [
          ['☑', 'Tasks'],
          ['▤', 'Notebook'],
          ['▥', 'Reports'],
          ['⚙', 'Settings'],
        ]) {
          const item = util.el('div', `organizer-dock-item${label === 'Tasks' ? ' active' : ''}`, dock);
          util.el('span', 'organizer-dock-icon', item, icon);
          util.el('span', '', item, label);
        }
        for (const item of organizerNav.children) icon(item.firstElementChild, item.lastElementChild.textContent);
        for (const item of dock.children) icon(item.firstElementChild, item.lastElementChild.textContent);
        const titlebar = util.el('div', 'ref-titlebar', document.body);
        const lights = util.el('div', 'ref-window-lights', titlebar);
        for (const tone of ['red', 'amber', 'green']) util.el('span', `ref-light ref-light-${tone}`, lights);
        const workbookTitle = util.el('div', 'ref-window-title', titlebar);
        util.el('span', 'workbook-window-icon', workbookTitle, '▦');
        util.el('span', '', workbookTitle, 'Task Workbook');
        Object.assign(_c, {
          collide,
          cr,
          date,
          decoys,
          dock,
          icon,
          label,
          lights,
          mast,
          masthead,
          nav,
          organizerNav,
          placement,
          pocket,
          referenceEnd,
          sidebar,
          titlebar,
          tree,
          wantFooter,
          workbookTitle,
        });
      },
    'frame.instruction': (base, S) =>
      function (_c) {
        const { ctx, display, header, util } = _c;
        if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
        else util.el('div', 'ref-spacer', header);
        const appTools = util.el('div', 'ref-app-tools', header);
        const appButton = (glyph, label, selected) => {
          const b = util.el('button', `ref-app-tool${selected ? ' is-selected' : ''}`, appTools);
          b.type = 'button';
          b.title = label;
          b.setAttribute('aria-label', label);
          util.el('span', 'ref-app-glyph', b, glyph);
          util.el('span', 'ref-app-label', b, label);
          return b;
        };
        appButton('▦', 'Workbook', true);
        appButton('▥', 'Charts');
        appButton('▤', 'Tables');
        appButton('A↧', 'Sort & Filter');
        appButton('✎', 'Format');
        util.el('span', 'ref-toolbar-gap', appTools);
        appButton('▦＋', 'Insert');
        appButton('▦−', 'Delete');
        appButton('∑', 'AutoSum');
        const search = util.el('div', 'ref-search', appTools);
        util.el('span', 'ref-search-icon', search, '⌕');
        util.el('span', '', search, 'Search Sheet');
        Object.assign(_c, { appButton, appTools, search });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, label, placement, titlebar, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', titlebar);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        Object.assign(_c, { headerTools, submit });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const rail = util.el('aside', 'workbook-controls', body);
        util.el('strong', 'workbook-group-title', rail, 'Worksheet');
        for (const [glyph, text] of [
          ['✚', 'Add Row'],
          ['✖', 'Delete Row'],
          ['⇧', 'Insert Row'],
        ]) {
          const button = util.el('button', 'workbook-control', rail);
          button.type = 'button';
          util.el('span', 'workbook-control-icon', button, glyph);
          util.el('span', '', button, text);
          button.addEventListener('click', () => env.log('decoy', { label: text }));
        }
        util.el('strong', 'workbook-group-title columns-title', rail, 'Columns');
        for (const [glyph, text] of [
          ['◫', 'Hide Column'],
          ['▥', 'Show Column'],
          ['▦', 'Freeze Panes'],
        ]) {
          const button = util.el('button', 'workbook-control', rail);
          button.type = 'button';
          util.el('span', 'workbook-control-icon', button, glyph);
          util.el('span', '', button, text);
          button.addEventListener('click', () => env.log('decoy', { label: text }));
        }
        const inspector = util.el('aside', 'ref-properties', body);
        const inspectorHead = util.el('div', 'ref-properties-head', inspector);
        util.el('span', 'ref-properties-close', inspectorHead, '●');
        util.el('strong', '', inspectorHead, '❔　Tips & Help');
        const property = (label, value) => {
          const row = util.el('div', 'ref-property', inspector);
          util.el('span', '', row, label);
          util.el('span', 'ref-property-value', row, value);
        };
        util.el('strong', 'ref-property-section', inspector, 'Working with data');
        util.el(
          'div',
          'organizer-help-copy',
          inspector,
          'Use the column menus to sort, filter, or group your data. Click the small arrow in a column header to see options for that column.',
        );
        util.el('div', 'ref-properties-rule', inspector);
        util.el('strong', 'ref-property-section', inspector, 'Filtering records');
        util.el(
          'div',
          'organizer-help-copy',
          inspector,
          'Choose values from the column menu to show only the records you want. You can filter by text, dates, or categories such as Status.',
        );
        util.el('div', 'ref-properties-rule', inspector);
        util.el('strong', 'ref-property-section', inspector, 'Helpful shortcuts');
        const shortcuts = util.el('div', 'organizer-shortcuts', inspector);
        for (const [key, action] of [
          ['Ctrl + Arrow', 'Move between cells'],
          ['Ctrl + D', 'Fill down'],
          ['Ctrl + R', 'Fill right'],
          ['Ctrl + Z', 'Undo'],
          ['Ctrl + Y', 'Redo'],
        ]) {
          const row = util.el('div', 'organizer-shortcut-row', shortcuts);
          util.el('span', '', row, key);
          util.el('span', '', row, action);
        }
        Object.assign(_c, { inspector, inspectorHead, property, rail, shortcuts, stage });
      },
    'frame.footer': (base, S) =>
      function (_c) {
        const { body, collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
        let { submit } = _c;
        if (wantFooter) {
          const foot = util.el('footer', 'ref-foot', body);
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
        Object.assign(_c, { submit });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { endBtn, headerTools, label, placement, referenceEnd, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        if (referenceEnd && submit) {
          const previous = submit.parentElement;
          submit.className = 'ref-submit';
          submit.textContent = label;
          headerTools.appendChild(submit);
          if (previous.classList.contains('ref-float-dock')) previous.remove();
        }
        Object.assign(_c, { submit });
      },
  };

  env.site({
    name: 'design-use-spreadsheet-filter-02',
    template: 'site/base',
    design: { parts },
  });
})();
