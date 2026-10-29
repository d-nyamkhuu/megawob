(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-shape-06',
    'task': 'read-figure',
    'scenario': 'shape',
    'style': 'nbook',
    'title': 'Notebook',
    'layout': 'stagger',
    'note': 'Properties',
  };
  const ICON = {
    select: '<path d="M5 3l0 15 4-4 3 7 3-1-3-7 6 0z" fill="#111"/>',
    rect: '<rect x="4" y="5" width="16" height="14" fill="none" stroke="#333" stroke-width="1.6"/>',
    circle: '<circle cx="12" cy="12" r="9" fill="none" stroke="#333" stroke-width="1.6"/>',
    line: '<path d="M5 20L20 4" stroke="#333" stroke-width="1.6"/>',
    text: '<path d="M4 4h16M12 4v17M8 21h8M4 4v4M20 4v4" fill="none" stroke="#333" stroke-width="1.6"/>',
    zoom: '<circle cx="10" cy="10" r="7" fill="none" stroke="#333" stroke-width="1.6"/><path d="M15 15l6 6" stroke="#333" stroke-width="1.8"/>',
    fit: '<path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5" fill="none" stroke="#333" stroke-width="1.8"/>',
    eye: '<path d="M2 12c3-5 7-7 10-7s7 2 10 7c-3 5-7 7-10 7s-7-2-10-7z" fill="none" stroke="#333" stroke-width="1.6"/><circle cx="12" cy="12" r="3" fill="#333"/>',
    eyeoff:
      '<path d="M2 12c3-5 7-7 10-7s7 2 10 7c-3 5-7 7-10 7s-7-2-10-7z" fill="none" stroke="#333" stroke-width="1.6"/><circle cx="12" cy="12" r="3" fill="#333"/><path d="M3 21L21 3" stroke="#333" stroke-width="1.8"/>',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      let display = ctx.display;
      if ((display === 'panel' && window.innerWidth < 1260) || (display === 'toast' && window.innerHeight < 700))
        display = 'header';
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      const ic = (p, k) => {
        const s = u.el('span', 'nb-ic nb-ic-' + k, p);
        s.innerHTML = '<svg width="36" height="36" viewBox="0 0 24 24">' + ICON[k] + '</svg>';
        return s;
      };
      const logo = u.el('span', 'nb-logo', top);
      logo.innerHTML =
        '<svg width="20" height="22" viewBox="0 0 20 22"><rect x="2" y="1" width="16" height="20" rx="2" fill="#ff914b" stroke="#ffbc8e"/><path d="M5 3v16M7 3v16M9 3v16M11 3v16M13 3v16M15 3v16" stroke="#ffd0aa" stroke-width=".65"/></svg>';
      u.el('span', '', top, C.title).className = 'nb-title';
      const menu = u.el('nav', 'nb-menu', top);
      ['File', 'Edit', 'View', 'Help'].forEach((m) => u.el('span', '', menu, m));
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 22, height: 22, viewBox: '0 0 20 20' }, wc);
        u.svg(
          'path',
          {
            d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': 1.6,
          },
          svg,
        );
      }
      const mid = u.el('div', 'nb-mid', app);
      const left = u.el('aside', 'nb-left', mid);
      u.el('h4', '', left, 'Tools');
      [
        ['select', 'Select', 1],
        ['rect', 'Rectangle'],
        ['circle', 'Circle'],
        ['line', 'Line'],
        ['text', 'Text'],
      ].forEach((t) => {
        const r = u.el('div', 'nb-item' + (t[2] ? ' on' : ''), left);
        ic(r, t[0]);
        u.el('span', '', r, t[1]);
      });
      u.el('hr', '', left);
      u.el('h4', '', left, 'View');
      [
        ['zoom', 'Zoom In'],
        ['zoom', 'Zoom Out'],
        ['fit', 'Fit'],
      ].forEach((t) => {
        const r = u.el('div', 'nb-item', left);
        ic(r, t[0]);
        u.el('span', '', r, t[1]);
      });
      const center = u.el('div', 'center', mid),
        brief = u.el('div', 'brief', center, display === 'header' ? ctx.instruction : '');
      const stage = u.el('section', 'stage', center);
      const right = u.el('aside', 'nb-right', mid);
      if (display === 'panel') {
        const task = u.el('section', 'nb-task-note', right);
        u.el('h4', '', task, 'Task');
        u.el('div', '', task, ctx.instruction);
      }
      u.el('h4', '', right, 'Properties');
      ['Type', 'Color', 'Size', 'Position'].forEach((k) => {
        const r = u.el('div', 'nb-prop', right);
        u.el('span', '', r, k);
        u.el('span', '', r, '—');
      });
      u.el('hr', '', right);
      u.el('h4', '', right, 'Layers');
      [
        ['eye', 'Layer 1', 1],
        ['eyeoff', 'Layer 2'],
      ].forEach((t) => {
        const r = u.el('div', 'nb-item' + (t[2] ? ' on' : ''), right);
        ic(r, t[0]);
        u.el('span', '', r, t[1]);
      });
      if (display === 'toast') {
        const note = u.el('div', 'nb-toast', center, ctx.instruction);
        note.setAttribute('role', 'status');
      }
      const endR = ctx.rng.fork('chrome/end'),
        endLabels = ctx.content && ctx.content.END_LABELS;
      const labels =
        endLabels && endLabels.length
          ? endLabels
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelText = (x) => (typeof x === 'string' ? x : x.label || x.text || String(x));
      const submitDefault = labels.find((x) => labelText(x).toLowerCase() === 'submit') || labels[0];
      const otherLabels = labels.filter((x) => labelText(x).toLowerCase() !== labelText(submitDefault).toLowerCase());
      const labelValue = endR.bool(0.5) || !otherLabels.length ? submitDefault : endR.pick(otherLabels),
        label = labelText(labelValue);
      const placementRoll = endR.bool(0.5),
        placement = labelValue === submitDefault || placementRoll ? 'footer' : endR.bool(0.6) ? 'header' : 'link';
      const collideR = ctx.rng.fork('chrome/collide');
      let collision = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const choices = labels
          .map((x) => (typeof x === 'string' ? x : x.label || x.text || String(x)))
          .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (choices.length) collision = { label: collideR.pick(choices), where: collideR.pick(['header', 'footer']) };
      }
      const addDecoy = (parent, text) => {
        const b = u.el('button', 'nb-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      const makeEnd = (parent, cls, text) => {
        const b = u.el(placement === 'link' && cls === 'nb-end-link' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'A') b.href = '#';
        else b.type = 'button';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const footer = u.el('footer', 'bottom', app);
      u.el('span', 'nb-count', footer, 'Items: —');
      u.el('button', 'nb-btn', footer, 'Clear').type = 'button';
      u.el('button', 'nb-btn', footer, 'Reset').type = 'button';
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'header') {
          const tools = u.el('div', 'nb-top-actions', top);
          if (collision && collision.where === 'header') addDecoy(tools, collision.label);
          submit = makeEnd(tools, 'nb-end-header', label);
        } else if (collision && collision.where === 'header') addDecoy(top, collision.label);
        if (collision && collision.where === 'footer') addDecoy(footer, collision.label);
        if (placement === 'footer') submit = makeEnd(footer, 'submit', label);
        else if (placement === 'link') submit = makeEnd(footer, 'nb-end-link', label + ' ›');
      }
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
