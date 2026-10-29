// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      util.el('h1', 'vf-form-title', header);
      const art = util.el('div', 'vf-header-art', header);
      util.el('span', 'vf-art-dots', art);
      S.frameBrand(_c, header);
      Object.assign(_c, { art, header });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('nav', 'vf-rail', document.body);
      util.el('div', 'vf-mark', rail);
      const icons = {
        Forms:'M4 2h14l8 8v22H4z M18 2v9h8 M9 16h12 M9 22h12 M9 27h12',
        Templates:'M3 3h8v8H3z M17 3h8v8h-8z M3 17h8v8H3z M17 17h8v8h-8z',
        Responses:'M5 17v9 M14 5v21 M23 11v15',
        Settings:'M11 3h6l1 4 4 2 4-1 3 5-3 3v4l3 3-3 5-4-1-4 2-1 4h-6l-1-4-4-2-4 1-3-5 3-3v-4l-3-3 3-5 4 1 4-2z M14 12a5 5 0 1 0 0 10a5 5 0 1 0 0-10',
      };
      const drawIcon = (parent, name) => {
        const svg=util.svg('svg',{viewBox:name==='Settings'?'-4 0 36 36':name==='Forms'?'0 0 30 34':'0 0 30 30',width:30,height:32,fill:'none',stroke:'currentColor','stroke-width':2.3,'stroke-linejoin':'round','stroke-linecap':'round'},parent);
        util.svg('path',{d:icons[name]||icons.Forms},svg);
      };
      for (const text of ['Forms', 'Templates', 'Responses', 'Settings']) {
        const item = util.el('div', `vf-rail-item${text === 'Forms' ? ' active' : ''}`, rail);
        drawIcon(util.el('span', 'vf-rail-icon', item),text);
        util.el('span', 'vf-rail-label', item, text);
      }
      const library = util.el('aside', 'vf-library', body);
      util.el('div', 'vf-library-brand', library, 'Velvet Forms');
      const libhead = util.el('div', 'vf-library-head', library);
      util.el('strong', '', libhead, 'My forms');
      util.el('button', 'vf-new-form', libhead, '＋  New form');
      const search = util.el('div', 'vf-search', library);
      const glass=util.svg('svg',{viewBox:'0 0 24 24',width:24,height:24,fill:'none',stroke:'currentColor','stroke-width':2,'stroke-linecap':'round'},search);
      util.svg('circle',{cx:10,cy:10,r:7},glass);
      util.svg('path',{d:'m16 16 5 5'},glass);
      util.el('span','',search,'Search forms...');
      const records = util.el('div', 'vf-records', library);
      for (const [title, meta, active] of [
        ['Velvet Hammer Records · Participant intake', '3 sections · 3 questions', true],
        ['Fan feedback survey', '5 sections · 12 questions'],
        ['Event registration', '4 sections · 9 questions'],
        ['Artist application', '6 sections · 14 questions'],
        ['Merchandise survey', '4 sections · 11 questions'],
        ['Community poll', '2 sections · 6 questions'],
      ]) {
        const row = util.el('div', `vf-record${active ? ' selected' : ''}`, records);
        drawIcon(util.el('span', 'vf-record-icon', row),'Forms');
        const copy = util.el('div', 'vf-record-copy', row);
        util.el('strong', '', copy, title);
        util.el('small', '', copy, meta);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, drawIcon, glass, icons, libhead, library, rail, records, search });
    },
    'frame.floating': (base, S) => function (_c) {
      const { body, display, endBtn, header, headerTools, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      if (display === 'header') {
        const note = header.querySelector('.ref-instruction');
        const noteTop = parseFloat(getComputedStyle(note).top) || 76;
        const headerHeight = Math.ceil(noteTop + note.scrollHeight + 12);
        header.style.height = `${headerHeight}px`;
        body.style.top = `${headerHeight}px`;
        body.style.height = `calc(100% - ${headerHeight}px)`;
        document.body.style.setProperty('--vf-overlay-top',`${headerHeight}px`);
      } else document.body.style.setProperty('--vf-overlay-top',`${header.offsetHeight}px`);
      header.style.setProperty('--vf-tools-width', `${headerTools.offsetWidth + 45}px`);
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-use-form-builder-branching-04',
    template: 'site/base',
    design: { parts },
  });
})();
