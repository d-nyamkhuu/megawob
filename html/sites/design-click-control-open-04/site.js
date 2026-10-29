(function () {
  'use strict';
  const cfg = {
    title: 'Salesforce',
    tools: 'Sales Home Accounts Contacts Opportunities Leads Reports Dashboards',
    rail: [
      'Account',
      'Acme Corporation',
      'Account Number',
      'A-10023',
      'Industry',
      'Manufacturing',
      'Type',
      'Customer',
      'Annual Revenue',
      '$52,400,000',
      'Employees',
      '320',
    ],
    side: [
      'File Summary',
      'Total Files',
      '12',
      'PDF Files',
      '4',
      'Word Documents',
      '3',
      'Excel Spreadsheets',
      '3',
      'CSV Files',
      '2',
      'Text Files',
      '1',
    ],
  };
  env.site({
    name: 'design-click-control-open-04',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref lightning';
      // Inject after the runtime stylesheet: the shared widget widget appends its own rules during render.
      const late = document.createElement('style');
      late.textContent = `body.ref.lightning{background:#e4eef6!important;color:#243b5b!important;font:16px Arial,'Segoe UI',sans-serif!important}body.ref.lightning .shell{height:100vh!important;display:flex!important;flex-direction:column!important;background:#e4eef6!important}body.ref.lightning .head{height:62px!important;min-height:62px!important;flex:none!important;position:relative!important;background:#fff!important;border:0!important}body.ref.lightning .title{position:absolute!important;left:20px!important;top:11px!important;width:60px!important;height:42px!important;padding:0!important;font-size:0!important;color:transparent!important;background:transparent!important}body.ref.lightning .title:before{content:'';display:block;width:58px;height:42px;background:#08a1df;clip-path:polygon(12% 45%,16% 25%,31% 19%,41% 1%,58% 7%,68% 19%,83% 20%,97% 39%,94% 60%,82% 76%,68% 78%,59% 97%,40% 91%,29% 82%,15% 80%,4% 64%)}body.ref.lightning .search{position:absolute!important;right:12.5%!important;top:11px!important;width:32%!important;height:40px!important;padding:9px 14px!important;border:1px solid #cbd9e7!important;border-radius:6px!important;background:#f7fafc!important;color:#8092aa!important;font-size:16px!important}body.ref.lightning .head-help{position:absolute!important;right:9%!important;top:15px!important;font-weight:bold!important;font-size:25px!important;color:#52647f!important}body.ref.lightning .head-bell{position:absolute!important;right:6%!important;top:14px!important;font-size:21px!important;color:#56677f!important}body.ref.lightning .head-avatar{position:absolute!important;right:1.4%!important;top:10px!important;border-radius:50%!important;width:42px!important;height:42px!important;background:#0875c9!important;color:white!important;text-align:center!important;padding-top:12px!important;font-size:14px!important}body.ref.lightning .tools{height:47px!important;min-height:47px!important;flex:none!important;display:flex!important;align-items:stretch!important;white-space:nowrap!important;background:white!important;padding:0 4%!important;gap:0!important}body.ref.lightning .menu-label{display:block!important;padding:13px 15px 10px!important;font-size:16px!important;color:#163b69!important}body.ref.lightning .menu-label:first-child{font-weight:bold!important;color:#0875d1!important;border-bottom:3px solid #0875d1!important}body.ref.lightning .work{display:flex!important;flex:1!important;min-height:0!important;padding:20px!important;gap:16px!important;background:#e4eef6!important}body.ref.lightning .rail{display:flex!important;flex:none!important;width:18%!important;flex-direction:column!important;white-space:normal!important;background:linear-gradient(120deg,#f8fbfd,#eaf2f8)!important;padding:18px 20px!important;overflow:hidden!important}body.ref.lightning .rail-kicker{font-size:14px!important;margin:0 0 5px!important}body.ref.lightning .rail-title{font-size:24px!important;font-weight:bold!important;border-bottom:1px solid #dce6ef!important;padding-bottom:18px!important;margin-bottom:12px!important}body.ref.lightning .rail-label{font-size:16px!important;color:#667993!important;margin-top:13px!important}body.ref.lightning .rail-value{font-size:18px!important;margin-top:6px!important}body.ref.lightning .center{display:flex!important;flex:1!important;min-width:0!important;flex-direction:column!important;overflow:hidden!important}body.ref.lightning .record-tabs{display:flex!important;flex:none!important;height:57px!important;background:#f9fbfd!important}body.ref.lightning .record-tabs span{padding:18px 16px 12px!important;white-space:nowrap!important}body.ref.lightning .record-tabs .active{color:#076ac4!important;border-bottom:4px solid #0875d1!important;font-weight:bold!important}body.ref.lightning .stage{display:block!important;flex:1!important;min-height:0!important;overflow:hidden!important;padding:24px 18px 18px!important}body.ref.lightning .inspector{display:flex!important;flex:none!important;width:16%!important;align-self:flex-start!important;margin-top:82px!important;flex-direction:column!important;background:#fff!important;padding:0 18px 14px!important}body.ref.lightning .uc-page{position:absolute!important;inset:0!important;width:100%!important;height:100%!important}body.ref.lightning .uc-nav,body.ref.lightning .uc-crumb,body.ref.lightning .uc-h1,body.ref.lightning .uc-side{display:none!important}body.ref.lightning .uc-body,body.ref.lightning .uc-main,body.ref.lightning .uc-content{display:flex!important;height:100%!important;min-height:0!important;margin:0!important;padding:0!important;flex-direction:column!important;background:transparent!important}body.ref.lightning .uc-box{display:flex!important;width:100%!important;height:100%!important;max-width:none!important;align-items:stretch!important;justify-content:flex-start!important;flex-direction:column!important}body.ref.lightning .uc-files{display:flex!important;flex:1!important;flex-direction:column!important;width:100%!important;max-width:none!important;overflow:auto!important;padding:0!important;background:#fff!important}body.ref.lightning .uc-ftile{--lightning-row-height:44px;flex:none!important;display:grid!important;grid-template-columns:40px minmax(0,1fr) 130px!important;align-items:center!important;padding:0 14px!important;border-bottom:1px solid #e1e7ed!important;border-radius:0!important;background:#fff!important;text-align:left!important}body.ref.lightning .uc-btn.dis{opacity:1!important;background:#0875d1!important;color:white!important}body.ref.lightning .footer{position:absolute!important;right:20px!important;bottom:8px!important;z-index:20!important;min-height:0!important;padding:0!important;border:0!important;background:transparent!important}body.ref.lightning .submit{min-width:90px!important;padding:8px 20px!important;background:#0875d1!important;color:white!important;border:1px solid #0669b9!important;border-radius:4px!important;font:16px Arial,sans-serif!important}body.ref.lightning .bottom-status{display:none!important}@media(max-height:700px){body.ref.lightning .work{padding:12px!important;gap:10px!important}body.ref.lightning .inspector{margin-top:58px!important;padding:0 10px 6px!important;max-height:calc(100% - 64px)!important;overflow:hidden!important}body.ref.lightning .inspector h2{font-size:15px!important;margin:0 -10px 4px!important;padding:8px 10px!important}body.ref.lightning .inspector span.summary-item{font-size:12px!important;margin-top:5px!important;line-height:1.15!important}body.ref.lightning .inspector strong.summary-item{font-size:14px!important;padding:1px 0 4px!important;line-height:1.1!important}body.ref.lightning .rail{padding:12px!important}body.ref.lightning .rail-label{margin-top:8px!important;font-size:13px!important}body.ref.lightning .rail-value{font-size:15px!important;margin-top:3px!important}}`;
      document.head.appendChild(late);
      const taskCss = document.createElement('style');
      taskCss.textContent =
        "body.ref.lightning .uc-toolbar{width:100%!important;align-self:stretch!important;box-sizing:border-box!important;height:88px!important;min-height:88px!important;justify-content:flex-end!important;position:relative!important;padding:12px 14px!important;margin:0!important;border:1px solid #d8e4ed!important;border-radius:5px 5px 0 0!important;background:#fff!important}body.ref.lightning .uc-toolbar:before{content:'▤';position:absolute;left:12px;top:14px;width:60px;height:60px;border-radius:6px;background:#8da6bf;color:#fff;font-size:30px;line-height:60px;text-align:center}body.ref.lightning .uc-toolbar:after{content:'Files';position:absolute;left:88px;top:14px;color:#243b5b;font-size:23px;font-weight:700;line-height:30px;pointer-events:none}body.ref.lightning .uc-toolbar .uc-btn{height:48px!important;padding:10px 16px!important;border-left:1px solid #d5e0e9!important;border-radius:0!important;font-size:16px!important}body.ref.lightning .uc-toolbar .uc-btn.primary{position:absolute!important;left:45%!important;top:16px!important;min-width:116px!important;border:0!important;border-radius:4px!important}body.ref.lightning .uc-files:before{content:'☐     Name   ▲                                      Type                 Size                    Modified Date   ▼                 Modified By';height:44px;min-height:44px;display:block;position:sticky;top:0;z-index:2;padding:12px 15px 10px 16px;background:#f0f4f7;border-bottom:1px solid #d9e2ea;color:#263b57;font-size:14px;font-weight:700;white-space:pre;overflow:hidden}body.ref.lightning .uc-files{display:flex!important;flex-direction:column!important;gap:0!important;align-content:stretch!important;border-top:0!important}body.ref.lightning .uc-ftile{--lightning-row-height:44px;flex:none!important;display:grid!important;grid-template-columns:40px minmax(180px,1fr) 100px 130px!important;align-items:center!important;gap:10px!important;padding:0 14px!important;border:0!important;border-bottom:1px solid #e1e7ed!important;border-radius:0!important;text-align:left!important}body.ref.lightning .instruction.panel-note{white-space:normal!important;overflow-wrap:anywhere!important;box-sizing:border-box!important;min-width:0!important;position:static!important;left:auto!important;top:auto!important;width:auto!important;max-width:none!important;margin:14px 0 0!important;box-shadow:0 1px 3px #23456818!important;font-size:14px!important}body.ref.lightning .instruction-toast{position:static!important;align-self:flex-end!important;max-width:55%!important;margin:8px 18px!important;box-shadow:0 3px 12px #23456835!important;font-size:14px!important}body.ref.lightning .tools{position:relative!important}body.ref.lightning .tools:before{content:'';position:absolute;left:20px;top:12px;width:21px;height:21px;background:radial-gradient(circle,#52647f 2px,transparent 2.6px);background-size:7px 7px}body.ref.lightning .uc-ftile{grid-template-columns:28px 30px minmax(180px,1fr) 90px 105px 200px 130px!important}body.ref.lightning .uc-ftile .type,body.ref.lightning .uc-ftile .sz{font-size:14px!important;color:#405572!important;white-space:nowrap!important}body.ref.lightning .uc-ftile:before{content:'';width:18px;height:18px;box-sizing:border-box;border:1px solid #8b9aaa;border-radius:3px;background:#fff;grid-column:1;grid-row:1;justify-self:center}body.ref.lightning .uc-ftile .nm{display:block!important;max-width:100%!important;color:#0875d1!important;font-size:15px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;-webkit-line-clamp:unset!important}@media(max-height:700px){body.ref.lightning .uc-toolbar{height:68px!important;min-height:68px!important}body.ref.lightning .uc-files:before{height:36px;min-height:36px;padding-top:9px}body.ref.lightning .uc-ftile{--lightning-row-height:36px}}";
      document.head.appendChild(taskCss);
      const shell = u.el('main', 'shell', document.body),
        head = u.el('header', 'head', shell);
      u.el('div', 'title', head, cfg.title);
      const search = u.el('div', 'search', head, '⌕　Search Salesforce');
      search.setAttribute('aria-hidden', 'true');
      u.el('span', 'head-help', head, '?');
      u.el('span', 'head-bell', head, '♟');
      u.el('span', 'head-avatar', head, 'JD');
      const tools = u.el('nav', 'tools', shell);
      cfg.tools.split(' ').forEach((label, i) => {
        const item = u.el('span', 'menu-label' + (i === 0 ? ' selected' : ''), tools, label);
      });
      const work = u.el('div', 'work', shell),
        rail = u.el('aside', 'rail', work);
      cfg.rail.forEach((s, i) =>
        u.el(
          i < 2 ? 'div' : 'span',
          i === 0 ? 'rail-kicker' : i === 1 ? 'rail-title' : i % 2 === 0 ? 'rail-label' : 'rail-value',
          rail,
          s,
        ),
      );
      const center = u.el('section', 'center', work),
        tabs = u.el('nav', 'record-tabs', center);
      ['Overview', 'Details', 'Contacts', 'Opportunities', 'Cases', 'Files', 'Related'].forEach((s, i) =>
        u.el('span', i === 5 ? 'active' : '', tabs, s),
      );
      const note = u.el('div', 'instruction', center, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      const stage = u.el('div', 'stage', center);
      const aside = u.el('aside', 'inspector', work);
      cfg.side.forEach((s, i) =>
        u.el(i === 0 ? 'h2' : i % 2 === 1 ? 'span' : 'strong', i === 0 ? '' : 'summary-item', aside, s),
      );
      if (ctx.display === 'panel') {
        note.classList.add('panel-note');
        rail.appendChild(note);
      }
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const footer = u.el('footer', 'footer', shell);
      const ready = u.el('span', 'ready', footer, '');
      const status = u.el('div', 'bottom-status', shell);
      u.el('span', '', status, 'Salesforce');
      let submit = null;
      const endRng = ctx.rng.fork('chrome/end'),
        bank = ctx.content?.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const txt = (x) => (typeof x === 'string' ? x : x?.label || x?.text || String(x));
      let label = endRng.bool(0.5) ? 'Continue' : txt(endRng.pick(bank.filter((x) => txt(x) !== 'Continue')));
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideRng.bool(0.3)) {
        const a = [...new Set(bank.map(txt).filter((x) => x.toLowerCase() !== label.toLowerCase()))];
        if (a.length) collide = collideRng.pick(a);
      }
      const addEnd = (parent, text, cls) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.addEventListener('click', ctx.submit);
        return b;
      };
      if (!ctx.finish) {
        submit = addEnd(footer, label, 'submit');
        if (collide) {
          const b = u.el('button', 'xtra-task', footer, collide);
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'perturb ' + ctx.kind, document.body);
      u.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      u.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const b = u.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      b.type = 'button';
      b.addEventListener('click', ctx.dismiss);
      return { el, dismiss: b };
    },
  });
})();
