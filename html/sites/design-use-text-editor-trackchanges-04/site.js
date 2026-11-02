// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) =>
      function (_c) {
        base(_c);
        const r = _c.ctx.rng.fork('site/carbon-end');
        if (!_c.ctx.finish && r.bool(0.5)) {
          _c.placement = 'header';
          _c.label = 'Submit';
          _c.wantFooter = false;
        }
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const mast = util.el('div', 'doc-mast', header);
        util.el('div', 'doc-mark', mast, '▤');
        const mastCopy = util.el('div', 'doc-mast-copy', mast);
        util.el('div', 'doc-title', mastCopy, 'Project Plan.docx');
        const frameButtons = util.el('div', 'window-buttons', header);
        for (const symbol of ['─', '□', '×']) util.el('span', '', frameButtons, symbol);
        S.frameBrand(_c, header);
        Object.assign(_c, { header, mast, mastCopy });
      },
    'frame.nav': (base, S) =>
      function (_c) {
        base(_c);
        const { util } = _c;
        const menu = util.el('nav', 'carbon-menu', document.body);
        for (const tab of ['Home', 'Documents', 'Review', 'View']) {
          const a = util.el('a', tab === 'Home' ? 'active' : '', menu, tab);
          a.href = '#';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: tab }); });
        }
        util.el('div', 'carbon-search', menu, '⚲  Search document');
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        S.frameSidebar(_c, body);
        Object.assign(_c, { body });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        base(_c);
        const { body, util } = _c;
        const panel = util.el('aside', 'document-info', body);
        util.el('h2', '', panel, 'Document');
        const counts = util.el('section', '', panel);
        util.el('h3', '', counts, 'Counts');
        for (const [key, val] of [['Words', '142'], ['Characters', '857'], ['Paragraphs', '3'], ['Sentences', '14'], ['Open suggestions', '2']]) {
          const row = util.el('div', 'info-row', counts);
          util.el('span', '', row, key);
          util.el('span', '', row, val);
        }
        const authors = util.el('section', '', panel);
        util.el('h3', '', authors, 'Authors');
        for (const [name, color] of [['Jordan Smith', 'blue'], ['Priya Raman', 'green']]) {
          const row = util.el('div', 'info-row author-row', authors);
          util.el('i', color, row);
          util.el('span', '', row, name);
          util.el('span', '', row, '1');
        }
        const changes = util.el('section', '', panel);
        util.el('h3', '', changes, 'Tracked changes');
        for (const key of ['Insertions', 'Deletions']) {
          const row = util.el('div', 'info-row', changes);
          util.el('span', '', row, key);
          util.el('span', '', row, '1');
        }
      },
    'frame.footer': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
        let { submit } = _c;
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
        const status = util.el('div', 'carbon-status', document.body);
        util.el('span', '', status, 'Page 1 of 1');
        util.el('span', 'status-words', status, '142 words');
        util.el('span', '', status, 'English (U.K.)');
        const view = util.el('div', 'status-view', status);
        for (const [icon, label] of [['▤', 'Print layout'], ['▣', 'Web layout'], ['⊞', 'Outline layout']]) {
          const button = util.el('button', label === 'Print layout' ? 'status-layout active' : 'status-layout', view, icon);
          button.type = 'button';
          button.title = label;
          button.setAttribute('aria-label', label);
          button.addEventListener('click', () => {
            view.querySelectorAll('.status-layout').forEach((item) => item.classList.toggle('active', item === button));
          });
        }
        const zoom = util.el('div', 'status-zoom', view);
        const minus = util.el('button', 'status-zoom-step', zoom, '−');
        minus.type = 'button';
        minus.setAttribute('aria-label', 'Zoom out');
        const range = util.el('input', 'status-zoom-range', zoom);
        range.type = 'range';
        range.min = '50';
        range.max = '150';
        range.step = '10';
        range.value = '100';
        range.setAttribute('aria-label', 'Zoom');
        const plus = util.el('button', 'status-zoom-step', zoom, '+');
        plus.type = 'button';
        plus.setAttribute('aria-label', 'Zoom in');
        const zoomText = util.el('span', 'status-zoom-value', zoom, '100%');
        const applyZoom = () => {
          zoomText.textContent = `${range.value}%`;
        };
        range.addEventListener('input', applyZoom);
        minus.addEventListener('click', () => { range.value = String(Math.max(50, Number(range.value) - 10)); applyZoom(); });
        plus.addEventListener('click', () => { range.value = String(Math.min(150, Number(range.value) + 10)); applyZoom(); });
        Object.assign(_c, { status, submit });
      },
  };

  env.site({
    name: 'design-use-text-editor-trackchanges-04',
    template: 'site/base',
    design: { parts },
  });
})();
