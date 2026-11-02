// Uses the tighter floor-fit and adds the crop mode controls around the shared inspector.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-outline-10',
  name: 'design',
  split: 'train',
  scenarios: ['outline'],
  traits: { aspect: 1.605, placement: 'center', startBox: { x: 0.188, y: 0.114, w: 0.505, h: 0.605 } },
  template: 'crop-image/box',
  design: {
    parts: {
      fit: (base, S) => (ctx) => {
        const { size, spec } = ctx;
        const availW = Math.floor(size.width - 24);
        const availH = Math.floor(size.height - 24);
        const W = Math.min(availW, Math.floor(availH * spec.aspect));
        const H = Math.floor(W / spec.aspect);
        return { W, H };
      },
      inspectorTools: (base, S) => (ctx, inspector) => {
        const { util } = ctx;
        util.el('hr', '', inspector);
        util.el('h3', '', inspector, 'Tools');
        const modeRow = util.el('div', 'crop-mode-row', inspector);
        for (const [i, label] of ['Move', 'Resize'].entries()) {
          const button = util.el('button', 'crop-mode' + (i === 0 ? ' selected' : ''), modeRow);
          button.type = 'button';
          button.textContent = (i === 0 ? '↖　' : '▧　') + label;
          button.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
          button.onclick = () => {
            modeRow.querySelectorAll('.crop-mode').forEach((item) => {
              const active = item === button;
              item.classList.toggle('selected', active);
              item.setAttribute('aria-pressed', active ? 'true' : 'false');
            });
          };
        }
      },
      tools: (base, S) => (ctx) => {
        const { bar, inspector } = S.els;
        if (!bar) return;
        const toolsHeading = inspector.querySelector('h3:nth-of-type(2)');
        toolsHeading.classList.add('crop-tools-heading');
        toolsHeading.append(bar);
      },
    },
  },
});
