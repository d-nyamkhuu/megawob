/* click-point/center: sampling for the center scenario. */
(function () {
  'use strict';
  const { fitRange, pt, r4, DEG } = env.taskOf('click-point').lib;

  function sampleCenter(rng, ood, tr, g) {
    // traits.shapes restricts the figure (e.g. ['arc']); the pick then comes from its own stream.
    const shapes = tr && Array.isArray(tr.shapes) && tr.shapes.length ? tr.shapes : null;
    const shape = shapes ? rng.fork('shapes').pick(shapes) : rng.pick(['circle', 'circle', 'ring', 'disc', 'arc', 'arc']);
    // The whole circle (plus 0.05) fits the area: radii shrink only for small placement areas. On aspect / placement
    // geometries a ring's outer edge (up to 1.2 r) also stays inside.
    const grow = g.custom && shape === 'ring' ? 1.2 : 1;
    const [rlo, rhi] = fitRange(ood ? [0.035, 0.07] : shape === 'arc' ? [0.16, 0.42] : [0.07, 0.36], (Math.min(g.x1 - g.x0, g.y1 - g.y0) / 2 - 0.05) / grow);
    const r = rng.float(rlo, rhi);
    const m = r * grow + 0.05;
    const c = [rng.float(g.x0 + m, g.x1 - m), rng.float(g.y0 + m, g.y1 - m)];
    const out = { shape, c: pt(c), r: r4(r) };
    if (shape === 'ring') out.ringWidth = r4(r * rng.float(0.18, 0.4));
    if (shape === 'arc') out.arc = { start: r4(rng.float(0, 2 * Math.PI)), span: r4((ood ? rng.float(40, 70) : rng.float(70, 200)) / DEG) };
    return out;
  }

  env.scenario('click-point', { name: 'center', sample: sampleCenter });
})();
