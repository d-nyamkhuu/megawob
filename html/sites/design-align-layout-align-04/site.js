// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('mac-titlebar');
      util.el('span', 'mac-title-icon', header, '');
      util.el('span', 'mac-app-name', header, 'Design Studio');
      const winControls = util.el('div', 'mac-window-controls', header);
      for (const glyph of ['−', '□', '×']) util.el('span', '', winControls, glyph);
      const menu = util.el('nav', 'mac-menu', document.body);
      menu.dataset.role = 'menu';
      const toolbar = util.el('div', 'mac-toolbar', document.body);
      for (const [icon, label] of [['➤', 'Select'], ['□', 'Rectangle'], ['◯', 'Ellipse'], ['T', 'Text'], ['▧', 'Image']]) {
        const tool = util.el('div', 'mac-tool', toolbar);
        util.el('span', 'mac-tool-icon', tool, icon);
        util.el('span', 'mac-tool-label', tool, label);
      }
      const project = util.el('div', 'mac-project', toolbar);
      const projectName = util.el('div', 'mac-field', project);
      util.el('b', '', projectName, 'Project');
      util.el('span', '', projectName, 'Spring Campaign');
      const canvasSize = util.el('div', 'mac-field', project);
      util.el('b', '', canvasSize, 'Canvas Size');
      util.el('span', '', canvasSize, '1280 × 720　▾');
      const background = util.el('div', 'mac-background', project);
      util.el('b', '', background, 'Background');
      util.el('i', '', background);
      util.el('span', '', background, '#F7F7F7');
      S.frameBrand(_c, header);
      Object.assign(_c, { background, canvasSize, header, menu, project, projectName, toolbar, winControls });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const assets = util.el('aside', 'mac-assets', body);
      assets.classList.add('properties');
      const tabs = util.el('div', 'mac-tabs', assets);
      util.el('b', '', tabs, 'Assets');
      util.el('span', '', tabs, 'Styles');
      util.el('span', '', tabs, 'Layers');
      util.el('div', 'mac-select', assets, 'All Assets　 ▾');
      for (const [i, label] of ['Photo 1', 'Photo 2', 'Photo 3', 'Photo 4'].entries()) {
        const row = util.el('div', `mac-asset${i === 0 ? ' selected' : ''}`, assets);
        util.el('span', `mac-thumb thumb-${i + 1}`, row);
        util.el('span', '', row, label);
      }
      util.el('div', 'mac-divider', assets);
      for (const [shape, label] of [['▰', 'Rectangle'], ['⬭', 'Oval'], ['★', 'Star'], ['―', 'Line']]) {
        const row = util.el('div', 'mac-shape', assets);
        util.el('span', '', row, shape);
        util.el('span', '', row, label);
      }
      const propTitle = util.el('h2', 'properties-title', assets, 'Properties');
      const selectedCard = util.el('div', 'properties-card', assets);
      util.el('b', '', selectedCard, 'Card');
      util.el('span', '', selectedCard, 'Mountain');
      for (const [name, color, value] of [['Fill', '#8EC1E6', '#8EC1E6'], ['Border', '#000000', '#000000'], ['Shadow', '#3B3B3B', '#3B3B3B']]) {
        const row = util.el('div', 'properties-row', assets);
        util.el('b', '', row, name);
        const swatch = util.el('i', 'properties-swatch', row);
        swatch.style.background = color;
        util.el('span', '', row, value);
      }
      const layerTitle = util.el('h3', 'properties-section', assets, 'Layer');
      const layers = util.el('div', 'properties-layers', assets);
      for (const [icon, active] of [['◆', false], ['▣', true], ['▢', false]]) {
        const button = util.el('span', `properties-layer${active ? ' active' : ''}`, layers, icon);
        button.setAttribute('aria-hidden', 'true');
      }
      const arrangeTitle = util.el('h3', 'properties-section', assets, 'Arrange');
      const arrange = util.el('div', 'properties-arrange', assets);
      for (const icon of ['◧', '↔', '◨', '↕']) util.el('span', '', arrange, icon);
      S.frameSidebar(_c, body);
      Object.assign(_c, { arrange, arrangeTitle, assets, body, layerTitle, layers, propTitle, selectedCard, tabs });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      const stageWindow = util.el('div', 'mac-stage-window', stage);
      util.el('div', 'mac-stage-head', stageWindow, '▤　Untitled Layout');
      util.el('div', 'mac-canvas-host', stageWindow);
      const tips = util.el('aside', 'mac-tips', body);
      util.el('h2', '', tips, 'Dragging Tips');
      for (const [title, art] of [['Move cards', '▭　　⇢　 ▯'], ['Resize boxes', '▱　　↘'], ['Align edges', '▰　┆　┆　▰'], ['Space evenly', '▰　↔　▰　↔　▰']]) {
        const tip = util.el('section', 'mac-tip', tips);
        util.el('h3', '', tip, title);
        util.el('div', 'mac-tip-art', tip, art);
      }
      S.frameAlign(_c, stage);
      const dock = util.el('nav', 'mac-dock', document.body);
      for (const [icon, label, active] of [['▦', 'Canvas', true], ['◆', 'Assets', false], ['▤', 'Templates', false], ['▧', 'Media', false], ['⚙', 'Settings', false]]) {
        const item = util.el('div', `mac-dock-item${active ? ' active' : ''}`, dock);
        util.el('span', '', item, icon);
        util.el('b', '', item, label);
      }
      Object.assign(_c, { dock, stage, stageWindow, tips });
    },
    'frame.floating': (base) => function (_c) {
      base(_c);
      const floating = document.querySelector('.ref-float-dock');
      if (floating) _c.dock.append(floating);
    },
  };

  env.site({
    name: 'design-align-layout-align-04',
    template: 'site/base',
    design: { parts },
  });
})();
