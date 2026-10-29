// Design of this site on the use-desktop-tools/workspace template: Times New Roman controls and an academic page scrollbar.
(function () {
  'use strict';
  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-editor-05',
    name: 'design',
    split: 'train',
    scenarios: ['editor'],
    template: 'use-desktop-tools/workspace',
    design: {
      toolbarTask: true,
      caret: (S) => S.svg('<path d="M2 5h12l-6 8z"/>', 16),
      fontName: 'Times New Roman',
      wordsLabel: (n) => `${n} words`,
      sizeCur: (key) => ({ small: '10', normal: '12', large: '18', huge: '24' })[key],
      toolIcons: {
        bullet: '<circle cx="3.5" cy="5" r=".9"/><circle cx="3.5" cy="11" r=".9"/><path d="M7 5h6M7 11h6"/>',
      },
      toolHtml: {
        number: (base, S) => S.svg('<path d="M2.5 3.5h1v3M2.5 9.5h2l-2 3h2M7 5h6M7 11h6"/>', 16),
      },
      parts: {
        edParasBuilt: () => (E) => {
          const { util, ed, area } = E;
          const scroll = util.el('div', 'academic-scroll', ed);
          const up = util.el('button', 'scroll-up', scroll);
          const track = util.el('div', 'scroll-track', scroll);
          const thumb = util.el('div', 'scroll-thumb', track);
          const down = util.el('button', 'scroll-down', scroll);
          up.type = down.type = 'button';
          up.setAttribute('aria-label', 'Scroll document up');
          down.setAttribute('aria-label', 'Scroll document down');
          const scrollPaint = () => {
            const extent = Math.max(0, area.scrollHeight - area.clientHeight);
            const height = extent
              ? Math.max(24, (track.clientHeight * area.clientHeight) / area.scrollHeight)
              : track.clientHeight * 0.275;
            thumb.style.height = `${height}px`;
            thumb.style.top = `${extent ? (area.scrollTop / extent) * (track.clientHeight - height) : 0}px`;
          };
          area.addEventListener('scroll', scrollPaint);
          up.addEventListener('click', () => {
            area.scrollTop -= 80;
            scrollPaint();
          });
          down.addEventListener('click', () => {
            area.scrollTop += 80;
            scrollPaint();
          });
          track.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            const initialY = e.clientY;
            const initialScroll = area.scrollTop;
            const extent = Math.max(0, area.scrollHeight - area.clientHeight);
            const travel = track.clientHeight - thumb.offsetHeight;
            if (e.target !== thumb && travel > 0) {
              area.scrollTop = ((e.clientY - track.getBoundingClientRect().top - thumb.offsetHeight / 2) / travel) * extent;
            }
            const move = (ev) => {
              if (e.target === thumb && travel > 0)
                area.scrollTop = initialScroll + ((ev.clientY - initialY) / travel) * extent;
              scrollPaint();
            };
            const release = () => {
              document.removeEventListener('pointermove', move);
              document.removeEventListener('pointerup', release);
            };
            document.addEventListener('pointermove', move);
            document.addEventListener('pointerup', release, { once: true });
            scrollPaint();
          });
          E.scrollPaint = scrollPaint;
          scrollPaint();
        },
        edPainted: () => (E) => E.scrollPaint(),
      },
    },
  });
})();
