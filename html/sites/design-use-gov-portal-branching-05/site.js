// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const paths = {
    file: 'M8 3H27L35 11V43H8Z M27 3V12H35 M14 18H19 M24 18H29 M14 25H19 M24 25H29 M14 32H19 M24 32H29',
    folder: 'M3 14H19L23 19H43L40 40H3Z M3 14V8H17L22 13H39V19',
    print: 'M12 16V3H33V16 M11 35H5V16H41V35H34 M12 27H34V44H12Z M13 34H30 M13 39H30 M32 21H36',
    evidence: 'M13 3H37V35H13Z M8 8H32 M8 8V40H32 M3 13V45H27 M18 10H31 M18 16H31 M18 22H31 M18 28H27',
    review: 'M8 3H37V44H8Z M13 12L16 15L20 10 M25 12H32 M13 23L16 26L20 21 M25 23H32 M13 34L16 37L20 32 M25 34H32',
    disk: 'M3 3H40L45 8V44H3Z M11 3V21H35V3 M9 28H37V44H9 M28 6V17H33V6',
    trash: 'M7 12H40L36 44H11Z M3 8H44V13H3Z M17 8V3H30V8 M17 18V37 M24 18V37 M31 18V37',
  };
  function drawIcon(parent, name) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 48 48'); svg.setAttribute('class','gem-svg'); svg.setAttribute('aria-hidden','true');
    const p = document.createElementNS('http://www.w3.org/2000/svg','path');
    p.setAttribute('d', paths[name] || paths.file); p.setAttribute('fill','#eee'); p.setAttribute('stroke','#080808'); p.setAttribute('stroke-width','2.4'); p.setAttribute('stroke-linejoin','miter');
    svg.append(p); parent.append(svg);
  }

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      S.frameBrand(_c, header);
      const desktop = util.el('div','gem-desktop',document.body);
      for (const [icon,label] of [['disk','Desk'],['folder','Documents'],['file','Applications'],['trash','Wastebin']]) {
        const item = util.el('div','gem-desktop-item',desktop); drawIcon(item,icon); util.el('span','',item,label);
      }
      const menu = util.el('div', 'gem-menu', header);
      for (const item of ['File', 'Edit', 'View', 'Application', 'Tools', 'Help']) util.el('span', '', menu, item);
      const toolbar = util.el('div', 'gem-toolbar', header);
      for (const [icon, label] of [['file','New'],['folder','Open'],['print','Print'],['evidence','Evidence'],['review','Review']]) {
        const b = util.el('button', 'gem-tool', toolbar);
        drawIcon(b,icon); util.el('span', '', b, label);
      }
      Object.assign(_c, { header });
    },
    'frame.placement': (base, S) => function (_c) {
      const { content, ctx, local, lr, rng, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      let wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      rng.bool(0.35); // preserve the reference frame draw
      const sidebar = true;
      rng.bool(0.5); // preserve the reference frame draw
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      const gemEnd = ctx.rng.fork('gem/end');
      if (!ctx.finish) {
        placement = gemEnd.pick(['footer','footer','footer','header','icon','link']);
        if (!word && gemEnd.bool(0.55)) label = 'OK';
      }
      wantFooter = placement === 'footer' || placement === 'link';
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.nav': (base, S) => function (_c) {
      const { content, rng } = _c;
      rng.sample(content.NAV_ITEMS, rng.int(3, 5));
    },
    'frame.body': (base, S) => function (_c) {
      const { content, rng, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      rng.sample(content.NAV_ITEMS, rng.int(4, 7));
      Object.assign(_c, { body });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, display, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const taskPanel = body.querySelector('.ref-panel');
      if (taskPanel) body.append(taskPanel);
      Object.assign(_c, { stage, taskPanel });
    },
  };

  env.site({
    name: 'design-use-gov-portal-branching-05',
    template: 'site/base',
    design: { parts },
  });
})();
