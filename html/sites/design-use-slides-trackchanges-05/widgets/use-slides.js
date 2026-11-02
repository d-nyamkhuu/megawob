// Design on the use-slides/office template; defaults reproduce the scaffold.
env.widget({
  task: 'use-slides',
  site: 'design-use-slides-trackchanges-05',
  name: 'design',
  split: 'train',
  scenarios: ['trackchanges'],
  template: 'use-slides/office',
  design: {
    uiFont: 'Verdana, Arial, sans-serif',
    documentFont: 'Verdana, Arial, sans-serif',
    deletionColor: '#ff0000',
    insertionColor: '#ff0000',
    brand: 'Corporate Deck',
    workspace: 'Revisions',
    documentTitle: 'Executive Summary',
    parts: {
      layout: (base, S) => (ctx) => {
        base(ctx);
        for (const sel of ['.as-head', '.as-filetabs', '.as-menu', '.as-quick', '.as-tools', '.as-status', '.as-projects', '.as-outline', '.as-ruler', '.as-dochead', '.as-docmeta', '.as-docfooter']) {
          S.root.querySelectorAll(sel).forEach((el) => el.remove());
        }
      },
      review: (_base, S) => (main) => {
        const u = S.ctx.util, P = S.P;
        const side = u.el('aside', 'as-review', main);
        const cap = P.register(u.el('div', 'as-cap revision-cap', side), 'reviewCount');
        cap.textContent = 'Revisions';
        const headings = u.el('div', 'as-revision-head', side);
        for (const text of ['Slide', 'Location', 'Original Text', 'Proposed Text', 'Action']) u.el('span', '', headings, text);
        P.changes(side);
      },
      document: (base, S) => (main) => {
        base(main);
        const u = S.ctx.util;
        const editor = main.querySelector('.as-editor');
        const area = u.el('div', 'legacy-slide-area', main);
        main.insertBefore(area, editor);
        const rail = u.el('aside', 'legacy-thumbnails', area);
        rail.setAttribute('aria-label', 'Slide thumbnails');
        const titles = ['Product Launch Plan', 'Executive Summary', 'Market Opportunity', 'Go-to-Market Plan', 'Financial Outlook'];
        titles.forEach((title, i) => {
          const row = u.el('div', 'legacy-thumb-row' + (i === 1 ? ' active' : ''), rail);
          u.el('span', 'legacy-thumb-number', row, String(i + 1));
          const thumb = u.el('div', 'legacy-thumb', row);
          if (i !== 0) u.el('div', 'legacy-thumb-bar', thumb, title);
          const art = u.el('div', 'legacy-thumb-art ' + (i === 2 ? 'chart' : ''), thumb);
          if (i === 0) u.el('strong', '', art, title);
          else if (i === 2) for (let j = 0; j < 4; j++) u.el('i', '', art);
          else for (let j = 0; j < 5; j++) u.el('span', '', art);
        });
        area.appendChild(editor);
      },
      paragraph: (_base, S) => (body, text, i) => {
        const p = S.ctx.util.el('p', 'as-slide-bullet', body, text);
        const range = document.createRange();
        range.setStart(p.firstChild, 0);
        range.setEnd(p.firstChild, S.spec.phrases[i].text.length);
        return { node: p.firstChild, range };
      },
      synced: (base, S) => (model) => {
        base(model);
        const cap = S.root.querySelector('.revision-cap');
        if (cap) cap.textContent = `Revisions (${model.decisions.length})`;
      },
    },
  },
});
