// select-text/base: the code editor renderer; S is the reference unit scope (including live selection state).
(function () {
  'use strict';
  function render(ctx, S) {
    const { ensureCodeStyle, THEMES, FONTS, FILES, bindSelection } = S;
    ensureCodeStyle();
    const { rng, util, size, spec } = ctx;
    const theme = THEMES[rng.pick(Object.keys(THEMES))];
    const font = rng.pick(FONTS);
    let fs = rng.int(14, 16);
    const lh = rng.pick([1.45, 1.55, 1.65]);
    let cols = rng.int(54, 82);
    const hang = rng.bool(0.4);
    const file = spec.source === 'message' ? rng.pick(['message.eml', 'reply.txt', 'ticket-notes.txt', 'inbox.md']) : rng.pick(FILES);
    const others = rng.sample(FILES.filter((f) => f !== file), rng.int(0, 2));
    const tabsFirst = rng.int(0, others.length);

    const win = util.el('div', 'cd-win' + (hang ? ' hang' : ''), ctx.stage);
    win.style.margin = `${rng.int(2, 8)}px ${rng.int(6, 20)}px`;
    const vars = { bg: theme.bg, fg: theme.fg, dim: theme.dim, chrome: theme.chrome, edge: theme.edge,
      curline: theme.curline, sel: theme.sel, ruler: theme.ruler, accent: theme.accent,
      statusbg: theme.statusbg, statusfg: theme.statusfg };
    for (const [k, v] of Object.entries(vars)) win.style.setProperty(`--cd-${k}`, v);
    win.style.setProperty('--cd-font', font);
    win.style.setProperty('--cd-radius', rng.pick([4, 6, 8, 10]) + 'px');

    const title = util.el('div', 'cd-title', win);
    for (const c of theme.dots) util.el('span', 'cd-dot', title).style.background = c;
    util.el('span', 'cd-title-text', title, `${file} — ${rng.pick(['Editor', 'Notepad', 'TextPad', 'Scratch'])}`);
    const tabs = util.el('div', 'cd-tabs', win);
    const names = others.slice();
    names.splice(tabsFirst, 0, file);
    for (const n of names) {
      const t = util.el('div', 'cd-tab' + (n === file ? ' on' : ''), tabs);
      util.el('span', '', t, n);
      util.el('span', 'x', t, '✕');
    }

    const body = util.el('div', 'cd-body', win);
    const textEl = util.el('div', 'cd-text', body);
    textEl.dataset.role = 'text';
    const nLines = spec.paragraphs.length * 2 - 1;
    win.style.setProperty('--cd-gutter', `${String(nLines).length + 1}ch`);
    const segments = [];
    const lines = [];
    let base = 0;
    spec.paragraphs.forEach((ptext, i) => {
      if (i > 0) lines.push(util.el('div', 'cd-line', textEl));
      const line = util.el('div', 'cd-line', textEl);
      lines.push(line);
      const src = util.el('span', 'cd-src', line);
      const node = document.createTextNode(ptext);
      src.append(node);
      segments.push({ node, start: base });
      base += ptext.length + 2;
    });
    lines.forEach((line, i) => {
      const ln = util.el('span', 'cd-ln', null, String(i + 1));
      ln.dataset.skip = '';
      line.prepend(ln);
      if (!line.querySelector('.cd-src')) util.el('span', 'cd-src', line);
    });
    const cur = rng.int(0, nLines - 1);
    lines[cur].classList.add('cur');

    const status = util.el('div', 'cd-status', win);
    const pos = util.el('span', '', status);
    const selInfo = util.el('span', 'sel', status);
    util.el('span', 'grow', status);
    util.el('span', '', status, rng.pick(['Spaces: 4', 'Spaces: 2', 'Tab Size: 4']));
    util.el('span', '', status, 'UTF-8');
    util.el('span', '', status, 'Soft Wrap');
    util.el('span', '', status, file.endsWith('.md') ? 'Markdown' : 'Plain Text');

    const show = (m) => {
      const before = spec.doc.slice(0, m.end);
      const ln = before.split('\n').length;
      const col = m.end - (before.lastIndexOf('\n') + 1) + 1;
      pos.textContent = `Ln ${ln}, Col ${col}`;
      selInfo.textContent = m.end > m.start ? `(${m.end - m.start} selected)` : '';
    };
    show(ctx.model);

    // Fit: narrow the wrap column to the stage width, then shrink the type, then widen again.
    const fit = () => {
      win.style.setProperty('--cd-fs', fs + 'px');
      win.style.setProperty('--cd-lh', String(lh));
      win.style.setProperty('--cd-cols', String(cols));
    };
    fit();
    while (win.getBoundingClientRect().width > size.width - 88 && cols > 36) {
      cols--;
      fit();
    }
    while (win.getBoundingClientRect().height > size.height - 44 && fs > 11) {
      fs--;
      fit();
    }
    while (win.getBoundingClientRect().height > size.height - 44) {
      cols += 4;
      fit();
      if (win.getBoundingClientRect().width > size.width - 88) {
        cols -= 4;
        fit();
        break;
      }
    }

    // Freeze the window size so status bar text never resizes it.
    win.style.width = Math.ceil(win.getBoundingClientRect().width) + 'px';
    S.sel = bindSelection(ctx, textEl, segments, show);
    return {
      anchors: [win],
      sync(m) {
        show(m);
        S.sel.set(m);
      },
    };
  }
  env.template('select-text/_base-code', () => ({ render }));
})();
