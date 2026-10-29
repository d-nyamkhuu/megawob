// Design of this site on click-control/controls: notebook resource rows and a compact article fit pass.
env.widget({
  task: 'click-control',
  site: 'design-click-control-link-05',
  name: 'design',
  split: 'train',
  scenarios: ['link'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      linkDecor: () => (ctx, art, links) => {
        const { util } = ctx;
        Array.from(art.children).forEach((el) => {
          if (el.tagName !== 'H3') el.remove();
        });
        art.querySelector('h3').textContent = 'Useful Links';
        util.el('p', 'notebook-intro', art, 'Here are some resources you might find helpful:');
        const resources = util.el('ul', 'notebook-resources', art);
        const descs = [
          'the Ubuntu project website',
          'learn more about the GNOME desktop',
          'a small link for testing',
          'development tools and services',
          'the Mozilla project',
          'office productivity suite',
        ];
        links.forEach((a, i) => {
          const row = util.el('li', '', resources);
          row.append(a);
          row.append('  –  ' + descs[i % descs.length]);
        });
        const closing = util.el('p', 'notebook-closing', art, 'For more information, visit our ');
        util.el('span', 'g-deco', closing, 'documentation');
        closing.append('.');
      },
      rendered: () => (ctx, page, content) => {
        const art = content.querySelector('.uc-article');
        if (!art) return;
        const padding = getComputedStyle(content);
        const room = content.clientHeight - parseFloat(padding.paddingTop) - parseFloat(padding.paddingBottom);
        let size = parseFloat(getComputedStyle(art).fontSize);
        while (art.scrollHeight > room && size > 13) {
          size = Math.max(13, size - 0.5);
          art.style.fontSize = size + 'px';
        }
        if (art.scrollHeight > room) {
          const list = art.querySelector('.notebook-resources');
          if (list) {
            list.style.marginBottom = '.75em';
            for (const row of list.children) row.style.lineHeight = '1.25';
          }
        }
      },
    },
  },
});
