// Design of this site on the use-social-feed/feed template (templates/use-social-feed/feed.js): one timeline column
// (no rail or sidebar) with a progress / rules panel and a reset button built into the site's note.
(function () {
  'use strict';
  const DESIGN_CSS = "\n.as-app{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;border:0;border-radius:0;box-shadow:none}.as-top{display:none}.as-body{min-height:0}.as-btn{border-radius:3px;font-size:14px}.as-pane{border-radius:0}.se-main{padding:17px 22px!important;gap:0}.se-col{width:100%;max-width:none}.se-side{display:none}.se-box{border-radius:3px;box-shadow:none;height:39px;padding:0 12px}.se-go{border-radius:3px;height:39px;padding:0 22px}.se-card{border-bottom:1px solid var(--line);padding:8px 8px 4px}.se-card .se-title{font-family:inherit;font-size:19px}.se-pager{justify-content:center}.se-pg{border-radius:2px;width:32px;min-width:32px;height:32px}.se-fav{width:22px;height:22px;border-radius:1px}.se-url{font-size:12px}.se-desc{font-size:14px}.tk-main{padding:18px 22px}.tk-title{font-size:24px}.tk-date{border-radius:0;background:transparent}.tk-row{gap:12px;border-bottom:1px solid var(--line);padding:0 12px}.tk-name{font-size:15px}.tk-price{font-size:18px;width:68px}.tk-buy{width:65px}.tk-when{width:125px}.tk-trigger{border-radius:0;min-width:175px}.fd-wrap.left{flex-direction:row}.fd-cart{width:28%!important;border-left:3px solid var(--fg);border-radius:0;background:var(--panel)}.fd-menu{padding:12px 18px}.fd-card{border-radius:0}.fd-add{border-radius:2px}.fd-order{border-radius:2px}.fd-rname{font-size:22px}.fd-rmeta{font-size:12px}.fd-dialog,.as-dialog{border-radius:4px}.fl-form{border-radius:0}.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-title{height:30px;border-radius:0;background:var(--header,var(--panel));font-size:14px}.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}.at-pane-h{border-radius:0}.at-explorer{width:46%!important;max-width:none}.at-preview{padding:10px}.at-tree{font-family:inherit}.at-row svg{color:var(--fg)}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-sheet h2{font-family:inherit}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}.at-term{border-radius:0;border:0}.at-tscroll{padding:20px;font:15px/1.5 monospace}.at-term-tabs{background:var(--header,var(--panel))}.as-page{inset:0!important;display:flex;justify-content:stretch!important}.as-rail,.as-side{display:none}.as-col{flex:1!important;width:100%!important;border:0}.as-head{height:43px;background:var(--header,var(--panel));font-size:14px}.as-post{padding:13px 18px;gap:14px;border-bottom:1px solid var(--line)}.as-text{font-size:16px;line-height:1.4}.as-av{width:48px;height:48px;border-radius:4px;font-size:17px}.as-acts{max-width:440px;justify-content:flex-start;gap:22px}.as-act{border-radius:3px;height:30px;font-size:14px;padding:0 8px}.as-act svg{width:20px;height:20px}.as-photos{height:100px!important;border-radius:4px}.as-menu{border-radius:3px;min-width:210px}.as-mi{height:35px;font-size:14px}.as-confirm{border-radius:4px}.as-confirm button{border-radius:3px}.as-track{border-radius:0;width:15px;background:var(--line)}.as-thumb{border-radius:0}.as-name{font-size:16px}.as-handle,.as-time{font-size:13px}.as-quote{border-radius:3px}.as-link{border-radius:3px}.as-link.tall .as-link-img{height:65px}.as-post:has(.as-photos){min-height:200px}\n.design-header{background:#f0f1f3;height:65px}.site-shell{grid-template-rows:65px minmax(0,1fr) 62px}.design-brand{font-size:19px}.task-note{margin:12px;border:1px solid #e1e3e6;background:#fafbfc;border-radius:14px;font-size:21px;padding:26px 20px}.as-post{border:1px solid #e1e3e6;background:#fff;margin:7px 14px;padding:15px;border-radius:13px}.as-av{border-radius:50%}.as-head{background:#f5f6f8}.as-act{border:1px solid #ddd;border-radius:14px}.as-photos{height:80px!important}.end-control{background:#3584e4;border-radius:13px}";

  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-some-12',
    name: 'design',
    split: 'train',
    scenarios: ['some'],
    template: 'use-social-feed/feed',
    design: {
      scenarioDecor: false,
      css: DESIGN_CSS,
      siteCssLast: true,
      layout: 'plain',
      labels: true,
      countZero: true,
      avatarSheet: 'reference-photos.webp',
      photoSheet: 'reference-photos.webp',
      menuBounds: 'column',
      scrollSet: 'first',
      parts: {
        // Progress and rules panels in the site's note; they follow the model on every paint.
        begin: () => (R) => {
          const { ctx, util, spec, F } = R;
          const note = document.querySelector('.task-note');
          const progressBox = util.el('section', 'inspector-panel', note);
          util.el('h3', '', progressBox, 'Progress');
          const progressText = util.el('p', '', progressBox);
          const progressBar = util.el('div', 'prog-bar', progressBox);
          const progressFill = util.el('i', '', progressBar);
          const targetBox = util.el('section', 'inspector-panel', note);
          targetBox.classList.add('rules-panel');
          util.el('h3', '', targetBox, 'Rules');
          const tgt = spec.select.kind === 'user' ? spec.select.handle : '#' + spec.select.tag;
          const rl = util.el('ul', '', targetBox);
          util.el('li', '', rl, 'Click Reply on exactly ' + spec.count + ' posts ' + (spec.select.kind === 'user' ? 'from ' : 'that mention ') + tgt + '.');
          util.el('li', '', rl, 'Do not reply to other posts.');
          util.el('li', '', rl, 'After replying to ' + spec.count + ' posts, click Submit.');
          const resetBtn = util.el('button', 'reset-btn', note, 'Reset Selections');
          resetBtn.type = 'button';
          const actionLabel = F.helpers.LABELS[spec.action] || spec.action;
          rl.children[0].textContent = 'Click ' + actionLabel + ' on exactly ' + spec.count + ' posts ' + (spec.select.kind === 'user' ? 'from ' : 'that mention ') + tgt + '.';
          rl.children[1].textContent = 'Do not ' + actionLabel.toLowerCase() + (spec.action === 'reply' ? ' to' : '') + ' other posts.';
          const endControl = document.querySelector('.end-control');
          rl.children[2].textContent = 'After ' + (spec.action === 'reply' ? 'replying to' : 'acting on') + ' ' + spec.count + ' posts, ' + (endControl ? 'click ' + endControl.dataset.endLabel + '.' : 'finish the task.');
          resetBtn.addEventListener('click', () => { for (const key of [...ctx.model.on]) R.up({ toggle: key }); R.paint(); });
          R.x.refresh = (m) => {
            const doneN = m.on.filter((k) => spec.targets.includes(Number(k.split(':')[0])) && k.endsWith(':' + spec.action)).length;
            progressText.textContent = ({ reply: 'Replies sent', retweet: 'Retweets sent', like: 'Likes', share: 'Shares' }[spec.action] || 'Actions') + ': ' + doneN + ' / ' + spec.count;
            progressFill.style.width = Math.min(100, 100 * doneN / Math.max(1, spec.count)) + '%';
          };
        },
        paintStart: () => (R, m) => R.x.refresh(m),
        actLabel: () => (R, btn, b, p, post, parts) => {
          if (R.labels) R.util.el('span', 'action-label', btn, R.F.helpers.LABELS[b]);
          if (b !== 'share') parts.counts[b] = R.util.el('span', 'action-count', btn);
        },
      },
    },
  });
})();
