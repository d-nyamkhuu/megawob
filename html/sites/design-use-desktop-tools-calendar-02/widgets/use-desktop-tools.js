// Bare Notebook frame and the site's calendar form controls, layered on use-desktop-tools/workspace.
(function () {
  'use strict';
  const DESIGN_CSS="\n.as-app{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;border:0;border-radius:0;box-shadow:none}.as-top{display:none}.as-body{min-height:0}.as-btn{border-radius:3px;font-size:14px}.as-pane{border-radius:0}.se-main{padding:17px 22px!important;gap:0}.se-col{width:100%;max-width:none}.se-side{display:none}.se-box{border-radius:3px;box-shadow:none;height:39px;padding:0 12px}.se-go{border-radius:3px;height:39px;padding:0 22px}.se-card{border-bottom:1px solid var(--line);padding:8px 8px 4px}.se-card .se-title{font-family:inherit;font-size:19px}.se-pager{justify-content:center}.se-pg{border-radius:2px;width:32px;min-width:32px;height:32px}.se-fav{width:22px;height:22px;border-radius:1px}.se-url{font-size:12px}.se-desc{font-size:14px}.tk-main{padding:18px 22px}.tk-title{font-size:24px}.tk-date{border-radius:0;background:transparent}.tk-row{gap:12px;border-bottom:1px solid var(--line);padding:0 12px}.tk-name{font-size:15px}.tk-price{font-size:18px;width:68px}.tk-buy{width:65px}.tk-when{width:125px}.tk-trigger{border-radius:0;min-width:175px}.fd-wrap.left{flex-direction:row}.fd-cart{width:28%!important;border-left:3px solid var(--fg);border-radius:0;background:var(--panel)}.fd-menu{padding:12px 18px}.fd-card{border-radius:0}.fd-add{border-radius:2px}.fd-order{border-radius:2px}.fd-rname{font-size:22px}.fd-rmeta{font-size:12px}.fd-dialog,.as-dialog{border-radius:4px}.fl-form{border-radius:0}.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-title{height:30px;border-radius:0;background:var(--header,var(--panel));font-size:14px}.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}.at-pane-h{border-radius:0}.at-explorer{width:46%!important;max-width:none}.at-preview{padding:10px}.at-tree{font-family:inherit}.at-row svg{color:var(--fg)}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-sheet h2{font-family:inherit}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}.at-term{border-radius:0;border:0}.at-tscroll{padding:20px;font:15px/1.5 monospace}.at-term-tabs{background:var(--header,var(--panel))}.as-page{inset:0!important;display:flex;justify-content:stretch!important}.as-rail,.as-side{display:none}.as-col{flex:1!important;width:100%!important;border:0}.as-head{height:43px;background:var(--header,var(--panel));font-size:14px}.as-post{padding:13px 18px;gap:14px;border-bottom:1px solid var(--line)}.as-text{font-size:16px;line-height:1.4}.as-av{width:48px;height:48px;border-radius:4px;font-size:17px}.as-acts{max-width:440px;justify-content:flex-start;gap:22px}.as-act{border-radius:3px;height:30px;font-size:14px;padding:0 8px}.as-act svg{width:20px;height:20px}.as-photos{height:100px!important;border-radius:4px}.as-menu{border-radius:3px;min-width:210px}.as-mi{height:35px;font-size:14px}.as-confirm{border-radius:4px}.as-confirm button{border-radius:3px}.as-track{border-radius:0;width:15px;background:var(--line)}.as-thumb{border-radius:0}.as-name{font-size:16px}.as-handle,.as-time{font-size:13px}.as-quote{border-radius:3px}.as-link{border-radius:3px}.as-link.tall .as-link-img{height:65px}.as-post:has(.as-photos){min-height:200px}\n.design-header{background:#303336;color:#fff}.design-nav{color:#fff}.task-note{background:#f8f7f3;font-size:20px;font-weight:400}.task-note h2{font-weight:400;font-size:23px}.at-title{background:#ededeb}.at-tb{background:#f5f5f4;height:52px}.at-tool{font-family:monospace}.at-sheet h2{font-family:monospace;font-size:26px}.at-doc{font-family:monospace}.end-control{background:#f78008;border-color:#e67409}.design-footer{background:#edece8}";
  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-calendar-02',
    name: 'design',
    split: 'train',
    scenarios: ['calendar'],
    template: 'use-desktop-tools/workspace',
    design: {
      css: DESIGN_CSS,
      siteCssLast: true,
      calToday: true,
      agendaHidden: true,
      formAlways: true,
      formTitle: 'New Event',
      namePlaceholder: 'Add a title...',
      createLabel: 'Create event',
      cancelLabel: 'Cancel',
      calTime12: false,
      calNavText: false,
      calRowCount: null,
      calEventPanel: false,
      calSelectedAgenda: false,
      parts: {
        frame: (base) => (ctx) => {
          const { util } = ctx;
          const win = util.el('section', 'at-win', ctx.stage);
          const title = util.el('div', 'at-title', win);
          util.el('b', '', title, 'Notebook');
          const body = util.el('div', 'at-body', win);
          const main = util.el('div', 'at-main', body);
          const gear = util.el('button', '', title);
          gear.hidden = true;
          return { win, title, main, gear, appMenu: null };
        },
        calStart: () => (C) => {
          const footerLabel = document.querySelector('.footer-label');
          if (footerLabel) {
            const footerDate = C.util.el('span', 'footer-date', null, C.spec.day);
            footerLabel.insertBefore(footerDate, footerLabel.querySelector('em'));
          }
        },
        calFormPre: () => (C) => {
          C.util.el('label', 'calendar-label', C.form, 'Title');
        },
        calRows: () => (_C, avail) => {
          const rowH = Math.max(16, Math.min(34, avail / 18));
          return { rowH, rows: Math.floor(avail / rowH + 0.001) };
        },
        calFormFields: () => (C) => {
          const { util, spec, form } = C;
          const dateLabel = util.el('label', 'calendar-label', form, 'Date');
          const dateReadout = util.el('div', 'calendar-readout', form, spec.day);
          const timeFields = util.el('div', 'calendar-time-fields', form);
          const startLabel = util.el('label', 'calendar-label', timeFields, 'Start');
          const startButton = util.el('button', 'calendar-readout', startLabel, '12:00 PM');
          startButton.type = 'button';
          const durationLabel = util.el('label', 'calendar-label', timeFields, 'Duration');
          const durationButton = util.el('button', 'calendar-readout', durationLabel, '30 minutes');
          durationButton.type = 'button';
          const timePop = util.el('div', 'calendar-picker', form);
          timePop.hidden = true;
          const x = C.x = { startButton, durationButton, timePop, selectedStart: 24, selectedDuration: 1 };
          function timeMenu(kind) {
            timePop.replaceChildren();
            const choices = kind === 'start' ? Array.from({ length: C.N }, (_, i) => i) : [1, 2, 3, 4, 6, 8];
            for (const value of choices) {
              const option = util.el('button', '', timePop, kind === 'start' ? C.tl(value) : `${value * 30} minutes`);
              option.type = 'button';
              option.addEventListener('click', () => {
                if (kind === 'start') x.selectedStart = value;
                else x.selectedDuration = value;
                x.selectedStart = Math.min(x.selectedStart, C.N - x.selectedDuration);
                const old = C.ctx.model.event;
                let m = C.fam.calendarDrag(C.ctx.model, x.selectedStart, x.selectedStart + x.selectedDuration - 1);
                m = { ...m, form: true, event: { ...m.event, name: old ? old.name : '' } };
                C.ctx.update(m);
                timePop.hidden = true;
                C.paint(m);
              });
            }
            timePop.hidden = false;
          }
          startButton.addEventListener('click', () => timeMenu('start'));
          durationButton.addEventListener('click', () => timeMenu('duration'));
          const when = C.when;
          form.insertBefore(timeFields, dateLabel);
          dateReadout.classList.add('calendar-date');
          util.el('label', 'calendar-label x-cal', form, 'Calendar');
          const calSelect = util.el('div', 'calendar-readout x-cal', form, 'My Calendar');
          util.el('i', 'x-dot', calSelect);
          util.el('label', 'calendar-label x-notes', form, 'Notes (optional)');
          util.el('div', 'calendar-readout x-notes x-area', form, 'Add a note...');
          C.dateReadout = dateReadout;
          C.startButton = startButton;
          C.durationButton = durationButton;
          C.timePop = timePop;
          C.when = when;
        },
        calEventPainted: (base) => (C, m, e) => {
          base(C, m, e);
          if (e) {
            C.startButton.textContent = C.tl(e.start);
            C.durationButton.textContent = `${e.dur * 30} minutes`;
            C.x.selectedStart = e.start;
            C.x.selectedDuration = e.dur;
          } else if (C.when) C.when.textContent = '';
          C.cancel.hidden = !e;
        },
        calPaintForm: (base) => (C, m) => {
          base(C, m);
          if (C.field.get() !== (m.event ? m.event.name : '')) C.field.set(m.event ? m.event.name : '');
        },
      },
    },
  });
})();
