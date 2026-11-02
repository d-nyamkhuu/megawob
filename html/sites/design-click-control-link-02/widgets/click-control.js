// Design of this site on the click-control/controls template (templates/click-control/controls.js): the paragraphs are a bulleted list of notes; a sentence-final link starts the next bullet.
env.widget({
  task: 'click-control',
  site: 'design-click-control-link-02',
  name: 'design',
  split: 'train',
  scenarios: ['link'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    articleFit: { room: 30 },
    parts: {
      linkDecor: () => () => {},
      linkParagraphs: () => (ctx, art) => {
        const { spec, util } = ctx;
        const list = util.el('ul', 'resource-notes', art);
        const links = [];
        spec.blocks.forEach((ws, k) => {
          let row = null;
          ws.forEach((w, i) => {
            if (!row) row = util.el('li', '', list);
            if (row.childNodes.length && !/^[.,;:!?)]/.test(w.text)) row.append(' ');
            if (w.link) {
              const a = util.el('span', 'uc-link', row, w.text);
              a.dataset.key = `${k}.${i}`;
              a.dataset.role = 'link';
              links.push(a);
              if (!ws[i + 1] || /^[A-Z]/.test(ws[i + 1].text)) row = null;
            } else row.append(w.text);
          });
        });
        return links;
      },
    },
  },
});
