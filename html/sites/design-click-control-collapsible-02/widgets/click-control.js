// Design of this site on the click-control/controls template (templates/click-control/controls.js): every section body gets a
// pointer-operated scrollbar rail.
(function () {
  'use strict';
  let scrolls = [];
  env.widget({
    task: 'click-control',
    site: 'design-click-control-collapsible-02',
    name: 'design',
    split: 'train',
    scenarios: ['collapsible'],
    traits: { menuOpen: ['hover', 'click'] },
    template: 'click-control/controls',
    design: {
      parts: {
        colAcc: () => () => { scrolls = []; },
        colSection: () => (ctx, sec, h, bd) => {
          const { util } = ctx;
          // Pointer-operated native-style scrollbar; keep the task's section and link targets intact.
          const rail = util.el('div', 'gtk-scroll', sec);
          const prev = util.el('button', 'gtk-scroll-up', rail, '▴');
          const track = util.el('div', 'gtk-scroll-track', rail);
          const thumb = util.el('div', 'gtk-scroll-thumb', track);
          util.el('span', '', thumb, '≡');
          const next = util.el('button', 'gtk-scroll-down', rail, '▾');
          prev.type = next.type = 'button';
          prev.setAttribute('aria-label', 'Scroll section up');
          next.setAttribute('aria-label', 'Scroll section down');
          prev.addEventListener('click', () => { bd.scrollTop -= 40; });
          next.addEventListener('click', () => { bd.scrollTop += 40; });
          const drawScroll = () => {
            const range = Math.max(0, bd.scrollHeight - bd.clientHeight);
            const height = Math.max(24, track.clientHeight * Math.min(1, bd.clientHeight / Math.max(1, bd.scrollHeight)));
            thumb.style.height = height + 'px';
            thumb.style.top = (range ? bd.scrollTop / range * (track.clientHeight - height) : 0) + 'px';
          };
          scrolls.push(drawScroll);
          bd.addEventListener('scroll', drawScroll);
          track.addEventListener('pointerdown', e => {
            const rect = track.getBoundingClientRect();
            if (!thumb.contains(e.target)) bd.scrollTop = (e.clientY - rect.top) / Math.max(1, rect.height) * (bd.scrollHeight - bd.clientHeight);
            const start = e.clientY, initial = bd.scrollTop;
            track.setPointerCapture(e.pointerId);
            const move = ev => {
              const travel = track.clientHeight - thumb.clientHeight;
              bd.scrollTop = initial + (ev.clientY - start) / Math.max(1, travel) * (bd.scrollHeight - bd.clientHeight);
            };
            track.addEventListener('pointermove', move);
            track.addEventListener('pointerup', () => track.removeEventListener('pointermove', move), { once: true });
          });
        },
        colSynced: () => () => scrolls.forEach((draw) => draw()),
      },
    },
  });
})();
