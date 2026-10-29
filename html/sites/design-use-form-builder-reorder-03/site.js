// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) =>
      function overlay(ctx) {
        const { K } = S;
        const { rng, util, kind } = ctx;
        const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
        el.dataset.role = 'overlay';
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        const row = util.el('div', 'ref-ov-row', box);
        const btn = (label, how, primary) => {
          if (word && K.button[label]) label = word(K.button[label]);
          const b = util.el('button', primary ? 'ref-ov-btn ref-ov-primary' : 'ref-ov-btn', row, label);
          b.type = 'button';
          b.addEventListener('click', () => (how ? ctx.dismiss(how) : env.log('overlay-click', { label })));
          return b;
        };
        let dismiss;
        if (kind === 'cookie') {
          if (rng.bool(0.5)) btn('Settings', null, false);
          btn(rng.pick(['Reject all', 'Necessary only']), 'reject', false);
          dismiss = btn(rng.pick(['Accept all', 'Accept', 'Got it']), 'accept', true);
        } else if (kind === 'promo') {
          dismiss = btn(rng.pick(['No thanks', 'Maybe later', 'Close']), 'close', false);
          btn(rng.pick(['Upgrade now', 'Start trial', 'Learn more']), null, true);
        } else if (kind === 'banner') {
          dismiss = btn('Dismiss', 'close', false);
        } else {
          dismiss = btn('×', 'close', false);
          dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
        }
        if (kind === 'promo') {
          const art = util.el('div', 'paper-promo-art', box);
          art.innerHTML =
            '<svg viewBox="0 0 180 180" aria-hidden="true"><circle cx="90" cy="90" r="88" fill="#fdeaea"/><g fill="white" stroke="#343b47" stroke-width="3" stroke-linejoin="round"><path d="M42 84 90 53l48 31v62H42z"/><path d="M56 59V39h68v86H56z"/><path d="m42 84 48 37 48-37v62H42z"/></g><path d="m42 146 48-36 48 36M67 55h46M67 67h46M67 79h39" fill="none" stroke="#343b47" stroke-width="3"/><path d="m140 51 12-10m-7 20 16-3m-28-18 5-14" stroke="#c5000d" stroke-width="3"/></svg>';
          const heading = util.el('h2', 'paper-promo-heading', box, 'Get product updates');
          box.prepend(art, heading);
          const input = util.el('input', 'paper-promo-email');
          input.type = 'email';
          input.placeholder = 'Your email address';
          row.prepend(input);
          dismiss.classList.add('paper-promo-close');
          dismiss.title = dismiss.textContent;
          dismiss.textContent = '×';
          dismiss.setAttribute('aria-label', 'Close');
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.theme': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
        const { rng, util, content } = ctx;
        let name = rng.pick(Object.keys(THEMES));
        const root = document.documentElement;
        let accent = rng.pick(ACCENTS);
        const tr = rng.fork('chrome/theme');
        if (tr.bool(0.08)) {
          name = 'low';
          accent = tr.pick(LOW_ACCENTS);
        }
        for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name]))
          root.style.setProperty(`--${k}`, v);
        root.style.setProperty('--accent', accent);
        root.dataset.theme = name;
        for (const [k, v] of Object.entries({
          bg: '#fff',
          panel: '#fff',
          fg: '#111',
          muted: '#68666e',
          line: '#ddd',
          accent: '#b40009',
        }))
          root.style.setProperty(`--${k}`, v);
        root.dataset.theme = 'light';
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.layout': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const roomy = W >= 1260;
        const tall = H >= 700;
        let display = ctx.display || 'header';
        if (display === 'panel' && !roomy) display = 'header';
        if (display === 'toast' && !tall) display = 'header';
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');
        document.body.dataset.display = display;
        Object.assign(_c, { H, W, display, roomy, tall });
      },
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebar = roomy && rng.bool(0.35);
        const nav = W >= 1180 && rng.bool(0.5);
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        const endDesign = rng.fork('paper/end');
        const usualEnd = endDesign.bool(0.55);
        placement = ctx.finish ? null : usualEnd ? 'footer' : endDesign.pick(['header', 'icon', 'link']);
        if (usualEnd) label = 'Confirm';
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        Object.assign(_c, { collide, cr, decoys, endDesign, label, nav, placement, sidebar, usualEnd, wantFooter });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const titlebar = util.el('div', 'flash-titlebar', document.body);
        titlebar.innerHTML =
          '<div class="paper-masthead"><div class="paper-brand">Andersson Snickeri</div><div class="paper-kicker">SURVEYS　·　FORMS　·　FEEDBACK</div><div class="paper-form-title">Member feedback</div><div class="paper-description">Build and organize your form, add questions, and set validation, routing and response settings.</div></div><div class="paper-stats"><div><b>3</b><span>Sections</span></div><div><b>9</b><span>Questions</span></div><div><b>0</b><span>Branching rules</span></div><p>Published status　 <strong>●　Draft</strong></p><p>Last updated　　Apr 12, 2011　10:24</p></div><div class="paper-preview"><b>Andersson Snickeri</b><span>Member feedback</span><i></i><em></em><em></em><em></em></div>';
        const draft = titlebar.querySelector('.paper-stats strong');
        draft.textContent = 'Draft';
        draft.prepend(util.el('span', 'paper-status-dot'));
        document.body.insertBefore(titlebar, header);
        const menubar = util.el('nav', 'flash-menubar', document.body);
        for (const item of ['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Help'])
          util.el('span', '', menubar, item);
        document.body.insertBefore(menubar, header);
        const toolbar = util.el('div', 'flash-toolbar', document.body);
        toolbar.innerHTML =
          '<span>▤　New</span><span>▰　Open</span><i></i><span>✂　Cut</span><span>▣　Copy</span><span>▧　Paste</span><span>✖　Delete</span><i></i><span>⬆　Move Up</span><span>⬇　Move Down</span>';
        document.body.insertBefore(toolbar, header);
        S.frameBrand(_c, header);
        Object.assign(_c, { draft, header, menubar, titlebar, toolbar });
      },
    'frame.instruction': (base, S) =>
      function (_c) {
        const { ctx, display, header, titlebar, util } = _c;
        if (display === 'header')
          util.el('div', 'ref-instruction', titlebar.querySelector('.paper-masthead'), ctx.instruction);
        else util.el('div', 'ref-spacer', header);
      },
    'frame.footer': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
        let { submit } = _c;
        {
          const foot = util.el('footer', 'ref-foot', document.body);
          const footText = wantFooter
            ? rng.pick([
                '© 2024 Example Co.',
                'All changes are saved automatically.',
                'Need help? Contact your administrator.',
                'v4.2.1 · Status: all systems normal',
              ])
            : '';
          util.el(
            'span',
            'ref-foot-text',
            foot,
            word
              ? lr.pick([
                  `© 2024 Example Co. ${word('footRights')}`,
                  word('footSaved'),
                  word('footHelp'),
                  `v4.2.1 · ${word('footStatus')}`,
                ])
              : footText,
          );
          const dockIcons = [
            '<rect x="4" y="2" width="22" height="28" rx="2" fill="currentColor"/><path d="M9 9h12M9 15h12M9 21h8" stroke="white" stroke-width="2"/>',
            '<path d="M3 3h21v19H9l-6 5zM10 25h16V10h3v22l-9-7z" fill="currentColor"/><path d="M7 8h13M7 12h13M7 16h9" stroke="white" stroke-width="1.4"/>',
            '<circle cx="16" cy="8" r="5" fill="currentColor"/><circle cx="5" cy="11" r="3.5" fill="currentColor"/><circle cx="27" cy="11" r="3.5" fill="currentColor"/><path d="M7 28v-7c0-9 18-9 18 0v7zM0 25v-5c0-5 5-7 8-4l-3 9zM27 25l-3-9c4-3 8 0 8 4v5z" fill="currentColor"/>',
            '<rect x="5" y="5" width="23" height="26" rx="1" fill="none" stroke="currentColor" stroke-width="3"/><path d="M11 4h11v5H11zM10 15h13M10 21h13M10 27h13" stroke="currentColor" stroke-width="3"/><path d="m12 12 4 4-4 5 5 5 5-8" fill="none" stroke="currentColor" stroke-width="2"/>',
            '<path d="m13 1 6 0 1 4 4 2 4-1 3 6-3 3v4l3 3-3 6-4-1-4 2-1 4h-6l-1-4-4-2-4 1-3-6 3-3v-4l-3-3 3-6 4 1 4-2z" fill="currentColor"/><circle cx="16" cy="17" r="6" fill="white"/>',
          ];
          const dock = util.el('nav', 'paper-dock', foot);
          ['Forms', 'Responses', 'Contacts', 'Templates', 'Settings'].forEach((name, i) => {
            const item = util.el('div', i === 0 ? 'paper-dock-active' : '', dock);
            item.innerHTML =
              '<svg viewBox="0 0 34 34" aria-hidden="true">' + dockIcons[i] + '</svg><span>' + name + '</span>';
          });
          const tools = util.el('div', 'ref-tools', foot);
          if (decoys.length > 1) decoyBtn(tools, decoys[1]);
          if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
          if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
          if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
          foot.style.setProperty(
            '--footer-actions',
            tools.children.length ? `${tools.children.length * 88 + 18}px` : '1.4%',
          );
        }
        Object.assign(_c, { submit });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { endBtn, label, placement, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        const paperWidget = env.widgetDef;
        if (paperWidget && paperWidget.render && !paperWidget.paperRender) {
          const render = paperWidget.render;
          paperWidget.paperRender = render;
          paperWidget.render = function (widgetCtx) {
            const notePanel = document.querySelector('.ref-panel');
            const result = render.call(this, widgetCtx);
            const decorate = () => {
              const stage = widgetCtx.stage;
              const el = widgetCtx.util.el;
              const title = stage.querySelector('.af-title b');
              if (title) {
                const names = title.textContent.split(' · ');
                document.querySelectorAll('.paper-brand, .paper-preview b').forEach((n) => (n.textContent = names[0]));
                document
                  .querySelectorAll('.paper-form-title, .paper-preview > span')
                  .forEach((n) => (n.textContent = names.slice(1).join(' · ')));
              }
              const note = document.querySelector('.paper-masthead > .ref-instruction');
              if (note) {
                const mast = note.parentElement;
                const brand = mast.querySelector('.paper-brand');
                const kicker = mast.querySelector('.paper-kicker');
                const available = mast.clientHeight - brand.offsetHeight - kicker.offsetHeight - 24;
                let size = Math.min(18, window.innerWidth / 96);
                note.style.fontSize = size + 'px';
                while (note.offsetHeight > available && size > 11.5) {
                  size -= 0.25;
                  note.style.fontSize = size + 'px';
                }
              }
              stage.querySelectorAll('.af-sections > button').forEach((button) => {
                const existingLabel = [...button.children].find(
                  (n) => n.tagName !== 'SMALL' && !n.classList.contains('paper-grip'),
                );
                if (existingLabel) {
                  existingLabel.classList.add('paper-section-label');
                  existingLabel.textContent = existingLabel.textContent.replace(/^\s*\d+\.\s*/, '');
                }
                if (!button.querySelector('.paper-grip')) {
                  const label = [...button.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
                  if (label) {
                    const text = label.textContent.replace(/^\s*\d+\.\s*/, '');
                    label.textContent = '';
                    el('span', 'paper-section-label', button, text);
                  }
                  button.prepend(el('span', 'paper-grip'));
                }
              });
              stage.querySelectorAll('.af-card').forEach((card) => {
                const top = card.querySelector('.af-card-top');
                if (!top) return;
                if (!card.querySelector('.paper-grip')) card.prepend(el('span', 'paper-grip'));
                const meta = [...top.children].find(
                  (n) => n.tagName === 'SPAN' && !n.classList.contains('af-card-more'),
                );
                if (meta && !meta.querySelector('.paper-question-type')) {
                  const parts = meta.textContent.split(' / ');
                  meta.textContent = '';
                  meta.classList.add('paper-question-meta');
                  el('span', 'paper-question-number', meta, parts[0]);
                  el('span', 'paper-question-type', meta, parts.slice(1).join(' / '));
                  if (parts[1] === 'Number') {
                    const icon = top.querySelector('svg');
                    if (icon)
                      icon.innerHTML =
                        '<text x="0" y="18" fill="currentColor" stroke="none" font-family="Arial,sans-serif" font-size="14">123</text>';
                  }
                }
                const more = top.querySelector('.af-card-more svg');
                if (more)
                  more.innerHTML =
                    '<circle cx="4" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="20" cy="12" r="2" fill="currentColor" stroke="none"/>';
              });
              const inspector = stage.querySelector('.af-inspector');
              if (inspector) {
                const heading = inspector.querySelector('.af-property-heading');
                if (heading) {
                  heading.querySelector('b').textContent = 'Question settings';
                  const del = [...inspector.children].find(
                    (n) => n.tagName === 'BUTTON' && n.textContent.trim() === 'Delete question',
                  );
                  if (del) heading.append(del);
                }
                const titleField = inspector.querySelector('textarea')?.closest('.af-field');
                const typeField = [...inspector.querySelectorAll('.af-field')].find(
                  (n) => n.querySelector('.af-select') && n.querySelector('.af-label')?.textContent !== 'Rule',
                );
                if (titleField) titleField.querySelector('.af-label').textContent = 'Question text';
                if (typeField) typeField.querySelector('.af-label').textContent = 'Answer type';
                const validation = inspector.querySelector('h3');
                if (validation) validation.textContent = 'Validation';
                const toggle = inspector.querySelector('.af-toggle-row');
                if (toggle && validation) {
                  validation.after(toggle);
                  const caption = toggle.querySelector('b');
                  if (caption) caption.textContent = 'Require an answer';
                }
                if (!inspector.querySelector('.paper-help')) {
                  const help = el('label', 'af-field paper-help');
                  const helpLabel = el('span', 'af-label', help);
                  helpLabel.innerHTML = '<b>Help text</b> (optional)';
                  const input = el('input', 'af-input', help);
                  input.placeholder = 'e.g. We’ll only use this to follow up.';
                  if (titleField) titleField.after(help);
                  const response = el('div', 'paper-response', inspector);
                  el('h3', '', response, 'Response settings');
                  const line = el('label', 'paper-checkbox-line', response);
                  const box = el('input', '', line);
                  box.type = 'checkbox';
                  el('span', '', line, 'Store in respondent profile');
                  const extra = el('div', 'paper-validation-extra');
                  ['Must be a valid email address', 'Show custom error message'].forEach((text) => {
                    const label = el('label', 'paper-checkbox-line', extra);
                    const checkbox = el('input', '', label);
                    checkbox.type = 'checkbox';
                    el('span', '', label, text);
                  });
                  if (toggle) toggle.after(extra);
                }
                const rule = [...inspector.querySelectorAll('.af-field')].find(
                  (n) => n.querySelector('.af-label')?.textContent.trim() === 'Rule',
                );
                if (rule) {
                  rule.classList.add('paper-rule');
                  inspector.append(rule);
                }
                if (notePanel && !inspector.contains(notePanel)) inspector.prepend(notePanel);
              }
            };
            decorate();
            if (result.sync) {
              const sync = result.sync;
              result.sync = function (...args) {
                const out = sync.apply(this, args);
                decorate();
                return out;
              };
            }
            return result;
          };
        }
        Object.assign(_c, { paperWidget, submit });
      },
  };

  env.site({
    name: 'design-use-form-builder-reorder-03',
    template: 'site/base',
    design: { parts },
  });
})();
