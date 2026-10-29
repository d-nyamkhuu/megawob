// Publishing studio design; defaults reproduce this scenario's scaffold.
env.widget({
  task: 'use-site-builder',
  site: 'design-use-site-builder-social-05',
  name: 'design',
  split: 'train',
  scenarios: ['social'],
  template: 'use-site-builder/studio',
  design: {
    parts: {
      postView: (base, S) => function (drafts, it) {
        const post = base(drafts, it);
        const n = (String(it.label).match(/\d+/) || ['1'])[0];
        const img = document.createElement('div');
        img.className = `ab-thumb cms-post-thumb-${(Number(n) - 1) % 4 + 1}`;
        post.prepend(img);
        const nets = document.createElement('div');
        nets.className = 'ab-nets';
        for (const [c, t] of [['#3b5998', 'f'], ['#1da1f2', 't'], ['#0a66c2', 'in']]) {
          const b = document.createElement('i');
          b.style.background = c;
          b.textContent = t;
          nets.append(b);
        }
        post.append(nets);
        return post;
      },
    },
  },
});
