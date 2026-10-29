// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';
  const decoratedWidgets = new WeakSet();

  // Decorations read the rendered explorer; all task nodes and their handlers stay in place.
  function decorateExplorer(stage, util) {
    const win = stage.querySelector('.fm-win');
    if (!win) return;
    const crumbs = [...win.querySelectorAll('.fm-crumb')].map(n => n.textContent.trim()).filter(Boolean);
    const name = crumbs[crumbs.length - 1] || win.querySelector('.fm-crumbs')?.textContent.trim().split('›').pop().trim() || 'Files';
    const tiles = [...win.querySelectorAll('.fm-tile')];
    const rows = [...win.querySelectorAll('.fm-tr')];
    const label = node => node.querySelector('.nm, .lb')?.textContent.trim() || '';
    const signature = [name, ...tiles.map(label), '|', ...rows.map(label)].join('\u001f');
    if (win.dataset.vistaSignature === signature) return;
    win.dataset.vistaSignature = signature;
    const el = (tag, cls, parent, text) => util.el(tag, cls, parent, text);
    const metadata = (text) => {
      let hash = 0;
      for (const c of text) hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
      const ext = text.match(/\.([a-z0-9]+)$/i)?.[1].toLowerCase() || '';
      const types = { doc: 'Microsoft Office Word Document', docx: 'Microsoft Office Word Document', xls: 'Microsoft Office Excel Worksheet', xlsx: 'Microsoft Office Excel Worksheet', ppt: 'Microsoft Office PowerPoint Presentation', pptx: 'Microsoft Office PowerPoint Presentation', rtf: 'Rich Text Document', pdf: 'Adobe Acrobat Document', jpg: 'JPEG Image', jpeg: 'JPEG Image', png: 'PNG Image', heic: 'HEIC Image', svg: 'SVG Image', txt: 'Text Document', md: 'Text Document', zip: 'Compressed Folder', '7z': 'Compressed Folder', mp3: 'MP3 Audio', m4a: 'Audio File', odt: 'OpenDocument Text' };
      return { ext, type: ext ? (types[ext] || ext.toUpperCase() + ' File') : 'File Folder',
        date: `${['Jan', 'Feb', 'Mar'][hash % 3]} ${1 + hash % 27}, 2007  ${1 + hash % 12}:${String(hash % 60).padStart(2, '0')} ${hash % 2 ? 'PM' : 'AM'}`,
        size: ext ? `${12 + hash % 801} KB` : '' };
    };
    const ensure = (cls, parent, tag = 'div') => parent.querySelector('.' + cls) || el(tag, cls, parent);
    const title = win.querySelector('.fm-title');
    if (title && !title.querySelector('.vista-caption-controls')) {
      const controls = el('span', 'vista-caption-controls', title);
      for (const text of ['−', '□', '×']) el('span', '', controls, text);
    }
    const summary = ensure('vista-summary', win);
    if (!summary.children.length) {
      el('div', 'vista-folder vista-folder-left', summary);
      const info = el('div', 'vista-summary-info', summary);
      el('div', 'vista-folder-name', info);
      el('div', 'vista-folder-kind', info, 'File Folder');
      el('div', 'vista-folder-date', info, 'Date modified:   Mar 2, 2007  3:24 PM');
      el('div', 'vista-folder-size', info, 'Size: 0 bytes');
      el('div', 'vista-folder vista-folder-right', summary);
    }
    summary.querySelector('.vista-folder-name').textContent = name;
    const commands = ensure('vista-commands', win);
    if (!commands.children.length) {
      for (const [icon, text] of [['', 'Organize ▾'], ['▦', 'Views ▾'], ['▱', 'Open'], ['◉', 'Burn']]) {
        const command = el('span', 'vista-command', commands);
        if (icon) el('span', 'vista-command-icon', command, icon);
        el('span', '', command, text);
      }
    }
    const main = win.querySelector('.fm-main');
    if (main && !main.querySelector('.vista-columns')) {
      const header = el('div', 'vista-columns', main);
      for (const text of ['Name', 'Date modified', 'Type', 'Size']) el('span', '', header, text);
      main.prepend(header);
    }
    tiles.forEach(tile => {
      const meta = metadata(label(tile));
      tile.dataset.vistaExt = meta.ext;
      tile.dataset.vistaKind = meta.ext ? 'file' : 'folder';
      const icon = tile.querySelector('.ic');
      if (icon) icon.dataset.badge = ({docx:'W',doc:'W',xlsx:'X',xls:'X',pptx:'P',ppt:'P',pdf:'PDF',rtf:'R'})[meta.ext] || (meta.ext ? meta.ext.toUpperCase().slice(0, 3) : '');
      for (const [cls, value] of [['vista-modified',meta.date],['vista-type',meta.type],['vista-size',meta.size]]) {
        ensure(cls, tile, 'span').textContent = value;
      }
    });
    rows.forEach(row => {
      row.classList.toggle('vista-current', label(row) === name);
      const icons = [...row.querySelectorAll('svg')];
      icons.forEach((icon, i) => { icon.dataset.vistaGlyph = icons.length > 1 && i === 0 ? 'toggle' : 'folder'; });
    });
    let search = win.querySelector('.vista-search');
    if (!search) search = el('div', 'vista-search', win.querySelector('.fm-bar'));
    search.textContent = 'Search ' + name;
    const related = ensure('vista-related', win);
    if (!related.children.length) {
      el('div', 'vista-related-title', related, 'Related Items');
      const header = el('div', 'vista-related-columns', related);
      for (const text of ['Name','Date modified','Type','Size']) el('span', '', header, text);
      el('div', 'vista-related-list', related);
    }
    const list = related.querySelector('.vista-related-list');
    list.replaceChildren();
    const sources = rows.filter(row => label(row) && !crumbs.includes(label(row))).slice(0, 3);
    const documentTile = tiles.find(tile => metadata(label(tile)).ext);
    if (documentTile) sources.push(documentTile);
    sources.forEach(source => {
      const text = label(source), meta = metadata(text);
      const row = el('div', 'vista-related-row', list);
      row.dataset.vistaExt = meta.ext;
      const item = el('span', 'vista-related-name', row);
      el('span', meta.ext ? 'vista-small-document' : 'vista-small-folder', item);
      el('span', '', item, text);
      el('span', '', row, meta.date);
      el('span', '', row, meta.type);
      el('span', 'vista-size', row, meta.size);
      row.addEventListener('click', () => { list.querySelectorAll('.vista-related-row').forEach(n => n.classList.toggle('vista-picked', n === row)); });
      row.addEventListener('dblclick', () => source.classList.contains('fm-tr') ? source.click() : source.dispatchEvent(new MouseEvent('dblclick', { bubbles: true })));
    });
    const scrollbar = (host, source, cls) => {
      if (!host || !source || host.querySelector('.' + cls)) return;
      const bar = el('div', 'vista-scrollbar ' + cls, host);
      const up = el('button', 'vista-scroll-arrow', bar, '▴');
      const track = el('div', 'vista-scroll-track', bar);
      const thumb = el('div', 'vista-scroll-thumb', track);
      const down = el('button', 'vista-scroll-arrow', bar, '▾');
      up.type = down.type = 'button';
      up.setAttribute('aria-label', 'Scroll up'); down.setAttribute('aria-label', 'Scroll down');
      const sync = () => {
        const max = Math.max(0, source.scrollHeight - source.clientHeight);
        const height = Math.max(24, track.clientHeight * (max ? source.clientHeight / source.scrollHeight : 0.72));
        thumb.style.height = Math.min(height, track.clientHeight) + 'px';
        thumb.style.top = (max ? source.scrollTop / max * (track.clientHeight - height) : 0) + 'px';
      };
      up.addEventListener('click', () => { source.scrollTop -= 34; });
      down.addEventListener('click', () => { source.scrollTop += 34; });
      source.addEventListener('scroll', sync);
      let origin = null;
      thumb.addEventListener('pointerdown', e => { origin = { y: e.clientY, scroll: source.scrollTop }; thumb.setPointerCapture(e.pointerId); e.preventDefault(); });
      thumb.addEventListener('pointermove', e => {
        if (!origin) return;
        const travel = track.clientHeight - thumb.clientHeight;
        if (travel > 0) source.scrollTop = origin.scroll + (e.clientY - origin.y) / travel * (source.scrollHeight - source.clientHeight);
      });
      thumb.addEventListener('pointerup', () => { origin = null; });
      thumb.addEventListener('pointercancel', () => { origin = null; });
      track.addEventListener('pointerdown', e => {
        if (e.target !== track) return;
        const delta = e.clientY < thumb.getBoundingClientRect().top ? -source.clientHeight : source.clientHeight;
        source.scrollTop += delta;
      });
      sync();
    };
    scrollbar(main, win.querySelector('.fm-pane'), 'vista-main-scroll');
    scrollbar(related, list, 'vista-related-scroll');
  }

  env.site({
    name: 'design-use-file-manager-navigate-05',
    template: 'site/base',
    design: {
      parts: {
        overlay: (base) => function (ctx) {
          const result = base(ctx);
          if (ctx.kind === 'banner') {
            result.el.classList.add('vista-fixed-banner');
            const header = document.querySelector('.ref-task');
            result.el.style.top = Math.max(34, header?.getBoundingClientRect().bottom || 0) + 'px';
          }
          return result;
        },
        endLabel: (base) => function (rng, content) {
          const label = base(rng, content);
          return rng.fork('vista/end-label').bool(0.5) ? 'Done' : label;
        },
        'frame.placement': (base) => function (c) {
          base(c);
          if (c.placement === 'floating') c.placement = 'header';
        },
        'frame.end': (base) => function (c) {
          const result = base(c);
          document.body.dataset.vistaDisplay = c.display;
          const text = document.querySelector('.ref-foot-text');
          if (text) text.textContent = '';
          const foot = document.querySelector('.ref-foot');
          if (foot && !foot.querySelector('button, a')) foot.remove();
          const widget = env.widgetDef;
          if (widget && !decoratedWidgets.has(widget)) {
            const render = widget.render;
            widget.render = function (ctx) {
              const rendered = render.call(this, ctx);
              decorateExplorer(ctx.stage, ctx.util || c.util);
              return rendered;
            };
            decoratedWidgets.add(widget);
          }
          return result;
        },
      },
    },
  });
})();
