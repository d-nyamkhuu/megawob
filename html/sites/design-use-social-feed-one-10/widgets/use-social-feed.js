// Design of this site on the use-social-feed/feed template (templates/use-social-feed/feed.js): a workbench with one whole
// card per page (a wheel or thumb stop snaps to a card), a reply draft pad under the timeline and a task detail
// panel kept in step with the model.
(function () {
  'use strict';
  const DESIGN_CSS = "\n.as-app{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;border:0;border-radius:0;box-shadow:none}.as-top{display:none}.as-body{min-height:0}.as-btn{border-radius:3px;font-size:14px}.as-pane{border-radius:0}.se-main{padding:17px 22px!important;gap:0}.se-col{width:100%;max-width:none}.se-side{display:none}.se-box{border-radius:3px;box-shadow:none;height:39px;padding:0 12px}.se-go{border-radius:3px;height:39px;padding:0 22px}.se-card{border-bottom:1px solid var(--line);padding:8px 8px 4px}.se-card .se-title{font-family:inherit;font-size:19px}.se-pager{justify-content:center}.se-pg{border-radius:2px;width:32px;min-width:32px;height:32px}.se-fav{width:22px;height:22px;border-radius:1px}.se-url{font-size:12px}.se-desc{font-size:14px}.tk-main{padding:18px 22px}.tk-title{font-size:24px}.tk-date{border-radius:0;background:transparent}.tk-row{gap:12px;border-bottom:1px solid var(--line);padding:0 12px}.tk-name{font-size:15px}.tk-price{font-size:18px;width:68px}.tk-buy{width:65px}.tk-when{width:125px}.tk-trigger{border-radius:0;min-width:175px}.fd-wrap.left{flex-direction:row}.fd-cart{width:28%!important;border-left:3px solid var(--fg);border-radius:0;background:var(--panel)}.fd-menu{padding:12px 18px}.fd-card{border-radius:0}.fd-add{border-radius:2px}.fd-order{border-radius:2px}.fd-rname{font-size:22px}.fd-rmeta{font-size:12px}.fd-dialog,.as-dialog{border-radius:4px}.fl-form{border-radius:0}.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-title{height:30px;border-radius:0;background:var(--header,var(--panel));font-size:14px}.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}.at-pane-h{border-radius:0}.at-explorer{width:46%!important;max-width:none}.at-preview{padding:10px}.at-tree{font-family:inherit}.at-row svg{color:var(--fg)}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-sheet h2{font-family:inherit}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}.at-term{border-radius:0;border:0}.at-tscroll{padding:20px;font:15px/1.5 monospace}.at-term-tabs{background:var(--header,var(--panel))}.as-page{inset:0!important;display:flex;justify-content:stretch!important}.as-rail,.as-side{display:none}.as-col{flex:1!important;width:100%!important;border:0}.as-head{height:43px;background:var(--header,var(--panel));font-size:14px}.as-post{padding:13px 18px;gap:14px;border-bottom:1px solid var(--line)}.as-text{font-size:16px;line-height:1.4}.as-av{width:48px;height:48px;border-radius:4px;font-size:17px}.as-acts{max-width:440px;justify-content:flex-start;gap:22px}.as-act{border-radius:3px;height:30px;font-size:14px;padding:0 8px}.as-act svg{width:20px;height:20px}.as-photos{height:100px!important;border-radius:4px}.as-menu{border-radius:3px;min-width:210px}.as-mi{height:35px;font-size:14px}.as-confirm{border-radius:4px}.as-confirm button{border-radius:3px}.as-track{border-radius:0;width:15px;background:var(--line)}.as-thumb{border-radius:0}.as-name{font-size:16px}.as-handle,.as-time{font-size:13px}.as-quote{border-radius:3px}.as-link{border-radius:3px}.as-link.tall .as-link-img{height:65px}.as-post:has(.as-photos){min-height:200px}\n.design-header{background:linear-gradient(#a5bed6,#e1effc)}.site-shell{grid-template-rows:100px minmax(0,1fr) 55px}.design-header{align-items:flex-start;padding-top:13px;position:relative}.design-header:after{content:\"Refresh       New Post       Open       Save       Search       Filter       Mark Read       Favorite       Settings\";position:absolute;bottom:12px;left:25px;color:#133c6d;font:16px Arial}.bottom .task-note{background:#deefff;font-size:26px}.as-post{display:flex;padding:12px}.as-main{position:relative;padding-right:280px}.as-acts{position:absolute;right:0;bottom:0;gap:12px}.as-text{font-size:14px}.as-photos{height:80px!important}.end-control{background:linear-gradient(#38b2ff,#0379d9)}";

  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-one-10',
    name: 'design',
    split: 'train',
    scenarios: ['one'],
    template: 'use-social-feed/feed',
    design: {
      css: DESIGN_CSS,
      detail: false,
      icons: {
        reply: '<path d="M9 4L2 11l7 7v-5h7c3 0 4 2 4 6h3v-6c0-4-3-6-7-6H9z" fill="currentColor" stroke="none"/>',
        retweet: '<path d="M2 8l5-6 5 6H9v10h6v3H6V8zM12 3h7v13h3l-5 6-5-6h3V6h-3z" fill="currentColor" stroke="none"/>',
        like: '<defs><pattern id="gem-heart" width="3" height="3" patternUnits="userSpaceOnUse"><path d="M0 3L3 0" stroke="currentColor" stroke-width="1"/></pattern></defs><path d="M12 21L3 12V6h3V3h4l2 3 2-3h4v3h3v6z" fill="url(#gem-heart)" stroke-width="1.5"/>',
      },
      labels: true,
      avatarSheet: null,
      parts: {
        // Both seeded timelines stay reachable in the window's title bar.
        headed: () => (R) => {
          if (R.live) document.querySelector('.win-left .win-title').append(R.head);
        },
        // A local draft pad under the timeline; social actions keep their toggle semantics.
        boxMade: (base, S) => (R) => {
          const { util, col } = R;
          const draft = util.el('section', 'gem-compose', col);
          R.x.draftLabel = util.el('div', 'gem-draft-label', draft);
          const draftBox = util.el('div', 'compose-box', draft);
          const editor = util.el('textarea', 'compose-editor', draftBox);
          editor.maxLength = 280;
          editor.setAttribute('aria-label', 'Reply draft');
          const draftScroll = util.el('div', 'compose-scroll', draftBox);
          util.el('span', '', draftScroll, '\u25b2');
          util.el('i', '', draftScroll);
          util.el('span', '', draftScroll, '\u25bc');
          const draftTools = util.el('div', 'compose-tools', draft);
          for (const [label, icon] of [['Document', '<path d="M5 2h10l5 5v15H5zM15 2v5h5M8 11h9M8 15h9M8 19h9"/>'], ['Emoji', '<circle cx="12" cy="12" r="9"/><path d="M7 14q5 7 10 0M8 8v3M16 8v3"/>'], ['Attach', '<path d="M9 15l7-7a3 3 0 0 0-4-4L4 12a5 5 0 0 0 7 7l9-9M8 15l7-7"/>']]) {
            const b = util.el('button', '', draftTools);
            b.type = 'button';
            b.title = label;
            b.innerHTML = S.svg(icon);
            b.addEventListener('click', () => env.log('decoy', { what: label }));
          }
          const draftCount = util.el('span', 'gem-draft-count', draftTools, 'Characters: 0 / 280');
          editor.addEventListener('input', () => { draftCount.textContent = `Characters: ${editor.value.length} / 280`; });
          for (const b of document.querySelectorAll('[data-inspector-action]')) b.addEventListener('click', () => env.log('decoy', { what: b.dataset.inspectorAction }));
        },
        paintStart: () => (R, m) => {
          const { spec, F } = R;
          const target = spec.targets[0];
          const post = spec.posts[target];
          const action = spec.action;
          document.querySelector('.detail-target-author').textContent = post.handle;
          document.querySelector('.detail-post-starts-with').textContent = post.text;
          document.querySelector('.detail-action').textContent = 'Click ' + (F.helpers.LABELS[action] || action) + ' on the specified post.';
          const ds = document.querySelector('.detail-status');
          const ok = m.on.length !== spec.start.length || m.on.some((k) => !spec.start.includes(k));
          ds.textContent = ok ? 'In progress' : 'Not completed';
          ds.style.color = '#111';
          R.x.draftLabel.textContent = 'Replying to ' + post.handle;
          document.querySelector('.gem-face').classList.add('gem-portrait');
        },
        avatar: (base, S) => (R, row, post) => {
          const av = R.util.el('div', 'as-av', row, S.initials(post.name));
          av.textContent = '';
          av.classList.add('gem-portrait');
          av.title = post.name;
          return av;
        },
        // The expander sits outside the independently scrolling text pane, as a button.
        showMore: () => (R, hosts, p) => {
          const sm = R.util.el('button', 'as-showmore', hosts.main, 'Show more');
          sm.type = 'button';
          sm.dataset.role = 'showmore';
          sm.addEventListener('click', () => { R.up({ expand: p }); R.paint(); });
          return sm;
        },
        // Keep every menu action clickable inside the workbench, even on a short stage.
        menuItemMade: () => (R, el) => {
          el.style.height = Math.min(42, Math.max(16, Math.floor((R.col.clientHeight - 20) / R.order.length))) + 'px';
        },
        // Whole-pixel card heights keep the task visibility test and the listbox's rounded offsets in agreement.
        rowAdded: () => (R, feed, row) => {
          if (row.classList.contains('as-post')) row.style.height = feed.clientHeight + 'px';
        },
        onScroll: () => (R) => R.report(true),
        // The task stores the initial scroll as a fractional row index: apply it before reporting geometry.
        restoreScroll: () => (R, B, m, keep, first) => {
          R.x.snapRestored = !first;
          const { feed, rows, lbx } = B;
          const rowEls = [...rows.values()];
          const index = Math.max(0, Math.min(m.scroll || 0, rowEls.length - 1));
          const whole = Math.floor(index);
          const fraction = index - whole;
          const offset = (el) => el.getBoundingClientRect().top - feed.getBoundingClientRect().top + feed.scrollTop;
          feed.scrollTop = first && rowEls.length
            ? offset(rowEls[whole]) + fraction * ((rowEls[whole + 1] ? offset(rowEls[whole + 1]) : offset(rowEls[whole]) + rowEls[whole].offsetHeight) - offset(rowEls[whole]))
            : keep;
          lbx.set({});
        },
        // A programmatic scroll schedules its native event asynchronously. Finish the restored feed's snap
        // before the next oracle read, rather than exposing the removed loading sentinel's old position.
        built: (base) => (R, B, m) => {
          base(R, B, m);
          if (R.x.snapRestored) R.report(true);
        },
        // report(true): this workbench shows a whole card at a time, so snap the pane to a card first.
        report: (base) => (R, snap = false) => {
          if (!R.fd) return;
          if (snap) {
            const { feed } = R.fd;
            const top = feed.scrollTop;
            const origin = feed.getBoundingClientRect().top + feed.clientTop;
            const max = Math.max(0, feed.scrollHeight - feed.clientHeight);
            const stops = [...R.fd.rows.values()].map((row) => Math.max(0, Math.min(max, Math.round(row.getBoundingClientRect().top - origin + top))));
            // Leave the load sentinel reachable so infinite feeds can grow.
            if (R.F.helpers.moreToLoad(R.spec, R.ctx.model)) stops.push(max);
            if (stops.length) {
              const stop = stops.reduce((best, value) => (Math.abs(value - top) < Math.abs(best - top) ? value : best));
              if (Math.abs(stop - top) > 0.5) feed.scrollTop = stop;
            }
          }
          base(R);
        },
      },
    },
  });
})();
