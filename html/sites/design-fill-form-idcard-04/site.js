(function () {
  'use strict';
  const palette = { bg: '#e4e9ef', panel: '#f8fafc', fg: '#101944', muted: '#66758d', line: '#c8d2df' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('div', 'ds-brand', top, 'DOCUMENT-TO-FORM LITE');
      const help = u.el('div', 'ds-help', top);
      help.innerHTML = '<span class="ds-info">i</span><span>Date format: YYYY-MM-DD</span>';
      const outer = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', outer);
      const toolbar = u.el('div', 'ds-footer', content);
      Object.assign(_c, { top, content, toolbar, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-note', 'ds-note-header');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) note.classList.add('ds-note', 'ds-note-panel');
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const stage = u.el('main', 'ds-stage', _c.body);
      stage.style.position = 'relative';
      const sourceHead = u.el('div', 'ds-source-head', stage);
      sourceHead.setAttribute('aria-hidden', 'true');
      sourceHead.style.cssText =
        'position:absolute;z-index:40;left:44%;right:0;top:0;height:132px;pointer-events:none;background:linear-gradient(135deg,#dce2e9,#f0f2f4);';
      const sourceTitle = u.el('div', '', sourceHead, 'SOURCE DOCUMENT');
      sourceTitle.style.cssText =
        "position:absolute;left:32px;top:21px;color:#101944;font-family:'Arial Narrow','Roboto Condensed',Impact,sans-serif;font-size:42px;line-height:1;font-weight:800;letter-spacing:-.5px;white-space:nowrap;";
      const tools = u.el('div', '', sourceHead);
      tools.style.cssText =
        'position:absolute;right:20px;top:12px;height:46px;display:flex;align-items:center;color:#172440;font:15px Arial,sans-serif;';
      const group = u.el('div', '', tools);
      group.style.cssText =
        'height:46px;display:flex;align-items:center;background:#f8f9fb;border-radius:9px;overflow:hidden;';
      for (const [text, width] of [['−', 42], ['100%', 54], ['+', 42]]) {
        const item = u.el('span', '', group, text);
        item.style.cssText = `width:${width}px;height:46px;display:grid;place-items:center;color:#172440;font:16px Arial,sans-serif;`;
      }
      const refresh = u.el('span', '', tools, '↻');
      refresh.style.cssText =
        'width:58px;height:40px;margin-left:22px;border-left:1px solid #aeb9c8;display:grid;place-items:center;color:#25354e;font:34px/1 Arial,sans-serif;';
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-note', 'ds-note-toast');
        _c.content.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.toolbar.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.toolbar.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-fill-form-idcard-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#0751ad'], LOW_ACCENTS: ['#0751ad'], parts,
    },
  });
})();
