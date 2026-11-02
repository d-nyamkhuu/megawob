// Design on templates/sort-into-bins/base.js: the base site's sort-into-bins widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'sort-into-bins',
  site: 'design-sort-into-bins-desk-05',
  name: 'design',
  split: 'train',
  scenarios: ['desk'],
  template: 'sort-into-bins/base',
  design: {
    parts: {
      FOLDER_SVG: () => () => window.officeIcon('folder'),
      TRASH_SVG: () => window.officeIcon('trash'),
      FILE_SVG: () => (kind, ext) => {
        const type = String(kind) + ' ' + String(ext);
        const icon = /xls|csv|ods|spread|sheet/i.test(type) ? 'excel' : /pdf/i.test(type) ? 'pdf' : /jpg|jpeg|png|gif|photo|image|webp/i.test(type) ? 'photo' : /doc|odt|rtf|word/i.test(type) ? 'document' : 'plain';
        let svg = window.officeIcon(icon);
        if (icon === 'plain') {
          const label = String(ext || kind).replace(/[^a-z0-9]/gi, '').slice(0, 5).toUpperCase();
          const color = /zip|7z|gz|archive|compress/i.test(type) ? '#b3872e' : /eml|mail|ics|vcf/i.test(type) ? '#1586a3' : '#7067ae';
          svg = svg.replace('</svg>', '<rect x="5" y="65" width="72" height="29" rx="2" fill="' + color + '" stroke="white"/><text x="41" y="86" text-anchor="middle" font-size="17" font-family="Arial" font-weight="bold" fill="white">' + label + '</text></svg>');
        }
        return svg;
      },
      renderDesk: (base, S) => (ctx) => {
        // Keep the sampled margins and every draw in the base renderer; expand only its visual geometry.
        S.geo = { W: Math.floor(ctx.size.width - 2), H: Math.floor(ctx.size.height - 2) };
        Object.assign(S.board.style, { width: S.geo.W + 'px', height: S.geo.H + 'px', margin: '0' });
        const summary = (m) => {
          const sheets = S.spec.files.filter(f => /xls|csv|ods|spread|sheet/i.test(String(f.kind) + ' ' + f.ext)).length;
          const trash = S.spec.folders.find(d => d.trash);
          const numbers = [sheets, S.spec.files.length - sheets, S.spec.folders.filter(d => !d.trash).length,
            trash ? S.spec.files.filter(f => m.loc[f.id] === trash.id).length : 0];
          document.querySelectorAll('.item-total').forEach((el, i) => { el.textContent = numbers[i]; });
          for (const f of S.spec.files) {
            const tile = S.els.files && S.els.files[f.id];
            if (!tile) continue;
            tile.classList.toggle('in-folder', m.loc[f.id] !== 'desk');
            if (m.loc[f.id] !== 'desk') {
              tile.style.setProperty('--art-top', '0px');
              continue;
            }
            const graphic = tile.querySelector('svg');
            const label = tile.querySelector('span');
            const fullHeight = graphic.getBoundingClientRect().height + label.getBoundingClientRect().height + 6;
            const top = (m.pos[f.id][1] - S.spec.item.h / 2) * S.geo.H;
            tile.style.setProperty('--art-top', Math.min(0, S.geo.H - top - fullHeight - 5) + 'px');
          }
        };
        base(new Proxy(ctx, { get(target, key) {
          if (key === 'update') return m => { target.update(m); summary(m); };
          return Reflect.get(target, key);
        } }));
        summary(ctx.model);
      },
    },
  },
});
