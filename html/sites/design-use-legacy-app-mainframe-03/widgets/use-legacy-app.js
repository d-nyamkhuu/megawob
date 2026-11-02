// Design on use-legacy-app/terminal; defaults reproduce this scaffold.
env.widget({
  task: 'use-legacy-app',
  site: 'design-use-legacy-app-mainframe-03',
  name: 'design',
  split: 'train',
  scenarios: ['mainframe'],
  template: 'use-legacy-app/terminal',
  design: {
    hostBackground: '#050505', hostText: '#7ccbff', hostBright: '#7ccbff', hostCyan: '#00f4b0',
    hostInputText: '#1d2630', hostInputBackground: '#fffda1', hostCaret: '#172a42', hostFocus: '#fffda1',
    hostSelection: '#9cd2ff',
    parts: {
      fit: (base, S) => (ctx) => ({ W: Math.max(200, ctx.stage.clientWidth), H: Math.max(180, ctx.stage.clientHeight) }),
      title: () => () => {},
      menu: () => () => {},
      toolbar: () => () => {},
      sessions: () => () => {},
      display: (base, S) => (ctx) => {
        const d = ctx.util.el('div', 'lg-terminal glass-terminal', S.root);
        const g = S.geo;
        d.style.fontSize = `${Math.max(13, Math.min(22, g.W / 72, g.H / 31))}px`;
        d.style.width = '100%'; d.style.height = '100%'; d.style.flex = '1';
        S.els.display = d; S.els.screens = {};
      },
      search: (base, S) => (ctx) => {
        const p = S.P, sc = S.els.screens.search, refs = S.refs;
        p.line(sc, 2, 3, 'ACME CORPORATION', 'lg-bright glass-heading-left');
        p.line(sc, 2, 31, 'JOB CONTROL - RECORD MAINTENANCE', 'lg-bright glass-heading-center');
        p.line(sc, 2, 75, 'JCM100', 'lg-bright glass-heading-right');
        p.line(sc, 3, 67, '2025/04/28  14:37:26', 'lg-bright glass-datetime');
        p.line(sc, 4, 3, 'Type choices, press Enter.', 'glass-command');
        const count = S.geo.W < 900 ? 31 : S.geo.W < 1300 ? 34 : 45;
        const col = S.geo.W < 1300 ? 40 : 41.7;
        const dots = (label) => `${label}  ${'. '.repeat(Math.max(1,Math.round((count-label.length-2)/2)))}:`;
        p.line(sc, 6, 10, dots('Record number'));
        p.field(sc, 'key', 6, col, 11);
        p.line(sc, 6, 51, '(F4 for list)');
        const rows = [
          [9,'Description',31],[10,'Cost center',8],[11,'Routing note',41],[12,'Retry limit',4],
          [15,'Status',7],[16,'Last updated',30],[17,'Updated by',10]
        ];
        for (const [row,label,width] of rows) {
          p.line(sc,row,10,dots(label),'glass-label');
          const visualWidth = S.geo.W >= 1300 ? ({ 9:33, 11:45, 12:5, 15:8, 17:11 }[row] || width) : width;
          const rule = p.line(sc,row,col,'','glass-rule'); rule.style.width = `${(row === 16 ? 7 : visualWidth) * .6}em`;
          if (row === 16) { const b = p.line(sc,row,col+6,'','glass-rule'); b.style.width = '7.2em'; const c = p.line(sc,row,col+15,'','glass-rule'); c.style.width = '4.8em'; }
        }
        refs.searchRows = Array.from({ length: S.spec.pageSize }, () => p.line(sc, 20, 2, '', 'glass-hidden'));
        refs.searchPage = p.line(sc, 20, 2, '', 'glass-hidden');
      },
      edit: (base, S) => (ctx) => {
        const p = S.P, sc = S.els.screens.edit, refs = S.refs;
        p.line(sc, 2, 3, 'ACME CORPORATION', 'lg-bright glass-heading-left');
        p.line(sc, 2, 31, 'JOB CONTROL - RECORD MAINTENANCE', 'lg-bright glass-heading-center');
        p.line(sc, 2, 75, 'JCM100', 'lg-bright glass-heading-right');
        p.line(sc, 3, 67, '2025/04/28  14:37:26', 'lg-bright glass-datetime');
        p.line(sc, 4, 3, 'Type choices, press Enter.', 'glass-command');
        refs.termKey = p.line(sc, 6, 10, '', 'glass-key-context');
        refs.owner = p.line(sc, 19, 10, '', 'glass-hidden');
        refs.company = p.line(sc, 19, 10, '', 'glass-hidden');
        refs.hostContext = p.line(sc, 19, 10, '', 'glass-hidden');
        p.line(sc, 6, 51, '(F4 for list)');
        const count = S.geo.W < 900 ? 31 : S.geo.W < 1300 ? 34 : 45;
        const col = S.geo.W < 1300 ? 40 : 41.7;
        p.line(sc,9,10,`Description  ${'. '.repeat(Math.max(1,Math.round((count-13)/2)))}:`,'glass-label');
        const descriptionRule = p.line(sc,9,col,'','glass-rule'); descriptionRule.style.width = S.geo.W >= 1300 ? '19.8em' : '18.6em';
        const fieldRows = { cost:10, memo:11, retries:12 };
        for (const f of S.spec.fields) {
          const row = fieldRows[f.id] || 9 + S.spec.fields.indexOf(f);
          p.line(sc,row,10,`${f.label}  ${'. '.repeat(Math.max(1,Math.round((count-f.label.length-2)/2)))}:`,'glass-label');
          p.field(sc,f.id,row,col,f.max);
        }
        for (const [row,label,width] of [[15,'Status',7],[16,'Last updated',30],[17,'Updated by',10]]) {
          p.line(sc,row,10,`${label}  ${'. '.repeat(Math.max(1,Math.round((count-label.length-2)/2)))}:`,'glass-label');
          const visualWidth = S.geo.W >= 1300 ? ({ 15:8, 17:11 }[row] || width) : width;
          const rule = p.line(sc,row,col,'','glass-rule'); rule.style.width = `${(row === 16 ? 7 : visualWidth) * .6}em`;
          if (row === 16) { const b = p.line(sc,row,col+6,'','glass-rule'); b.style.width = '7.2em'; const c = p.line(sc,row,col+15,'','glass-rule'); c.style.width = '4.8em'; }
        }
        refs.receipt = p.line(sc,20,10,'','glass-receipt');
      },
      status: (base, S) => (ctx) => {
        const p = S.P, d = S.els.display;
        S.els.status = p.line(d,21,3,'','glass-status');
        p.line(d,23,3,'F1=Help        F4=List        F5=Reset        F7=Backward        F8=Forward','glass-footer');
        p.line(d,23,76,'04/015','glass-page');
        S.els.help = ctx.util.el('div','lg-term-help',d,S.D.helpText);
        S.refs.oia = ctx.util.el('span','glass-hidden',d);
      },
    },
  },
});
