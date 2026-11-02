/* click-control/_controls-dialog: dialog parts of click-control/controls.
 * install(BASE, scopeRef) keeps each part replaceable through the parent's design.parts.
 */
(function () {
  'use strict';

  function dialogBefore(scopeRef) {}

  function dialogOpener(scopeRef, ctx, settings) {
    const { spec, util } = ctx;
    if (spec.opener) {
      const opener = util.el('button', 'uc-btn', settings, spec.opener);
      opener.type = 'button';
      return opener;
    }
    scopeRef.P.dialogStart(ctx, settings);
    return null;
  }

  function dialogStart(scopeRef, ctx, settings) {
    const start = ctx.util.el('button', 'uc-btn', settings, 'Start Calibration');
    start.type = 'button';
  }

  function dialogAfter(scopeRef) {}

  function dialogPage(scopeRef, ctx, content) {
    const { util } = ctx;
    scopeRef.P.dialogBefore(ctx, content);
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
      const r = util.el('div', '', info);
      util.el('span', 'k', r, t.slice(0, k + 1));
      util.el('span', 'v', r, t.slice(k + 1).trim());
    });
    const settings = util.el('section', 'calibration-settings', grid);
    util.el('h3', '', settings, 'Calibration Settings');
    ['Target White Point:|D65 (6504K)', 'Luminance:|120 cd/m²', 'Gamma:|2.2', 'Profile Name:|my_display'].forEach((t) => {
      const [l, v] = t.split('|');
      const row = util.el('div', 'setting-row', settings);
      util.el('label', '', row, l);
      const sv = util.el('span', 'setting-value', row, v);
      if (l !== 'Profile Name:') {
        util.el('i', l === 'Target White Point:' ? 'arr' : 'arr spinner', sv, l === 'Target White Point:' ? '▾' : '▴▾');
      }
    });
    const ambient = util.el('p', '', settings);
    util.el('span', 'draw-check', ambient);
    util.el('span', '', ambient, 'Enable ambient light compensation');
    const preview = util.el('p', '', settings);
    util.el('span', 'draw-check checked', preview);
    util.el('span', '', preview, 'Preview calibration results');
    const opener = scopeRef.P.dialogOpener(ctx, settings);
    const screen = util.el('div', 'calibration-screen', grid);
    util.el('div', 'color-bars', screen);
    util.el('div', 'greyscale', screen);
    const logp = util.el('section', 'logout', grid);
    util.el('h3', '', logp, 'Log Output');
    const logb = util.el('div', 'logbody', logp);
    scopeRef.CALIBRATION_LOG.forEach((t) => util.el('div', '', logb, t));
    const logbar = util.el('span', 'logbar', logp);
    util.el('i', 'log-up', logbar, '▴');
    util.el('i', 'log-thumb', logbar);
    util.el('i', 'log-down', logbar, '▾');
    scopeRef.P.dialogAfter(ctx, content, opener);
    return opener;
  }

  function dialogTitleText(scopeRef, ctx, title) { return ctx.util.el('span', '', title, ctx.spec.title); }

  function dialogClose(scopeRef) {}

  function dialogBody(scopeRef, ctx, dbox) {
    const { spec, util } = ctx;
    const dlgBody = util.el('div', 'uc-dlg-b', dbox);
    const archiveIcon = util.el('i', 'dlg-ico', dlgBody);
    archiveIcon.innerHTML = scopeRef.D.dlgIcon;
    util.el('div', 'dlg-q', dlgBody, spec.text);
    // Calibration context is decorative; the seeded message and result controls remain authoritative.
    const dlgRows = util.el('div', 'dlg-rows', dlgBody);
    util.el('span', 'dl', dlgRows, scopeRef.D.dlgName[0]);
    util.el('span', 'dv', dlgRows, scopeRef.D.dlgName[1]);
    util.el('span', 'dl', dlgRows, 'Location:');
    util.el('span', 'dv loc', dlgRows, scopeRef.D.dlgLocation);
    util.el('span', 'dbr', dlgRows, 'Browse...');
    const report = util.el('span', 'dchk', dlgRows);
    util.el('span', 'draw-check checked', report);
    util.el('span', '', report, scopeRef.D.dlgReport);
    const steps = document.querySelectorAll('.inspector > p');
    if (steps[1]) {
      steps[1].textContent = ctx.model.open
        ? '1.  The "' + spec.title + '" dialog is already open.'
        : '1.  Open the requested dialog.';
    }
  }

  function footButton(scopeRef, ctx, foot, l, i) {
    const b = ctx.util.el('button', 'uc-btn' + (i === ctx.spec.buttons.length - 1 ? ' primary' : ''), foot);
    ctx.util.el('u', '', b, l.slice(0, 1));
    ctx.util.el('span', '', b, l.slice(1));
    b.type = 'button';
    return b;
  }

  function dialogWidth(scopeRef, r) { return Math.min(340, r.width - 10); }

  function dialogPos(scopeRef, r, bw, bh, rng) { return [
    Math.round(rng.float(0.1, 0.9) * Math.max(0, Math.min(r.width, 760) - bw)),
    Math.round(rng.float(0.05, 0.8) * Math.max(0, r.height - bh - 10)),
  ]; }

  function dialogPlaced(scopeRef, ctx, content, dbox, r, opener) { return opener; }

  function dialogDone(scopeRef) {}

  function dialogSynced(scopeRef) {}

  function buildDialog(scopeRef, ctx, content, up) {
    const { spec, util, rng } = ctx;
    let opener = scopeRef.P.dialogPage(ctx, content);
    const backdrop = util.el('div', 'uc-backdrop', content);
    const dbox = util.el('div', 'uc-dialog', content);
    dbox.dataset.role = 'dialog';
    const title = util.el('div', 'uc-dlg-t', dbox);
    scopeRef.P.dialogTitleText(ctx, title);
    const x = util.el('button', 'uc-dlg-x', title, '×');
    x.type = 'button';
    x.title = 'close';
    scopeRef.P.dialogClose(ctx, x);
    scopeRef.P.dialogBody(ctx, dbox);
    const btns = [];
    if (spec.buttons.length) {
      const foot = util.el('div', 'uc-dlg-f', dbox);
      spec.buttons.forEach((l, i) => {
        const b = scopeRef.P.footButton(ctx, foot, l, i);
        btns.push([l, b]);
      });
    }
    // Place the box somewhere inside the content area.
    const r = content.getBoundingClientRect();
    const bw = scopeRef.P.dialogWidth(r);
    dbox.style.width = bw + 'px';
    const wasHidden = dbox.hidden;
    dbox.hidden = false;
    const bh = dbox.getBoundingClientRect().height || 170;
    dbox.hidden = wasHidden;
    const [left, top] = scopeRef.P.dialogPos(r, bw, bh, rng);
    dbox.style.left = left + 'px';
    dbox.style.top = top + 'px';
    opener = scopeRef.P.dialogPlaced(ctx, content, dbox, r, opener, bh);
    const dlg = env.ui.dialog(dbox, {
      open: ctx.model.open,
      opener: opener || [],
      close: x,
      closeResult: 'x',
      buttons: btns,
      backdrop,
      onChange: (open, result) => up(result ? { open, clicks: ctx.model.clicks.concat([result]) } : { open }),
    });
    scopeRef.P.dialogDone(ctx, dlg, opener);
    return {
      sync(m) { dlg.set(m.open); scopeRef.P.dialogSynced(ctx, m); },
      locate(t) {
        if (t.opener) return dlg.locateOpener();
        if (t.dialog !== undefined) return dlg.locate(t.dialog);
        return null;
      },
      recover: 'toast',
    };
  }

  function install(BASE, scopeRef) {
    BASE.dialogBefore = (...args) => dialogBefore(scopeRef, ...args);
    BASE.dialogOpener = (...args) => dialogOpener(scopeRef, ...args);
    BASE.dialogStart = (...args) => dialogStart(scopeRef, ...args);
    BASE.dialogAfter = (...args) => dialogAfter(scopeRef, ...args);
    BASE.dialogPage = (...args) => dialogPage(scopeRef, ...args);
    BASE.dialogTitleText = (...args) => dialogTitleText(scopeRef, ...args);
    BASE.dialogClose = (...args) => dialogClose(scopeRef, ...args);
    BASE.dialogBody = (...args) => dialogBody(scopeRef, ...args);
    BASE.footButton = (...args) => footButton(scopeRef, ...args);
    BASE.dialogWidth = (...args) => dialogWidth(scopeRef, ...args);
    BASE.dialogPos = (...args) => dialogPos(scopeRef, ...args);
    BASE.dialogPlaced = (...args) => dialogPlaced(scopeRef, ...args);
    BASE.dialogDone = (...args) => dialogDone(scopeRef, ...args);
    BASE.dialogSynced = (...args) => dialogSynced(scopeRef, ...args);
    BASE.buildDialog = (...args) => buildDialog(scopeRef, ...args);
  }

  env.template('click-control/_controls-dialog', () => ({ install }));
})();
