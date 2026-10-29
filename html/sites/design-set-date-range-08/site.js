// Memphis trip-planner frame: visual sections on the shared site/base behavior.
(function () {
  'use strict';

  function calendarIcon(u, header) {
    const ic = u.el('div', 'ds-icon', header);
    ic.innerHTML = '<svg viewBox="0 0 48 48" width="62" height="62"><rect x="3" y="8" width="42" height="36" rx="6" fill="#fff" stroke="#1d1745" stroke-width="3.5"/><path d="M3 14a6 6 0 0 1 6-6h30a6 6 0 0 1 6 6v6H3z" fill="#ff6b5e" stroke="#1d1745" stroke-width="3.5"/><rect x="12" y="2" width="4" height="10" rx="2" fill="#1d1745"/><rect x="32" y="2" width="4" height="10" rx="2" fill="#1d1745"/><g fill="#7b6cf0"><rect x="9" y="26" width="8" height="6" rx="1"/><rect x="20" y="26" width="8" height="6" rx="1"/><rect x="31" y="26" width="8" height="6" rx="1"/><rect x="9" y="35" width="8" height="6" rx="1"/><rect x="20" y="35" width="8" height="6" rx="1"/><rect x="31" y="35" width="8" height="6" rx="1"/></g></svg>';
  }

  function heroText(text, instruction, u) {
    text.classList.add('ds-instruction');
    text.style.setProperty('--hero-size',
      4.1 * Math.min(1, 64 / Math.max(1, String(instruction).length)) + 'vw');
    text.replaceChildren();
    String(instruction).split(/([A-Z][a-z]+ \d{1,2}, \d{4})/).forEach((t, i) => {
      if (i % 2) u.el('span', 'ds-hot', text, t);
      else text.appendChild(document.createTextNode(t));
    });
  }

  const theme = { bg: '#fcf8ee', panel: '#ffffff', fg: '#0c0b28',
    muted: '#727792', line: '#dcdfea' };

  env.site({
    name: 'design-set-date-range-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { cream: theme }, LOW_THEME: theme,
      ACCENTS: ['#ff665f'], LOW_ACCENTS: ['#ff665f'],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          // Keep this design's existing compact instruction fallbacks.
          let display = _c.ctx.display || 'header';
          if ((display === 'panel' && _c.W < 1180) || (display === 'toast' && !_c.tall))
            display = 'header';
          _c.display = display;
          document.body.classList.toggle('ref-has-note', display === 'toast');
        },
        'frame.placement': (base) => (_c) => {
          base(_c);
          // Trip Details always has a footer for Clear Dates and shared end controls.
          _c.wantFooter = true;
        },
        'frame.header': () => (_c) => {
          const { util: u, display } = _c;
          const shell = u.el('div', 'ds-body', document.body);
          const content = u.el('div', 'ds-content', shell);
          const header = u.el('aside', 'ds-header-note', content);
          header.dataset.display = display;
          calendarIcon(u, header);
          u.el('div', 'ds-eyebrow', header, 'TRIP PLANNER');
          Object.assign(_c, { shell, contentArea: content, header });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          base(_c);
          const { ctx, header, util: u } = _c;
          const text = header.querySelector('.ref-instruction');
          if (text) {
            heroText(text, ctx.instruction, u);
            u.el('div', 'ds-sub', header, 'Select your pick-up and return dates in the calendar below.');
          }
          header.querySelector('.ref-spacer')?.remove();
          u.el('div', 'ds-scribble', header, 'Good\ntrips\nahead');
          u.el('div', 'ds-blob ds-blob-a', header);
          u.el('div', 'ds-blob ds-blob-b', header);
        },
        'frame.body': () => (_c) => {
          const { contentArea, shell, util: u } = _c;
          const main = u.el('div', 'ds-main ref-body', contentArea);
          const side = u.el('aside', 'ds-side', shell);
          u.el('h3', '', side, 'Trip Details');
          const car = u.el('div', 'ds-car', side);
          car.innerHTML = '<svg viewBox="0 0 40 28" width="46" height="32"><path d="M6 13l3-9q1-2 4-2h14q3 0 4 2l3 9q4 1 4 5v5H2v-5q0-4 4-5z" fill="#8769ff"/><rect x="5" y="21" width="6" height="7" rx="2" fill="#8769ff"/><rect x="29" y="21" width="6" height="7" rx="2" fill="#8769ff"/><circle cx="8" cy="18" r="2.5" fill="white"/><circle cx="32" cy="18" r="2.5" fill="white"/><path d="M11 12l2-5h14l2 5z" fill="#e9e5ff"/></svg>';
          u.el('span', '', car, 'Car Rental');
          Object.assign(_c, { main, side, body: side });
        },
        'frame.panel': (base) => (_c) => {
          base(_c);
          const { side, util: u } = _c;
          const panel = side.querySelector('.ref-panel');
          if (panel) panel.classList.add('ds-task-note');
          [
            ['Pick-up date', 'ds-v-start', 'Not selected'],
            ['Return date', 'ds-v-end', 'Not selected'],
            ['Trip length', 'ds-v-len', '—'],
          ].forEach(([k, c, v], i) => {
            const r = u.el('div', 'ds-fact' + (i === 0 ? ' first' : ''), side);
            const g = u.el('div', 'ds-gl', r);
            g.innerHTML =
              i < 2
                ? '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#1d1745" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 2v5M16 2v5"/></svg>'
                : '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#1d1745" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v6"/></svg>';
            const t = u.el('div', '', r);
            u.el('div', 'ds-k', t, k);
            u.el('div', 'ds-v ' + c, t, v);
          });
        },
        'frame.stage': () => (_c) => {
          const { util: u, main, contentArea } = _c;
          _c.stage = u.el('main', 'ds-stage', main);
          const zig = u.el('div', 'ds-zig', contentArea);
          zig.innerHTML =
            '<svg viewBox="0 0 155 60"><path d="M3 56L26 31L49 47L70 24L89 39L108 19L128 34L151 5" fill="none" stroke="#ff8b87" stroke-width="7"/></svg>';
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) {
            note.classList.add('ds-toast-note');
            _c.main.before(note);
          }
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const { side, util: u } = _c;
          const foot = document.querySelector('.ref-foot');
          foot.classList.add('ds-footer');
          side.append(foot);
          foot.querySelector('.ref-foot-text').remove();
          const clr = u.el('button', 'ds-clear', foot, 'Clear Dates');
          clr.type = 'button';
          clr.addEventListener('click', () => {
            if (env.widgetDef.clear) env.widgetDef.clear();
          });
          u.el('div', 'ds-dots', side);
          _c.foot = foot;
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) _c.foot.prepend(dock);
        },
        'frame.end': (base) => (_c) => {
          const { submit, header, headerTools } = _c;
          for (const button of document.querySelectorAll('.ref-xtra')) button.classList.add('ds-xtra');
          if (submit) {
            submit.classList.add(submit.classList.contains('ref-endlink') ? 'ds-end-link' : 'ds-submit');
          }
          if (headerTools.children.length) header.classList.add('ds-has-head-submit');
          return base(_c);
        },
      },
    },
  });
})();
