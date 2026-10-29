// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const folder = '<svg viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="dock-gold" x2="0" y2="1"><stop stop-color="#fff9b9"/><stop offset="1" stop-color="#ffd233"/></linearGradient></defs><path d="M5 12h13l5 5h20v24H5z" fill="#e8a617" stroke="#5f4b17" stroke-width="2"/><path d="M10 6h18l7 8v23H10z" fill="#fff" stroke="#7a8f92"/><path d="M15 12h11m-11 5h15m-15 5h15" stroke="#aab9bf"/><path d="M4 20h38l-4 23H2z" fill="url(#dock-gold)" stroke="#8f6603" stroke-width="1.5"/><path d="M6 23h32" stroke="#fff" stroke-width="2"/></svg>';
  const computer = '<svg viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="dock-screen" x2="1" y2="1"><stop stop-color="#d8f4ff"/><stop offset=".45" stop-color="#4188cd"/><stop offset="1" stop-color="#092b72"/></linearGradient></defs><path d="M10 3h29v30H10z" fill="#d5d5ce" stroke="#242a30" stroke-width="1.6"/><path d="M13 6h23v22H13z" fill="url(#dock-screen)" stroke="#fff"/><path d="M19 33h12v5H19z" fill="#aeb4b4" stroke="#555"/><path d="M11 38h28l6 7H4z" fill="#dbdedb" stroke="#343b42" stroke-width="1.5"/><path d="M13 40h21m-23 2h27" stroke="#8a959e"/><path d="M13 30h3" stroke="#218b30" stroke-width="2"/><path d="M7 45h34" stroke="#fff"/></svg>';
  const network = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M4 4h23v25H4z" fill="#c8ccc9" stroke="#293b49" stroke-width="1.5"/><path d="M7 7h17v16H7z" fill="#3897d5" stroke="#fff"/><path d="M10 5l10 2-4 9-9-2z" fill="#9cdd54"/><path d="M10 29h10v5H10l-4 4h26" fill="#d6d7cd" stroke="#374957"/><path d="M22 16h22v24H22z" fill="#d9d9d1" stroke="#27333b" stroke-width="1.5"/><path d="M25 19h16v15H25z" fill="#1961a0" stroke="#fff"/><path d="M29 40h9v4h6v3H23v-3h6z" fill="#c7cbc9" stroke="#384047"/><path d="M11 39v5h9" fill="none" stroke="#374c72" stroke-width="2"/></svg>';
  const explorer = '<svg viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="dock-ie" x2="0" y2="1"><stop stop-color="#20c5ff"/><stop offset="1" stop-color="#0056c9"/></linearGradient></defs><path d="M39 33c-5 7-11 10-19 8C8 38 7 29 11 19 15 7 29 4 37 12c5 5 6 12 4 17H18c1 7 9 9 15 4zM20 22h14c0-9-10-9-14 0z" fill="url(#dock-ie)" stroke="#065eaf" stroke-width="1"/><ellipse cx="24" cy="24" rx="24" ry="9" transform="rotate(-43 24 24)" fill="none" stroke="#1489e2" stroke-width="3"/><path d="M5 35c-3 8 5 11 15 5" fill="none" stroke="#1569d2" stroke-width="2"/></svg>';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const brand = S.frameBrand(_c, header) || util.el('div', 'ref-brand', header);
      brand.innerHTML = folder;
      util.el('span', '', brand, 'Project Docs');
      brand.dataset.role = 'brand';
      Object.assign(_c, { header });
    },
    'frame.nav': (base) => function (_c) {
      base(_c);
      _c.header.querySelector('.ref-nav')?.remove();
    },
    'frame.body': (base) => function (_c) {
      base(_c);
      _c.body.querySelector('.ref-side')?.remove();
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      const windowControls = util.el('div', 'xp-window-controls', header);
      for (const [kind, glyph, label] of [['min', '−', 'Minimize'], ['max', '□', 'Maximize'], ['close', '×', 'Close']]) {
        const b = util.el('button', `xp-window-button xp-${kind}`, windowControls, glyph);
        b.type = 'button';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', () => env.log('window-control', { label }));
      }
      Object.assign(_c, { headerTools, submit, windowControls });
    },
    'frame.footer': (base) => function (_c) {
      base(_c);
      const { util } = _c;
      const foot = document.querySelector('.ref-foot') || util.el('footer', 'ref-foot', document.body);
      const dock = util.el('nav', 'classic-dock', foot);
      foot.prepend(dock);
      for (const [name, art] of [['My Computer', computer], ['My Documents', folder], ['My Network Places', network], ['Internet Explorer', explorer]]) {
        const b = util.el('button', 'classic-dock-item', dock);
        b.type = 'button';
        b.innerHTML = art;
        util.el('span', '', b, name);
        if (name === 'My Documents') b.classList.add('active');
        b.addEventListener('click', () => env.log('dock', { label: name }));
      }
      _c.dockFoot = foot;
    },
    'frame.floating': (base) => function (_c) {
      base(_c);
      if (_c.placement === 'floating' && _c.submit) {
        const tools = _c.dockFoot.querySelector('.ref-tools') || _c.util.el('div', 'ref-tools', _c.dockFoot);
        tools.appendChild(_c.submit);
        _c.submit.classList.remove('ref-float');
        document.querySelector('.ref-float-dock')?.remove();
      }
    },
  };

  env.site({
    name: 'design-use-file-manager-rename-05',
    template: 'site/base',
    design: { parts },
  });
})();
