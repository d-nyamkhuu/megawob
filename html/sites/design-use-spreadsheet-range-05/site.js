// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);

      // iPadOS split view: a slim title bar over the workbook; a header note shares that bar.
      header.classList.add('motif-titlebar');
      const title = util.el('span', 'motif-window-title', header, 'Quarterly Sales');
      Object.assign(_c, { title });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      S.frameSidebar(_c, body);
      // Read-only cell inspector on the right (Cell, Fill, Border, Alignment, Format), drawn from DOM only.
      const inspector = util.el('aside', 'ref-inspector', body);
      util.el('div', 'ref-insp-head', inspector, 'Cell');
      // Line icons as inline SVG (static markup, no user content).
      const svg = (d) => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${d.map((p) => `<path d="${p}"/>`).join('')}</svg>`;
      const tabs = util.el('div', 'ref-insp-tabs', inspector);
      const tabIcons = [svg(['M3 3h18v18H3z', 'M3 9h18', 'M3 15h18', 'M9 3v18', 'M15 3v18']), 'A', '123', svg(['M4 4h10v10H4z', 'M10 10h10v10H10z'])];
      ['Cell', 'Text', 'Number', 'Arrange'].forEach((label, i) => {
        const tab = util.el('div', `ref-insp-tab${i === 0 ? ' on' : ''}`, tabs);
        util.el('span', 'ref-insp-glyph', tab).innerHTML = tabIcons[i];
        util.el('span', '', tab, label);
      });
      const card = (heading) => {
        const c = util.el('section', 'ref-insp-card', inspector);
        util.el('h3', 'ref-insp-title', c, heading);
        return c;
      };
      const fill = card('Fill');
      const fillRow = util.el('div', 'ref-insp-row', fill);
      util.el('span', 'ref-insp-swatch', fillRow);
      util.el('span', 'ref-insp-select', fillRow, 'Solid Fill');

      const border = card('Border');
      const borderRow = util.el('div', 'ref-insp-row', border);
      const presets = util.el('div', 'ref-insp-presets', borderRow);
      for (let i = 0; i < 6; i++) util.el('span', `ref-insp-preset${i === 3 ? ' on' : ''}`, presets);
      const borderCol = util.el('div', 'ref-insp-col', borderRow);
      util.el('span', 'ref-insp-select', borderCol, 'All Borders');
      const lineRow = util.el('div', 'ref-insp-row', borderCol);
      util.el('span', 'ref-insp-select', lineRow, '———');
      util.el('span', 'ref-insp-swatch dark', lineRow);
      util.el('span', 'ref-insp-select', borderCol, '1 pt');

      const align = card('Alignment');
      const seg = util.el('div', 'ref-insp-seg', align);
      const hAlign = [['M4 6h16', 'M4 10h10', 'M4 14h16', 'M4 18h10'], ['M4 6h16', 'M7 10h10', 'M4 14h16', 'M7 18h10'],
        ['M4 6h16', 'M10 10h10', 'M4 14h16', 'M10 18h10'], ['M4 6h16', 'M4 10h16', 'M4 14h16', 'M4 18h16']];
      hAlign.forEach((d, i) => { util.el('span', i === 0 ? 'on' : '', seg).innerHTML = svg(d); });
      const vrow = util.el('div', 'ref-insp-row', align);
      const vseg = util.el('div', 'ref-insp-seg', vrow);
      [['M12 20V5', 'M7 10l5-5 5 5'], ['M4 12h16', 'M8 7h8', 'M8 17h8'], ['M12 4v15', 'M7 14l5 5 5-5']].forEach((d, i) => {
        util.el('span', i === 1 ? 'on' : '', vseg).innerHTML = svg(d);
      });
      util.el('span', 'ref-insp-label', vrow, 'Wrap text');
      util.el('span', 'ref-insp-toggle', vrow);

      const format = card('Format');
      util.el('span', 'ref-insp-select', format, 'General');
      const chips = util.el('div', 'ref-insp-row', format);
      for (const text of ['$', '%', '.0 → .00']) util.el('span', 'ref-insp-chip', chips, text);
      Object.assign(_c, { body, inspector });
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-use-spreadsheet-range-05',
    template: 'site/base',
    design: { parts },
  });
})();
