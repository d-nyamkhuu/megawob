// Design on use-legacy-app/terminal; defaults reproduce this scaffold.
env.widget({
  task: 'use-legacy-app',
  site: 'design-use-legacy-app-mainframe-lookup-05',
  name: 'design',
  split: 'train',
  scenarios: ['mainframe-lookup'],
  template: 'use-legacy-app/terminal',
  design: {
    inset: 0, maxWidth: 2200, maxHeight: 1400,
    terminalWidthInset: 48, terminalHeightInset: 40,
    hostBackground: '#050607', hostText: '#35ef83', hostBright: '#35ef83', hostCyan: '#64c6ff',
    hostInputText: '#64c6ff', hostInputBackground: '#050607', hostCaret: '#64c6ff', hostFocus: '#050607',
    parts: {
      title: () => () => {},
      menu: () => () => {},
      toolbar: () => () => {},
      sessions: () => () => {},
      display: (base, S) => (ctx) => {
        base(ctx);
        S.els.display.style.width = '100%';
        S.els.display.style.height = '100%';
        S.els.display.style.flex = '1 1 auto';
        S.els.display.style.fontSize = `${Math.min((S.geo.W-48)/48,(S.geo.H-36)/25.2)}px`;
      },
      mainMenu: (base, S) => (ctx) => {
        const screen = S.els.screens.menu;
        const line = (row,col,text,cls) => S.P.line(screen,row,col,text,cls);
        line(1,1,'ACCT100'); line(1,27,'Riverside Financial Systems','lg-cyan');
        line(1,60,'04/22/2024   14:27:10');
        line(2,31,'ACCOUNTS RECEIVABLE'); line(3,30,'OPERATIONS MAIN MENU','lg-cyan');
        line(4,27,'-----------------------------','lg-cyan');
        const labels = ['Customer Services','Batch Processing','System Administration','Spool Files       (12)','Exception Queues  (03)','Daily Reconciliation','Reference Tables','Message Center    (02)'];
        labels.forEach((label,i) => { line(5.3+i*1.2,15,String(i+1),'lg-cyan'); line(5.3+i*1.2,19,label); });
        line(19,14,'Select Option:'); S.P.field(screen,'option',19,29,2);
      },
      submenu: (base, S) => (ctx) => {
        base(ctx);
        const lines = S.els.screens.submenu.querySelectorAll('.lg-line');
        const choices = Array.from(lines).filter(node => /^\d\. /.test(node.textContent));
        choices.sort((a,b) => Number(a.textContent[0])-Number(b.textContent[0])).forEach((node,i) => {
          node.style.top = `${(5+i)/24*100}%`; node.style.left = '22.5%';
        });
      },
      status: (base, S) => (ctx) => {
        base(ctx);
        S.root.querySelector('.lg-status').style.display = 'none';
        S.els.status.style.top = `${20/24*100}%`;
        const legends = Array.from(S.els.display.children).filter(node => node.classList.contains('lg-cyan'));
        legends[0].textContent = 'F1=Help    F3=Exit     F7=Prev Menu    F8=Next Menu';
        legends[1].textContent = '';
        S.P.line(S.els.display,22,1,'--------------------------------------------------------------------------------','lg-cyan');
        S.P.line(S.els.display,23,75,'06/024','lg-cyan');
      },
      sync: (base, S) => (model) => {
        base(model);
        S.els.status.style.visibility = model.status === 'READY' ? 'hidden' : 'visible';
      },
    },
  },
});
