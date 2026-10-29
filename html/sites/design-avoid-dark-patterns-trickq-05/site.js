// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base) => function (_c) {
      base(_c);
      _c.header.classList.add('af-titlebar');
      const title = _c.util.el('div', 'af-title', _c.header, 'Ashlar & Finch Account Setup');
      const emblem = _c.util.el('span', 'af-title-icon', title);
      emblem.innerHTML = '<svg viewBox="0 0 28 28" aria-hidden="true"><path fill="#111" d="m3 23 6-13q2-5 7-5l1-2 4 2 4 2-4 2q0 7-6 10l-4 2-5 5 3-7Zm8-5 2 5 5 2-1 1-7-3Z"/><path d="M3 25q10-6 22 0M12 23q-9-11-8-4 1 4 8 4m5 1q0-10 5-7 3 4-5 7" fill="#111"/></svg>';
      title.prepend(emblem);
      _c.header.prepend(title);
      const controls = _c.util.el('div', 'af-window-controls', _c.header);
      controls.innerHTML = '<span>_</span><span>□</span><span>×</span>';
      controls.setAttribute('aria-hidden', 'true');
    },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const workspace = util.el('div', 'af-workspace', body);
        const recent = util.el('section', 'wm-recent', workspace);
        util.el('h2', 'wm-list-title', recent, 'Existing Accounts');
        const table = util.el('div', 'wm-table', recent);
        const head = util.el('div', 'wm-row wm-table-head', table);
        for (const label of ['Name', 'Email', 'Account Type', 'Created', 'Status']) util.el('span', '', head, label);
        for (const values of [
          ['Carter, Evelyn', 'evelyn.carter@ashlarandfinch.com', 'Customer', '03/12/1992', 'Active'],
          ['Nguyen, Daniel', 'd.nguyen@ashlarandfinch.com', 'Customer', '02/28/1992', 'Active'],
          ['Patel, Asha', 'a.patel@ashlarandfinch.com', 'Customer', '01/17/1992', 'Active'],
          ['Reed, Thomas', 't.reed@ashlarandfinch.com', 'Customer', '11/03/1991', 'Active'],
        ]) {
          const row = util.el('div', 'wm-row', table);
          for (const value of values) util.el('span', '', row, value);
        }
        const stage = util.el('main', 'ref-stage', workspace);
        S.frameAlign(_c, stage);
        const signature = util.el('footer', 'wm-signature', workspace);
        const bird = util.el('div', 'af-bird', signature);
        bird.innerHTML = '<svg viewBox="0 0 56 68" aria-hidden="true"><g fill="#111"><path d="M7 52 19 29Q21 19 30 17L32 12Q37 8 41 14L46 17 40 19Q40 30 31 39L22 44 10 56 15 43Z"/><path d="m23 39-6 15 4-1 7-14M30 40l3 10 4 3-1 2-7-4-3-12"/><circle cx="37" cy="14" r="1" fill="#ddd"/><path d="M5 57q20-9 42 5l-2 2Q26 50 5 59M23 57q-12-17-13-8 0 7 13 8M30 59q4-18 10-13 3 7-10 13M40 61q0-12 8-9 5 5-8 9"/></g></svg>';
        util.el('strong', '', signature, 'Ashlar & Finch');
        util.el('span', '', signature, 'Quality for a Brighter Tomorrow');
        const art = util.el('div', 'af-estate', signature);
        art.innerHTML = '<svg viewBox="0 0 260 90" aria-hidden="true"><defs><pattern id="af-hatch" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 4 4 0" stroke="#333" stroke-width=".5"/></pattern><g id="af-pine"><path d="M0 74V5M-20 70 0 48 20 70M-18 60 0 38 18 60M-15 48 0 28 15 48M-12 37 0 18 12 37M-8 25 0 9 8 25" fill="none" stroke="#222" stroke-width="2"/></g></defs><g fill="none" stroke="#222" stroke-width="1"><path d="M4 83q40-10 74 0t80-1 94-2M3 87q65-10 116 0t135-3"/><use href="#af-pine" x="34" y="2"/><use href="#af-pine" x="239" y="8"/><path d="M83 45 137 23 199 40 181 48 124 32 83 50Z" fill="url(#af-hatch)"/><path d="M87 48v30l94 1V47M125 33v45M181 48l18-8v35l-18 4M133 25v-9h7v8M91 53h10v14H91ZM109 48h10v17h-10ZM134 47h10v17h-10ZM151 50h10v15h-10ZM169 52h8v15h-8ZM135 70h12v9h-12ZM155 70h11v9h-11ZM187 51h7v13h-7Z"/><path d="M96 53v14M114 48v17M139 47v17M156 50v15M173 52v15M190 51v13M91 60h10M109 56h10M134 55h10M151 57h10M169 59h8M187 57h7M84 80h117M90 82h103"/><path d="M63 76V24m0 29q-23-12-12-23-5-13 7-15 6-16 15-4 15-3 13 12 15 10 0 19 1 15-23 11M213 75V28m0 29q-20-6-13-19-10-12 2-20 1-17 14-11 16-3 15 13 15 12 0 22-1 14-18 15" fill="url(#af-hatch)"/></g></svg>';
        const afActions = util.el('footer', 'af-actions', document.body);
        Object.assign(_c, { recent, signature, stage, table, afActions });
      },
    'frame.end': (base) => function (_c) {
      const result = base(_c);
      const r = _c.ctx.rng.fork('af/end-placement');
      const form = r.pick(['footer', 'footer', 'footer', 'header', 'icon']);
      const destination = form === 'footer' ? _c.afActions : _c.header;
      for (const extra of document.querySelectorAll('.ref-xtra')) _c.afActions.append(extra);
      if (result.submit) {
        destination.append(result.submit);
        result.submit.classList.toggle('af-icon-end', form === 'icon');
        if (form === 'icon') result.submit.textContent = '✓';
      }
      for (const foot of document.querySelectorAll('.ref-foot,.ref-float-dock')) foot.remove();
      _c.afActions.hidden = !_c.afActions.children.length;
      return result;
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-trickq-05',
    template: 'site/base',
    design: { parts },
  });
})();
