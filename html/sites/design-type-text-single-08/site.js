// Note Keeper chrome on the shared frame; controls, instructions and perturbations use site/base.
(function () {
  'use strict';
  const C = { brand: 'Note Keeper', menu: 'File|Edit|View|Tools|Help' };
  const ICONS = {
    new: '<svg width="34" height="38" viewBox="0 0 34 38"><defs><linearGradient id="paper" x2="1" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#d4e0e6"/></linearGradient></defs><path d="M6 3h17l8 8v24H6z" fill="url(#paper)" stroke="#657b87" stroke-width="2" stroke-linejoin="round"/><path d="M23 3v9h8" fill="#b7c9d1" stroke="#657b87" stroke-width="1.5"/><path d="M11 17h13M11 22h13M11 27h8M16 14v16" stroke="#6090b3" stroke-width="2"/></svg>',
    open: '<svg width="38" height="38" viewBox="0 0 38 38"><defs><linearGradient id="folder" x2="0" y2="1"><stop stop-color="#ffe299"/><stop offset="1" stop-color="#d9a344"/></linearGradient></defs><path d="M17 10l2-5h12l3 5-3 13H14z" fill="#e4e7df" stroke="#62685b" stroke-width="1.5"/><path d="M21 8h10M20 11h11" stroke="#92998e"/><path d="M3 9h11l3 4h14v5H8L3 31z" fill="#e8b44d" stroke="#84642f" stroke-width="2" stroke-linejoin="round"/><path d="M8 18h27l-6 14H3z" fill="url(#folder)" stroke="#84642f" stroke-width="2" stroke-linejoin="round"/><path d="M10 20h22" stroke="#fff1be"/></svg>',
    save: '<svg width="36" height="38" viewBox="0 0 36 38"><defs><linearGradient id="disk" x2="1" y2="1"><stop stop-color="#90b4cd"/><stop offset="1" stop-color="#3b719a"/></linearGradient></defs><rect x="3" y="3" width="30" height="32" rx="1" fill="url(#disk)" stroke="#405564" stroke-width="2"/><path d="M8 3h19v13H8z" fill="#f3eee2" stroke="#405564" stroke-width="1.5"/><rect x="19" y="4" width="5" height="10" fill="#72818a" stroke="#344553"/><path d="M8 22h20v13H8z" fill="#e9eff1" stroke="#405564" stroke-width="1.5"/><path d="M11 25h14M11 28h14" stroke="#a7b8c4"/><rect x="14" y="29" width="7" height="5" fill="#4c6d88"/></svg>',
    print:
      '<svg width="38" height="38" viewBox="0 0 38 38"><defs><linearGradient id="printer" x2="0" y2="1"><stop stop-color="#f7f6ed"/><stop offset="1" stop-color="#a6a7a0"/></linearGradient></defs><rect x="9" y="2" width="21" height="15" rx="1" fill="#fcfcf8" stroke="#696a65" stroke-width="2"/><path d="M12 5h14" stroke="#d0d1ca"/><rect x="3" y="14" width="32" height="16" rx="3" fill="url(#printer)" stroke="#666761" stroke-width="2"/><path d="M5 17h27M6 22h3" stroke="#f7f8ed" stroke-width="2"/><rect x="9" y="24" width="21" height="12" rx="1" fill="#fff" stroke="#72736e" stroke-width="2"/><path d="M12 28h15M12 32h15" stroke="#969990" stroke-width="1.5"/></svg>',
    note: '<svg width="62" height="74" viewBox="0 0 62 74"><defs><linearGradient id="note" x2="1" y2="1"><stop stop-color="#e4f0f5"/><stop offset="1" stop-color="#b8cfdd"/></linearGradient></defs><path d="M2 2h40l12 13v57H2z" fill="url(#note)" stroke="#547489" stroke-width="2.2" stroke-linejoin="round"/><path d="M3 3h38v13H3" fill="#87afc6"/><path d="M42 2v14h12" fill="#e3edf2" stroke="#547489" stroke-width="2"/><path d="M10 23h34M10 30h36M10 37h36M10 44h36M10 51h36M10 59h20" stroke="#5c8299" stroke-width="2"/><path d="M13 23h18M11 37h24M12 51h20" stroke="#9cb9ca" stroke-width="1"/></svg>',
  };

  function fitChrome(work, heading, acts, stage) {
      stage.fitChrome = () => {
        if (heading.parentElement === work) heading.style.flex = 'none';
        acts.style.flex = 'none';
        const occupied = () => {
          const ws = getComputedStyle(work),
            hs = getComputedStyle(heading),
            as = getComputedStyle(acts);
          const noteHeight = heading.parentElement === work ? heading.scrollHeight + parseFloat(hs.marginBottom) : 0;
          return (
            parseFloat(ws.paddingTop) +
            parseFloat(ws.paddingBottom) +
            noteHeight +
            Math.max(112, stage.getBoundingClientRect().height) +
            acts.getBoundingClientRect().height +
            parseFloat(as.marginTop) +
            12
          );
        };
        if (occupied() > work.clientHeight) {
          work.style.paddingTop = '20px';
          heading.style.marginBottom = '20px';
          heading.style.flex = 'none';
          acts.style.marginTop = '20px';
          acts.style.flex = 'none';
          let fs = parseFloat(getComputedStyle(heading).fontSize);
          while (occupied() > work.clientHeight && fs > 20) {
            fs = Math.max(20, fs - 2);
            heading.style.fontSize = fs + 'px';
          }
        }
      };
  }

  const parts = {
    'frame.theme': (base) => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) {
        document.activeElement.dataset.resetting = 'true';
        document.activeElement.blur();
      }
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      base(_c);
      // The application keeps its Human desktop palette in every episode.
      const palette = { bg: '#dfd3c2', panel: '#efe8de', fg: '#17110d', muted: '#77614c', line: '#bfb09c', accent: '#e07a2a' };
      for (const [key, value] of Object.entries(palette)) _c.root.style.setProperty('--' + key, value);
      _c.root.dataset.theme = 'warm';
    },
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This design's feedback pane also fits panel and toast notes at narrow sizes.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.remove('ref-has-note');
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const brand = u.el('span', 'ds-brand', top);
      brand.innerHTML =
        '<svg width="26" height="26" viewBox="0 0 26 26"><defs><radialGradient id="badge"><stop stop-color="#ffe6a2"/><stop offset="1" stop-color="#e9ae41"/></radialGradient></defs><path d="M13 1l4 2 4 1 1 4 2 4-1 5-3 4-4 2-5 1-5-2-3-4-1-5 1-5 4-5z" fill="url(#badge)" stroke="#92713d"/><path d="M13 7v12M10 9v8M16 9v8" stroke="#6d7773" stroke-width="2"/><path d="M11 11h4v4h-4z" fill="#e6ded2"/></svg>';
      u.el('span', '', brand, C.brand);
      const wins = u.el('div', 'ds-wincontrols', top);
      ['minimize', 'maximize', 'close'].forEach((key) => {
        const b = u.el('button', 'ds-wincontrol ds-wc-' + key, wins);
        b.type = 'button';
        b.setAttribute('aria-label', key);
        b.innerHTML =
          '<svg width="18" height="18" viewBox="0 0 18 18"><path d="' +
          { minimize: 'M3 13h12', maximize: 'M3 3h12v12H3z', close: 'M4 4l10 10M14 4 4 14' }[key] +
          '" fill="none" stroke="#fff" stroke-width="2.4"/></svg>';
      });
      const nav = u.el('nav', 'ds-menu', document.body);
      C.menu.split('|').forEach((t) => {
        const s = u.el('span', '', nav);
        s.innerHTML = '<u>' + t[0] + '</u>' + t.slice(1);
      });
      const tool = u.el('div', 'ds-tool', document.body);
      [
        ['new', 'New'],
        ['open', 'Open'],
        ['save', 'Save'],
        ['print', 'Print'],
      ].forEach((p, i) => {
        if (i === 1 || i === 2 || i === 3) {
          if (i >= 2) u.el('i', 'ds-tsep', tool);
        }
        const t = u.el('span', 'ds-tbtn', tool);
        t.innerHTML = ICONS[p[0]];
        u.el('span', '', t, p[1]);
      });
      Object.assign(_c, { header: tool });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      // The form lives below the toolbar, so draw the shared instruction after building it.
      _c.drawInstruction = () => {
        base({ ..._c, header: _c.work });
        const heading = _c.work.querySelector('.ref-instruction');
        if (heading) heading.classList.add('ds-instruction', 'ds-instruction-header');
      };
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.headerTools.classList.add('ds-end-tools');
      for (const button of _c.headerTools.querySelectorAll('.ref-xtra')) button.classList.add('ds-xtra');
      if (_c.submit) _c.submit.classList.add('ds-submit', 'ds-submit-toolbar');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', document.body);
      const left = u.el('div', 'ds-left', body);
      const brief = u.el('section', 'ds-brief', left);
      brief.insertAdjacentHTML('beforeend', ICONS.note);
      const bt = u.el('div', 'ds-brief-text', brief);
      u.el('b', '', bt, 'Quick Note');
      u.el('div', '', bt, 'A simple place to jot things down.');
      u.el('div', '', bt, 'Complete the task below.');
      const work = u.el('section', 'ds-work', left);
      body.classList.add('ref-body');
      const side = u.el('aside', 'ds-side', body);
      u.el('h3', '', side, 'Status');
      const st = u.el('div', 'ds-status', side);
      u.el('i', 'ds-led', st);
      u.el('span', '', st, 'Not submitted');
      u.el('h3', '', side, 'Details');
      const dl = u.el('div', 'ds-details', side);
      const rows = [
        ['Task', 'Enter text'],
        ['Characters', '0'],
        ['Status', 'Pending'],
      ];
      rows.forEach((r, i) => {
        u.el('span', '', dl, r[0]);
        const v = u.el('span', '', dl, r[1]);
        if (i === 1) {
          v.dataset.role = 'character-count';
        }
      });
      Object.assign(_c, { body, work, side, dl });
      _c.drawInstruction();
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.side });
      const panel = _c.side.querySelector('.ref-panel');
      if (panel) panel.classList.add('ds-instruction', 'ds-instruction-panel');
    },
    'frame.stage': () => (_c) => {
      const { util: u, work } = _c;
      const stage = u.el('main', 'ds-stage', work);
      const acts = u.el('div', 'ds-actions', work);
      if (_c.submit && _c.placement === 'header') {
        _c.submit.classList.remove('ds-submit-toolbar');
        acts.append(_c.submit);
      }
      const clear = u.el('button', 'ds-clear', acts, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        const input = stage.querySelector('input,textarea');
        if (input) {
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.focus();
        }
      });
      Object.assign(_c, { stage, acts });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-instruction', 'ds-instruction-toast');
        note.setAttribute('role', 'status');
        _c.side.append(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('ds-feedback-actions');
        _c.side.append(foot);
      }
      if (_c.submit && ['footer', 'link'].includes(_c.placement))
        _c.submit.classList.add('ds-submit', 'ds-submit-feedback');
      for (const button of _c.side.querySelectorAll('.ref-xtra')) button.classList.add('ds-xtra');
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) {
        dock.classList.add('ds-feedback-actions');
        _c.side.append(dock);
        _c.submit.classList.add('ds-submit', 'ds-submit-feedback');
      }
    },
    'frame.end': (base) => (_c) => {
      const { util: u, work, stage, side, dl, acts, submit, placement } = _c;
      const heading = document.querySelector('.ds-instruction') || u.el('div', 'ds-instruction');
      if (heading.parentElement === side) {
        if (submit && ['footer', 'link', 'floating'].includes(placement)) heading.classList.add('ds-above-end');
        const note = heading.getBoundingClientRect();
        const end = side.querySelector('.ds-feedback-actions');
        const bottom = end ? end.getBoundingClientRect().top - 18 : side.getBoundingClientRect().bottom - 18;
        if (note.top < dl.getBoundingClientRect().bottom + 10 || note.bottom > bottom) {
          heading.className = 'ds-instruction ds-instruction-header';
          work.insertBefore(heading, stage);
        }
      }
      fitChrome(work, heading, acts, stage);
      return base(_c);
    },
  };

  env.site({
    name: 'design-type-text-single-08',
    template: 'site/base',
    langs: ['en'],
    design: { parts },
  });
})();
