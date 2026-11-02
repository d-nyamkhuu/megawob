(function () {
  'use strict';
  const palette = { bg: '#f4f7fd', panel: '#fff', fg: '#111', muted: '#555', line: '#c9d3e6' };
  const CATS = ['Arts & Humanities','Business & Economy','Computers & Internet','Education','Entertainment','Health & Fitness','News & Media','Recreation & Sports','Reference','Regional','Science','Society & Culture','Travel'];
  const FEAT = ["Today's Picks",'New Sites','Most Popular',"Editor's Choice"];
  const POP = [['Amazon.com','CNN','Disney','eBay','Excite','GeoCities'],['Lycos','Microsoft','NBC','Netflix','Newsweek','RealAudio'],['Reuters','SportsLine','TripAdvisor','USA Today','Yahoo!','ZDNet']];
  const DETAILS = [['Keep the top-left corner in the','same position.'],['Resize using the bottom-right handle','only.'],['The dashed outline shows the','target size.']];
  function links(u, parent, items) {
    const ul = u.el('ul', '', parent);
    for (const text of items) {
      const a = u.el('a', '', u.el('li', '', ul), text);
      a.href = '#';
      a.onclick = e => e.preventDefault();
    }
  }
  const parts = {
    'frame.layout': base => c => {
      base(c);
      c.display = c.ctx.display || 'header';
    },
    'frame.placement': base => c => {
      base(c);
      c.wantFooter = true;
      c.nav = c.sidebar = false;
    },
    'frame.header': () => c => {
      const u = c.util;
      document.body.className = 'design webguide mode-' + c.display + (c.display === 'toast' ? ' has-instruction-toast' : '');
      document.documentElement.style.setProperty('--font', 'Arial, Helvetica, sans-serif');
      const shell = u.el('div', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const logo = u.el('div', 'logo', head);
      u.el('span', 'w1', logo, 'Web');
      u.el('span', 'w2', logo, 'Guide');
      u.el('div', 'tagline', head, 'Your Guide to the Internet');
      u.el('span', 'find-label', head, 'Find It Fast:');
      u.el('div', 'find-input', head);
      const sb = u.el('button', 'find-btn', head, 'Search');
      sb.type = 'button';
      sb.onclick = () => env.log('search');
      const hl = u.el('div', 'head-links', head);
      ['Help','Site Map','Contact Us'].forEach((t, i) => {
        if (i) u.el('span', 'sep', hl, '|');
        const a = u.el('a', '', hl, t);
        a.href = '#';
        a.onclick = e => e.preventDefault();
      });
      u.el('div', 'rule', shell);
      u.el('div', 'right-bg', shell);
      u.el('div', 'task-head', shell, c.display === 'hidden' ? 'Directory Help' : 'Your Task');
      const content = u.el('div', 'content', shell);
      const toolbar = u.el('div', 'directory-tools', shell);
      Object.assign(c, { shell, content, toolbar, header: content });
    },
    'frame.nav': () => c => {
      const u = c.util;
      const side = u.el('nav', 'cats', c.shell);
      u.el('div', 'strip', side, 'Browse by Category');
      links(u, side, CATS);
      const sf = u.el('nav', 'feats', c.shell);
      u.el('div', 'strip', sf, 'Special Features');
      links(u, sf, FEAT);
      u.el('h1', 'welcome', c.shell, 'Welcome to WebGuide');
      u.el('div', 'welcome-sub', c.shell, 'A Directory of the Best Sites on the Web');
      u.el('div', 'rule2', c.shell);
      const pop = u.el('section', 'popular', c.shell);
      u.el('div', 'strip', pop, 'Popular Links');
      const cols = u.el('div', 'pop-cols', pop);
      for (const col of POP) links(u, cols, col);
    },
    'frame.instruction': base => c => {
      base(c);
      const note = c.content.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('task-note');
        const text = note.textContent;
        note.textContent = '';
        c.util.el('div', 'instruction', note, text);
      }
    },
    'frame.tools': base => c => {
      const header = c.header;
      c.header = c.toolbar;
      base(c);
      c.header = header;
    },
    'frame.body': () => c => {
      const u = c.util;
      const aside = u.el('aside', 'aside', c.shell);
      u.el('h3', '', aside, 'Details:');
      const ul = u.el('ul', '', aside);
      for (const lines of DETAILS) {
        const li = u.el('li', '', ul);
        for (const text of lines) u.el('span', 'detail-line', li, text);
      }
      c.body = c.content;
    },
    'frame.panel': base => c => {
      base(c);
      const panel = c.content.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('task-note', 'instruction-panel');
        panel.querySelector('.ref-panel-text').classList.add('instruction');
      }
    },
    'frame.stage': () => c => {
      c.stage = c.util.el('main', 'stage', c.content);
      c.stage.dataset.role = 'stage';
    },
    'frame.toast': base => c => {
      base(c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note', 'instruction-toast');
        note.querySelector('.ref-note-text').classList.add('instruction');
        note.querySelector('.ref-note-x').classList.add('note-close');
        c.content.appendChild(note);
      }
      if (c.display !== 'hidden' && c.display !== 'toast') {
        const box = c.content.querySelector('.task-note');
        const text = box.querySelector('.instruction');
        const style = getComputedStyle(box), ts = getComputedStyle(text);
        const available = box.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
        const original = parseFloat(ts.fontSize);
        let font = original;
        while (available > 0 && text.scrollHeight > available + 1 && font > original * .65) {
          font -= original * .025;
          text.style.fontSize = font + 'px';
          text.style.lineHeight = font * 1.25 + 'px';
        }
      }
    },
    'frame.footer': base => c => {
      base(c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      c.shell.appendChild(foot);
    },
    'frame.floating': base => c => {
      base(c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) c.shell.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u=ctx.util,kind=ctx.kind;const el=u.el('section','obstruction obstruction-'+kind,document.body);el.dataset.role='overlay';const box=u.el('div','obstruction-box',el);
      const title={cookie:'Your privacy',toast:'Changes saved',chat:'Support',promo:'WebGuide update',banner:'Service notice'}[kind];
      const text={cookie:'This site stores optional cookies.',toast:'Your changes have been saved.',chat:'Need a hand finding a site?',promo:'Explore the latest additions to the directory.',banner:'You are viewing a shared directory.'}[kind];
      const label=kind==='cookie'?'Reject optional':'Close';
      u.el('h3','',box,title);u.el('p','',box,text);
      const dismiss=u.el('button','dismiss',box,label);dismiss.type='button';dismiss.onclick=()=>ctx.dismiss('close');
      if(kind==='cookie'){const accept=u.el('button','dismiss',box,'Accept optional');accept.onclick=()=>ctx.dismiss('accept');}
      return{el,dismiss,ttlSteps:kind==='toast'?5:0};
    },
  };
  env.site({
    name: 'design-resize-element-ghost-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { 'design-resize-element-ghost-10': palette }, LOW_THEME: palette, ACCENTS: ['#0f3f9e'], LOW_ACCENTS: ['#0f3f9e'], parts },
  });
})();
