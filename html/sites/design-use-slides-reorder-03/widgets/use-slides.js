// Design on the use-slides/office template; defaults reproduce the scaffold.
env.widget({
  task: 'use-slides',
  site: 'design-use-slides-reorder-03',
  name: 'design',
  split: 'train',
  scenarios: ['reorder'],
  template: 'use-slides/office',
  design: {
    uiFont: 'Segoe UI, Tahoma, Arial, sans-serif',
    documentFont: 'Segoe UI, Arial, sans-serif',
    guideColor: '#71a9df',
    editorLabel: 'Contoso Suite presentation editor',
    brand: 'Contoso Suite', workspace: 'Presentations',
    documentTitle: 'Executive Briefing',
    slideEyebrow: 'CONTOSO',
    slideFooter: 'People  |  Insight  |  Results',
    frameInset: 8, compactAt: 1050, tightAt: 760,
    navigationAt: 0, inspectorAt: 0,
    railWidth: 210, compactRailWidth: 190, inspectorWidth: 0,
    thumbnailPitch: 68, thumbnailHeight: 61,
    canvasInsetX: 20, canvasInsetY: 32, maxScale: 1.5,
    parts: {
      presentation: (base, S) => (parent, index, thumbnail) => {
        parent.replaceChildren();
        const svg = S.ctx.util.svg('svg', { viewBox: '0 0 720 400', width: '100%', height: '100%', 'aria-hidden': 'true' }, parent);
        const shape = (tag, attrs) => S.ctx.util.svg(tag, attrs, svg);
        const text = (x, y, value, size, color, weight) => {
          const node = shape('text', { x, y, fill: color, 'font-size': size, 'font-family': 'Segoe UI, Arial, sans-serif', 'font-weight': weight || 400 });
          node.textContent = value;
        };
        shape('rect', { x:0, y:0, width:720, height:400, fill:'#fff' });
        text(40, 72, S.spec.slides[index].title, thumbnail ? 30 : 40, '#155c92', 600);
        const lines = ['Focus on customer value', 'Leverage existing strengths', 'Build for sustainable growth', 'Execute with discipline'];
        lines.forEach((line, i) => {
          shape('circle', { cx:50, cy:137 + i * 42, r:5, fill:'#17649c' });
          text(72, 144 + i * 42, line, thumbnail ? 12 : 20, '#1b2735');
        });
        shape('rect', { x:400, y:48, width:278, height:268, fill:'#b8daf4' });
        shape('path', { d:'M400 234 L678 182 L678 316 L400 316 Z', fill:'#b5c9d4' });
        shape('path', { d:'M520 48 L678 48 L678 316 L570 316 Q550 250 520 48Z', fill:'#4c8bad' });
        shape('path', { d:'M544 48 L568 48 L606 316 L581 316 Z M609 48 L627 48 L650 316 L631 316 Z', fill:'#a9d7ee', opacity:'.82' });
        shape('path', { d:'M400 254 H678 M400 276 H678 M532 48 L580 316', fill:'none', stroke:'#e9f5fc', 'stroke-width':3 });
        shape('rect', { x:0, y:352, width:720, height:48, fill:'#155b91' });
        text(30, 381, 'Contoso', thumbnail ? 13 : 18, '#fff', 700);
        text(145, 381, 'People   |   Insight   |   Results', thumbnail ? 9 : 12, '#e8f4fc');
      },
      deck: (base, S) => (main) => {
        S.P.navigation(main);
        const editor = S.P.register(S.ctx.util.el('div', 'as-editor', main), 'custom-editor');
        S.P.ruler(editor, 0);
        const work = S.ctx.util.el('div', 'as-work', editor);
        const wrap = S.ctx.util.el('div', 'as-slidewrap', work);
        const canvas = S.ctx.util.el('div', 'as-canvas', wrap);
        S.slideArt = S.ctx.util.el('div', '', canvas);
        Object.assign(S.slideArt.style, { position: 'absolute', inset: '0', pointerEvents: 'none' });
        S.P.slideHeading(canvas);
        S.guide = S.ctx.util.el('div', 'as-guide', canvas);
        S.spec.shapes.forEach((shape, i) => {
          const el = S.shapeEls[i] = S.P.shape(canvas, shape, i);
          S.P.shapeBehavior(el, i);
        });
        S.P.rail(main);
        S.P.fit(work, wrap, canvas);
      },
    },
  },
});
