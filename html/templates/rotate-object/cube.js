/*
 * rotate-object/cube — CSS six-face cube, L2 medoid design-rotate-object-cube-11 (design {}).
 * Scenario: cube; its preset is empty (the medoid already has the majority behavior).
 * L3 singleton design-rotate-object-cube-07 shares these mechanics through small hooks.
 * Tokens: edgeHeight (.61), edgeWidth (.4), edgeMax (285): cube edge limits;
 * x (.58), y (.5): visual center and trackball origin as pad fractions;
 * labelMax (.16), labelFit (.8): font/edge and font*labelLength/edge limits;
 * labelColor ('#25313e', null omits): light-face label ink; background ('background'):
 * face style property; faceImage (null): optional backgroundImage; shade (.24): darkness;
 * reset (true): bind the frame reset control to the initial quaternion.
 * Parts: matrix(q,translation=[0,0,0]) -> CSS matrix3d; begin(ctx,g) noop stage art;
 * pad(ctx,g) -> pad, fit(ctx,g) -> edge, origin(rect) -> trackball point;
 * face(ctx,g,data,i) -> shade element (builds face, matrix and label through P);
 * label(ctx,g,label,data) styles text; legend(ctx,g) noop after faces;
 * helper(ctx,g) writes the visible task helper; beforePaint(ctx,g) noop status hook;
 * shade(ctx,g,el,light,i) paints face shade; controls(ctx,g) binds reset;
 * paint(ctx,g) paints cube matrix, status and face shading.
 * S exposes live ctx, geo, D and P. Construction shares g, including pad/rect/edge,
 * cube/shadow/faces, initial quaternion, ball and paint callback. No factory DOM work.
 */
(function () {
  'use strict';
  const TOKENS = {
    edgeHeight: .61, edgeWidth: .4, edgeMax: 285, x: .58, y: .5,
    labelMax: .16, labelFit: .8, labelColor: '#25313e', background: 'background',
    faceImage: null, shade: .24, reset: true,
  };
  env.template('rotate-object/cube', (design, def) => {
    let D, P, ctxRef, geo, view;
    const BASE = {};
    const S = { get ctx() { return ctxRef; }, get geo() { return geo; }, get D() { return D; }, get P() { return P; } };
    BASE.matrix = function (q, translation = [0, 0, 0]) {
      const m = env.taskDef.helpers.quat.matrix(q);
      const values = [m[0][0], m[1][0], m[2][0], 0, m[0][1], m[1][1], m[2][1], 0,
        m[0][2], m[1][2], m[2][2], 0, ...translation, 1];
      return `matrix3d(${values.map(v => Math.abs(v) < 1e-9 ? '0' : v.toFixed(6)).join(',')})`;
    };
    BASE.begin = () => {};
    BASE.pad = (ctx) => {
      const pad = ctx.util.el('div', 'cube-pad', ctx.stage);
      pad.dataset.role = 'cube';
      pad.setAttribute('aria-label', 'Drag to rotate the cube');
      return pad;
    };
    BASE.fit = (ctx, g) => Math.floor(Math.min(g.rect.height * D.edgeHeight, g.rect.width * D.edgeWidth, D.edgeMax));
    BASE.origin = (r) => [r.left + r.width * D.x, r.top + r.height * D.y];
    BASE.label = (ctx, g, label, data) => {
      label.style.fontSize = Math.round(g.edge * Math.min(D.labelMax, D.labelFit / data.label.length)) + 'px';
      if (D.labelColor && ['white', 'yellow'].includes(data.colorName)) label.style.color = D.labelColor;
    };
    BASE.face = (ctx, g, data, i) => {
      const { util } = ctx;
      const face = util.el('div', 'cube-face', g.cube);
      Object.assign(face.style, { width: g.edge + 'px', height: g.edge + 'px', [D.background]: data.color });
      if (D.faceImage) face.style.backgroundImage = D.faceImage;
      const normal = env.taskDef.helpers.faceWorld([1, 0, 0, 0], i).normal;
      face.style.transform = P.matrix(env.taskDef.helpers.FACES[i].q, normal.map(v => v * g.edge / 2));
      const shade = util.el('div', 'face-shade', face);
      const label = util.el('div', 'face-label', face, data.label);
      P.label(ctx, g, label, data);
      return shade;
    };
    BASE.legend = () => {};
    BASE.helper = (ctx, g) => {
      const { spec } = ctx;
      const target = g.target;
      if (ctx.episode.instr !== 'hidden') {
        const face = spec.ref === 'color' ? `${target.colorName} face` :
          `${spec.ref === 'both' ? target.colorName + ' ' : ''}face labeled “${target.label}”`;
        g.helper.textContent = `Click and drag the cube to rotate it. The ${face} should be facing directly toward you.${spec.upright ? ' Keep its label upright.' : ''}`;
      }
    };
    BASE.beforePaint = () => {};
    BASE.shade = (ctx, g, shade, light) => { shade.style.opacity = (D.shade * (1 - light)).toFixed(4); };
    BASE.paint = (ctx, g) => {
      g.cube.style.transform = P.matrix(ctx.model.q);
      P.beforePaint(ctx, g);
      g.faces.forEach((shade, i) => {
        const normal = env.taskDef.helpers.faceWorld(ctx.model.q, i).normal;
        const light = Math.max(0, -normal[0] * .25 - normal[1] * .4 + normal[2] * .87);
        P.shade(ctx, g, shade, light, i);
      });
    };
    BASE.controls = (ctx, g) => {
      if (D.reset) document.querySelector('[data-action="reset"]').onclick = () => {
        ctx.update({ q: g.initial.slice() });
        g.paint();
      };
    };
    const SCENARIOS = { cube: {} };
    ({ D, P } = env.templateDesign('rotate-object/cube', design, def, { tokens: TOKENS, scenarios: SCENARIOS, base: BASE, state: S }));
    return {
      render(ctx) {
        ctxRef = ctx;
        const g = {};
        geo = g;
        g.paint = () => P.paint(ctx, g);
        P.begin(ctx, g);
        g.pad = P.pad(ctx, g);
        g.rect = g.pad.getBoundingClientRect();
        g.edge = P.fit(ctx, g);
        g.shadow = ctx.util.el('div', 'cube-shadow', g.pad);
        g.cube = ctx.util.el('div', 'cube-solid', g.pad);
        Object.assign(g.cube.style, { width: g.edge + 'px', height: g.edge + 'px',
          left: (g.rect.width * D.x - g.edge / 2) + 'px', top: (g.rect.height * D.y - g.edge / 2) + 'px' });
        g.faces = ctx.spec.faces.map((data, i) => P.face(ctx, g, data, i));
        P.legend(ctx, g);
        g.helper = document.querySelector('.task-helper');
        g.target = ctx.spec.faces[ctx.spec.target];
        P.helper(ctx, g);
        g.initial = ctx.model.q.slice();
        let start;
        const task = env.taskDef;
        g.ball = env.ui.trackball(g.pad, {
          label: 'cube', origin: () => P.origin(g.pad.getBoundingClientRect()),
          gain: Math.max(.7, task.helpers.MAX_DRAG / Math.max(35, g.rect.height / 2 - 8)),
          onStart() { start = ctx.model.q.slice(); g.pad.classList.add('dragging'); },
          onInput([yaw, pitch]) { ctx.update({ q: task.helpers.quat.normalize(task.helpers.quat.mul(task.helpers.rotation(yaw, pitch), start)) }); g.paint(); },
          onChange() { g.pad.classList.remove('dragging'); },
        });
        P.controls(ctx, g);
        g.paint();
        view = g;
        return { anchors: [g.pad], sync: g.paint };
      },
      locate(target) {
        if (target.grab === 'cube') return view.ball.locateGrab();
        if (target.rotateBy) return view.ball.locate(target.rotateBy);
        throw new Error(`Metro cube cannot locate ${JSON.stringify(target)}`);
      },
    };

  });
})();
