// Design on templates/use-email/base.js: the base site's use-email widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'use-email',
  site: 'design-use-email-reply-all-03',
  name: 'design',
  split: 'train',
  scenarios: ['reply-all'],
  template: 'use-email/base',
  design: {
    widget: 'classic',
    parts: {
      'CLASSIC_SIZES': () => ({ maxWidth: Infinity, rowHeights: [36, 38, 40], minRow: 30 }),
      'classicListPaint': (base, S) => function classicListPaint(ctx, nodes, underlay, m) {
        const { app, lbox } = nodes;
        app.classList.toggle('cl-composing', !!m.compose);
        if (underlay) {
          const copy = lbox.cloneNode(true);
          copy.classList.add('cl-underlay');
          copy.classList.remove('cl-floating');
          copy.setAttribute('aria-hidden', 'true');
          copy.querySelectorAll('[data-role]').forEach((e) => e.removeAttribute('data-role'));
          underlay.replaceWith(copy);
          underlay = copy;
        }

        return underlay;
      },
      'classicListMounted': (base, S) => function classicListMounted(ctx, nodes) {
        const { lbox } = nodes;
        let underlay;
        underlay = lbox.cloneNode(true);
        underlay.classList.add('cl-underlay');
        underlay.setAttribute('aria-hidden', 'true');
        underlay.querySelectorAll('[data-role]').forEach((e) => e.removeAttribute('data-role'));
        lbox.parentNode.insertBefore(underlay, lbox);
        lbox.classList.add('cl-floating');

        return underlay;
      },
    },
  },
});
