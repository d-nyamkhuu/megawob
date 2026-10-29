(function () {
  'use strict';
  // Static display lettering: narrow, heavy geometric caps from the reference.
  // These are frame labels only; all task copy remains the seeded instruction.
  const glyphs = {
    F: [24, 'M0 0H24V14H14V42H22V56H14V100H0Z'],
    E: [24, 'M0 0H24V14H14V42H22V56H14V86H24V100H0Z'],
    D: [34, 'M0 0H18Q34 0 34 17V83Q34 100 18 100H0ZM15 14V86H16Q19 86 19 81V19Q19 14 16 14Z'],
    I: [14, 'M0 0H14V100H0Z'],
    T: [28, 'M0 0H28V14H21V100H7V14H0Z'],
    L: [24, 'M0 0H14V86H24V100H0Z'],
    N: [32, 'M0 0H13L22 56V0H32V100H19L10 44V100H0Z'],
    O: [
      32,
      'M16 0Q32 0 32 17V83Q32 100 16 100Q0 100 0 83V17Q0 0 16 0ZM16 13Q12 13 12 18V82Q12 87 16 87Q20 87 20 82V18Q20 13 16 13Z',
    ],
    P: [31, 'M0 0H16Q31 0 31 15V40Q31 55 16 55H13V100H0ZM13 13V42H16Q19 42 19 37V18Q19 13 16 13Z'],
    R: [32, 'M0 0H16Q31 0 31 15V39Q31 49 23 52L33 100H19L11 56V100H0ZM12 13V42H16Q19 42 19 37V18Q19 13 16 13Z'],
    U: [32, 'M0 0H12V82Q12 87 16 87Q20 87 20 82V0H32V83Q32 100 16 100Q0 100 0 83Z'],
    G: [
      32,
      'M16 0Q32 0 32 17V30H20V18Q20 13 16 13Q12 13 12 18V82Q12 87 16 87Q20 87 20 82V60H15V47H32V100H24L22 94Q18 100 12 100Q0 100 0 84V17Q0 0 16 0Z',
    ],
    C: [
      32,
      'M16 0Q32 0 32 17V32H20V18Q20 13 16 13Q12 13 12 18V82Q12 87 16 87Q20 87 20 82V68H32V83Q32 100 16 100Q0 100 0 83V17Q0 0 16 0Z',
    ],
    S: [
      32,
      'M16 0Q32 0 32 17V29H20V18Q20 13 16 13Q12 13 12 18V33Q12 37 18 42L25 48Q32 54 32 64V83Q32 100 16 100Q0 100 0 83V69H12V82Q12 87 16 87Q20 87 20 82V67Q20 63 14 58L7 52Q0 46 0 36V17Q0 0 16 0Z',
    ],
    W: [46, 'M0 0H12L16 69L20 0H29L33 69L37 0H49L40 100H28L24 47L20 100H8Z'],
    K: [33, 'M0 0H13V43L21 0H34L23 49L35 100H21L13 56V100H0Z'],
  };
  function lettering(parent, label) {
    let x = 0;
    const parts = [];
    for (const ch of label) {
      if (ch === ' ') {
        x += 12;
        continue;
      }
      const [w, d] = glyphs[ch];
      parts.push('<path transform="translate(' + x + ' 0)" d="' + d + '"/>');
      x += w + 3;
    }
    parent.textContent = '';
    parent.setAttribute('aria-label', label);
    parent.innerHTML =
      '<svg class="display-svg" viewBox="0 0 ' +
      (x - 3) +
      ' 100" preserveAspectRatio="none" aria-hidden="true" fill="currentColor" fill-rule="evenodd">' +
      parts.join('') +
      '</svg>';
  }
  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { rng, util, content } = ctx;
      const root = document.documentElement;
      for (const [key, value] of Object.entries(S.THEMES.light)) root.style.setProperty('--' + key, value);
      root.dataset.theme = 'light';
      Object.assign(_c, { rng, util, content, root });
    },
    'frame.layout': (base) => function (_c) {
      base(_c);
      document.body.className = 'rail instruction-' + _c.display;
    },
    'frame.header': () => function (_c) {
      const { util } = _c;
      const shell = util.el('div', 'site-shell', document.body);
      const body = util.el('div', 'design-body ref-body', shell);
      const header = util.el('header', 'task-note', body);
      header.dataset.role = 'instruction';
      Object.assign(_c, { shell, body, header });
    },
    // The widget supplies the feed tabs; the rail supplies the frame navigation.
    'frame.nav': () => () => {},
    'frame.instruction': (base) => function (_c) {
      base(_c);
      const instruction = _c.header.querySelector('.ref-instruction');
      if (instruction) {
        const p = _c.util.el('p', '', _c.header);
        p.append(...instruction.childNodes);
        instruction.replaceWith(p);
        p.textContent = '';
        for (const part of _c.ctx.instruction.split(/(@[\w]+)/)) {
          _c.util.el('span', part.startsWith('@') ? 'task-handle' : '', p, part);
        }
      } else if (_c.display !== 'panel') _c.header.classList.add('empty-note');
    },
    'frame.tools': (base) => function (_c) {
      base(_c);
      _c.headerTools.classList.add('chrome-tools');
    },
    'frame.body': () => function (_c) {
      const { util: u, body } = _c;
      const rail = u.el('nav', 'kinetic-rail', body);
      u.el('div', 'rl-logo', rail).innerHTML =
        '<svg viewBox="0 0 36 48" fill="none"><path d="M9 39V9l18 30V9" stroke="white" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      const IC = {
        Home: '<path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z"/>',
        Search: '<circle cx="11" cy="11" r="7"/><path d="M16 16l5 5"/>',
        Alerts: '<path d="M6 17V11a6 6 0 0112 0v6l2 2H4z"/><path d="M10 21h4"/>',
        Messages: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
        Saved: '<path d="M6 3h12v18l-6-5-6 5z"/>',
        People:
          '<circle cx="9" cy="8" r="4"/><path d="M2 21c0-5 3-7 7-7s7 2 7 7"/><path d="M16 4a4 4 0 010 8M18 15c3 1 4 3 4 6"/>',
        More: '<circle cx="12" cy="12" r="9"/><path d="M8 12h.01M12 12h.01M16 12h.01"/>',
      };
      for (const icon of ['Home', 'Search', 'Alerts', 'Messages', 'Saved', 'People', 'More']) {
        const s = u.el('span', 'rl' + (icon === 'Home' ? ' on' : ''), rail);
        s.setAttribute('aria-label', icon);
        s.innerHTML = '<svg viewBox="0 0 24 24">' + IC[icon] + '</svg>';
      }
      u.el('div', 'rail-user', rail, 'JS');
      const trends = u.el('aside', 'kinetic-trends', body);
      u.el('div', 'tr-search', trends, 'Search posts, people, topics...');
      const trendCard = u.el('section', 'trend-card', trends);
      const th = u.el('h2', '', trendCard);
      lettering(u.el('span', 'display-heading', th), 'TRENDING');
      u.el('span', 'tr-all', th, 'See all');
      let ti = 0;
      for (const item of ['AI tools', 'Better habits', 'Clean energy', 'Remote work', 'Product design']) {
        const p = u.el('p', 'tr-row', trendCard, ++ti + '     ' + item);
        u.el('span', '', p, ['125K', '98K', '72K', '64K', '41K'][ti - 1] + ' posts');
      }
      const peopleCard = u.el('section', 'people-card', trends);
      const sh = u.el('h2', '', peopleCard);
      lettering(u.el('span', 'display-heading', sh), 'SUGGESTED PEOPLE');
      u.el('span', 'tr-all', sh, 'See all');
      for (const [i, person] of ['Maya Chen', 'Ravi Desai', 'Elena Cruz'].entries()) {
        const row = u.el('div', 'person-row', peopleCard);
        u.el('div', 'person-avatar avatar-' + i, row);
        const info = u.el('div', 'person-info', row);
        u.el('b', '', info, person);
        u.el('span', '', info, ['@mayachen', '@ravid', '@elenacruz'][i]);
        u.el('span', 'person-follow', row, 'Follow');
      }
      Object.assign(_c, { trends });
    },
    'frame.panel': (base) => function (_c) {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('task-note', 'instruction-card');
        panel.dataset.role = 'instruction';
        _c.trends.prepend(panel);
        document.body.classList.add('panel-card');
      }
    },
    'frame.stage': () => function (_c) {
      const { util, body } = _c;
      const stage = util.el('main', 'stage', body);
      lettering(util.el('h1', 'kinetic-title', body), 'FEED');
      Object.assign(_c, { stage });
    },
    'frame.end': (base) => function (_c) {
      const { header, headerTools, placement, submit } = _c;
      if (placement) document.body.classList.add('end-' + placement);
      document.querySelectorAll('.ref-foot').forEach((foot) => foot.classList.add('design-footer'));
      document.querySelectorAll('.ref-foot-text').forEach((text) => text.classList.add('footer-label'));
      document.querySelectorAll('[data-role="submit"]').forEach((button) => {
        button.classList.add('end-control');
        if (button.classList.contains('ref-endlink')) button.classList.add('end-link');
      });
      document.querySelectorAll('.ref-xtra').forEach((button) => button.classList.add('chrome-xtra'));
      const instruction = header.querySelector('p');
      if (instruction) {
        const available = Math.max(100, header.clientWidth - headerTools.getBoundingClientRect().width - 80);
        instruction.style.setProperty('--instruction-condense', String(Math.min(0.46, available / instruction.scrollWidth)));
        if (_c.ctx.instruction.length > 120) {
          header.classList.add('instruction-wrapped');
          instruction.style.width = available / 0.55 + 'px';
        }
      }
      // Preserve the widget's geometry hook even when the end control lives elsewhere.
      if (submit && submit.parentElement === headerTools) headerTools.classList.add('has-end-control');
      return base(_c);
    },
    overlay: (base) => function (ctx) {
      if (ctx.kind !== 'cookie') return base(ctx);
      const u = ctx.util;
      const el = u.el('section', 'reference-overlay cookie', document.body);
      el.dataset.role = 'overlay';
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', 'We use cookies');
      const heading = u.el('h2', '', el);
      u.el('span', 'cookie-icon', heading).innerHTML =
        '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="5"><path d="M43 6C22 4 5 22 5 42C5 61 21 77 40 77C61 77 77 61 77 40C68 42 60 36 61 29C52 29 46 23 47 16C43 15 41 11 43 6Z"/><g fill="currentColor" stroke="none"><circle cx="24" cy="40" r="4"/><circle cx="40" cy="23" r="4"/><circle cx="40" cy="56" r="4"/><circle cx="55" cy="45" r="4"/></g></svg>';
      lettering(u.el('span', 'overlay-title', heading), 'WE USE COOKIES');
      u.el('div', 'overlay-copy', el, 'We use optional cookies to improve your experience, analyze traffic and show more relevant content.');
      u.el('div', 'overlay-preferences', el, 'You can change your preferences at any time in Settings.');
      const actions = u.el('div', 'overlay-actions', el);
      const accept = u.el('button', '', actions, 'Accept all');
      accept.type = 'button';
      accept.addEventListener('click', () => ctx.dismiss('accept'));
      const dismiss = u.el('button', 'primary', actions, 'Reject optional');
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss('reject'));
      return { el, dismiss };
    },
  };

  env.site({
    name: 'design-use-social-feed-menu-11',
    template: 'site/base',
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'frame-support.css', 'site.css'],
    langs: ['en'],
    initialOverlay: { kind: 'cookie' },
    design: {
      THEMES: {
        light: {
          bg: '#eef1f5', panel: '#ffffff', fg: '#0d1626', accent: '#2464ff',
          font: 'Impact,Arial Narrow,sans-serif', line: '#c8cdd5', muted: '#5f6a78',
        },
      },
      parts,
    },
  });
})();
