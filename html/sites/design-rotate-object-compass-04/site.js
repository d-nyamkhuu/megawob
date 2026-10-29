/* Riverton Maps reference frame. */
(function () {
  'use strict';
  function icon(parent, name, size = 24) {
    const paths = {
      windows: 'M2 4L11 3V12H2ZM13 3L23 1V12H13ZM2 14H11V23L2 22ZM13 14H23V25L13 23Z',
      close: 'M5 5L21 21M21 5L5 21', minimize: 'M5 20H21', maximize: 'M6 6H21V21H6Z',
      search: 'M17 17L24 24M20 11A9 9 0 1 1 2 11A9 9 0 1 1 20 11',
      wifi: 'M2 9Q13 -1 24 9M6 14Q13 7 20 14M10 19Q13 16 16 19M13 23H13.1',
      sound: 'M3 10H8L14 5V23L8 18H3ZM18 9Q25 14 18 19M21 5Q33 14 21 23',
      up: 'M5 17L13 9L21 17',
    };
    const svg = env.util.svg('svg', { width: size, height: size, viewBox: '0 0 28 28', 'aria-hidden': 'true' }, parent);
    env.util.svg('path', { d: paths[name], fill: name === 'windows' ? 'currentColor' : 'none',
      stroke: name === 'windows' ? 'none' : 'currentColor', 'stroke-width': 1.7 }, svg);
    return svg;
  }
  function drawOverlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
      if (ctx.initial) el.classList.add('reference-initial');
      el.setAttribute('role', 'dialog');
      const content = {
      chat: ['Riverton Maps', 'Welcome to the map workspace. Use the tools to explore this area.', 'Open help', 'Close'],
        cookie: ['Your privacy', 'Allow optional cookies for this practice workspace?', 'Accept optional', 'Reject optional'],
        toast: ['Practice saved', 'Your current workspace is ready to continue.', null, 'Dismiss'],
        promo: ['Discover more practice', 'Explore more exercises after completing this task.', 'Show details', 'Not now'],
        banner: ['Workspace notice', 'This practice session works offline.', null, 'Dismiss'],
      }[ctx.kind];
      u.el('h2', '', el, content[0]);
      const close = u.el('button', 'bubble-close', el);
      close.type = 'button'; close.setAttribute('aria-label', 'Close notice'); icon(close, 'close', 25);
      close.onclick = () => ctx.dismiss('close');
      const message = u.el('p', '', el, content[1]);
      const actions = u.el('div', 'tour-actions', el);
      if (content[2]) {
        const primary = u.el('button', 'tour-primary', actions, content[2]); primary.type = 'button';
        primary.onclick = () => {
          if (ctx.kind === 'cookie') ctx.dismiss('accept');
          else { message.textContent = 'Click and drag the cube. Use the task instruction to choose which face should point toward you.'; primary.hidden = true; }
        };
      }
      const dismiss = u.el('button', 'tour-dismiss', actions, content[3]); dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('skip');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  env.site({
    name: 'design-rotate-object-compass-04', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = `riverton instruction-${ctx.display}`;
      const top = u.el('header', 'map-topbar', document.body);
      u.el('span', 'globe-mark', top, '🌎'); u.el('strong', 'brand', top, 'Riverton Maps');
      const nav = u.el('nav', 'main-nav', top);
      ['Home', 'Maps', 'Places', 'Routes', 'Photos', 'Community'].forEach((label) => {
        const b = u.el('button', label === 'Maps' ? 'nav-item active' : 'nav-item', nav, label); b.type = 'button';
      });
      const search = u.el('div', 'search-area', top);
      const input = u.el('input', '', search); input.placeholder = 'Search places…'; input.setAttribute('aria-label', 'Search places');
      const go = u.el('button', 'go-button', search, 'Go'); go.type = 'button';
      const page = u.el('main', 'maps-layout', document.body);
      const left = u.el('aside', 'left-column', page);
      const tools = u.el('section', 'side-box tools-box', left); u.el('h2', '', tools, 'Map Tools');
      [['✥','Pan'],['⊕','Zoom In'],['⊖','Zoom Out'],['⟲','Rotate Map'],['▣','Print Map'],['◫','Map Details']].forEach(([sym, label], i) => {
        const row = u.el('div', i === 3 ? 'tool-row selected' : 'tool-row', tools);
        u.el('span', 'tool-icon', row, sym); u.el('span', '', row, label);
        if (i === 3) row.classList.add('current-tool');
      });
      const help = u.el('section', 'side-box help-box', left); u.el('h2', '', help, '❔ Help & Tips');
      u.el('p', '', help, 'Drag the handle on the rotation ring to turn the map. You can also click the ring to rotate in smaller steps.');
      u.el('p', '', help, 'Use the compass rose and bearing readout to see the current orientation.');
      u.el('p', '', help, 'The place pins show named locations on the map.');
      const center = u.el('section', 'center-column', page);
      const under = u.el('div', 'underlay-map', center);
      u.el('div', 'underlay-road road-one', under); u.el('div', 'underlay-road road-two', under);
      u.el('span', 'underlay-label', under, 'Riverton City Map');
      const panel = u.el('section', 'floating-window', center);
      const title = u.el('header', 'window-heading', panel); u.el('strong', '', title, 'Rotate Map');
      const close = u.el('button', 'window-close', title, '×'); close.type = 'button'; close.setAttribute('aria-label', 'Close map window');
      const heading = u.el('div', 'instruction', title, ctx.instruction);
      if (ctx.display === 'hidden') heading.hidden = true;
      if (ctx.display === 'panel') { heading.classList.add('side-instruction'); left.insertBefore(heading, help); }
      if (ctx.display === 'toast') { heading.classList.add('instruction-toast-card'); document.body.appendChild(heading); }
      const stage = u.el('main', 'map-stage', panel); stage.dataset.role = 'stage';
      const footer = u.el('footer', 'window-footer', panel);
      u.el('span', 'footer-hint', footer, 'Riverton Maps · Map orientation');
      let submit = null;
      if (!ctx.finish) {
        const endRng = ctx.rng.fork('chrome/end');
        const placements = ['page-footer', 'page-footer', 'page-toolbar', 'page-link'];
        const placement = endRng.pick(placements);
        const fallbackLabels = ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const labels = ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS : fallbackLabels;
        const labelValue = endRng.pick(labels);
        const endLabel = typeof labelValue === 'string' ? labelValue : (labelValue.label || labelValue.text || labelValue.name || String(labelValue));
            submit = u.el(placement === 'page-link' ? 'a' : 'button', 'submit-button ' + placement, footer, placement === 'page-link' ? endLabel + ' ›' : endLabel);
        if (placement === 'page-link') submit.href = '#'; else submit.type = 'button';
        submit.dataset.role = 'submit'; submit.setAttribute('aria-label', endLabel); submit.title = endLabel;
        submit.onclick = (event) => { event.preventDefault(); ctx.submit(); };

        const collideRng = ctx.rng.fork('chrome/collide');
        if (collideRng.bool(0.3)) {
          const candidates = labels.map((x) => typeof x === 'string' ? x : (x.label || x.text || x.name || String(x)))
            .filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
          if (candidates.length) {
            const decoyLabel = collideRng.pick(candidates);
            const decoy = u.el('button', 'end-xtra', footer, decoyLabel);
            decoy.type = 'button'; decoy.dataset.role = 'xtra';
            decoy.addEventListener('click', () => env.log('decoy', { label: decoyLabel, collide: true }));
          }
        }
      }
      const right = u.el('aside', 'right-column', page);
      const list = u.el('section', 'side-box places-box', right); u.el('h2', '', list, 'Places on This Map');
      const table = u.el('div', 'place-table', list); u.el('div', 'table-head', table, 'Name　　　　　　　　　 Type');
      [['●','Foundry Lane','Street'],['●','Riverside Park','Park'],['●','Maple Square','Square'],['●','Cedar Bridge','Bridge'],['●','Oak Station','Station']].forEach((p,i)=>{
        const row=u.el('div','place-row',table);u.el('span','pin-dot dot-'+i,row,p[0]);u.el('span','',row,p[1]);u.el('span','place-type',row,p[2]);
      });
      const details=u.el('section','side-box details-box',right);u.el('h2','',details,'Place Details');
      const photo=u.el('div','street-photo',details);photo.setAttribute('aria-hidden','true');
      const info=u.el('div','place-description',details);u.el('strong','',info,'Name:');u.el('span','',info,' Foundry Lane');
      u.el('strong','',info,'Type:');u.el('span','',info,' Street');u.el('strong','',info,'Description:');
      u.el('span','description-text',info,'A historic lane with converted factory buildings, shops and cafés.');
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
