/* GNOME libadwaita "Video Settings" window: preview card above, task panel with slider below. */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  function svgEl(tag, attrs, parent) {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function landscape(parent) {
    const s = svgEl('svg', {viewBox: '0 0 770 278', preserveAspectRatio: 'none', class: 'scene', 'aria-hidden': 'true'}, parent);
    const defs = svgEl('defs', {}, s);
    const sky = svgEl('linearGradient', {id: 'sky', x1: 0, y1: 0, x2: 0, y2: 1}, defs);
    [['0', '#8fa6c7'], ['.55', '#e7b9a3'], ['1', '#f1d3b8']].forEach(([o, c]) => svgEl('stop', {offset: o, 'stop-color': c}, sky));
    const lake = svgEl('linearGradient', {id: 'lake', x1: 0, y1: 0, x2: 0, y2: 1}, defs);
    [['0', '#7d93ac'], ['1', '#243a52']].forEach(([o, c]) => svgEl('stop', {offset: o, 'stop-color': c}, lake));
    svgEl('rect', {width: 770, height: 170, fill: 'url(#sky)'}, s);
    svgEl('polygon', {points: '0,110 40,80 100,60 130,45 170,40 215,70 260,95 330,110 420,100 520,85 600,90 700,70 770,60 770,170 0,170', fill: '#5d7396'}, s);
    svgEl('polygon', {points: '260,140 380,112 470,108 560,120 650,100 770,92 770,170 260,170', fill: '#7f8fa6', opacity: '.75'}, s);
    svgEl('polygon', {points: '0,100 60,118 150,140 250,160 350,170 0,170', fill: '#27402f'}, s);
    svgEl('rect', {y: 168, width: 770, height: 110, fill: 'url(#lake)'}, s);
    svgEl('polygon', {points: '0,60 40,50 90,30 120,20 170,40 230,60 300,85 380,100 380,170 0,170', fill: '#5a7096', opacity: '.55'}, s);
    for (let i = 0; i < 26; i++) {
      const x = 6 + i * 11, h = 28 + (i * 37) % 22;
      svgEl('polygon', {points: `${x},${158 - h} ${x - 7},158 ${x + 7},158`, fill: '#1f3b24'}, s);
      svgEl('polygon', {points: `${x},${178 + h * .6} ${x - 7},178 ${x + 7},178`, fill: '#16271b', opacity: '.8'}, s);
    }
    svgEl('rect', {y: 175, width: 770, height: 20, fill: '#6e7f99', opacity: '.35'}, s);
    svgEl('polygon', {points: '0,178 150,178 150,278 0,278', fill: '#15251c', opacity: '.55'}, s);
    svgEl('rect', {y: 150, width: 770, height: 22, fill: '#e0b9a0', opacity: '.25'}, s);
  }
  function tuneIcon(parent) {
    const s = svgEl('svg', {viewBox: '0 0 48 48', class: 'tune', 'aria-hidden': 'true'}, parent);
    [[14, 30], [24, 14], [34, 28]].forEach(([y, x]) => {
      svgEl('line', {x1: 6, y1: y, x2: 42, y2: y, stroke: '#205db0', 'stroke-width': 3.5, 'stroke-linecap': 'round'}, s);
      svgEl('circle', {cx: x, cy: y, r: 4.2, fill: '#dbe9fb', stroke: '#205db0', 'stroke-width': 3}, s);
    });
  }
  function winBtn(parent, kind) {
    const b = env.util.el('span', 'wb', parent);
    const s = svgEl('svg', {viewBox: '0 0 16 16'}, b);
    if (kind === 'min') svgEl('path', {d: 'M3 8h10', stroke: '#222', 'stroke-width': 1.5}, s);
    if (kind === 'max') svgEl('rect', {x: 3.5, y: 3.5, width: 9, height: 9, fill: 'none', stroke: '#222', 'stroke-width': 1.5}, s);
    if (kind === 'close') svgEl('path', {d: 'M3.5 3.5l9 9M12.5 3.5l-9 9', stroke: '#222', 'stroke-width': 1.5}, s);
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'adw-dialog overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const title = {chat: 'We value your feedback', cookie: 'Your privacy matters', toast: 'Settings notice', promo: 'Try the new player', banner: 'Service notice'}[ctx.kind];
    u.el('h2', '', el, title);
    const body = {chat: 'Tell us how the video settings feel.', cookie: 'This app can remember your display preferences.', toast: 'Your changes are applied to this preview only.', promo: 'Discover more playback options.', banner: 'Video settings are available offline.'}[ctx.kind];
    u.el('p', '', el, body);
    const dismiss = u.el('button', 'suggested', el, ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss');
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('dismiss');
    return {el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0};
  }
  env.site({name: 'design-set-slider-horizontal-04', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const labelOf = x => typeof x === 'string' ? x : (x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = endRng.bool(0.5);
      const placement = referenceEnd ? 'footer' : endRng.pick(['header', 'link']);
      const endLabel = referenceEnd ? 'Submit' : endRng.pick(endLabels.filter(x => x !== 'Submit'));
      const collideRng = ctx.rng.fork('chrome/collide');
      const collideLabels = endLabels.filter(x => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collide = collideRng.bool(0.3) && collideLabels.length ? collideRng.pick(collideLabels) : null;
      document.body.className = `adw instruction-${ctx.display}`;
      const head = u.el('header', 'headerbar', document.body);
      const ico = u.el('span', 'app-icon', head);
      u.el('span', 'app-icon-screen', ico);
      u.el('h1', '', head, 'Video Settings');
      const headerTools = u.el('div', 'header-tools', head);
      const wc = u.el('div', 'wincontrols', head);
      winBtn(wc, 'min'); winBtn(wc, 'max'); winBtn(wc, 'close');

      const preview = u.el('section', 'preview-card', document.body);
      u.el('h2', '', preview, 'Preview');
      u.el('p', 'sub', preview, 'This is a preview of how your current settings affect the video.');
      const row = u.el('div', 'preview-row', preview);
      const pic = u.el('div', 'pic', row);
      const photo = u.el('img', 'scene', pic);
      photo.src = 'sites/design-set-slider-horizontal-04/assets/alpine-preview-v2.webp';
      photo.alt = 'Alpine mountains and forest reflected in a still lake at dusk';
      const cs = u.el('div', 'current', row);
      u.el('h3', '', cs, 'Current Settings');
      const dl = u.el('dl', '', cs);
      for (const [k, v, cls] of [['Resolution', '1920 × 1080'], ['Frame Rate', '60 fps'], ['Speed', '—', 'cs-speed'], ['Color Profile', 'Standard'], ['Audio', 'On']]) {
        u.el('dt', '', dl, k);
        u.el('dd', cls || '', dl, v);
      }

      const panel = u.el('section', 'task-panel', document.body);
      const top = u.el('div', 'task-top', panel);
      const circle = u.el('span', 'task-icon', top);
      tuneIcon(circle);
      const instruction = u.el('div', 'instruction', top, ctx.instruction);
      if (ctx.display === 'hidden') instruction.hidden = true;
      if (ctx.display === 'toast') {
        const close = u.el('button', 'instruction-close', instruction, 'Close');
        close.onclick = () => { instruction.hidden = true; };
      }
      const stage = u.el('main', 'speed-card', panel);
      stage.dataset.role = 'stage';
      const actions = u.el('div', 'actions', panel);
      const reset = u.el('button', 'reset', actions, 'Reset');
      reset.type = 'button';
      reset.dataset.action = 'reset';
      if (collide) {
        const decoy = u.el('button', 'end-xtra', headerTools, collide);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.onclick = () => env.log('decoy', {label: collide, collide: true});
      }
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'header' ? headerTools : actions;
        submit = u.el(placement === 'link' ? 'a' : 'button', placement === 'link' ? 'end-link' : 'suggested', parent, endLabel);
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.onclick = e => { e.preventDefault(); ctx.submit(); };
      }
      return {stage, submit};
    },
    overlay: drawOverlay,
  });
})();
