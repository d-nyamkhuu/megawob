// Design on templates/click-control/base.js: the base site's click-control widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'click-control',
  site: 'design-click-control-open-02',
  name: 'design',
  split: 'train',
  scenarios: ['open'],
  template: 'click-control/base',
  design: {
    parts: {
      'buildOpen': (base, S) => function buildOpen(ctx, content, up) {
        const { box, chooseLayout, env, fam, fileIcon, fileView } = S;
        const { spec, util, rng } = ctx;
        const r = content.getBoundingClientRect();
        const bar = util.el('div', 'uc-toolbar', content);
        const openBtn = util.el('button', 'uc-btn primary', bar, rng.pick(['Open', 'Open', 'View']));
        openBtn.type = 'button';
        for (const l of rng.sample(['New folder', 'Upload', 'Share', 'Sort'], 2)) util.el('button', 'uc-btn', bar, l).type = 'button';
        const avail = { w: Math.floor(r.width), h: Math.floor(r.height) - 55 };
        const b = box(ctx, content, { top: true });
        const layout = chooseLayout({ ...spec, layout: 'list' }, { w: avail.w, h: avail.h - 31 });
        const { els, host } = fileView(ctx, b, spec.items, layout, { w: avail.w, h: avail.h - (layout === 'list' ? 31 : 0) });
        content.style.alignItems = 'stretch';
        content.style.justifyContent = 'flex-start';
        bar.style.cssText = 'display:flex;align-items:center;justify-content:flex-start;gap:12px;width:100%;height:55px;min-height:55px;margin:0;padding:0 14px;background:linear-gradient(#edf4f0,#d9e6df);border-bottom:1px solid #a9c2b6;';
        b.style.cssText = 'position:relative;width:100%;max-width:none;height:auto;flex:1 1 0;min-height:0;overflow:auto;';
        if (host.classList.contains('uc-card')) {
          host.style.width = '100%';
          host.style.maxWidth = 'none';
          host.style.padding = '0';
          host.style.border = '0';
          host.style.borderRadius = '0';
          host.style.background = '#fff';
          host.style.boxSizing = 'border-box';
          const listHead = util.el('div', 'uc-filehead', content);
          content.insertBefore(listHead, b);
          listHead.style.cssText = 'display:grid;grid-template-columns:30px minmax(180px,38%) 10% 20% 1fr;align-items:center;flex:none;width:100%;height:31px;padding:5px 10px;background:#d4e1db;border-bottom:1px solid #a9bcb3;color:#202724;font:bold 15px Arial,sans-serif;';
          util.el('span', '', listHead, '');
          util.el('span', '', listHead, 'Name  ▲');
          util.el('span', '', listHead, 'Size');
          util.el('span', '', listHead, 'Type');
          util.el('span', '', listHead, 'Modified');
          for (const it of spec.items) {
            const row = els[it.key];
            row.style.gridTemplateColumns = '30px minmax(180px,38%) 10% 20% 1fr';
            row.style.gap = '10px';
            row.style.fontSize = '16px';
            const size = row.querySelector('.sz');
            const extension = String(it.name).split('.').pop().toLowerCase();
            const fileType = it.kind === 'folder' ? 'File Folder' : ({doc:'Microsoft Word Document',docx:'Microsoft Word Document',xls:'Microsoft Excel Worksheet',xlsx:'Microsoft Excel Worksheet',ppt:'Microsoft PowerPoint Presentation',pptx:'Microsoft PowerPoint Presentation',pdf:'Adobe Acrobat Document',gif:'GIF Image',jpg:'JPEG Image',png:'PNG Image',svg:'SVG Image',csv:'CSV File',txt:'Text Document',odt:'OpenDocument Text',ods:'OpenDocument Spreadsheet',mp4:'MP4 Video'}[extension] || `${extension.toUpperCase()} File`);
            const type = util.el('span', 'uc-ftype', row, fileType);
            if (size) row.insertBefore(type, size.nextSibling);
            const icon = row.querySelector('.uc-ficon');
            if (icon) { icon.style.width = '26px'; icon.style.height = '30px'; }
            const name = row.querySelector('.nm');
            if (name) name.style.fontSize = '16px';
          }
        }
        // Viewer over the content area: the opened item, with a Back link.
        const viewer = util.el('div', 'uc-viewer', content);
        viewer.hidden = true;
        const vh = util.el('div', 'uc-vhead', viewer);
        const back = util.el('span', 'uc-back', vh, rng.pick(['← Back', '‹ All files', '← Documents']));
        back.dataset.role = 'back';
        const vname = util.el('span', '', vh);
        const vbody = util.el('div', 'uc-vbody', viewer);
        for (const it of spec.items) {
          const el = els[it.key];
          el.addEventListener('click', (ev) => { if (ev.button === 0 && ctx.model.sel !== it.key) up({ sel: it.key }); });
          el.addEventListener('dblclick', () => {
            env.log('open', { what: 'file', key: it.key });
            up({ sel: it.key, clicks: ctx.model.clicks.concat([it.key]) });
          });
        }
        openBtn.addEventListener('click', () => {
          if (ctx.model.sel === null) { env.log('disabled', { what: 'open' }); return; }
          up({ clicks: ctx.model.clicks.concat([ctx.model.sel]) });
        });
        back.addEventListener('click', () => {
          const F = fam();
          if (F.helpers.pending(ctx.model, spec)) up(F.helpers.undoModel(ctx.model, spec));
          else up({ clicks: [] });
        });
        let shown = null;
        function sync(m) {
          for (const it of spec.items) { if (m.sel === it.key) els[it.key].setAttribute('data-sel', 'true'); else els[it.key].removeAttribute('data-sel'); }
          openBtn.classList.toggle('dis', m.sel === null);
          const last = m.clicks.length ? m.clicks[m.clicks.length - 1] : null;
          viewer.hidden = last === null;
          if (last !== null && shown !== last) {
            shown = last;
            const it = spec.items.find((x) => x.key === last);
            vname.textContent = it ? it.name : '';
            vbody.replaceChildren();
            if (it && it.kind === 'folder') {
              const vr = ctx.rng.fork(`v${last}`);
              for (let i = 0; i < 4; i++) {
                const row = util.el('div', 'uc-frow', vbody);
                row.style.height = '28px';
                row.innerHTML = fileIcon('pdf');
                util.el('span', 'nm', row, env.content.fileName ? env.content.fileName(vr) : `file-${i}`);
              }
            } else {
              util.el('div', '', vbody, it ? `${it.size} · ${String(it.kind).toUpperCase()}` : '');
              for (let i = 0; i < 6; i++) util.el('div', 'uc-vline', vbody).style.width = `${50 + ((i * 37) % 50)}%`;
            }
          }
          if (last === null) shown = null;
        }
        sync(ctx.model);
        return {
          sync,
          locate(t) {
            if (t.item2 !== undefined) return viewer.hidden ? env.util.center(els[t.item2]) : null;
            if (t.openbtn) return env.util.center(openBtn);
            if (t.undo) return viewer.hidden ? null : env.util.center(back);
            return null;
          },
          recover: null, // the viewer's Back link is the way back
        };
      },
    },
  },
});
