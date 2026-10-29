// Design of this site on the click-control/controls template (templates/click-control/controls.js): a project table behind a "Menu" menu.
env.widget({
  task: 'click-control',
  site: 'design-click-control-menu-05',
  name: 'design',
  split: 'train',
  scenarios: ['menu'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    menuLabel: 'Menu',
    parts: {
      // A project table behind the menu.
      menuPrelude: () => (ctx, content) => {
        const { util } = ctx;
        const proj=util.el('div','proj',content);
        const ph=util.el('div','proj-h',proj);util.el('h1','',ph,'Projects');
        const np=util.el('span','proj-new',ph);np.innerHTML='<svg viewBox="0 0 16 16" stroke="#15171c" stroke-width="2.4" stroke-linecap="round"><path d="M8 2v12M2 8h12"/></svg>New Project';
        const tabs=util.el('div','proj-tabs',proj);['All Projects','Active','Archived'].forEach((t,i)=>util.el('span','proj-tab'+(i===0?' on':''),tabs,t));
        const th=util.el('div','proj-row proj-th',proj);['Name','Status','Due Date','Owner'].forEach(t=>util.el('span','',th,t));
        const IC=['<path d="M5 3h9l5 5v13H5z" fill="#0082ef"/><path d="M14 3v5h5" fill="#bde4ff"/><path d="M8 10h6M8 13h8M8 16h8M8 19h8" stroke="#fff" stroke-width="1.3"/>','<path d="M3 21v-6h4v6zM9 21V10h4v11zM15 21V4h4v17z" fill="#7430ff"/><path d="M3 15h4M9 10h4M15 4h4" stroke="#a57aff" stroke-width="1.6"/>','<rect x="3" y="3" width="18" height="18" rx="3" fill="#00ae55"/><path d="M6 11l5 5 8-9" stroke="#fff" stroke-width="2.6" fill="none"/>','<ellipse cx="9" cy="8" rx="3.5" ry="4" fill="#bd7c00"/><ellipse cx="17" cy="8" rx="2.7" ry="3" fill="#bd7c00"/><path d="M2 20v-2c0-7 14-7 14 0v2zM17 13c4 0 5 3 5 7h-4v-3z" fill="#bd7c00"/>','<circle cx="12" cy="13" r="8" stroke="#f00059" stroke-width="2.5" fill="none"/><circle cx="12" cy="13" r="4.5" stroke="#f00059" stroke-width="2" fill="none"/><path d="M12 13L21 3M18 3h3v4" stroke="#f00059" stroke-width="2.6" fill="none"/>'];
        const BG=['#cfe3fb','#e2d8fb','#c9f2dc','#fbe58a','#fcc9dc'];
        const DOT=['#12c612','#777','#12c612','#1a73e8','#777'];
        const ROWS=[['Website Redesign','In Progress','Apr 28, 2025','Product Team'],['Marketing Campaign','Not Started','May 12, 2025','Marketing'],['Mobile App Launch','In Progress','May 30, 2025','Engineering'],['Customer Research','On Hold','Jun 10, 2025','UX Team'],['Q3 Planning','Not Started','Jun 28, 2025','Operations']];
        ROWS.forEach((r,i)=>{const row=util.el('div','proj-row',proj);
          const n=util.el('span','pn',row);const ic=util.el('i','pi',n);ic.style.background=BG[i];ic.innerHTML='<svg viewBox="0 0 24 24">'+IC[i]+'</svg>';util.el('b','',n,r[0]);
          const st=util.el('span','',row);const pill=util.el('em','pill'+(i===3?' hold':''),st);const d=util.el('s','',pill);d.style.background=DOT[i];util.el('span','',pill,r[1]);
          util.el('span','',row,r[2]);util.el('span','',row,r[3]);
          const k=util.el('span','kebab',row);k.innerHTML='<svg viewBox="0 0 6 20"><circle cx="3" cy="3" r="2"/><circle cx="3" cy="10" r="2"/><circle cx="3" cy="17" r="2"/></svg>';});
      },
      menuPanel: () => (panel, nodes) => panel.style.setProperty('--item-count', nodes.length),
    },
  },
});
