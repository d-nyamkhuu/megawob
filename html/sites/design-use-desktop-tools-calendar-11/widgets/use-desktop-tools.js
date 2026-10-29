// Design of this site on the use-desktop-tools/workspace template: a notebook calendar with the date and start time on one
// row and extra location / notes fields in the form.
(function () {
  'use strict';
  const SHORT_DAY = /\b(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/g;
  const SHORT_MONTH = /\b(January|February|March|April|June|July|August|September|October|November|December)\b/g;
  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-calendar-11',
    name: 'design',
    split: 'train',
    scenarios: ['calendar'],
    template: 'use-desktop-tools/workspace',
    design: {
      calTime12: false,
      calNavText: false,
      calRowCount: null,
      calEventPanel: false,
      calSelectedAgenda: false,
      frame: 'plain',
      frameTitle: 'Notebook',
      siteCssLast: true,
      css: "\n.as-app{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;border:0;border-radius:0;box-shadow:none}.as-top{display:none}.as-body{min-height:0}.as-btn{border-radius:3px;font-size:14px}.as-pane{border-radius:0}.se-main{padding:17px 22px!important;gap:0}.se-col{width:100%;max-width:none}.se-side{display:none}.se-box{border-radius:3px;box-shadow:none;height:39px;padding:0 12px}.se-go{border-radius:3px;height:39px;padding:0 22px}.se-card{border-bottom:1px solid var(--line);padding:8px 8px 4px}.se-card .se-title{font-family:inherit;font-size:19px}.se-pager{justify-content:center}.se-pg{border-radius:2px;width:32px;min-width:32px;height:32px}.se-fav{width:22px;height:22px;border-radius:1px}.se-url{font-size:12px}.se-desc{font-size:14px}.tk-main{padding:18px 22px}.tk-title{font-size:24px}.tk-date{border-radius:0;background:transparent}.tk-row{gap:12px;border-bottom:1px solid var(--line);padding:0 12px}.tk-name{font-size:15px}.tk-price{font-size:18px;width:68px}.tk-buy{width:65px}.tk-when{width:125px}.tk-trigger{border-radius:0;min-width:175px}.fd-wrap.left{flex-direction:row}.fd-cart{width:28%!important;border-left:3px solid var(--fg);border-radius:0;background:var(--panel)}.fd-menu{padding:12px 18px}.fd-card{border-radius:0}.fd-add{border-radius:2px}.fd-order{border-radius:2px}.fd-rname{font-size:22px}.fd-rmeta{font-size:12px}.fd-dialog,.as-dialog{border-radius:4px}.fl-form{border-radius:0}.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-title{height:30px;border-radius:0;background:var(--header,var(--panel));font-size:14px}.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}.at-pane-h{border-radius:0}.at-explorer{width:46%!important;max-width:none}.at-preview{padding:10px}.at-tree{font-family:inherit}.at-row svg{color:var(--fg)}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-sheet h2{font-family:inherit}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}.at-term{border-radius:0;border:0}.at-tscroll{padding:20px;font:15px/1.5 monospace}.at-term-tabs{background:var(--header,var(--panel))}.as-page{inset:0!important;display:flex;justify-content:stretch!important}.as-rail,.as-side{display:none}.as-col{flex:1!important;width:100%!important;border:0}.as-head{height:43px;background:var(--header,var(--panel));font-size:14px}.as-post{padding:13px 18px;gap:14px;border-bottom:1px solid var(--line)}.as-text{font-size:16px;line-height:1.4}.as-av{width:48px;height:48px;border-radius:4px;font-size:17px}.as-acts{max-width:440px;justify-content:flex-start;gap:22px}.as-act{border-radius:3px;height:30px;font-size:14px;padding:0 8px}.as-act svg{width:20px;height:20px}.as-photos{height:100px!important;border-radius:4px}.as-menu{border-radius:3px;min-width:210px}.as-mi{height:35px;font-size:14px}.as-confirm{border-radius:4px}.as-confirm button{border-radius:3px}.as-track{border-radius:0;width:15px;background:var(--line)}.as-thumb{border-radius:0}.as-name{font-size:16px}.as-handle,.as-time{font-size:13px}.as-quote{border-radius:3px}.as-link{border-radius:3px}.as-link.tall .as-link-img{height:65px}.as-post:has(.as-photos){min-height:200px}\n.design-header{background:#303336;color:#fff}.design-nav{color:#fff}.task-note{background:#f8f7f3;font-size:20px;font-weight:400}.task-note h2{font-weight:400;font-size:23px}.at-title{background:#ededeb}.at-tb{background:#f5f5f4;height:52px}.at-tool{font-family:monospace}.at-sheet h2{font-family:monospace;font-size:26px}.at-doc{font-family:monospace}.end-control{background:#f78008;border-color:#e67409}.design-footer{background:#edece8}",
      agendaHidden: true,
      namePlaceholder: 'Add a title',
      parts: {
        calHead: (base) => (C) => {
          base(C);
          const h3 = C.head.querySelector('h3');
          h3.textContent = C.spec.day.replace(SHORT_DAY, (w) => w.slice(0, 3)).replace(SHORT_MONTH, (w) => w.slice(0, 3));
        },
        calRows: () => (C, avail) => {
          const rowH = Math.max(16, Math.round(avail / 27 * 2) / 2);
          return { rowH, rows: Math.floor(avail / rowH) };
        },
        calFormPre: () => (C) => C.util.el('label', 'calendar-label title-label', C.form, 'Title'),
        calFormFields: (base, S) => (C) => {
          const { util, form } = C;
          const p = C.x = S.timePicker(C);
          p.dateLabel.hidden = true;
          const startRow = util.el('div', 'calendar-start-row', p.startLabel);
          startRow.append(p.dateReadout, p.startButton);
          p.dateReadout.classList.add('calendar-date');
          p.dateReadout.textContent = C.head.querySelector('h3').textContent;
          const dateIcon = util.el('span', 'calendar-date-icon', p.dateReadout);
          dateIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 5h18v17H3zM3 9h18M7 2v6M17 2v6"/><path d="M6 12h2m2 0h2m2 0h2m2 0h1M6 15h2m2 0h2m2 0h2m2 0h1M6 18h2m2 0h2m2 0h2"/></svg>';
          p.startButton.classList.add('calendar-select');
          p.durationButton.classList.add('calendar-select');
          util.el('label', 'calendar-label extra', form, 'Location (optional)');
          const locIn = util.el('input', 'extra', form); locIn.type = 'text'; locIn.placeholder = 'Add a location';
          util.el('label', 'calendar-label extra', form, 'Notes (optional)');
          const notesIn = util.el('textarea', 'extra notes', form); notesIn.placeholder = 'Add notes';
        },
        calEventPainted: () => (C, m, e) => { if (e) C.x.sync(e); },
      },
    },
  });
})();
