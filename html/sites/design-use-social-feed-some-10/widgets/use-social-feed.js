// Docked list tabs, photo scene markers, and goal-independent action controls.
(function () {
  'use strict';

  const SCENE_Y = ['19.93%', '31.05%', '42.29%', '53.65%', '65.12%', '76.48%'];

  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-some-10',
    name: 'design',
    split: 'train',
    scenarios: ['some'],
    template: 'use-social-feed/feed',
    design: {
      scenarioDecor: false,
      labels: false,
      timeFormat: 'plain',
      icons: {
        like: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
      },
      parts: {
        header: (base) => (R) => {
          base(R);
          if (!R.live) R.head.hidden = true;
          else {
            R.head.classList.add('dock-tabs');
            document.querySelector('.show-filter').append(R.head);
          }
        },
        avatar: (base) => (R, row, post, p, ...rest) => {
          const avatar = base(R, row, post, p, ...rest);
          avatar.textContent = '';
          avatar.classList.add('scene-thumb');
          avatar.style.setProperty('--scene-y', SCENE_Y[p % SCENE_Y.length]);
          return avatar;
        },
        scrollbar: (base) => (R) => {
          const result = base(R);
          for (const [className, dy] of [['scroll-up', -90], ['scroll-down', 90]]) {
            const arrow = R.util.el('button', className, result.track);
            arrow.type = 'button';
            arrow.setAttribute('aria-label', dy < 0 ? 'Scroll up' : 'Scroll down');
            arrow.addEventListener('pointerdown', (event) => event.stopPropagation());
            arrow.addEventListener('click', (event) => {
              event.stopPropagation();
              R.fd.feed.scrollTop += dy;
              R.report();
            });
          }
          return result;
        },
        paintStart: (base) => (R, model) => {
          base(R, model);
          const count = document.querySelector('.selected-count');
          if (!count) return;
          count.textContent = String(model.on.length);
        },
      },
    },
  });
})();
