(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-listbox-06',
    'brand': 'Willow & Finch',
    'kicker': 'Your task',
    'sub': 'Use the list below to choose the colors. You can select more than one option.',
    'setTitle': 'Appearance Settings',
    'setSub': 'Choose accent colors for the workspace theme.',
  };
  const SPRIG =
    '<svg viewBox="34 9 42 44" width="40" height="44" preserveAspectRatio="none" aria-hidden="true"><image href="sites/' +
    C.site +
    '/assets/botanical-source.webp" width="1672" height="941"/></svg>';
  const PALETTE = {
    bg: '#f7f4ec', panel: '#fcfaf5', fg: '#11150f', muted: '#777978', line: '#dfd2b8',
  };

  // The shared instruction parts supply the text and display behavior; this card supplies its styling.
  function taskCard(card, util) {
    card.className = 'ds-header-note';
    const heading = card.querySelector('.ref-panel-title');
    if (heading) {
      heading.className = 'ds-kicker';
      heading.textContent = C.kicker;
    } else {
      const kicker = util.el('div', 'ds-kicker', null, C.kicker);
      card.prepend(kicker);
    }
    card.querySelector('.ref-instruction, .ref-panel-text').className = 'ds-instruction';
    util.el('div', 'ds-note', card, C.sub);
  }

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Both instruction cards fit above the settings, including at the smallest viewport.
      _c.display = _c.ctx.display;
    },
    'frame.header': () => (_c) => {
      const { util: u } = _c;
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const top = u.el('header', 'ds-top', document.body);
      const bl = u.el('span', 'ds-logo', top);
      bl.innerHTML = SPRIG;
      u.el('span', 'ds-brand', bl, C.brand);
      Object.assign(_c, { top, header: top });
    },
    'frame.nav': () => (_c) => {
      const { top, util: u } = _c;
      const nav = u.el('nav', 'ds-nav', top);
      ['Workspace', 'Settings', 'Help'].forEach((label) => {
        const item = u.el('span', '', nav, label);
        item.addEventListener('click', () => env.log('decoy', { label }));
      });
      u.el('span', 'ds-avatar', nav, 'JS');
      // The template's header tools belong beside this design's navigation.
      _c.header = nav;
    },
    'frame.instruction': (base) => (_c) => {
      if (_c.display !== 'header') return;
      const note = _c.util.el('section', 'ds-header-note');
      base({ ..._c, header: note });
      taskCard(note, _c.util);
      _c.note = note;
    },
    'frame.controls': (base) => (_c) => {
      base(_c);
      // Keep the template's events, accessible labels and finish behavior; add the existing CSS hooks.
      const { endBtn, decoyBtn } = _c;
      _c.endBtn = (parent, cls, text) => {
        const button = endBtn(parent, cls, text);
        button.classList.add('ds-submit');
        if (parent.closest('.ds-nav')) button.classList.add('ds-end-header');
        if (cls === 'ref-endlink') button.classList.add('ds-endlink');
        return button;
      };
      _c.decoyBtn = (parent, text, collides) => {
        decoyBtn(parent, text, collides);
        parent.lastElementChild.classList.add('ds-xtra');
      };
    },
    'frame.body': () => (_c) => {
      const { util: u, note } = _c;
      const body = u.el('div', 'ds-body ref-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const side = u.el('aside', 'ds-side', body);
      if (note) content.append(note);
      Object.assign(_c, { body, content, side });
    },
    'frame.panel': (base) => (_c) => {
      if (_c.display !== 'panel') return;
      base({ ..._c, body: _c.content });
      taskCard(_c.content.querySelector('.ref-panel'), _c.util);
    },
    'frame.stage': () => (_c) => {
      const { content, side, util: u } = _c;
      const set = u.el('section', 'ds-set', content);
      u.el('h1', '', set, C.setTitle);
      u.el('p', '', set, C.setSub);
      const row = u.el('div', 'ds-setrow', set);
      const stage = u.el('main', 'ds-stage', row);
      u.el('div', 'ds-vrule', row);
      const pv = u.el('div', 'ds-pvwrap', row);
      u.el('h3', '', pv, 'Theme Preview');
      const pc = u.el('div', 'ds-pv', pv);
      const ph = u.el('div', 'ds-pvhead', pc);
      u.el('span', 'ds-pvbrand', ph, C.brand);
      const pn = u.el('span', 'ds-pvnav', ph);
      ['Home', 'Projects', 'Settings'].forEach((t) => u.el('span', '', pn, t));
      const pb = u.el('div', 'ds-pvbody', pc);
      const img = u.el('div', 'ds-pvimg', pb);
      img.innerHTML =
        '<svg viewBox="667 620 279 240" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><defs><clipPath id="botanical-crop"><rect x="667" y="620" width="279" height="240"/></clipPath></defs><image clip-path="url(#botanical-crop)" href="sites/' +
        C.site +
        '/assets/botanical-source.webp" width="1672" height="941"/></svg>';
      const tx = u.el('div', 'ds-pvtext', pb);
      u.el('h2', '', tx, 'A calmer workspace');
      u.el('div', 'ds-gold', tx);
      u.el('p', '', tx, 'Thoughtful tools for brighter days.');
      // side zone
      u.el('h3', '', side, 'Progress');
      const bar = u.el('div', 'ds-bar', side);
      const fill = u.el('div', 'ds-barfill', bar);
      const cnt = u.el('div', 'ds-count', side, '');
      u.el('div', 'ds-hr', side);
      u.el('h3', '', side, 'Selected colors');
      const sel = u.el('div', 'ds-selbox', side);
      const spacer = u.el('div', 'ds-spacer', side);
      u.el('div', 'ds-hr', side);
      const clear = u.el('button', 'ds-clear', side, 'Clear selection');
      clear.type = 'button';
      clear.addEventListener('click', () => env.widgetDef.clear());
      // This progress rail is decorative, as in the original frame.
      u.el('em', '', sel, 'No colors selected yet.');
      cnt.textContent = '0 colors selected';
      fill.style.width = '10%';
      Object.assign(_c, { stage });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display !== 'toast') return;
      const note = document.querySelector('.ref-note');
      note.classList.add('ds-toast');
      note.querySelector('.ref-note-text').className = 'ds-instruction';
      _c.content.prepend(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.querySelector('.ref-foot');
      if (foot) {
        foot.className = 'ds-enddock';
        _c.side.append(foot);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) {
        dock.className = 'ds-enddock';
        _c.side.append(dock);
      }
    },
  };

  env.site({
    name: C.site,
    template: 'site/base',
    design: {
      THEMES: { willow: PALETTE },
      LOW_THEME: PALETTE,
      ACCENTS: ['#3a4430'],
      LOW_ACCENTS: ['#3a4430'],
      LANGS: ['en'],
      parts,
    },
  });
})();
