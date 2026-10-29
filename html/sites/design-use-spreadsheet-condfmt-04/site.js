// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const roomy = W >= 1260;
        const tall = H >= 700;
        let display = ctx.display || 'header';
        if (display === 'panel' && !roomy) display = 'header';
        if (display === 'toast' && !tall) display = 'header';
        document.body.classList.toggle('sheet-header-note', display === 'header');
        document.body.classList.toggle('sheet-panel-note', display === 'panel');
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');
        Object.assign(_c, { H, W, display, roomy, tall });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const tips = util.el('aside', 'sheet-help', body);
        util.el('h2', '', tips, 'Instrument Details');
        util.el('div', 'sheet-rule', tips);
        const detail = util.el('div', 'instrument-fields', tips);
        for (const [label, value] of [
          ['Asset ID:', 'PV-1042'],
          ['Name:', 'Pressure Transmitter'],
          ['Category:', 'Pressure'],
          ['Manufacturer:', 'Omega'],
          ['Model:', 'PX309'],
          ['Serial Number:', 'A77193'],
          ['Location:', 'Unit 3'],
          ['Last Calibration:', '2024-04-15'],
          ['Next Due:', '2025-04-15'],
          ['Status:', 'In Service'],
        ]) {
          const row = util.el('div', 'instrument-row', detail);
          util.el('span', '', row, label);
          const kind =
            label === 'Category:' || label === 'Status:'
              ? ' instrument-select'
              : label.includes('Calibration') || label.includes('Due')
                ? ' instrument-date'
                : '';
          util.el('span', `instrument-value${kind}`, row, value);
        }
        util.el('div', 'sheet-rule', tips);
        util.el('h2', '', tips, 'Specifications');
        const specs = util.el('div', 'instrument-fields', tips);
        for (const [label, value] of [
          ['Range:', '0 - 250 psi'],
          ['Accuracy:', '±0.25% FS'],
          ['Output:', '4 - 20 mA'],
          ['Supply:', '24 VDC'],
          ['Notes:', 'Mounted on east manifold. Verify zero at installation.'],
        ]) {
          const row = util.el('div', 'instrument-row', specs);
          util.el('span', '', row, label);
          util.el('span', `instrument-value${label === 'Notes:' ? ' instrument-notes' : ''}`, row, value);
        }
        const dock = util.el('nav', 'sheet-dock', document.body);
        for (const [icon, text] of [
          ['⌂', 'Home'],
          ['▦', 'Workbooks'],
          ['▤', 'Templates'],
        ]) {
          const a = util.el('a', text === 'Workbooks' ? 'active' : '', dock);
          util.el('span', 'dock-icon', a, icon);
          util.el('span', '', a, text);
        }
        const dockRight = util.el('div', 'dock-right', dock);
        for (const [icon, text] of [
          ['ⓘ', 'Help'],
          ['⚙', 'Settings'],
        ]) {
          const a = util.el('a', '', dockRight);
          util.el('span', 'dock-icon', a, icon);
          util.el('span', '', a, text);
        }
        Object.assign(_c, { detail, dock, dockRight, specs, stage, tips });
      },
  };

  env.site({
    name: 'design-use-spreadsheet-condfmt-04',
    template: 'site/base',
    design: { parts },
  });
})();
