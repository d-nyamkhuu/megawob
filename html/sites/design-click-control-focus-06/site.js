(function () {
  'use strict';
  const cfg = {
    'title': 'Customer Record - OS/2 Workplace Shell',
    'theme': 'os2',
    'layout': 'os2',
    'menu': 'File|Edit|View|Insert|Options|Help',
    'tabs': 'General|Details|Notes',
  };
  env.site({
    name: 'design-click-control-focus-06',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head);
      const ico = u.el('span', 'title-icon', title);
      ico.innerHTML =
        '<svg viewBox="0 0 24 24"><path d="M4 3h15v18H4Z" fill="#ddd" stroke="#222"/><path d="M6 5h11v14H6Z" fill="#eee" stroke="#555"/><path d="m8 8 7 1-2 3-3-1 2-3m-1 4 1 4h3V9M3 3h17" fill="none" stroke="#111"/><path d="M6 5h11" stroke="#fff"/></svg>';
      u.el('span', 'title-text', title, cfg.title);
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M4 12h8" stroke-width="2.4"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z" stroke-width="2"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13" stroke-width="2.2"/></svg></i>';
      const menu = u.el('nav', 'menubar', head);
      cfg.menu.split('|').forEach((s) => u.el('span', '', menu, s));
      const frameRng = ctx.rng.fork('chrome/end');
      const endLabels = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
        'Complete',
        "I'm done",
      ];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const sampledEndLabel = labelOf(frameRng.pick(endLabels));
      const endLabel = ctx.rng.fork('chrome/reference-label').bool(0.5) ? 'Submit' : sampledEndLabel;
      const placement = ctx.finish ? null : frameRng.pick(['footer', 'footer', 'footer', 'header', 'link', 'icon']);
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const pool = endLabels.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
        const alternatives = pool.filter((x) => String(x).toLowerCase() !== String(endLabel).toLowerCase());
        if (alternatives.length) collide = collideRng.pick(alternatives);
      }
      const tools = u.el('div', 'os2-tools', head);
      const decoyBtn = (parent, text, isCollide) => {
        const b = u.el('button', isCollide ? 'os2-xtra collide' : 'os2-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: text, ...(isCollide ? { collide: true } : {}) }));
        return b;
      };
      if (collide) decoyBtn(tools, collide, true);
      const endBtn = (parent, cls, label) => {
        const b = u.el('button', cls, parent, label);
        b.type = 'button';
        b.title = endLabel;
        b.setAttribute('aria-label', endLabel);
        b.addEventListener('click', ctx.submit);
        return b;
      };
      let headerSubmit = null;
      if (!ctx.finish && (placement === 'header' || placement === 'icon'))
        headerSubmit = endBtn(
          tools,
          placement === 'icon' ? 'os2-submit os2-icon' : 'os2-submit',
          placement === 'icon' ? '✓' : endLabel,
        );
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const tabs = u.el('div', 'tabs', center);
      cfg.tabs.split('|').forEach((s, i) => u.el('span', i === 0 ? 'tab on' : 'tab', tabs, s));
      const page = u.el('div', 'page', center);
      const hd = u.el('div', 'doc-head', page);
      const book = u.el('span', 'doc-icon', hd);
      book.innerHTML =
        '<svg viewBox="0 0 80 90" stroke="#090909" stroke-width="2" stroke-linejoin="round"><path d="M12 17 63 3 67 7 69 11 74 13 74 75 17 88Q3 86 4 76V28Q2 20 12 17Z" fill="#ccc"/><path d="M10 18 62 5M10 22 67 8M12 26 69 12M16 31 73 15M16 36 74 19M17 36v49M7 29Q5 35 16 36M5 43Q4 49 16 50M5 64Q4 71 16 72M5 76Q4 83 16 84" fill="none"/><path d="m22 37 44-12v47L22 82Z" fill="#eee"/><path d="m28 42 31-8v32l-31 9Z" fill="#aaa"/><path d="M42 34q-8 1-7 11 0 7 6 7 7-1 8-9 0-9-7-9ZM32 72q-1-13 6-17l4 9 4-12q9 1 9 14Z" fill="#000" stroke="none"/><path d="m9 37 5 3M8 41l6 3M8 52l6 3M8 57l6 3M8 61l6 3M8 74l6 3" fill="none" stroke-width="1"/></svg>';
      const hh = u.el('div', 'doc-title', hd, 'Customer Information');
      const stage = u.el('div', 'stage', page);
      const aside = u.el('aside', 'inspector', work);
      const display = ctx.display;
      const note = u.el('div', 'instruction', display === 'header' ? head : aside, ctx.instruction);
      note.dataset.display = display;
      note.hidden = display === 'hidden';
      if (display === 'toast') note.classList.add('instruction-toast');
      const act = u.el('div', 'action', aside);
      act.hidden = display === 'hidden';
      u.el('strong', '', act, 'Action:');
      u.el('p', '', act, 'Use the mouse pointer to click inside the textbox.');
      const foot = u.el('footer', 'footer', shell);
      const clear = u.el('button', 'clear-form', foot, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () =>
        stage.querySelectorAll('input,textarea').forEach((input) => (input.value = '')),
      );
      const helpb = u.el('button', 'help-btn', foot, 'Help');
      helpb.type = 'button';
      let submit = null;
      if (!ctx.finish && placement === 'footer') {
        submit = endBtn(foot, 'submit', endLabel);
      } else if (!ctx.finish && placement === 'link') {
        submit = endBtn(foot, 'submit os2-link', endLabel + ' ›');
      } else submit = headerSubmit;
      const bar = u.el('div', 'taskbar', shell);
      const t1 = u.el('span', 'tb-item shellbtn', bar);
      t1.innerHTML =
        '<svg viewBox="0 0 28 28"><path d="M1 1h26v26H1Z" fill="#bbb" stroke="#111"/><path d="M3 3h22v21H3Z" fill="#eee" stroke="#fff"/><path d="M7 7h13v15H6V10h14v12H8Z" fill="#1114a4"/><path d="m10 5 7 1 4 5-4 4-6-1-3-5Z" fill="#bfc6c5" stroke="#333"/><path d="m11 6 4 2-3 6-4-3Z" fill="#eee"/><path d="m17 8 5 4-5 5-3-2Z" fill="#7377dd"/><path d="M4 23h20v2H4Z" fill="#252b9c"/><path d="M18 18h6v4h-6Z" fill="#ddd" stroke="#666"/></svg><b>Workplace Shell</b>';
      const t2 = u.el('span', 'tb-item recbtn', bar);
      t2.innerHTML =
        '<svg viewBox="0 0 28 28"><path d="M3 1h17v23H3Z" fill="#eee" stroke="#111"/><path d="M6 4h17v23H6Z" fill="#ddd" stroke="#111"/><path d="M8 6h13v19H8Z" fill="#fff"/><path d="M9 8h11M9 11h11M9 14h11M9 17h11M9 20h11M9 23h11" stroke="#111"/></svg><b>Customer Record</b>';
      const clock = u.el('span', 'tb-clock', bar);
      clock.innerHTML =
        '<svg viewBox="0 0 28 28"><path d="M1 1h26v26H1Z" fill="#ddd" stroke="#111"/><path d="M3 3h10v10H3Zm12 0h10v10H15ZM3 15h10v10H3Zm12 0h10v10H15Z" fill="#fff" stroke="#888"/><path d="M5 5h5v5H5Zm12 12h5v5h-5Z" fill="#6655b4"/><path d="m18 4 4 6-5 2Zm-14 15 7-3v6Z" fill="#6255c5" stroke="#222" stroke-width=".6"/><path d="M6 4v5m-2-3h5m9 13 3-2m-3 2 4 2" stroke="#bbb"/><circle cx="20" cy="20" r="2" fill="#ddd"/></svg><b>10:24 AM</b>';
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
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
      ctx.util.el(
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
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
