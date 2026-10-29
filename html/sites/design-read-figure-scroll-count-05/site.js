(function () {
  'use strict';
  const icon = (u, parent, name, size = 24) => {
    const svg = u.svg('svg', { width:size, height:size, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':1.6, 'stroke-linecap':'round', 'stroke-linejoin':'round', 'aria-hidden':'true' }, parent);
    const paths = {
      folder:'M2 7V4.5h7l2 2.5h11v14H2z',
      people:'M15 20v-2a5 5 0 0 0-10 0v2 M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7 M17 4a3.5 3.5 0 0 1 0 7 M19 14a5 5 0 0 1 3 4v2',
      star:'m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2-6.2 3.2L7 14.2 2 9.3l6.9-1z',
      clock:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18 M12 7v6l4 2',
      trash:'M4 6h16 M9 6V3h6v3 M6 6l1 15h10l1-15 M10 10v7 M14 10v7',
      bell:'M5 17h14l-2-4V9a5 5 0 0 0-10 0v4z M10 20h4 M12 2v2',
      document:'M5 2h10l5 5v15H5z M15 2v6h5 M8 11h8 M8 15h8 M8 18h6',
      image:'M3 3h18v18H3z M3 17l6-6 4 4 3-3 5 5 M8 7h.01',
      pencil:'m3 17 13-13a2.8 2.8 0 0 1 4 4L7 21l-5 1z M14 6l4 4',
      list:'M9 5h12 M9 12h12 M9 19h12 M3 5h.1 M3 12h.1 M3 19h.1',
      grid:'M3 3h6v6H3z M15 3h6v6h-6z M3 15h6v6H3z M15 15h6v6h-6z',
      brand:'M6 5h12v14H6z M9 9h6 M9 12h6 M9 15h4',
      mail:'M2 6h20v14H2z M2 6l10 8L22 6',
      search:'M10.5 3a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15 M16 16l5 5',
    };
    if (name === 'newsletter') {
      u.svg('path', {d:'M2 10 12 2l10 8v12H2z',fill:'#2b78ff',stroke:'#1769f5','stroke-width':.6},svg);
      u.svg('rect', {x:5,y:3,width:14,height:16,rx:1.5,fill:'#fff',stroke:'#1769f5','stroke-width':.6},svg);
      u.svg('path', {d:'M8 7h8 M8 10h8 M8 13h6',stroke:'#8eb8ff','stroke-width':.7},svg);
      u.svg('path', {d:'m2 10 10 8 10-8v12H2z',fill:'#337bff',stroke:'#1769f5','stroke-width':.6},svg);
      u.svg('path', {d:'m2 22 9-8 11 8z',fill:'#1769f5',stroke:'none'},svg);
    } else if (name === 'more') {
      for (const cx of [4,12,20]) u.svg('circle', { cx,cy:12,r:1.5,fill:'currentColor',stroke:'none' }, svg);
    } else if (['sheet','presentation','pdf'].includes(name)) {
      const fill = name === 'sheet' ? '#0ba47c' : name === 'presentation' ? '#ffb000' : '#f0141c';
      u.svg('path', {d:'M5 1h11l5 5v17H3V3a2 2 0 0 1 2-2z',fill,stroke:'none'},svg);
      u.svg('path', {d:'M16 1v5h5',fill:'#ffffff55',stroke:'none'},svg);
      const line = name === 'sheet' ? 'M7 8h10v11H7z M7 12h10 M7 15.5h10 M12 8v11' : name === 'presentation' ? 'M6 7h12v10H6z M9 20h6 M12 17v3' : 'M7 18c7-8 4-14 3-9s5 8 8 7-9-2-11 2z';
      u.svg('path', {d:line,stroke:'#fff','stroke-width':1.3,fill:'none'},svg);
    } else u.svg('path', { d: paths[name] || paths.document }, svg);
    return svg;
  };
  env.site({
    name: 'design-read-figure-scroll-count-05',
    template: 'site/base',
    design: {
      THEMES: {
        light: { bg: '#e9edf2', panel: '#ffffff', fg: '#10203b', muted: '#65758c', line: '#dce2e9' },
        dark: { bg: '#202733', panel: '#ffffff', fg: '#10203b', muted: '#65758c', line: '#dce2e9' },
        warm: { bg: '#e9edf2', panel: '#ffffff', fg: '#10203b', muted: '#65758c', line: '#dce2e9' },
      },
      ACCENTS: ['#315fc1'],
      TITLES: ['FlowDocs'],
      parts: {
        endLabel: (base) => (rng, content) => {
          const label = base(rng, content);
          return rng.fork('flowdocs/end-label').bool(.5) ? 'Apply' : label;
        },
        'frame.placement': (base) => (_c) => {
          base(_c);
          if (!_c.ctx.finish && _c.rng.fork('flowdocs/end-placement').bool(.5)) {
            _c.placement = 'header';
            _c.wantFooter = false;
          }
        },
        'frame.header': (_base, S) => (_c) => {
          const { util } = _c;
          const head = util.el('header', 'app-head', document.body);
          const brand = util.el('div', 'brand-row', head);
          const badge = util.el('span', 'brand-mark', brand);
          icon(util, badge, 'brand', 19);
          badge.setAttribute('aria-hidden', 'true');
          util.el('strong', '', brand, 'FlowDocs');
          const controls = util.el('div', 'window-controls', brand);
          for (const mark of ['−', '□', '×']) util.el('span', '', controls, mark);
          util.el('nav', 'menu-row', head, 'File　　Edit　　View　　Go　　Tools　　Help');
          Object.assign(_c, { header: head });
        },
        'frame.nav': () => (_c) => {},
        'frame.instruction': () => (_c) => {
          if (_c.display === 'header') {
            const note = _c.util.el('div', 'header-instruction', _c.header);
            icon(_c.util, note, 'document', 23);
            _c.util.el('span','',note,_c.ctx.instruction);
          }
        },
        'frame.controls': (base, S) => (_c) => {
          base(_c);
          const { ctx, label, util } = _c;
          _c.submit = null;
          _c.makeAction = (parent) => {
            if (ctx.finish) return null;
            const b = util.el('button', 'action-control', parent, label);
            b.type = 'button';
            b.title = label;
            b.setAttribute('aria-label', label);
            b.addEventListener('click', ctx.submit);
            return b;
          };
        },
        'frame.tools': (_base, S) => (_c) => {
          const { util, placement, collide, decoys } = _c;
          const tools = util.el('div', 'toolbar', document.body);
          const actions = [
            ['New', 'M5 2h8l5 5v15H5z M13 2v5h5 M8 12h7 M8 16h7'],
            ['Open', 'M2 7h8l2 3h10v11H2z M2 7V4h7l2 3'],
            ['Share', 'M7 12l10-6 M7 12l10 6 M5 12a2.5 2.5 0 1 0 0 .1 M19 5a2.5 2.5 0 1 0 0 .1 M19 19a2.5 2.5 0 1 0 0 .1'],
            ['Search', 'M10.5 3a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15 M16 16l5 5'],
            ['Sort', 'M7 3v18 M3 7l4-4 4 4 M17 21V3 M13 17l4 4 4-4'],
          ];
          for (const [text, path] of actions) {
            const item = util.el('button', 'tool-button', tools);
            item.type = 'button';
            const svg = util.svg('svg', { width: 21, height: 21, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, item);
            util.svg('path', { d: path }, svg);
            util.el('span', '', item, text);
            if (text === 'Open' || text === 'Share') util.el('i', 'tool-divider', tools);
          }
          for (const item of decoys.slice(0, placement === 'footer' || placement === 'link' ? 1 : 2)) _c.decoyBtn(tools, item);
          if (collide && (collide.where === 'header' || !_c.wantFooter)) _c.decoyBtn(tools, collide.text, true);
          if (placement === 'header') _c.submit = _c.makeAction(tools);
          else if (placement === 'icon') {
            const button = _c.makeAction(tools);
            if (button) { button.textContent = '✓'; button.classList.add('icon-action'); }
            _c.submit = button;
          }
          icon(util, util.el('span', 'notify-mark', tools), 'bell', 22);
          util.el('span', 'avatar', tools, 'JD');
          if (_c.submit && _c.submit.parentElement === tools) tools.appendChild(_c.submit);
        },
        'frame.body': (_base, S) => (_c) => {
          const { util } = _c;
          const body = util.el('div', 'workspace', document.body);
          const sidebar = util.el('aside', 'workspace-sidebar', body);
          const sideRow = (label, symbol, active) => {
            const row = util.el('div', active ? 'side-active' : 'side-item', sidebar);
            icon(util, row, symbol, 24);
            util.el('span', '', row, label);
          };
          sideRow('Documents', 'folder', true);
          for (const [label, symbol] of [['Shared with me','people'],['Starred','star'],['Recent','clock'],['Trash','trash']]) sideRow(label,symbol);
          util.el('div', 'side-divider', sidebar);
          util.el('small', 'side-label', sidebar, 'Collections');
          for (const label of ['Projects','References','Templates','Archive']) sideRow(label,'folder');
          const area = util.el('main', 'workspace-area', body);
          util.el('h1', 'workspace-title', area, 'Documents');
          const finder = util.el('div', 'document-search', area);
          icon(util, finder, 'search', 21);
          util.el('span','',finder,'Search documents...');
          finder.setAttribute('aria-hidden', 'true');
          const views = util.el('div', 'document-view-tools', area);
          icon(util, util.el('span','view-active',views),'list',20);
          icon(util, util.el('span','',views),'grid',20);
          const backList = util.el('div', 'background-list', area);
          const columns = util.el('div', 'background-columns', backList);
          for (const title of ['Name','Size','Modified']) util.el('span','',columns,title);
          const names = ['Project Brief.pdf','Meeting Notes.docx','Roadmap.pptx','Budget.xlsx','Specifications.txt','Design Mockup.pdf','User Interviews.docx','Launch Plan.png','Team Status.docx','Competitive Analysis.pptx','Metrics.xlsx','Press Release.pdf'];
          const sizes = ['2.4 MB','1.1 MB','532 KB','3.8 MB','210 KB','1.6 MB','948 KB','4.2 MB','310 KB','1.3 MB','765 KB','2.9 MB'];
          const days = [22,20,18,16,14,12,10,9,7,5,3,1];
          names.forEach((name, index) => {
            const row = util.el('div', 'background-row', backList);
            for (const value of [name,sizes[index],`Apr ${days[index]}, 2024`]) util.el('span','',row,value);
          });
          Object.assign(_c, { body, area });
        },
        'frame.stage': (_base, S) => (_c) => {
          const { util } = _c;
          const win = util.el('section', 'task-window', _c.area);
          util.el('h2', 'task-title', win, 'Count Items');
          const content = util.el('div', 'task-content', win);
          const stage = util.el('main', 'ref-stage', content);
          stage.style.justifyContent = 'flex-start';
          stage.style.alignItems = 'stretch';
          const legend = util.el('aside', 'legend-pane', content);
          util.el('h3', '', legend, 'Icons in this list');
          for (const [symbol, name, color] of [['document','Document','#293d58'],['sheet','Spreadsheet','#16a37a'],['presentation','Presentation','#f3a600'],['pdf','PDF','#e32729'],['image','Image','#14a57c'],['pencil','Pencil','#293d58'],['more','More','#293d58']]) {
            const row = util.el('div', 'legend-item', legend);
            const mark = util.el('span', 'legend-icon', row);
            mark.style.color = color;
            icon(util, mark, symbol, 30);
            util.el('span', '', row, name);
          }
          Object.assign(_c, { stage });
        },
        'frame.panel': (_base, S) => (_c) => {
          if (_c.display !== 'panel') return;
          const { util, ctx } = _c;
          _c.body.classList.add('has-instruction-panel');
          const panel = util.el('aside', 'instruction-card', _c.body);
          util.el('strong', '', panel, 'Task');
          const message = util.el('p', '', panel);
          icon(util, message, 'document', 24);
          util.el('span','',message,ctx.instruction);
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          if (_c.display === 'toast') {
            const note = document.querySelector('.ref-note');
            if (note) {
              const mark = _c.util.el('span','ref-note-mark',note,'✓');
              mark.setAttribute('aria-hidden','true');
              note.prepend(mark);
            }
          }
        },
        'frame.footer': () => (_c) => {
          const { placement, wantFooter, collide, decoys, util } = _c;
          let { submit } = _c;
          if (wantFooter) {
            const footer = util.el('footer', 'action-footer', document.body);
            util.el('span', 'footer-hint', footer, 'All changes are saved automatically.');
            const group = util.el('div', 'footer-actions', footer);
            if (decoys.length > 1) _c.decoyBtn(group, decoys[1]);
            if (collide && collide.where === 'footer') _c.decoyBtn(group, collide.text, true);
            if (placement === 'footer') submit = _c.makeAction(group);
            if (placement === 'link') {
              const link = util.el('a', 'action-link', group, `${_c.label} ›`);
              link.href = '#';
              link.setAttribute('aria-label', _c.label);
              link.title = _c.label;
              link.addEventListener('click', (event) => { event.preventDefault(); _c.ctx.submit(); });
              submit = link;
            }
          }
          _c.submit = submit;
        },
        'frame.floating': () => (_c) => {
          if (_c.placement === 'floating') {
            const dock = _c.util.el('div', 'floating-action', document.body);
            _c.submit = _c.makeAction(dock);
          }
        },
        overlay: (base) => (ctx) => {
          const result = base(ctx);
          if (ctx.kind !== 'promo') return result;
          const u = ctx.util, box = result.el.querySelector('.ref-ov-box');
          box.classList.add('newsletter-box');
          const title = box.querySelector('.ref-ov-text');
          title.textContent = 'Stay in the loop';
          const art = u.el('div','promo-art',box);
          icon(u, art, 'newsletter', 110);
          box.prepend(art);
          const row = box.querySelector('.ref-ov-row');
          const sub = u.el('div','promo-subtitle',box,'Get product updates, tips and resources directly in your inbox.');
          box.insertBefore(sub,row);
          const email = u.el('input','promo-email',box);
          email.type = 'email';
          email.placeholder = 'Your email address';
          email.setAttribute('aria-label','Your email address');
          box.insertBefore(email,row);
          const primary = row.querySelector('.ref-ov-primary');
          if (primary) { primary.textContent = 'Subscribe'; row.prepend(primary); }
          if (result.dismiss) result.dismiss.textContent = 'Maybe later';
          const close = u.el('button','promo-close',box,'×');
          close.type = 'button';
          close.setAttribute('aria-label','Close');
          close.addEventListener('click',() => ctx.dismiss('close'));
          return { ...result, dismiss: close };
        },
      },
    },
  });
})();
