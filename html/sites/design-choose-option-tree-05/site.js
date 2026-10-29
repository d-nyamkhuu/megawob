// Fieldnote project workspace, on the shared reference frame.
(function () {
  'use strict';
  env.site({
    name: 'design-choose-option-tree-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/base',
    design: {
      parts: {
        'frame.theme': (base) => (_c) => {
          base(_c);
          const palette = { bg:'#f3eedf', panel:'#f8f4e9', fg:'#12374c', muted:'#5f7080', line:'#cfc8b8', accent:'#225466' };
          Object.entries(palette).forEach(([key,value]) => _c.root.style.setProperty(`--${key}`, value));
          _c.root.dataset.theme = 'warm';
          _c.name = 'warm';
          _c.accent = palette.accent;
        },
        'frame.placement': (base) => (_c) => {
          base(_c);
          const r = _c.rng.fork('fieldnote/end');
          if (!_c.ctx.finish && r.bool(0.5)) {
            _c.placement = 'footer';
            _c.wantFooter = true;
            _c.label = 'OK';
            if (_c.collide && _c.collide.text === 'OK') _c.collide.text = _c.content.collideLabel(r, 'OK');
          }
        },
        frameBrand: (base) => (_c, header) => {
          const brand = base(_c, header);
          if (brand) {
            brand.textContent = 'Fieldnote';
            brand.classList.add('fieldnote-brand');
            _c.util.el('small', 'fieldnote-tagline', brand, 'PEOPLE   PROJECTS   PROGRESS');
          }
          return brand;
        },
        'frame.nav': (base) => (_c) => {
          base(_c);
          const { header, util } = _c;
          let nav = header.querySelector('.ref-nav');
          if (!nav) nav = util.el('nav', 'ref-nav', header);
          const names = ['Projects', 'Tasks', 'Calendar', 'Reports', 'People'];
          let links = Array.from(nav.querySelectorAll('.ref-navlink'));
          links.forEach((a, i) => { a.textContent = names[i] || 'People'; });
          for (let i = links.length; i < names.length; i++) {
            const a = util.el('a', 'ref-navlink', nav, names[i]);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: names[i] }); });
          }
          nav.classList.add('fieldnote-tabs');
          const search = util.el('div', 'fieldnote-search', header);
          util.el('span', '', search, '⌕');
          util.el('span', '', search, 'Search projects…');
          const user = util.el('div', 'fieldnote-user', header);
          util.el('span', 'fieldnote-avatar', user, '●');
          util.el('span', '', user, 'Taylor Kim ⌄');
        },
        'frame.header': (base) => (_c) => {
          base(_c);
          if (!_c.header.querySelector('.fieldnote-brand')) {
            const b = _c.util.el('div', 'ref-brand fieldnote-brand', _c.header, 'Fieldnote');
            _c.util.el('small', 'fieldnote-tagline', b, 'PEOPLE   PROJECTS   PROGRESS');
          }
        },
        'frame.stage': (base) => (_c) => {
          base(_c);
          const { util, body } = _c;
          const identity = util.el('div', 'fieldnote-identity', body);
          util.el('strong', '', identity, 'Riverside Park');
          util.el('span', '', identity, 'Community Spaces');
          const rail = util.el('aside', 'fieldnote-details', body);
          const panel = body.querySelector('.ref-panel');
          if (panel) rail.append(panel);
          const photo = util.el('img', 'fieldnote-photo', rail);
          photo.src = 'sites/design-choose-option-tree-05/assets/riverside.jpg';
          photo.alt = 'Riverside Park lake';
          util.el('h3', '', rail, 'Riverside Park');
          util.el('div', 'fieldnote-category', rail, 'Community Spaces');
          const meta = util.el('dl', 'fieldnote-meta', rail);
          [['Created', 'Jan 14, 2015'], ['Updated', 'Apr 14, 2015'], ['Owner', 'Taylor Kim'], ['Status', '● Active'], ['Team', '6 people']].forEach(([key,value]) => {
            util.el('dt', '', meta, key);
            util.el('dd', '', meta, value);
          });
          const activity = util.el('section', 'fieldnote-activity', rail);
          util.el('h3', '', activity, 'Recent Activity');
          [['Apr 14','Updated project details'],['Apr 12','Added 3 photos'],['Apr 10','Assigned 2 tasks'],['Apr 02','Comment from Alex'],['Mar 28','Updated map area']].forEach(([date,copy]) => {
            const row = util.el('div', '', activity);
            util.el('time', '', row, date);
            util.el('span', '', row, copy);
          });
        },
        frameSidebar: (base) => (_c, body) => {
          const side = base(_c, body) || _c.util.el('aside', 'ref-side', body);
          side.classList.add('fieldnote-projects');
          side.replaceChildren();
          _c.util.el('h2', 'fieldnote-side-title', side, 'Projects');
          _c.util.el('div', 'fieldnote-all-projects', side, 'All Projects   ⌄');
          const rows = [
            ['Riverside Park', 'Community Spaces', 'Apr 14, 2015'], ['Maple Grove Trail', 'Trails & Access', 'Apr 02, 2015'],
            ['Cedar Ridge', 'Land Conservation', 'Mar 28, 2015'], ['Oak Hill Restore', 'Habitat Improvement', 'Mar 12, 2015'],
            ['Pine Creek', 'Water Quality', 'Feb 26, 2015'], ['Meadow View', 'Community Spaces', 'Feb 18, 2015'],
            ['Stonebridge', 'Land Conservation', 'Feb 03, 2015'], ['Willow Brook', 'Trails & Access', 'Jan 21, 2015'],
            ['Lake Franklin', 'Water Quality', 'Jan 10, 2015'], ['Canyon Run', 'Habitat Improvement', 'Dec 17, 2014'],
          ];
          rows.forEach((row, i) => {
            const item = _c.util.el('div', `fieldnote-project${i === 0 ? ' is-current' : ''}`, side);
            _c.util.el('strong', '', item, row[0]);
            _c.util.el('span', '', item, row[1]);
            _c.util.el('time', '', item, row[2]);
          });
          return side;
        },
      },
    },
  });
})();
