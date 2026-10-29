(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-spatial-04',
    'task': 'read-figure',
    'scenario': 'spatial',
    'style': 'electron',
    'title': 'Picture Catalog',
    'menu': 'File    Edit    View    Picture    Tools    Help',
    'note': '',
    'layout': 'catalog',
    'subtitle': '',
    'aside':
      'Quick Notes:\n\n1. Count the blocks in each group.\n2. Add the two numbers.\n3. Type the total into the textbox.',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util,
        endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide');
      let display = ctx.display || 'header';
      if (window.innerWidth < 1100 && (display === 'panel' || display === 'toast')) display = 'header';
      document.body.className =
        C.style +
        ' ' +
        C.layout +
        ' instruction-' +
        (display === 'panel' ? 'header' : display) +
        (ctx.finish ? ' finish-mode' : '');
      const app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      if (['mint', 'qt', 'dark', 'electron', 'motif', 'human', 'beos', 'gtk', 'eink'].includes(C.style)) {
        const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
        u.svg(
          'rect',
          {
            x: 3,
            y: 2,
            width: 20,
            height: 22,
            rx: C.style === 'mint' ? 0 : 3,
            fill:
              C.style === 'mint'
                ? 'none'
                : C.style === 'dark'
                  ? '#8266ce'
                  : C.style === 'electron'
                    ? '#ee8520'
                    : '#d7e2e8',
            stroke: 'currentColor',
            'stroke-width': 1.5,
          },
          icon,
        );
        u.svg(
          'path',
          {
            d: C.layout === 'catalog' ? 'M4 18l6-8 4 5 3-7 6 10H4z' : 'M7 7h12M7 11h12M7 15h12M7 19h9',
            fill: C.layout === 'catalog' ? '#67a148' : 'none',
            stroke: C.layout === 'catalog' ? '#fff' : 'currentColor',
            'stroke-width': 1.5,
          },
          icon,
        );
      }
      u.el('span', '', top, C.title);
      if (['qt', 'dark', 'electron', 'motif', 'human', 'gtk', 'eink'].includes(C.style)) {
        const wc = u.el('div', 'native-window-controls', top);
        for (const kind of ['min', 'max', 'close']) {
          const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
          u.svg(
            'path',
            {
              d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16',
              fill: 'none',
              stroke: 'currentColor',
              'stroke-width': 1.5,
            },
            svg,
          );
        }
      }
      if (C.subtitle) u.el('small', '', top, C.subtitle);
      const menu = C.menu ? u.el('nav', 'menu', top, C.menu) : null;
      const toolbar = u.el('nav', 'xp-toolbar', app);
      for (const item of [
        ['New Folder', '#e2a51b', 'M3 11h30v19H3z M3 11V6h12l4 5', 'folder'],
        ['Add Pictures', '#45a844', 'M7 3h17l7 7v22H7z M24 3v8h7 M17 16v11 M11.5 21.5h11', 'add'],
        ['View', '#91a8b9', 'M14 4a10 10 0 100 20 10 10 0 000-20 M21 21l10 10', 'view'],
        ['Slideshow', '#3682cb', 'M3 5h29v23H3z M12 33h11 M17 28v5 M14 12l10 5-10 6z', 'slide'],
        ['Rotate Left', '#2b9a48', 'M9 13H3l7-8 M4 13a13 13 0 102-5', 'rotate'],
        ['Rotate Right', '#2b9a48', 'M27 13h6l-7-8 M32 13a13 13 0 11-2-5', 'rotate'],
        ['Delete', '#e52620', 'M6 6l24 24 M30 6L6 30', 'delete'],
        ['Properties', '#5186bf', 'M4 4h28v28H4z M9 9h7v7H9z M20 10h8 M20 14h8 M9 22h19 M9 26h19', 'props'],
      ]) {
        const b = u.el('button', 'xp-tool', toolbar);
        const svg = u.svg('svg', { viewBox: '0 0 36 36', class: 'xp-tool-icon ' + item[3] }, b);
        u.svg(
          'path',
          {
            d: item[2],
            fill: item[3] === 'folder' ? '#ffca36' : 'none',
            stroke: item[1],
            'stroke-width': item[3] === 'delete' ? 3.4 : item[3] === 'view' ? 2.8 : 2.2,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          },
          svg,
        );
        u.el('span', '', b, item[0]);
      }
      const folders = u.el('nav', 'folder-pane', app);
      u.el('div', 'folder-heading', folders, 'Folders');
      const root = u.el('div', 'folder-row root-row', folders);
      u.el('i', 'tree-toggle', root, '−');
      u.el('i', 'tree-folder', root);
      u.el('span', '', root, 'My Pictures');
      for (const name of ['Animals', 'Holidays', 'Nature', 'People', 'Sample Pictures']) {
        const row = u.el('div', 'folder-row child-row' + (name === 'Animals' ? ' active' : ''), folders);
        u.el('i', 'tree-folder', row);
        u.el('span', '', row, name);
      }
      const center = u.el('div', 'center', app);
      const band = u.el('section', 'catalog-band', center);
      const preview = u.el('div', 'catalog-preview', band);
      const photo = u.el('img', 'catalog-photo', preview);
      photo.src = 'sites/design-read-figure-spatial-04/assets/alpine-lake.webp';
      const summary = u.el('div', 'catalog-summary', band);
      u.el('h1', '', summary, 'Animals');
      u.el('p', '', summary, '6 pictures');
      u.el('p', '', summary, 'Size:  4.8 MB');
      u.el('p', '', summary, 'Type:  File Folder');
      u.el('p', '', summary, 'Date Modified:  Apr 12, 2003  10:24 AM');
      const collage = u.el('div', 'catalog-collage', band);
      for (let i = 0; i < 3; i++) {
        const print = u.el('div', 'catalog-print print-' + i, collage);
        const image = u.el('img', '', print);
        image.src = 'sites/design-read-figure-spatial-04/assets/alpine-lake.webp';
      }
      u.el('div', 'catalog-camera', collage);
      let brief = null;
      if (display === 'header' || display === 'panel') brief = u.el('div', 'brief', center, ctx.instruction);
      const stage = u.el('section', 'stage', center),
        aside = u.el('aside', 'aside', document.body);
      if (display === 'panel') {
        u.el('b', 'episode-title', aside, 'Task instructions');
        u.el('p', 'episode-instruction', aside, ctx.instruction);
      }
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, C.aside);
      const footer = u.el('footer', 'bottom', app);
      u.el('span', 'catalog-count', footer, '6 pictures');
      const viewTools = u.el('div', 'catalog-view-tools', footer);
      u.el('span', 'view-grid', viewTools, '▦');
      u.el('span', 'view-list', viewTools, '▤');
      u.el('span', 'zoom-label', viewTools, '−');
      u.el('span', 'zoom-track', viewTools, '━━●━━━━━━');
      u.el('span', 'zoom-label', viewTools, '+');
      let submit = null;
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const submitWord = labels.map(labelOf).find((x) => x.toLowerCase() === 'submit') || labelOf(labels[0]);
      const original = endRng.bool(0.5),
        placement = original ? 'footer' : endRng.pick(['icon', 'toolbar']),
        label = original ? submitWord : labelOf(endRng.pick(labels));
      const endButton = (parent, cls, text, action) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.setAttribute('aria-label', text);
        b.title = text;
        b.addEventListener('click', action);
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'footer') submit = endButton(footer, 'submit', label, ctx.submit);
        else if (placement === 'icon') {
          submit = endButton(footer, 'episode-icon', '✓', ctx.submit);
          submit.title = label;
          submit.setAttribute('aria-label', label);
        } else submit = endButton(top, 'episode-toolbar', label, ctx.submit);
        if (collideRng.bool(0.3)) {
          const pool = [
            ...new Set(labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
          ];
          if (pool.length) {
            const text = labelOf(collideRng.pick(pool));
            endButton(footer, 'episode-xtra', text, () => env.log('decoy', { label: text, collide: true }));
          }
        }
      }
      if (display === 'toast') {
        const toast = u.el('div', 'episode-toast', document.body);
        u.el('b', '', toast, 'Task note');
        u.el('p', '', toast, ctx.instruction);
      }
      if (ctx.finish) footer.remove();
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
