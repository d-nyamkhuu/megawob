// Design on the use-slides/office template; defaults reproduce the scaffold.
env.widget({
  task: 'use-slides',
  site: 'design-use-slides-restyle-02',
  name: 'design',
  split: 'train',
  scenarios: ['restyle'],
  template: 'use-slides/office',
  design: {
    uiFont: 'Georgia, "Times New Roman", serif',
    documentFont: 'Georgia, "Times New Roman", serif',
    guideColor: '#760b25',
    brand: 'Riverton Presentation',
    workspace: 'Branch Programs',
    documentTitle: 'Spring Programs',
    slideEyebrow: '',
    slideFooter: '',
    notesLabel: '',
    notesText: '',
    menus: { File: [], Edit: [], View: [], Insert: [], Format: [], Slide: [], Tools: [], Help: [] },
    frameInset: 0,
    compactAt: 0,
    tightAt: 0,
    inspectorAt: 0,
    parts: {
      deck: (base, S) => (main) => {
        const P = S.P, ctx = S.ctx, spec = S.spec, u = ctx.util;
        P.rail(main);
        const editor = u.el('div', 'as-editor', main);
        const work = u.el('div', 'as-work', editor);
        const wrap = u.el('div', 'as-slidewrap', work);
        const canvas = u.el('div', 'as-canvas', wrap);
        P.slideHeading(canvas);
        S.guide = u.el('div', 'as-guide', canvas);
        spec.shapes.forEach((shape, i) => {
          const el = S.shapeEls[i] = P.shape(canvas, shape, i);
          P.shapeBehavior(el, i);
        });
        const controls = u.el('div', 'as-tools as-bottom-tools', editor);
        P.styleTools(controls);
        P.inspector(main);
        P.fit(work, wrap, canvas);
      },
      quickTools: (base, S) => () => {
        S.P.register(S.ctx.util.el('span', 'as-group-caption', S.root), 'selectionStatus');
      },
      navigation: () => () => {},
      tools: (base) => () => {},
      shapeInspector: (base, S) => (inner) => {
        const P = S.P, ctx = S.ctx, u = ctx.util;
        const selected = ctx.model.selected[0] ?? 0;
        const label = S.spec.shapes[selected]?.label || 'Text shape';
        const style = ctx.model.styles[selected];
        u.el('div', 'as-property-caption', inner, 'Text');
        const text = u.el('div', 'as-property-text', inner, label);
        text.setAttribute('aria-label', 'Selected text');
        u.el('div', 'as-property-label', inner, 'Font');
        u.el('div', 'as-property-value', inner, 'Times New Roman');
        u.el('div', 'as-property-label', inner, 'Size');
        u.el('div', 'as-property-value', inner, `${style.size} pt`);
        u.el('div', 'as-property-label', inner, 'Style');
        u.el('div', 'as-property-value', inner, `${style.bold ? '☑' : '□'}  Bold　　 ${style.italic ? '☑' : '□'}  Italic　　 □  Underline`);
        u.el('div', 'as-property-label', inner, 'Text Colour');
        const swatch = u.el('div', 'as-property-value', inner, `　 ${style.color}`);
        swatch.style.borderLeft = `18px solid ${({ forest: '#214a2e', green: '#34734a', coral: '#d86d61', blue: '#3473a1', plum: '#754d83', charcoal: '#333333' })[style.color] || '#596450'}`;
        u.el('hr', '', inner);
        u.el('div', 'as-property-caption', inner, 'Alignment');
        u.el('div', 'as-property-value', inner, '☷　　　 ≡　　　 ☰');
        const empty = P.register(u.el('div', 'as-empty', inner, 'Select an object to see its properties.'), 'inspectorEmpty');
        empty.hidden = true;
        const dl = P.register(u.el('dl', '', inner), 'inspectorProperties');
        for (const key of ['Width', 'Height', 'Rotation', 'X', 'Y']) {
          u.el('dt', '', dl, key);
          P.register(u.el('dd', '', dl, key === 'Width' ? '110' : key === 'Height' ? '48' : key === 'Rotation' ? '0 deg' : '40'), `property:${key}`);
        }
      },
    },
  },
});
