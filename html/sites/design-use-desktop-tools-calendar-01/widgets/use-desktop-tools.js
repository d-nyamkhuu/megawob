// Design of this site on the use-desktop-tools/workspace template: an organizer note with a Start / End row, a duration
// picker and placeholder location / notes fields.
(function () {
  'use strict';
  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-calendar-01',
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
      namePlaceholder: '',
      frame: 'plain',
      frameTitle: 'New Event',
      siteCssLast: true,
      css: "\n.as-app{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;border:0;border-radius:0;box-shadow:none}.as-top{display:none}.as-body{min-height:0}.as-btn{border-radius:3px;font-size:14px}.as-pane{border-radius:0}.se-main{padding:17px 22px!important;gap:0}.se-col{width:100%;max-width:none}.se-side{display:none}.se-box{border-radius:3px;box-shadow:none;height:39px;padding:0 12px}.se-go{border-radius:3px;height:39px;padding:0 22px}.se-card{border-bottom:1px solid var(--line);padding:8px 8px 4px}.se-card .se-title{font-family:inherit;font-size:19px}.se-pager{justify-content:center}.se-pg{border-radius:2px;width:32px;min-width:32px;height:32px}.se-fav{width:22px;height:22px;border-radius:1px}.se-url{font-size:12px}.se-desc{font-size:14px}.tk-main{padding:18px 22px}.tk-title{font-size:24px}.tk-date{border-radius:0;background:transparent}.tk-row{gap:12px;border-bottom:1px solid var(--line);padding:0 12px}.tk-name{font-size:15px}.tk-price{font-size:18px;width:68px}.tk-buy{width:65px}.tk-when{width:125px}.tk-trigger{border-radius:0;min-width:175px}.fd-wrap.left{flex-direction:row}.fd-cart{width:28%!important;border-left:3px solid var(--fg);border-radius:0;background:var(--panel)}.fd-menu{padding:12px 18px}.fd-card{border-radius:0}.fd-add{border-radius:2px}.fd-order{border-radius:2px}.fd-rname{font-size:22px}.fd-rmeta{font-size:12px}.fd-dialog,.as-dialog{border-radius:4px}.fl-form{border-radius:0}.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-title{height:30px;border-radius:0;background:var(--header,var(--panel));font-size:14px}.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}.at-pane-h{border-radius:0}.at-explorer{width:46%!important;max-width:none}.at-preview{padding:10px}.at-tree{font-family:inherit}.at-row svg{color:var(--fg)}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-sheet h2{font-family:inherit}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}.at-term{border-radius:0;border:0}.at-tscroll{padding:20px;font:15px/1.5 monospace}.at-term-tabs{background:var(--header,var(--panel))}.as-page{inset:0!important;display:flex;justify-content:stretch!important}.as-rail,.as-side{display:none}.as-col{flex:1!important;width:100%!important;border:0}.as-head{height:43px;background:var(--header,var(--panel));font-size:14px}.as-post{padding:13px 18px;gap:14px;border-bottom:1px solid var(--line)}.as-text{font-size:16px;line-height:1.4}.as-av{width:48px;height:48px;border-radius:4px;font-size:17px}.as-acts{max-width:440px;justify-content:flex-start;gap:22px}.as-act{border-radius:3px;height:30px;font-size:14px;padding:0 8px}.as-act svg{width:20px;height:20px}.as-photos{height:100px!important;border-radius:4px}.as-menu{border-radius:3px;min-width:210px}.as-mi{height:35px;font-size:14px}.as-confirm{border-radius:4px}.as-confirm button{border-radius:3px}.as-track{border-radius:0;width:15px;background:var(--line)}.as-thumb{border-radius:0}.as-name{font-size:16px}.as-handle,.as-time{font-size:13px}.as-quote{border-radius:3px}.as-link{border-radius:3px}.as-link.tall .as-link-img{height:65px}.as-post:has(.as-photos){min-height:200px}\n.design-header{background:#303336;color:#fff}.design-nav{color:#fff}.task-note{background:#f8f7f3;font-size:20px;font-weight:400}.task-note h2{font-weight:400;font-size:23px}.at-title{background:#ededeb}.at-tb{background:#f5f5f4;height:52px}.at-tool{font-family:monospace}.at-sheet h2{font-family:monospace;font-size:26px}.at-doc{font-family:monospace}.end-control{background:#f78008;border-color:#e67409}.design-footer{background:#edece8}",
      agendaHidden: true,
      formTitle: 'New Event',
      parts: {
        calTimeLabel: () => (C, i) => C.fam.timeLabel(i, false).replace(/(am|pm)$/i, ' $1').toUpperCase(),
        calRows: () => (C, avail) => {
          const rowH = Math.max(20, Math.min(34, avail / 18));
          return { rowH, rows: Math.floor(avail / rowH) };
        },
        calLine: () => (C, i) => {
          const l = C.util.el('div', 'at-hh' + (i % 2 ? ' half' : ''), C.col);
          l.style.top = `${i * C.rowH}px`;
          if (i % 2 === 0) {
            const s = C.util.el('span', '', C.gut, C.tl(i).replace(':00', '').toUpperCase());
            s.style.top = `${i * C.rowH}px`;
          }
        },
        calFormPre: () => (C) => C.util.el('label', 'calendar-label', C.form, 'Title'),
        calFormFields: (base, S) => (C) => {
          const { util, form } = C;
          C.x = S.timePicker(C, {
            end: true,
            durationIn: 'form',
            between: () => {
              const allDay = util.el('div', 'nb-allday', form);
              util.el('i', '', allDay);
              util.el('span', '', allDay, 'All day');
              util.el('label', 'calendar-label', form, 'Location  (optional)');
              util.el('div', 'nb-field ph', form, 'Add a location');
              util.el('label', 'calendar-label', form, 'Notes  (optional)');
              util.el('div', 'nb-field nb-notes ph', form, 'Add notes');
            },
          });
        },
        calFormBuilt: () => (C) => {
          const submit = document.querySelector('.end-control');
          if (submit) C.row.append(submit);
        },
        calEventPainted: () => (C, m, e) => { if (e) C.x.sync(e); },
        calStarted: () => (C) => {
          if (!C.ctx.model.event) C.name.focus({ preventScroll: true });
        },
      },
    },
  });
})();
