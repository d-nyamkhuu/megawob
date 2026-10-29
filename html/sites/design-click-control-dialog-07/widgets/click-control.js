// Design of this site on click-control/controls: a display calibration page with an expanded archive dialog.
env.widget({
  task: 'click-control',
  site: 'design-click-control-dialog-07',
  name: 'design',
  split: 'train',
  scenarios: ['dialog'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      dialogPage: () => (ctx, content) => {
        const { spec, util } = ctx;
        const grid = util.el('div', 'calibration-grid', content);
        const info = util.el('section', 'display-info', grid);
        util.el('h3', '', info, 'Display Information');
        [
          'Display:       DELL 2001FP',
          'Resolution:    1600 × 900',
          'Refresh Rate:  60 Hz',
          'Current Profile: Generic RGB',
          'Status:        Ready',
        ].forEach((t) => {
          const k = t.indexOf(':');
          const row = util.el('div', '', info);
          util.el('span', 'k', row, t.slice(0, k + 1));
          util.el('span', 'v', row, t.slice(k + 1).trim());
        });

        const settings = util.el('section', 'calibration-settings', grid);
        util.el('h3', '', settings, 'Calibration Settings');
        ['Target White Point:|D65 (6504K)', 'Luminance:|120 cd/m²', 'Gamma:|2.2', 'Profile Name:|my_display'].forEach(
          (t) => {
            const [label, value] = t.split('|');
            const row = util.el('div', 'setting-row', settings);
            util.el('label', '', row, label);
            const setting = util.el('span', 'setting-value', row, value);
            if (label !== 'Profile Name:') {
              util.el(
                'i',
                label === 'Target White Point:' ? 'arr' : 'arr spinner',
                setting,
                label === 'Target White Point:' ? '▾' : '▴▾',
              );
            }
          },
        );
        const ambient = util.el('p', '', settings);
        util.el('span', 'draw-check', ambient);
        util.el('span', '', ambient, 'Enable ambient light compensation');
        const preview = util.el('p', '', settings);
        util.el('span', 'draw-check checked', preview);
        util.el('span', '', preview, 'Preview calibration results');

        let opener = null;
        if (spec.opener) {
          opener = util.el('button', 'uc-btn', settings, spec.opener);
          opener.type = 'button';
        } else {
          const start = util.el('button', 'uc-btn', settings, 'Start Calibration');
          start.type = 'button';
        }

        const screen = util.el('div', 'calibration-screen', grid);
        util.el('div', 'color-bars', screen);
        util.el('div', 'greyscale', screen);
        const log = util.el('section', 'logout', grid);
        util.el('h3', '', log, 'Log Output');
        const logBody = util.el('div', 'logbody', log);
        [
          '[10:14:03] Detecting display...',
          '[10:14:03] DELL 2001FP at 1600x900, 60 Hz',
          '[10:14:04] Loading measurement data...',
          '[10:14:05] Ready.',
        ].forEach((t) => util.el('div', '', logBody, t));
        const logbar = util.el('span', 'logbar', log);
        util.el('i', 'log-up', logbar, '▴');
        util.el('i', 'log-thumb', logbar);
        util.el('i', 'log-down', logbar, '▾');

        const doc = util.el('div', 'kdoc', content);
        util.el('h1', '', doc, '#  Project Plan');
        util.el('h2', '', doc, '##  Goals');
        const goals = util.el('ul', 'dash', doc);
        ['Improve reliability', 'Simplify user experience', 'Launch in Q3'].forEach((t) => util.el('li', '', goals, t));
        util.el('h2', '', doc, '##  Milestones');
        const milestones = util.el('ol', '', doc);
        ['Research', 'Design', 'Implementation', 'Testing', 'Release'].forEach((t) => util.el('li', '', milestones, t));
        util.el('h2', '', doc, '##  Notes');
        util.el('p', '', doc, 'This plan outlines the key steps and owners for the next phase of the project.');
        const slot = document.querySelector('.toolbar .slot');
        if (opener) (slot || doc).appendChild(opener);
        else if (slot) util.el('span', '', slot, 'Archive…');
        return opener;
      },
      dialogClose: () => (ctx, x) => {
        x.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3 3 10 10M13 3 3 13"/></svg>';
        x.setAttribute('aria-label', 'close');
      },
      dialogBody: (base) => (ctx, dbox) => {
        base(ctx, dbox);
        const { util } = ctx;
        const body = dbox.querySelector('.uc-dlg-b');
        const form = util.el('div', 'kform');
        util.el('label', '', form, 'Create an archive of:');
        util.el('div', 'kfield', form, 'Project Plan.md');
        util.el('label', '', form, 'Archive format:');
        util.el('div', 'kfield kcombo', form, 'ZIP (.zip)');
        const parent = util.el('div', 'kchk', form);
        util.el('i', 'box on', parent, '✓');
        util.el('span', '', parent, 'Include parent folder');
        const remove = util.el('div', 'kchk', form);
        util.el('i', 'box', remove);
        util.el('span', '', remove, 'Delete files after archiving');
        body.querySelector('.dlg-rows').before(form);
      },
      dialogWidth: () => (r) => Math.min(470, Math.max(290, r.width * 0.452), r.width - 10),
      dialogPos: () => (r, bw, bh, rng) => [
        Math.round((0.66 + 0.04 * rng.float(0.1, 0.9)) * Math.max(0, r.width - bw)),
        Math.round((0.3 + 0.08 * rng.float(0.05, 0.8)) * Math.max(0, r.height - bh - 10)),
      ],
    },
  },
});
