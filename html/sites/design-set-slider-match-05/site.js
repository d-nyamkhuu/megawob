// Fluent Photos workspace, with the shared episode controls and contract.
(function () {
  'use strict';
  env.site({
    name: 'design-set-slider-match-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/base',
    design: {parts: {
      'frame.placement': (base) => (_c) => {
        base(_c);
        // Most episodes keep the Photos action in the bottom bar.
        if (_c.placement === 'header') _c.placement = 'footer';
        _c.wantFooter = true;
      },
      'frame.header': () => (_c) => {
        const {util, ctx} = _c;
        const el = (t,c,p,text) => util.el(t,c,p,text);
        const W = document.documentElement.clientWidth;
        document.documentElement.style.setProperty('--ui', Math.max(.78, W / 1536));
        document.documentElement.style.setProperty('--accent', '#0067c9');
        document.body.className = 'photos-app';
        let display = ctx.display || 'header';
        if (W < 1260 && (display === 'panel' || display === 'toast')) display = 'header';
        document.body.dataset.note = display;
        const shell = el('div','photos-window',document.body);
        const title = el('header','photos-title',shell);
        const logo = el('span','photos-logo',title);
        logo.innerHTML = '<svg viewBox="0 0 24 24"><defs><linearGradient id="p" x2="0" y2="1"><stop stop-color="#65c3ed"/><stop offset="1" stop-color="#0078bc"/></linearGradient></defs><rect width="24" height="24" rx="2" fill="url(#p)"/><circle cx="17" cy="6" r="2" fill="white"/><path d="M0 19 8 8 15 15 18 11 24 20v4H0" fill="#00649d"/><path d="m2 21 7-10 9 13H2" fill="#008bcb"/></svg>';
        el('span','photos-app-name',title,'Photos');
        const windowTools = el('div','window-tools',title);
        for (const [name, path] of [['Minimize','M5 12h14'],['Maximize','M6 6h12v12H6z'],['Close','m6 6 12 12M18 6 6 18']]) {
          const b=el('button','window-control',windowTools); b.title=name;b.setAttribute('aria-label',name);
          b.innerHTML='<svg viewBox="0 0 24 24"><path d="'+path+'"/></svg>';
        }
        const toolbar = el('nav','photos-toolbar',shell);
        const icons = [
          '<rect x="4" y="3" width="16" height="18" rx="3"/><path d="m6 16 4-5 4 4 3-3 3 4M2 7v11m20-10v10"/><circle cx="14" cy="8" r="1.5"/>',
          '<path d="M5 5h10M4 9v11h15v-8M3 4h3v3H3zM18 18h3v3h-3z"/><path d="m9 15 2-5L20 2l3 3-9 9-5 1" stroke="#0067c9"/>',
          '<circle cx="12" cy="7" r="5"/><circle cx="7" cy="15" r="5"/><circle cx="17" cy="15" r="5"/>',
          '<path d="M2 5h20M2 12h20M2 19h20"/><circle cx="9" cy="5" r="2" fill="#faf9f7"/><circle cx="17" cy="12" r="2" fill="#faf9f7"/><circle cx="8" cy="19" r="2" fill="#faf9f7"/>',
          '<path d="M5 2v17h17M2 5h17v17M9 15l6-6"/>'
        ];
        ['Gallery','Edits','Filters','Adjust','Crop'].forEach((name,i)=>{
          const b=el('button','photos-tab'+(i===1?' selected':''),toolbar);
          b.innerHTML='<svg viewBox="0 0 24 24">'+icons[i]+'</svg><span>'+name+'</span>';
          b.addEventListener('click',()=>env.log('decoy',{label:name}));
        });
        Object.assign(_c, {shell, header: toolbar, display});
      },
      'frame.nav': () => () => {},
      'frame.instruction': (base) => (_c) => {
        const header = _c.header;
        _c.header = _c.shell;
        base(_c);
        _c.header = header;
        const note = _c.shell.querySelector('.ref-instruction');
        if (note) note.classList.add('photos-note', 'header-note');
      },
      'frame.body': () => (_c) => {
        _c.body = _c.util.el('div', 'photos-body', _c.shell);
      },
      'frame.panel': (base) => (_c) => {
        base(_c);
        const panel = _c.body.querySelector('.ref-panel');
        if (panel) panel.classList.add('photos-note', 'panel-note');
      },
      'frame.stage': () => (_c) => {
        _c.stage = _c.util.el('main', 'photos-stage', _c.body);
      },
      'frame.toast': (base) => (_c) => {
        base(_c);
        const note = document.querySelector('.ref-note');
        if (note) {
          note.classList.add('photos-note', 'toast-note');
          _c.header.append(note);
        }
      },
      'frame.footer': (base) => (_c) => {
        const {util} = _c;
        const el = (t,c,p,text) => util.el(t,c,p,text);
        const shell = _c.shell;
        const footer=el('footer','photos-footer',shell);
        const tip=el('div','photos-tip',footer);
        const bulb=el('span','tip-bulb',tip);
        bulb.innerHTML='<svg viewBox="0 0 24 28"><path d="M7 22h10M9 25h6M8 20c0-4-4-5-4-10a8 8 0 0 1 16 0c0 5-4 6-4 10z"/></svg>';
        el('strong','tip-label',tip,'Tip');
        _c.wantFooter = true;
        base(_c);
        const foot = document.querySelector('.ref-foot');
        const text = foot.querySelector('.ref-foot-text');
        text.textContent = 'Presets show the exact brightness and contrast values for each look.';
        text.classList.add('tip-copy');
        tip.append(text);
        footer.append(foot);
        _c.photosFooter = footer;
      },
      'frame.floating': (base) => (_c) => {
        base(_c);
        const dock = document.querySelector('.ref-float-dock');
        if (dock) _c.photosFooter.prepend(dock);
      },
      overlay: (base) => (ctx) => {
        const result=base(ctx);
        result.el.classList.add('photos-overlay');
        result.dismiss.textContent='Dismiss';
        return result;
      }
    }},
  });
})();
