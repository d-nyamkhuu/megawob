// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

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

        // Native-style system menu above the Inventory Pro window.
        const menubar = util.el('div', 'mac-menubar', document.body);
        const apple = util.el('span', 'mac-apple', menubar);
        apple.innerHTML =
          '<svg viewBox="0 0 24 28" aria-hidden="true"><path fill="currentColor" d="M15 6c2-1 3-3 3-5-3 0-5 2-5 5zM20 15c-4-3-2-6 0-7-3-3-5-2-7-1-3-2-6-1-8 1-4 4-2 12 1 16 2 3 4 1 6 1 3 0 4 2 6-1 2-2 3-5 3-6-1 0-1-1-1-3z"/></svg>';
        util.el('strong', 'mac-appname', menubar, 'Orders');
        for (const item of ['File', 'Edit', 'View', 'Records', 'Tools', 'Window', 'Help'])
          util.el('span', 'mac-menuitem', menubar, item);
        util.el('span', 'mac-status', menubar, '▣　');

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
        document.body.dataset.instruction = display;
        header.insertAdjacentHTML('afterbegin', '<span class="mac-traffic"><i></i><i></i><i></i></span>');
        menubar.appendChild(header.querySelector('.mac-traffic'));
        const appactions = util.el('div', 'mac-actions', header);
        const icons = {
          document: '<path d="M5 2h13l8 8v24H5zM18 2v9h8"/>',
          ship: '<path fill="currentColor" stroke="none" d="M1 12h16V3H7v9H1v14h4a5 5 0 0 1 10 0h9a5 5 0 0 1 10 0h3V15l-6-8H20v15h-3V12z"/><path d="M24 10h6l4 7H24z"/><circle cx="10" cy="27" r="3"/><circle cx="29" cy="27" r="3"/>',
          cancel: '<path d="M4 4l26 26M30 4L4 30"/>',
          delete: '<path d="M8 10h19v23H8zM4 6h27M12 6V2h11v4M14 14v14M21 14v14"/>',
        };
        for (const [icon, label] of [
          ['document', 'New Order'],
          ['ship', 'Ship'],
          ['cancel', 'Cancel'],
          ['delete', 'Delete'],
        ]) {
          const b = util.el('span', 'mac-action', appactions);
          util.el('b', '', b).innerHTML =
            '<svg viewBox="0 0 38 36" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">' +
            icons[icon] +
            '</svg>';
          util.el('span', '', b, label);
        }
        const search = util.el('span', 'mac-search', header);
        search.innerHTML =
          '<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><circle cx="13" cy="13" r="10"/><path d="M21 21l12 12"/></svg><span>Search orders…</span>';
        const show = util.el('span', 'mac-show', header);
        show.innerHTML = '<span>Show:</span><span class="mac-show-value">All Orders<i>▴<br>▾</i></span>';
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
        const dashboard = util.el('div', 'mac-dashboard', body);
        const intro = util.el('div', 'mac-intro', dashboard);
        util.el('span', 'mac-document', intro).innerHTML =
          '<svg viewBox="0 0 80 100" fill="white" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M8 3h48l20 22v72H2V8h6z"/><path d="M8 8h47v23h21M18 25h29M18 37h43M18 49h43M18 61h43M18 73h43M18 85h30"/></svg>';
        const identity = util.el('div', 'mac-identity', intro);
        util.el('strong', '', identity, 'Orders');
        util.el('span', '', identity, 'Manage customer orders, track status and shipments.');
        const metrics = util.el('div', 'mac-metrics', dashboard);
        for (const [a, b, c] of [
          ['Total Orders', '254', ''],
          ['Open Orders', '68', ''],
          ['Shipped Orders', '167', ''],
          ['Cancelled Orders', '19', ''],
        ]) {
          const card = util.el('div', 'mac-metric', metrics);
          util.el('span', '', card, a);
          util.el('strong', '', card, b);
          util.el('em', '', card, c);
        }
        const activity = util.el('div', 'mac-activity', dashboard);
        util.el('strong', '', activity, 'Recent Activity');
        for (const t of [
          'Order #10824 shipped',
          'Payment received',
          'Inventory updated',
          'Order #10823 invoiced',
          'Low stock alert',
        ])
          util.el('div', '', activity, t);
        body.insertBefore(dashboard, stage);
        header.insertBefore(dashboard, appactions);
        const tips = util.el('section', 'mac-tips', document.body);
        util.el('strong', 'mac-tips-title', tips, '💡　Tips & Help');
        const tiprow = util.el('div', 'mac-tiprow', tips);
        for (const [h, t] of [
          ['Sort and filter', 'Click a column header to sort. Use the filter button in each header to narrow results.'],
          [
            'Select multiple',
            'Use Shift-click to select a range, or click the checkbox in the header to select all visible rows.',
          ],
          ['Bulk actions', 'After selecting rows, use the toolbar to ship, invoice, mark as paid, or delete.'],
          ['Adjust columns', 'Drag a column’s right edge to resize. Drag the header to reorder columns.'],
        ]) {
          const x = util.el('div', 'mac-tip', tiprow);
          util.el('b', '', x, h);
          util.el('span', '', x, t);
        }
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
        const taskPanel = body.querySelector('.ref-panel');
        if (taskPanel) header.appendChild(taskPanel);
        if (display === 'header') {
          const instruction = header.querySelector('.ref-instruction');
          menubar.appendChild(instruction);
        }
        const completion = util.el('div', 'mac-completion', document.body);
        for (const button of document.querySelectorAll('.ref-xtra')) completion.appendChild(button);
        if (submit) {
          const er = rng.fork('mac/end');
          const form = er.pick(['footer', 'footer', 'footer', 'link', 'icon']);
          if (er.bool(0.5) && ![...completion.children].some((b) => b.textContent === 'Continue')) label = 'Continue';
          submit.className = form === 'link' ? 'ref-endlink' : form === 'icon' ? 'ref-submit ref-icon' : 'ref-submit';
          submit.textContent = form === 'icon' ? '✓' : label;
          submit.title = label;
          submit.setAttribute('aria-label', label);
          completion.appendChild(submit);
        }
        document.body.classList.toggle('mac-has-footer-controls', completion.children.length > 0);
        document.body.style.setProperty(
          '--completion-width',
          completion.children.length ? completion.getBoundingClientRect().width + 48 + 'px' : '30px',
        );
        return { stage, submit };
      },
  };

  env.site({
    name: 'design-use-data-grid-resize-02',
    template: 'site/base',
    design: { parts },
  });
})();
