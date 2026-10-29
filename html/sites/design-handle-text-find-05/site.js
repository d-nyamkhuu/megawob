// Design on templates/site/ui-text-find-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: "design-handle-text-find-05",
    styles: ['site.css'],
    template: 'site/handle-text-find-01',
    design: {
      parts: {
        'frame.57': (base) => function (c) {
          const {ctx, u, head, work, center, note, stage, foot} = c;
          document.body.classList.add('gnome');
          const svg = (paths) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + paths + '</svg>';
          const page = '<path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6M9 15h6M9 18h4"/>';
          const controls = u.el('div', 'native-controls', document.body);
          ['<path d="M5 12h14"/>','<rect x="5" y="5" width="14" height="14" rx="1"/>','<path d="m6 6 12 12M18 6 6 18"/>'].forEach(p => {u.el('span', '', controls).innerHTML = svg(p);});
          const toolbar = head.querySelector('.tools');
          toolbar.replaceChildren();
          const glyphs = [
            ['New', '<path d="M6 3h8l4 4v14H6zM14 3v5h4"/>'],
            ['Open', '<path d="M3 8V5h7l2 3h9l-4 12H3zM3 11h16"/>'],
            ['Save', '<path d="M4 3h15l2 2v16H3V3zM7 3v7h10V3M7 21v-8h10v8M14 5v3"/>'],
            ['Print', '<path d="M7 8V3h10v5M7 17H3V9h18v8h-4M7 14h10v7H7zM17 11h1"/>'],
            ['Undo', '<path d="m8 4-5 5 5 5M3 9h10a7 7 0 0 1 0 14"/>'],
            ['Redo', '<path d="m16 4 5 5-5 5M21 9H11a7 7 0 0 0 0 14"/>']
          ];
          glyphs.forEach(([label,p], i) => {
            const item = u.el('span', 'format-icon' + (i === 3 || i === 4 ? ' group-start' : '') + (i === 5 ? ' muted' : ''), toolbar);
            item.title = label; item.innerHTML = svg(p);
          });
          ['Sans Serif','11'].forEach((label,i) => {const item = u.el('span', 'format-select' + (i ? ' size-select' : ''), toolbar, label); item.innerHTML += svg('<path d="m8 10 4 4 4-4"/>');});
          ['B','I','U'].forEach((label,i) => u.el('span', 'format-letter letter-' + i, toolbar, label));
          const rest = [
            ['Align left','<path d="M4 5h16M4 10h11M4 15h16M4 20h11"/>'],
            ['Align center','<path d="M4 5h16M7 10h10M4 15h16M7 20h10"/>'],
            ['Align right','<path d="M4 5h16M9 10h11M4 15h16M9 20h11"/>'],
            ['Bulleted list','<path d="M9 5h12M9 12h12M9 19h12"/><circle cx="3" cy="5" r="1" fill="currentColor"/><circle cx="3" cy="12" r="1" fill="currentColor"/><circle cx="3" cy="19" r="1" fill="currentColor"/>'],
            ['Numbered list','<path d="M10 5h11M10 12h11M10 19h11M2 3h2v4M2 11q4-2 2 1l-2 2h3M2 18h3l-2 2h2"/>'],
            ['Link','<path d="m10 13 4-4M9 16l-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0M15 8l2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0" transform="translate(0 -1)"/>'],
            ['Image','<rect x="3" y="3" width="18" height="18"/><path d="m3 18 6-7 4 4 3-4 5 7" fill="currentColor"/><circle cx="16" cy="7" r="1"/>'],
            ['Table','<rect x="3" y="3" width="18" height="18"/><path d="M3 8h18M3 14h18M10 8v13"/>']
          ];
          rest.forEach(([label,p],i) => {const item = u.el('span','format-icon' + ([0,3,5].includes(i) ? ' group-start' : ''),toolbar);item.title=label;item.innerHTML=svg(p);});
          const summary = u.el('section','document-summary',work);
          work.prepend(summary);
          const thumb = u.el('div','document-thumbnail',summary);
          thumb.innerHTML = '<svg viewBox="0 0 132 128"><defs><linearGradient id="photo" x2="1" y2="1"><stop stop-color="#74a4ed"/><stop offset="1" stop-color="#3480d5"/></linearGradient></defs><path d="M110 1v20h20" fill="#f0f2f5"/><rect x="23" y="25" width="57" height="45" rx="3" fill="url(#photo)"/><path d="m33 62 13-19 10 13 8-8 9 14" fill="#eaf5ff"/><path d="M90 34h18M90 46h18M90 58h18M90 69h18M23 85h85M23 94h85M23 103h66" fill="none" stroke="#bbc7d5" stroke-width="3.5"/></svg>';
          const details = u.el('div','summary-details',summary);
          u.el('h1','',details,'Travel Plan');
          u.el('div','summary-meta',details,'Draft   •   Last edited today at 10:24 AM');
          u.el('div','summary-description',details,'Itinerary, booking details, and important information for our upcoming trip.');
          const stats = u.el('div','summary-counts',summary);
          [['3','Pages'],['1,248','Words'],['7,315','Characters']].forEach(([value,label]) => {const cell = u.el('div','summary-count',stats);u.el('strong','',cell,value);u.el('span','',cell,label);});
          const rail = work.querySelector('.rail');
          rail.replaceChildren();
          ['Overview','Itinerary','Flights','Hotels','Activities','Budget','Notes'].forEach((label,i) => {const row=u.el('div',i ? '' : 'active',rail);u.el('span','rail-icon',row).innerHTML=svg(page);u.el('span','rail-label',row,label);});
          const inspector = c.aside;
          inspector.replaceChildren();
          u.el('h2','',inspector,'Document Properties');
          const properties=u.el('div','properties-grid',inspector);
          [['Title','Travel Plan'],['Type','Rich Text Document'],['Size','72 KB'],['Created','Apr 3, 2025, 9:14 AM'],['Modified','Apr 5, 2025, 10:24 AM']].forEach(([label,value],i) => {u.el('span','property-label',properties,label);u.el('span',i ? 'property-value' : 'property-value title-value',properties,value);});
          [['Statistics',[['Pages','3'],['Words','1,248'],['Characters','7,315']]],['Readability',[['Reading level','8th grade'],['Estimated time','6 min']]]].forEach(([title,rows]) => {const section=u.el('section','property-section',inspector);u.el('h3','',section,title);const grid=u.el('div','properties-grid',section);rows.forEach(([label,value])=>{u.el('span','property-label',grid,label);u.el('span','property-value',grid,value);});});
          if(ctx.display === 'header') {details.querySelector('.summary-description').replaceWith(note);note.classList.add('summary-instruction');}
          if(ctx.display === 'panel') {stats.replaceWith(note);note.classList.add('summary-panel');}
          if(ctx.display === 'toast') {c.shell.appendChild(note);note.classList.add('status-instruction');}
          const endControls = u.el('div','end-controls' + (c.endPlacement && c.endPlacement !== 'footer' ? ' bottom-end' : ''),document.body);
          if(c.submit) endControls.appendChild(c.submit);
          [...foot.querySelectorAll('.submit')].forEach(b => endControls.appendChild(b));
          foot.hidden = true;
          return base(c);
        },
        'overlay.7': (base) => function (c) {
          return base(c);
        }
      }
    },
  });
})();
