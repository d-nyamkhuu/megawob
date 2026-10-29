(function () {
  'use strict';
  const C = {
    'site': 'design-solve-puzzle-arithmetic-12',
    'task': 'solve-puzzle',
    'scenario': 'arithmetic',
    'style': 'gtk',
    'title': 'Math Practice',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'gtk clearlooks instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 24, height: 24, viewBox: '0 0 24 24', class: 'title-icon' }, top);
      u.svg('rect', { x: 2, y: 2, width: 20, height: 20, rx: 3, fill: '#e8edf0', stroke: '#53616a' }, icon);
      u.svg('path', { d: 'M6 7h12M6 11h12M6 15h8', stroke: '#35434c', 'stroke-width': 1.4 }, icon);
      u.el('span', '', top, C.title);
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const b = u.el('button', 'window-' + kind, wc, kind === 'min' ? '−' : kind === 'max' ? '□' : '×');
        b.type = 'button';
      }
      const menu = u.el('nav', 'menu', app);
      ['File', 'Edit', 'Help'].forEach((x) => u.el('span', 'menu-item', menu, x));
      const center = u.el('div', 'center', app),
        brief = u.el('section', 'brief', center);
      if (ctx.display !== 'hidden') brief.textContent = ctx.instruction;
      const preview = u.el('section', 'task-preview', center),
        ph = u.el('h2', 'preview-title', preview, 'Task Preview');
      u.el('div', 'preview-label', preview, 'Math problem:');
      u.el('div', 'preview-expression', preview, 'Arithmetic exercise');
      u.el('div', 'preview-label', preview, 'Your answer:');
      u.el('div', 'preview-empty', preview);
      const previewSubmit = u.el('button', 'preview-submit', preview, 'Submit');
      previewSubmit.type = 'button';
      const work = u.el('section', 'work-area', center),
        tabs = u.el('div', 'tabs', work),
        task = u.el('button', 'tab task-tab', tabs, '▤　Task'),
        prefs = u.el('button', 'tab prefs-tab active', tabs, '⚙　Preferences');
      task.type = prefs.type = 'button';
      const workspace = u.el('div', 'workspace', work),
        stage = u.el('section', 'stage', workspace),
        prefsPanel = u.el('section', 'preferences-panel', workspace);
      prefsPanel.innerHTML =
        '<h2>Application Preferences</h2><div class="pref-card"><h3>General</h3><div class="pref-row"><span>Theme:</span><b class="fake-select">Classic (Default)</b></div><div class="pref-row"><span>Font size:</span><b class="fake-select short">Medium</b></div><div class="pref-row"><span>Automatically check for updates:</span><b class="fake-check">✓</b> Enable</div><div class="pref-row"><span>Play sound effects:</span><b class="fake-check">✓</b> Enable</div><hr><h3>Appearance</h3><div class="pref-row"><span>Window style:</span><b class="fake-select">Normal</b></div><div class="pref-row"><span>Show toolbar text:</span><b class="fake-check">✓</b> Enable</div><div class="pref-row"><span>Language:</span><b class="fake-select short">English (US)</b></div><div class="pref-actions"><button>Restore Defaults</button><button>Cancel</button><button>Apply</button></div></div>';
      function showTask() {
        prefsPanel.hidden = true;
        prefs.classList.remove('active');
        task.classList.add('active');
      }
      function showPrefs() {
        prefsPanel.hidden = false;
        task.classList.remove('active');
        prefs.classList.add('active');
      }
      task.addEventListener('click', showTask);
      prefs.addEventListener('click', showPrefs);
      const tools = u.el('aside', 'tool-strip', center);
      [
        ['▤', 'Task'],
        ['⚙', 'Preferences'],
        ['▣', 'History'],
      ].forEach((x, i) => {
        const b = u.el('button', 'tool' + (i === 1 ? ' selected' : ''), tools, x[0]);
        b.type = 'button';
        b.title = x[1];
        if (i === 0) b.addEventListener('click', showTask);
        if (i === 1) b.addEventListener('click', showPrefs);
      });
      const footer = u.el('footer', 'bottom', app);
      // Chrome choices have independent streams: task content and existing draws stay unchanged.
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const original = er.bool(0.5),
        placement = original ? 'preview' : er.pick(['toolbar', 'form-footer']);
      const endLabel = original ? 'Submit' : er.pick(labels.filter((x) => x !== 'Submit'));
      const actions = u.el('div', 'chrome-actions', menu);
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'preview') submit = previewSubmit;
        else {
          previewSubmit.textContent = 'Open Task';
          previewSubmit.addEventListener('click', showTask);
          const parent = placement === 'toolbar' ? actions : u.el('div', 'end-footer', work);
          submit = u.el('button', 'chrome-end', parent, endLabel);
        }
        submit.textContent = endLabel;
        submit.type = 'button';
        submit.dataset.chromeEnd = 'true';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', ctx.submit);
      } else previewSubmit.remove();
      if (cr.bool(0.3)) {
        const pool = labels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        const label = cr.pick(pool),
          decoy = u.el('button', 'chrome-xtra', actions, label);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
      }
      // Existing preference actions are inert frame, and report their clicks as such.
      prefsPanel
        .querySelectorAll('button')
        .forEach((b) => b.addEventListener('click', () => env.log('decoy', { label: b.textContent })));
      if (ctx.display === 'hidden') brief.remove();
      else {
        const noteBottom = brief.offsetTop + brief.offsetHeight;
        const top = parseFloat(getComputedStyle(preview).marginTop);
        if (noteBottom + 20 > top) preview.style.marginTop = noteBottom + 20 + 'px';
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body),
        messages = {
          cookie: 'This application stores preferences on your device.',
          toast: 'Your workspace has been synced.',
          chat: 'Need help with this exercise?',
          promo: 'Try the new practice collection.',
          banner: 'An updated practice collection is available.',
        };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
