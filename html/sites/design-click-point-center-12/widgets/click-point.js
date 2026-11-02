// Center board design: frame the figure to the stage and keep the original plain style and status readout.
(function () {
  env.widget({
    task: 'click-point',
    site: 'design-click-point-center-12',
    name: 'design',
    split: 'train',
    scenarios: ['center'],
    template: 'click-point/board',
    design: {
      camera: true,
      placeCard: 'none',
      plainLook: true,
      clear: true,
      circleExtra: { class: 'cp-arc' },
      style: { serif: false },
      parts: {
        readout: () => (point) => {
          const status = document.querySelector('.point-status');
          if (status) status.textContent = point ? '1 point placed.' : 'No points placed yet.';
        },
      },
    },
  });
})();
