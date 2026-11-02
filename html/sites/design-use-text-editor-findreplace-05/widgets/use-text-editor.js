env.widget({
  task: 'use-text-editor',
  site: 'design-use-text-editor-findreplace-05',
  name: 'design',
  split: 'train',
  scenarios: ['findreplace'],
  traits: { doc: 'code' },
  template: 'use-text-editor/classic',
  design: {
    minLineHeight: 12,
    maxLineHeight: 20,
    minFontSize: 12,
    maxFontSize: 14,
    minWidth: 350,
    fontFamily: 'Consolas, "Liberation Mono", monospace',
    parts: {
      frame: (base, S) => (ctx) => {
        const card = base(ctx);
        card.classList.remove('dark', 'warm', 'low');
        return card;
      },
      appearance: (base, S) => (ctx, look) => ({ ...base(ctx, look), minimap: true }),
      tabs: (base, S) => (ctx, look) => {
        const tabs = S.P.el('div', 'tc-tabs swiss-code-head');
        const title = S.P.el('strong', '', 'Code');
        const file = S.P.el('span', 'swiss-filename', ctx.spec.file);
        const dirty = S.P.el('span', 'tc-dirty');
        tabs.append(title, file, dirty);
        return { tabs, dirty };
      },
      findStrip: (base, S) => (ctx) => {
        const controls = base(ctx);
        controls.crumbs.remove();
        const toolbar = document.querySelector('.paper-toolbar');
        if (toolbar) {
          toolbar.querySelectorAll('.tc-findbtn').forEach((node) => node.remove());
          toolbar.append(controls.findBtn);
          controls.findBtn.title = 'Find and replace';
          controls.findBtn.setAttribute('aria-label', 'Find and replace');
          controls.findBtn.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/></svg>';
        }
        return controls;
      },
      metrics: (base, S) => (ctx, box, controls) => {
        const F = env.taskDef.helpers;
        const count = Math.max(1, F.lines(ctx.spec.base).length, F.lines(ctx.spec.target).length);
        const available = Math.min(box.h, ctx.stage.clientHeight);
        const lh = Math.max(6, Math.min(20, Math.floor((available - 70) / count)));
        const fs = Math.max(8, Math.min(14, lh));
        const font = fs + 'px/' + lh + 'px ' + S.D.fontFamily;
        const probe = S.P.el('span', '', 'M'.repeat(80));
        probe.style.cssText = 'font:' + font + ';position:absolute;visibility:hidden;white-space:pre';
        controls.code.append(probe);
        const cw = probe.getBoundingClientRect().width / 80;
        probe.remove();
        const PAD = 10, TOP = 4;
        const gutterW = Math.ceil(cw * 3 + 22), miniW = controls.mini ? 57 : 0;
        const codeW = Math.floor(box.w - gutterW - miniW - 2);
        const bodyH = count * lh + TOP * 2;
        controls.gutter.style.cssText = 'width:' + gutterW + 'px;font:' + font + ';padding-top:' + TOP + 'px';
        controls.code.style.cssText = 'width:' + codeW + 'px;height:' + bodyH + 'px;font:' + font;
        controls.linesEl.style.cssText = 'position:absolute;left:' + PAD + 'px;top:' + TOP + 'px;right:0';
        controls.body.style.height = bodyH + 'px';
        controls.card.style.width = box.w + 'px';
        return { lh, fs, cw, PAD, TOP, codeW, bodyH };
      },
      minimap: (base, S) => (ctx, mini, lines, height) => {
        base(ctx, mini, lines, height);
        mini.querySelectorAll('i').forEach((bar, index) => {
          const line = lines[index] || '';
          bar.style.background = line.trim().startsWith(ctx.spec.tok) ? '#16943c' : /['"]/.test(line) ? '#ed4949' : '#488be2';
        });
      },
      status: (base, S) => (ctx, status, model, lines, row, column) => {
        base(ctx, status, model, lines, row, column);
        const fields = Array.from(status.children);
        for (const node of fields) if (node.textContent === lines.length + ' lines' || node.textContent === 'LF') node.remove();
        const encoding = fields.find((node) => node.textContent === 'UTF-8');
        const spaces = fields.find((node) => node.textContent.startsWith('Spaces:'));
        const lang = fields[fields.length - 1];
        if (encoding && spaces && lang) status.append(encoding, lang, spaces);
      },
      rendered: (base, S) => (ctx, view) => {
        base(ctx, view);
        const fields = document.querySelectorAll('.inspector-row b');
        const values = [ctx.spec.file, ctx.spec.lang === 'py' ? 'Python File' : 'JavaScript File', ctx.model.text.length + ' bytes', '/project/' + ctx.spec.file];
        values.forEach((value, i) => { if (fields[i]) fields[i].textContent = value; });
        if (fields[5]) fields[5].textContent = ctx.spec.lang === 'py' ? 'Python' : 'JavaScript';
        if (fields[6]) fields[6].textContent = 'Spaces (' + ctx.spec.unit + ')';
        const stats = document.querySelectorAll('.inspector-stat b');
        [env.taskDef.helpers.lines(ctx.model.text).length, ctx.model.text.trim().split(/\s+/).length, ctx.model.text.length].forEach((value, i) => { if(stats[i]) stats[i].textContent = value; });
        const labels = document.querySelectorAll('.structure-label');
        if (labels[0]) labels[0].textContent = ctx.spec.file;
        const functions = Array.from(ctx.model.text.matchAll(/(?:function|def)\s+(\w+)\s*\(([^)]*)\)/g));
        functions.slice(0, 2).forEach((match, index) => { if (labels[index + 1]) labels[index + 1].textContent = match[1] + '(' + match[2] + ')'; });
      },
      place: (base, S) => (ctx, box, view) => {
        base(ctx, box, view);
        Object.assign(view.card.style, { position: 'absolute', left: '0px', top: '0px', margin: '0px' });
      },
    },
  },
});
