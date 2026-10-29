(function () {
  'use strict';
  const C = {
    title: 'Daily Tasks',
    side: ['Daily Tasks', 'Practice', 'Progress', 'Settings'],
    tabs: ['Numbers', 'Logic', 'Patterns', 'Words'],
    tip: 'Read the figures carefully, then give your answer in the field provided.',
  };
  const SIDE_ICONS = [
    '<defs><linearGradient id="clipPaper" x2="0" y2="1"><stop stop-color="#ffffff"/><stop offset="1" stop-color="#e5edf3"/></linearGradient></defs><rect x="5" y="4" width="18" height="23" rx="1" fill="url(#clipPaper)" stroke="#46647c" stroke-width="1.3"/><path d="M8 10h12M8 14h12M8 18h12M8 22h10" stroke="#8da4b6"/><rect x="9" y="3" width="10" height="3" rx="1" fill="#b7c9d7" stroke="#46647c"/><path d="M10 2v4m8-4v4" stroke="#46647c" stroke-width="1.5"/>',
    '<defs><linearGradient id="chartBlue" x2="1" y2="0"><stop stop-color="#91dcff"/><stop offset="1" stop-color="#1685d1"/></linearGradient><linearGradient id="chartGold" x2="1" y2="0"><stop stop-color="#f8ec9a"/><stop offset="1" stop-color="#9a9d79"/></linearGradient></defs><rect x="4" y="16" width="4.5" height="10" rx=".5" fill="url(#chartBlue)" stroke="#327099"/><rect x="11.5" y="10" width="4.5" height="16" rx=".5" fill="url(#chartBlue)" stroke="#327099"/><rect x="19" y="3" width="4.5" height="23" rx=".5" fill="url(#chartGold)" stroke="#456a82"/><path d="M2 26.5h25" stroke="#4b657a" stroke-width="1.6"/>',
    '<defs><linearGradient id="pieGreen" x2="0" y2="1"><stop stop-color="#73e4b9"/><stop offset="1" stop-color="#15957b"/></linearGradient><linearGradient id="pieBlue" x2="0" y2="1"><stop stop-color="#89d9ff"/><stop offset="1" stop-color="#278bd4"/></linearGradient></defs><path d="M13 3A11.5 11.5 0 1 0 25 15H13Z" fill="url(#pieGreen)" stroke="#278a7c" stroke-width="1.3"/><path d="M15 1v12h12A12 12 0 0 0 15 1Z" fill="url(#pieBlue)" stroke="#3b7fae" stroke-width="1.3"/><path d="M11 5A9 9 0 0 0 5 12" fill="none" stroke="#bbf5db" stroke-width="1.4"/>',
    '<defs><linearGradient id="gearMetal" x2="0" y2="1"><stop stop-color="#b5cfdf"/><stop offset="1" stop-color="#6b879c"/></linearGradient></defs><path d="m12 1 4 .2.9 3.1 2.4 1.1 2.9-1.3 2.5 3.1-1.8 2.6.7 2.6 3 .9-.2 4-3.1.8-1.1 2.3 1.4 2.9-3.2 2.4-2.5-1.8-2.6.7-1 3-4-.2-.7-3.1-2.4-1-2.8 1.3-2.5-3.1L4 19l-.7-2.6-3-1 .2-4 3.1-.7 1.1-2.4-1.4-2.8 3.2-2.4L9 4.9l2.3-.7Z" fill="url(#gearMetal)" stroke="#526d83" stroke-width="1.2"/><circle cx="14" cy="14" r="5.3" fill="#edf5fa" stroke="#526d83" stroke-width="1.2"/><circle cx="14" cy="14" r="3.6" fill="#d5e6f1"/>',
  ];
  const WIN = {
    min: '<path d="M4 12h9" stroke="#fff" stroke-width="3"/>',
    max: '<rect x="4" y="3" width="10" height="9" fill="none" stroke="#fff" stroke-width="2"/>',
    close: '<path d="M4 3l10 10M14 3L4 13" stroke="#fff" stroke-width="2.5"/>',
  };
  env.site({
    name: 'design-solve-puzzle-compute-05',
    template: 'site/base',
    styles: ['site.css'],
    design: {
      parts: {
        endLabel: (base, S) => function (rng, content) {
          const sampled = base(rng, content);
          const preferred = (content.END_LABELS || []).find(label => label === 'Submit');
          return preferred && rng.fork('vista/end-label').bool(0.55) ? preferred : sampled;
        },
        'frame.header': (base, S) => function (_c) {
          const { util, ctx } = _c;
          document.body.classList.add('vw');
          const frame = util.el('div', 'vw-frame', document.body);
          const header = util.el('header', 'ref-task', frame);
          const icon = util.svg('svg', { width: 28, height: 28, viewBox: '0 0 28 28', class: 'vw-icon' }, header);
          icon.innerHTML = SIDE_ICONS[0] + '<path d="M23 11h3v15h-3z" fill="#e3bf55" stroke="#a58c46" stroke-width=".6"/>';
          util.el('div', 'vw-title', header, C.title);
          Object.assign(_c, { header, frame });
        },
        'frame.nav': (base, S) => function () {},
        'frame.tools': (base, S) => function (_c) {
          base(_c);
          const { header, util } = _c;
          const wc = util.el('div', 'vw-winctl', header);
          for (const k of ['min', 'max', 'close']) {
            const b = util.el('span', 'vw-wb vw-' + k, wc);
            const s = util.svg('svg', { width: 28, height: 24, viewBox: '0 0 18 15' }, b);
            s.innerHTML = WIN[k];
          }
        },
        'frame.body': (base, S) => function (_c) {
          const { util, frame } = _c;
          const body = util.el('div', 'ref-body', frame);
          const side = util.el('aside', 'vw-side', body);
          C.side.forEach((t, i) => {
            const a = util.el('a', 'vw-sidelink' + (i === 0 ? ' on' : ''), side);
            a.dataset.role = 'nav';
            const s = util.svg('svg', { width: 28, height: 28, viewBox: '0 0 28 28' }, a);
            s.innerHTML = SIDE_ICONS[i];
            util.el('span', '', a, t);
            a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: t }); });
          });
          const col = util.el('div', 'vw-col', body);
          const tabs = util.el('div', 'vw-tabs', col);
          C.tabs.forEach((t, i) => {
            const a = util.el('a', 'vw-tab' + (i === 0 ? ' on' : ''), tabs, t);
            a.dataset.role = 'nav';
            a.href = '#';
            a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: t }); });
          });
          Object.assign(_c, { body: col });
        },
        'frame.panel': (base, S) => function (_c) {
          base(_c);
          const panel = _c.body.querySelector('.ref-panel');
          if (panel) _c.frame.querySelector('.vw-side').appendChild(panel);
        },
        'frame.toast': (base, S) => function (_c) {
          base(_c);
          const { body, util } = _c;
          const note = document.querySelector('.ref-note');
          if (note) {
            const bottom = note.getBoundingClientRect().bottom;
            const top = _c.stage.getBoundingClientRect().top;
            _c.stage.style.paddingTop = Math.max(28, bottom - top + 20) + 'px';
          }
          const tip = util.el('div', 'vw-tip', body);
          const q = util.el('span', 'vw-q', tip, '?');
          q.setAttribute('aria-hidden', 'true');
          const t = util.el('span', '', tip);
          util.el('b', '', t, 'Tip: ');
          t.append(C.tip);
        },
        'frame.footer': (base, S) => function (_c) {
          const real = document.body;
          base(_c);
          const foot = document.querySelector('.ref-foot');
          const frame = _c.frame;
          if (foot && frame) frame.appendChild(foot);
        },
        'frame.floating': (base, S) => function (_c) {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) _c.frame.appendChild(dock);
        },
        'frame.end': (base, S) => function (_c) {
          const result = base(_c);
          const button = result.submit;
          if (!button) return result;
          const r = _c.ctx.rng.fork('vista/end-control');
          const form = r.pick(['footer', 'footer', 'footer', 'header', 'link', 'icon']);
          button.className = form === 'link' ? 'ref-endlink' : form === 'icon' ? 'ref-submit ref-icon' : 'ref-submit';
          button.textContent = form === 'icon' ? '✓' : _c.label;
          if (form === 'header' || form === 'icon') _c.headerTools.appendChild(button);
          else {
            let foot = _c.frame.querySelector('.ref-foot');
            if (!foot) {
              foot = _c.util.el('footer', 'ref-foot', _c.frame);
              _c.util.el('span', 'ref-foot-text', foot);
            }
            let tools = foot.querySelector('.ref-tools');
            if (!tools) tools = _c.util.el('div', 'ref-tools', foot);
            tools.appendChild(button);
          }
          const dock = _c.frame.querySelector('.ref-float-dock');
          if (dock && !dock.children.length) dock.remove();
          return result;
        },
      },
    },
  });
})();
