// Site design on the rotate/cube template.
env.widget({
  task: 'rotate-object', site: 'design-rotate-object-cube-07', name: 'design', split: 'train',
  scenarios: ['cube'],
  template: 'rotate-object/cube',
  design: {
    edgeHeight: .5,
    x: .48,
    y: .51,
    labelMax: .44,
    labelFit: 1.15,
    reset: false,
    parts: {
      pad: (base, S) => (ctx, g) => {
        const pad = base(ctx, g);
        const { util } = ctx;
        const gizmo = util.el('div', 'view-gizmo', pad);
        const gs = util.svg('svg', {viewBox:'0 0 90 96', 'aria-hidden':'true'}, gizmo);
        util.svg('path', {d:'M4 24L46 8L86 24L44 42Z',fill:'#f2f3f8',stroke:'#e5e8ef','stroke-width':2},gs);
        util.svg('path', {d:'M4 24L44 42V91L7 72Z',fill:'#d9dce5',stroke:'#e5e8ef','stroke-width':2},gs);
        util.svg('path', {d:'M44 42L86 24L83 73L44 91Z',fill:'#b9bdc8',stroke:'#e5e8ef','stroke-width':2},gs);
        [['U',46,22],['L',21,63],['F',65,66]].forEach(([label,x,y]) => {
          const t=util.svg('text',{x,y,fill:'#29334e','font-size':23,'font-weight':600,'text-anchor':'middle'},gs);t.textContent=label;
        });
        return pad;
      },
      legend: (base, S) => (ctx, g) => {
        const { util, spec } = ctx;
        const legendList = document.querySelector('.legend-list');
        if (legendList) {
          legendList.textContent = '';
          spec.faces.slice().sort((a, b) => String(a.label).localeCompare(String(b.label), undefined, { numeric: true })).forEach((d) => {
            const row = util.el('div', 'legend-row', legendList);
            const sw = util.el('span', 'legend-swatch', row); sw.style.background = d.color;
            util.el('span', 'legend-num', row, String(d.label));
            util.el('span', '', row, `(${d.colorName})`);
          });
        }
      },
      helper: (base, S) => (ctx, g) => {
        const { spec } = ctx;
        const { helper } = g;
        helper.textContent = `The cube has one ${spec.faces.every(d => /^\d+$/.test(d.label)) ? 'number' : 'label'} on each face. Rotate it to view different sides.`;
      },
      beforePaint: (base, S) => (ctx, g) => {
        const task = env.taskDef;
        const { shadow, edge, rect } = g;
        const m = task.helpers.quat.matrix(ctx.model.q);
        const extent = edge / 2 * (Math.abs(m[1][0]) + Math.abs(m[1][1]) + Math.abs(m[1][2]));
        shadow.style.top = (rect.height * .51 + extent - 14) + 'px';
      },
      shade: (base, S) => (ctx, g, shade, light) => {
        base(ctx, g, shade, light);
        shade.nextElementSibling.style.opacity = (.83 + .17 * light).toFixed(4);
      },
      controls: (base, S) => (ctx, g) => {
        const task = env.taskDef;
        const paint = g.paint;
        document.querySelectorAll('[data-rotate]').forEach(button => {
          button.onclick = () => {
            const angles = {left:[-.25,0],right:[.25,0],up:[0,-.25],down:[0,.25]}[button.dataset.rotate];
            ctx.update({q:task.helpers.quat.normalize(task.helpers.quat.mul(task.helpers.rotation(...angles),ctx.model.q))});paint();
          };
        });
        document.querySelectorAll('[data-preset]').forEach(button => {
          button.onclick = () => {
            const angles = {front:[0,0],back:[Math.PI,0],left:[Math.PI/2,0],right:[-Math.PI/2,0],top:[0,Math.PI/2],bottom:[0,-Math.PI/2]}[button.dataset.preset];
            ctx.update({q:task.helpers.quat.normalize(task.helpers.rotation(...angles))});paint();
          };
        });
      },
    },
  },
});
