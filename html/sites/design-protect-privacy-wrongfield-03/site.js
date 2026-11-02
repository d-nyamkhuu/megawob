// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      // OS/2 Workplace Shell style application title and its own menu/toolbar.
      const crmBrand = util.el('div', 'crm-brand', header);
      util.el('span', 'window-mark', crmBrand, '➜');
      util.el('strong', '', crmBrand, 'Community Centre Manager - Open Day Registration');
      const menu = util.el('nav', 'os-menu', header);
      for (const item of ['File', 'Edit', 'View', 'Record', 'Tools', 'Help']) util.el('span', '', menu, item);
      const toolbar = util.el('div', 'os-toolbar', header);
      const toolArt = [
        '<path d="M8 3h12l7 7v22H8z" fill="#f7f7f7"/><path d="M20 3v8h7M12 17h11M12 22h11M12 27h8"/>',
        '<path d="M3 11h11l3 4h14v16H3z" fill="#f1d641"/><path d="M3 11V7h10l4 4M3 15h28l-3 16H3z"/>',
        '<path d="M17 5 5 17l12 12v-7h15V12H17z" fill="#fafafa"/><path d="M17 5 5 17l12 12v-7h15V12H17z"/>',
        '<path d="M8 11V3h20v8M7 25H4V13h28v12h-4M8 21h20v11H8z" fill="#f8f8f8"/><path d="M12 25h12M12 29h12M24 16h3"/>',
        '<path d="M12 12a5 5 0 1 1 10 0 5 5 0 0 1-10 0M4 30c0-7 4-11 8-11s8 4 8 11M19 20c5-2 11 2 11 10M23 5a5 5 0 0 1 0 10" fill="#f8f8f8"/>',
        '<rect x="4" y="5" width="26" height="26" fill="#fafafa"/><path d="M4 12h26M11 5v26M18 5v26M25 5v26M4 19h26M4 26h26"/>',
        '<path d="M4 4h26v27H4z" fill="#fafafa"/><path d="M9 9h16M9 14h16M9 19h16M9 24h16M9 29h16"/><path d="M7 9h1M7 14h1M7 19h1M7 24h1M7 29h1"/>'
      ];
      for (const [i, label] of ['New','Open','Back','Print','Members','Events','Reports'].entries()) {
        const tool = util.el('div', 'os-tool', toolbar);
        const icon = util.el('span', 'os-tool-icon', tool);
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 36 36');
        svg.setAttribute('aria-hidden', 'true');
        svg.innerHTML = toolArt[i];
        for (const shape of svg.children) {
          shape.setAttribute('stroke', '#111');
          shape.setAttribute('stroke-width', '1.8');
          shape.setAttribute('stroke-linecap', 'square');
          shape.setAttribute('stroke-linejoin', 'miter');
        }
        icon.appendChild(svg);
        util.el('span', 'os-tool-label', tool, label);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { crmBrand, header, menu, toolArt, toolbar });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const osSide = util.el('aside', 'os-sidebar', body);
      for (const [icon, label, active] of [['⌂', 'Home', false], ['▤', 'Open Day', true], ['♧', 'Members', false],
        ['▦', 'Events', false], ['▧', 'Rooms', false], ['▥', 'Reports', false]]) {
        const item = util.el('div', `os-side-item${active ? ' selected' : ''}`, osSide);
        util.el('span', 'os-side-icon', item, icon);
        util.el('span', '', item, label);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, osSide });
    },
  };

  env.site({
    name: 'design-protect-privacy-wrongfield-03',
    template: 'site/base',
    design: { parts },
  });
})();
