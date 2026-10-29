/* Image Adjuster: KDE Breeze-style desktop window, left workbench with the live slider, right inspector. */
(function () {
  'use strict';
  const SCENE = '<svg viewBox="33 236 747 429" preserveAspectRatio="none" aria-hidden="true"><image href="sites/design-set-slider-log-06/assets/mountain-reference.webp" width="1672" height="941"/></svg>';
  const THUMB = '<svg viewBox="1247 153 185 124" preserveAspectRatio="none" aria-hidden="true"><image href="sites/design-set-slider-log-06/assets/mountain-reference.webp" width="1672" height="941"/></svg>';
  const ICONS = {
    sun: '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="5.5" fill="none" stroke="#3d566e" stroke-width="2"/><path d="M16 2v5M16 25v5M2 16h5M25 16h5M6 6l3.5 3.5M22.5 22.5L26 26M26 6l-3.5 3.5M9.5 22.5L6 26" stroke="#3d566e" stroke-width="2" stroke-linecap="round"/></svg>',
    contrast: '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="13" fill="none" stroke="#3d566e" stroke-width="2"/><path d="M16 3a13 13 0 0 0 0 26z" fill="#3d566e"/></svg>',
    drop: '<svg viewBox="0 0 32 32"><path d="M16 3C11 11 7 16 7 21a9 9 0 0 0 18 0c0-5-4-10-9-18z" fill="#3d566e"/><path d="M12 22a4 4 0 0 0 4 4" stroke="#8aa1b6" stroke-width="2" fill="none"/></svg>',
    half: '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="13" fill="#3d566e"/><path d="M16 3a13 13 0 0 1 0 26z" fill="#e6effa"/><circle cx="16" cy="16" r="13" fill="none" stroke="#3d566e" stroke-width="2"/></svg>',
  };
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'survey-drawer overlay-' + ctx.kind, document.body); el.setAttribute('role', 'dialog');
    const title = {chat:'Feedback', cookie:'Privacy', toast:'Image Adjuster', promo:'Tip of the day', banner:'Notice'}[ctx.kind];
    u.el('h2', '', el, title);
    const x = u.el('button', 'survey-x', el, '×'); x.setAttribute('aria-label', 'Close notice'); x.onclick = () => ctx.dismiss('close');
    u.el('p', 'survey-intro', el, {chat:'Help us improve Image Adjuster.', cookie:'This app can remember your display preferences.', toast:'The image is ready for editing.', promo:'Adjustments apply to the current image.', banner:'Image Adjuster is running offline.'}[ctx.kind]);
    const dismiss = u.el('button', 'primary survey-close', el, ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss');
    dismiss.type = 'button'; dismiss.onclick = () => ctx.dismiss('dismiss');
    return {el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0};
  }
  env.site({name:'design-set-slider-log-06', styles:['site.css'], scripts:[],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = `breeze instruction-${ctx.display}`;
      const win = u.el('div', 'win', document.body);
      const title = u.el('header', 'titlebar', win);
      const logo = u.el('span', 'app-logo', title);
      logo.innerHTML = '<svg viewBox="0 0 20 20"><rect width="20" height="20" rx="2" fill="#2f86e6"/><path d="M5 5l10 10M15 5L5 15" stroke="#fff" stroke-width="1.8"/></svg>';
      u.el('span', 'app-title', title, 'Image Adjuster');
      const wc = u.el('span', 'win-ctl', title);
      wc.innerHTML = '<svg viewBox="0 0 120 20"><path d="M10 10h12" stroke="#222" stroke-width="1.6"/><rect x="52" y="4" width="12" height="12" fill="none" stroke="#222" stroke-width="1.6"/><path d="M96 4l12 12M108 4L96 16" stroke="#222" stroke-width="1.6"/></svg>';
      const menu = u.el('nav', 'menubar', win);
      ['File', 'Edit', 'View', 'Help'].forEach((m, i) => u.el('span', i === 0 ? 'active' : '', menu, m));
      const frameRng = ctx.rng.fork('chrome/end');
      const commonEnd = !ctx.finish && frameRng.bool(0.5);
      const endPlacement = ctx.finish ? null : commonEnd ? 'inspector' : frameRng.pick(['inspector', 'toolbar', 'link']);
      const endLabels = ctx.content && Array.isArray(ctx.content.END_LABELS) ? ctx.content.END_LABELS : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelText = x => typeof x === 'string' ? x : x && (x.label || x.text || x.name) || String(x);
      const endLabel = commonEnd ? (endLabels.map(labelText).find(x => x === 'Submit') || 'Submit') : labelText(frameRng.pick(endLabels));
      const collideRng = ctx.rng.fork('chrome/collide');
      let collideLabel = null;
      if (collideRng.bool(0.3)) {
        const options = endLabels.map(labelText).filter(x => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) collideLabel = collideRng.pick(options);
      }
      const body = u.el('div', 'win-body', win);
      const work = u.el('main', 'workbench', body);
      const display = (ctx.display === 'panel' || ctx.display === 'toast') && document.documentElement.clientWidth < 1260 ? 'header' : ctx.display;
      if (display === 'header') u.el('div', 'instruction', work, ctx.instruction);
      if (ctx.display === 'toast') {
        if (display === 'toast') u.el('div', 'toast-note', win, ctx.instruction);
      }
      const pic = u.el('div', 'picture', work); pic.innerHTML = SCENE;
      const stage = u.el('div', 'stage', work); stage.dataset.role = 'stage';

      const insp = u.el('aside', 'inspector', body);
      u.el('h3', '', insp, 'Image Properties');
      if (display === 'panel') {
        const taskPanel = u.el('div', 'task-panel', insp);
        u.el('strong', '', taskPanel, 'Task');
        u.el('div', '', taskPanel, ctx.instruction);
      }
      const props = u.el('div', 'props', insp);
      const thumb = u.el('div', 'prop-thumb', props); thumb.innerHTML = THUMB;
      const meta = u.el('div', 'prop-meta', props);
      ['mountains.jpg', '1920 × 1080', '2.4 MB', 'JPEG'].forEach((t, i) => u.el('div', i === 0 ? 'fname' : '', meta, t));
      u.el('hr', '', insp);
      u.el('h3', 'adj', insp, 'Adjustments');
      const rows = [['Brightness', 'sun', 0.5], ['Contrast', 'contrast', 0.5], ['Saturation', 'drop', 0.5], ['Opacity', 'half', 0.5]];
      rows.forEach(([name, icon, f]) => {
        const row = u.el('div', 'adj-row' + (name === 'Opacity' ? ' sel' : ''), insp);
        const ic = u.el('span', 'adj-icon', row); ic.innerHTML = ICONS[icon];
        const mid = u.el('div', 'adj-mid', row);
        u.el('div', 'adj-name', mid, name);
        const tr = u.el('div', 'adj-track', mid);
        const fill = u.el('i', 'adj-fill', tr); const th = u.el('b', 'adj-thumb', tr);
        fill.style.width = th.style.left = (f * 100) + '%';
        u.el('span', 'adj-val', row, name === 'Opacity' ? '—' : '0');
      });
      u.el('hr', 'foot', insp);
      const actions = u.el('div', 'actions', insp);
      const reset = u.el('button', 'reset', actions, 'Reset'); reset.type = 'button'; reset.dataset.action = 'reset';
      let submit = null;
      const endButton = (parent, cls, label) => {
        const b = u.el('button', cls, parent, label);
        b.type = 'button'; b.dataset.role = 'submit'; b.setAttribute('aria-label', String(endLabel)); b.title = String(endLabel); b.onclick = () => ctx.submit();
        return b;
      };
      if (!ctx.finish && endPlacement === 'inspector') submit = endButton(actions, 'primary', endLabel);
      if (!ctx.finish && endPlacement === 'toolbar') {
        const b = endButton(menu, 'toolbar-submit', endLabel); submit = b;
      }
      if (!ctx.finish && endPlacement === 'link') {
        const b = u.el('button', 'end-link', actions, endLabel); b.type = 'button'; b.dataset.role = 'submit'; b.setAttribute('aria-label', String(endLabel)); b.title = String(endLabel); b.onclick = () => ctx.submit(); submit = b;
      }
      if (collideLabel) {
        const decoy = u.el('button', 'pq-xtra', menu, collideLabel); decoy.type = 'button'; decoy.dataset.role = 'xtra';
        decoy.onclick = () => env.log('decoy', {label: String(collideLabel), collide: true});
      }

      return {stage, submit};
    },
    overlay: drawOverlay,
  });
})();
