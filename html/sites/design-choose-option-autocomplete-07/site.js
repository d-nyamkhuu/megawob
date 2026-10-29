// Travel frame design on the shared site template.
(function () {
  'use strict';

  const palette = {
    bg: '#f8faff', panel: '#ffffff', fg: '#0d1b3e', muted: '#6b7690', line: '#d3dae8',
  };

  function emphasizeQuotes(el, util) {
    const text = el.textContent;
    el.textContent = '';
    for (const part of text.split(/("[^"]*")/)) {
      if (part.startsWith('"')) util.el('span', 'ds-q', el, part);
      else el.append(part);
    }
  }

  env.site({
    name: 'design-choose-option-autocomplete-07',
    template: 'site/base',
    design: {
      THEMES: { travel: palette },
      LOW_THEME: palette,
      ACCENTS: ['#0a62ff'],
      LOW_ACCENTS: ['#0a62ff'],
      LANGS: ['en'],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          // Both instruction modes use the design's left brief, even at small sizes.
          _c.display = _c.ctx.display || 'header';
          document.body.classList.remove('ref-has-note');
        },
        'frame.placement': (base) => (_c) => {
          base(_c);
          // The travel form always has a footer, including in finish mode.
          _c.wantFooter = true;
        },
        'frame.header': () => (_c) => {
          const { util } = _c;
          const body = util.el('div', 'ds-body ref-body', document.body);
          const content = util.el('div', 'ds-content', body);
          const header = util.el('header', 'ds-nav', content);
          util.el('span', 'ds-brand', header, 'TRAVEL');
          const links = util.el('nav', 'ds-links', header);
          for (const text of ['Trips', 'Stays', 'Cars', 'Support']) util.el('span', '', links, text);
          const avatar = util.el('span', 'ds-avatar', header);
          avatar.innerHTML = '<svg viewBox="0 0 44 44" width="44" height="44"><circle cx="22" cy="18" r="7.5" fill="#70809a"/><path d="M8 44c0-10 6-15 14-15s14 5 14 15z" fill="#70809a"/></svg>';
          Object.assign(_c, { body, content, header });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          const { body, display, util } = _c;
          if (display !== 'header' && display !== 'panel') return;
          const brief = util.el('aside', 'ds-brief');
          body.prepend(brief);
          const kicker = util.el('div', 'ds-kicker', brief);
          util.el('span', '', kicker, 'TASK');
          util.el('i', '', kicker);
          base({ ..._c, header: brief, display: 'header' });
          const instruction = brief.querySelector('.ref-instruction');
          instruction.classList.add('ds-instruction');
          emphasizeQuotes(instruction, util);
          const details = util.el('div', 'ds-details', brief);
          util.el('div', 'ds-kicker', details, 'DETAILS');
          [
            ['Help', 'Type to search\navailable options.'],
            ['Field', ''],
            ['Current input', ''],
            ['Suggestions', 'Matching entries\nappear below the field.'],
          ].forEach(([label, text], i) => {
            const row = util.el('div', 'ds-drow', details);
            util.el('span', '', row, label);
            util.el('span', i === 1 ? 'ds-detail-field' : i === 2 ? 'ds-detail-input' : '', row, text);
          });
        },
        'frame.controls': (base) => (_c) => {
          base(_c);
          const endBtn = _c.endBtn;
          _c.endBtn = (parent, cls, text) => {
            const button = endBtn(parent, cls, text);
            button.classList.add(cls === 'ref-endlink' ? 'ds-endlink' : 'ds-submit');
            if (parent.closest('.ds-nav')) button.classList.add('ds-submit-head');
            return button;
          };
        },
        'frame.body': () => () => {},
        'frame.panel': () => () => {},
        'frame.stage': () => (_c) => {
          const { content, util } = _c;
          const hero = util.el('div', 'ds-hero', content);
          const title = util.el('h1', '', hero, 'PLAN A ');
          util.el('span', 'ds-blue', title, 'TRIP');
          util.el('p', '', hero, 'Find great places. Simple plans.');
          const stage = util.el('main', 'ds-stage', content);
          Object.assign(_c, { hero, stage });
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          if (_c.display !== 'toast') return;
          const note = document.querySelector('.ref-note');
          note.classList.add('ds-toast');
          _c.content.insertBefore(note, _c.hero);
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const foot = document.querySelector('.ref-foot');
          foot.classList.add('ds-footer');
          _c.content.append(foot);
          // Keep generic inert buttons out of the compact travel navigation.
          for (const button of _c.headerTools.querySelectorAll('.ref-xtra')) foot.append(button);
          const clear = _c.util.el('button', 'ds-clear', foot, 'Clear');
          clear.type = 'button';
          foot.append(foot.querySelector('.ref-tools'));
          _c.foot = foot;
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) _c.foot.append(dock);
        },
      },
    },
  });
})();
