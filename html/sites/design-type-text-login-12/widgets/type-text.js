env.widget({
  task: 'type-text',
  site: 'design-type-text-login-12',
  name: 'design',
  split: 'train',
  scenarios: ['login'],
  template: 'type-text/fields',
  design: {
    cardWidth: null,
    parts: {
      // The login form sits in a collapsed "Task controls" panel of a settings page; the panel is the anchor.
      begin: (base, S) => (ctx) => {
        const U = ctx.util;
        const page=U.el('div','lg-page',ctx.stage);
        U.el('h1','lg-welcome',page,'Welcome');U.el('p','lg-sub',page,'Sign in to continue');
        const pref=U.el('section','lg-panel lg-pref',page);
        const ph=U.el('div','lg-phead',pref);
        U.el('span','lg-ico',ph).innerHTML='<svg viewBox="0 0 24 24" width="100%" height="100%"><path fill="#161616" d="M19.4 13a7.5 7.5 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.4 7.4 0 0 0-1.7-1L15 3.2h-4l-.4 2.7a7.400 7.400 0 0 0-1.700 1l-2.500-1-2 3.500L6.600 11a7.500 7.500 0 0 0 0 2l-2.100 1.600 2 3.500 2.500-1a7.400 7.400 0 0 0 1.700 1l.4 2.700h4l.4-2.700a7.400 7.400 0 0 0 1.700-1l2.500 1 2-3.500zM13 15.500a3.500 3.500 0 1 1 0-7 3.500 3.500 0 0 1 0 7z" transform="translate(-1 0)"/></svg>';
        U.el('span','lg-ptitle',ph,'Preferences');U.el('span','lg-chev',ph).innerHTML='<svg viewBox="0 0 16 16" width="100%" height="100%"><path d="M3 5.500l5 5 5-5" fill="none" stroke="#161616" stroke-width="2.400"/></svg>';
        const pb=U.el('div','lg-pbody',pref);
        const mk=(l,v)=>{const g=U.el('div','lg-pf',pb);U.el('div','lg-pl',g,l);const s=U.el('div','lg-sel',g);U.el('span','',s,v);U.el('span','lg-chev',s).innerHTML='<svg viewBox="0 0 16 16" width="100%" height="100%"><path d="M3 5.500l5 5 5-5" fill="none" stroke="#161616" stroke-width="2.400"/></svg>';return g;};
        mk('Theme','Light').classList.add('w1');mk('Language','English').classList.add('w2');
        const nt=U.el('div','lg-pf w3',pb);U.el('div','lg-pl',nt,'Notifications');const tg=U.el('div','lg-tog',nt);U.el('span','lg-sw',tg).appendChild(document.createElement('i'));U.el('span','',tg,'On');
        const task=U.el('section','lg-panel lg-task',page);
        const th=U.el('div','lg-thead',task);
        U.el('span','lg-ico',th).innerHTML='<svg viewBox="0 0 24 24" width="100%" height="100%"><rect x="4" y="10" width="16" height="12" rx="2" fill="#161616"/><path d="M7.500 10V7a4.500 4.500 0 0 1 9 0v3" fill="none" stroke="#161616" stroke-width="2.500"/><circle cx="12" cy="16" r="1.600" fill="#e9e6df"/></svg>';
        const tt=U.el('div','lg-ttext',th);U.el('div','lg-ttitle',tt,'Task controls');const tsub=U.el('div','lg-tsub',tt,'Hidden for focus. Click to show the login form.');
        const showBtn=U.el('button','lg-show',th,'Show controls');showBtn.type='button';
        U.el('span','lg-chev r',th).innerHTML='<svg viewBox="0 0 16 16" width="100%" height="100%"><path d="M5.500 3l5 5-5 5" fill="none" stroke="#161616" stroke-width="2.400"/></svg>';
        const tbody=U.el('div','lg-tbody',task);
        showBtn.addEventListener('click',()=>{const open=task.classList.toggle('open');showBtn.textContent=open?'Hide controls':'Show controls';tsub.textContent=open?'Enter your login details below.':'Hidden for focus. Click to show the login form.';S.st.collapsed=!open;ctx.reanchor();});
        Object.assign(S.st, { host: tbody, collapsed: true, showBtn, task });
      },
      anchors: (base, S) => () => [S.st.task],
      locate: (base, S) => (t) => (S.st.collapsed && S.st.showBtn ? S.ctx.util.center(S.st.showBtn) : base(t)),
    },
  },
});
