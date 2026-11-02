// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebarDraw = roomy && rng.bool(0.35);
        const navDraw = W >= 1180 && rng.bool(0.5);
        const sidebar = true;
        const nav = false;
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        const winTitle = util.el('div', 'cw-titlebar', document.body);
        util.el('span', 'cw-appicon', winTitle, '◧');
        util.el('strong', 'cw-title', winTitle, 'CourseWork - English 101: Writing and Rhetoric');
        util.el('span', 'cw-window-buttons', winTitle, '−　▢　×');
        const menu = util.el('nav', 'cw-menubar', document.body);
        for (const label of ['File', 'Edit', 'View', 'Students', 'Assessments', 'Tools', 'Help']) {
          const a = util.el('a', '', menu, label);
          a.href = '#';
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'menu', label });
          });
        }
        const toolbar = util.el('div', 'cw-toolbar', document.body);
        for (const [icon, label] of [
          ['♟', 'Students'],
          ['▤', 'Gradebook'],
          ['▧', 'Assignments'],
          ['▦', 'Rubrics'],
          ['▥', 'Modules'],
          ['▧', 'Reports'],
        ]) {
          const item = util.el('div', 'cw-tool', toolbar);
          util.el('span', 'cw-tool-icon', item, icon);
          util.el('span', '', item, label);
        }
        Object.assign(_c, {
          collide,
          cr,
          decoys,
          label,
          menu,
          nav,
          navDraw,
          placement,
          sidebar,
          sidebarDraw,
          toolbar,
          wantFooter,
          winTitle,
        });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { content, local, rng, sidebar, util } = _c;
        const { K } = S;
        const body = util.el('div', 'ref-body', document.body);
        if (sidebar) {
          const side = util.el('aside', 'ref-side', body);
          side.innerHTML =
            '<section class="cw-inspector"><h3>Students</h3><div class="cw-tablehead"><span>Name</span><span>ID</span></div><div class="cw-students"><div>Chen, Li <b>S1012</b></div><div>Garcia, Elena <b>S1013</b></div><div>Khan, Ayesha <b>S1014</b></div><div>Lopez, Marco <b>S1015</b></div><div>Miller, Jordan <b>S1016</b></div><div class="selected">Ndiaye, Mio <b>S1017</b></div><div>Patel, Rohan <b>S1018</b></div><div>Smith, Taylor <b>S1019</b></div><div>Watanabe, Kenji <b>S1020</b></div><div>Wilson, Priya <b>S1021</b></div></div></section><section class="cw-inspector cw-details"><h3>Student Details</h3><p>Name: <span>Mio Ndiaye</span></p><p>ID: <span>S1017</span></p><p>Email: <span>mndiaye@college.edu</span></p><p>Section: <span>ENG 101-01</span></p><p>Major: <span>History</span></p><p>Year: <span>Sophomore</span></p></section><section class="cw-inspector cw-assess"><h3>Assessments</h3><div class="cw-assesslist"><div class="selected">Research Essay</div><div>Reflection Essay</div><div>In-Class Quiz 1</div><div>In-Class Quiz 2</div></div><p>Type:　　 Essay</p><p>Due:　　 Apr 12, 1995</p><p>Points:　 100</p><p>Rubric:　 Research Essay Rubric</p></section>';
          for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav)) {
            const a = util.el('a', 'ref-sidelink', side, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'sidebar', label: item });
            });
          }
        }
        Object.assign(_c, { body });
      },
  };

  env.site({
    name: 'design-use-course-admin-rubric-04',
    template: 'site/base',
    design: { parts },
  });
})();
