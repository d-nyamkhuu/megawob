// Design of this site on click-control/controls: accordion sections present their seeded links in resource tables.
env.widget({
  task: 'click-control',
  site: 'design-click-control-collapsible-07',
  name: 'design',
  split: 'train',
  scenarios: ['collapsible'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    modTitle: 'Module Contents',
    chevron: '<svg viewBox="0 0 16 21" aria-hidden="true"><path d="M2 1L15 10.5L2 20Z"/></svg>',
    parts: {
      colBody: (base) => (ctx, bd, s, i, links, h) => {
        const { util } = ctx;
        const source = util.el('div', '', bd);
        const sectionLinks = [];
        base(ctx, source, s, i, sectionLinks, h);
        const prose = Array.from(source.firstChild.childNodes)
          .filter((n) => n.nodeType === 3)
          .map((n) => n.textContent)
          .join('')
          .trim()
          .split(/\s+/)
          .filter(Boolean);
        const table = util.el('table', 'project-resources', bd);
        const header = util.el('tr', '', util.el('thead', '', table));
        ['Title', 'Description', 'Link'].forEach((t) => util.el('th', '', header, t));
        const rows = util.el('tbody', '', table);
        const titles = ['Project Plan', 'Volunteer Guide', 'Community Map', 'Photo Archive', 'Additional Resources'];
        const files = ['plan.html', 'guide.html', 'map.html', 'photos.html'];
        const count = Math.max(5, sectionLinks.length);
        for (let row = 0; row < count; row++) {
          const tr = util.el('tr', '', rows);
          util.el('td', '', tr, titles[Math.min(row, 4)]);
          util.el(
            'td',
            '',
            tr,
            prose
              .slice(Math.floor((row * prose.length) / count), Math.floor(((row + 1) * prose.length) / count))
              .join(' '),
          );
          const cell = util.el('td', '', tr);
          const link = sectionLinks[row - (count - sectionLinks.length)];
          if (link) cell.append(link);
          else {
            const filler = util.el('span', 'resource-xtra', cell, files[row % files.length]);
            filler.addEventListener('click', () => env.log('decoy', { label: filler.textContent }));
          }
        }
        source.remove();
        links.push(...sectionLinks);
      },
    },
  },
});
