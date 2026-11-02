// Design on templates/click-control/base.js: the base site's click-control widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'click-control',
  site: 'design-click-control-context-01',
  name: 'design',
  split: 'train',
  scenarios: ['context'],
  template: 'click-control/base',
  design: {
    widget: 'desktop',
    parts: {
      'window2': (base, S) => function window2(ctx) {
        const { util, rng } = ctx;
        const W = ctx.size.width;
        const H = ctx.size.height;
        const win = util.el('div', 'ud-win', ctx.stage);
        const ww = Math.round(Math.min(W - 24, Math.max(Math.min(760, W - 24), W * rng.float(0.8, 0.96))));
        const wh = Math.round(H - 2 * rng.int(10, 18));
        const fx = rng.pick([0.1, 0.5, 0.5, 0.9]);
        win.style.width = ww + 'px';
        win.style.height = wh + 'px';
        win.style.left = Math.round(12 + fx * Math.max(0, W - 24 - ww)) + 'px';
        win.style.top = Math.round((H - wh) / 2) + 'px';
        rng.pick(['Workbench', 'Notebook', 'Inspector', 'Organizer', 'Finder', 'Explorer']);
        const title = util.el('div', 'ud-title', win, 'My Drafts');
        title.insertAdjacentHTML('afterbegin', '<span class="ud-dots"><i></i><i></i><i></i></span>');
        const bar = util.el('div', 'ud-bar', win);
        const body = util.el('div', 'ud-body', win);
        const status = util.el('div', 'ud-status', win);
        util.el('span', '', status, 'Ready');
        util.el('span', '', status, `${rng.int(2, 40)} items`);
        util.el('span', '', status, 'UTF-8');
        return { win, bar, body };
      },
    },
  },
});
