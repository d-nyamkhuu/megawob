// Keep the library layout in the widget so its dimensions agree with the listbox.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-scroll-count-03',
  name: 'design',
  split: 'train',
  scenarios: ['scroll-count'],
  template: 'read-figure/base',
  design: {
    parts: {
      ensureStyle: (base) => () => {
        base();
        if (document.getElementById('library-task-layout')) return;
        const style = document.createElement('style');
        style.id = 'library-task-layout';
        style.textContent = `
          .library .up-panel{border:0;border-radius:0;background:transparent;box-shadow:none;overflow:hidden}
          .library .up-head{padding:0 28px;border:0;border-bottom:1px solid #293743;background:transparent;gap:0;position:relative}
          .library .up-head:before{position:absolute;left:calc(56% - 210px)}
          .library .up-head:after{position:absolute;left:calc(56% - 160px);right:auto;margin:0}
          .library .up-badge,.library .up-meta,.library .up-label{display:none}
          .library .up-body{flex:1;min-height:0;padding:0;display:grid;grid-template-columns:minmax(0,1.22fr) minmax(220px,.9fr);gap:0;align-items:stretch}
          .library .up-sc{grid-column:1;grid-row:1;display:flex;min-width:0;min-height:0;padding:0 27px 16px 12px;border-right:1px solid #34424e;position:relative}
          .library .up-sclist{min-width:0;border:0;border-radius:0;background:transparent;scrollbar-width:none}
          .library .up-sclist::-webkit-scrollbar{display:none}
          .library .up-scrow{padding:0 24px 0 18px;gap:23px}
          .library .up-scrow svg{width:30px;height:30px;overflow:visible}
          .library .up-sctrack{position:absolute;right:7px;top:0;width:14px;border-radius:9px;background:#263541}
          .library .up-scthumb{left:2px;right:2px;border-radius:7px;background:#647587}
          .library .up-field,.library .up-opts{grid-column:2;grid-row:1;align-self:stretch;min-width:0;margin:-23px 22px 71px 24px;padding:84px 26px 28px;border:1px solid #2a3946;border-radius:10px;background:linear-gradient(145deg,#151f28,#121a21);position:relative;display:flex;flex-direction:column;gap:14px}
          .library .up-field:before,.library .up-opts:before{content:"Your Answer";position:absolute;left:26px;top:24px;font-size:26px;font-weight:600;color:#f0f3f6}
          .library .up-input{width:100%;min-width:0;height:94px;margin:0;border-radius:9px}
          .library .up-opts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-content:start}
          .library .up-opt{height:100%;min-width:0;padding:0;border-radius:10px}
          @media(max-width:1200px){.library .up-body{grid-template-columns:minmax(0,1.08fr) minmax(220px,.92fr)}.library .up-head:before{left:calc(55% - 164px)}.library .up-head:after{left:calc(55% - 112px)}.library .up-scrow{gap:12px;padding:0 12px}.library .up-field,.library .up-opts{margin:24px 12px;padding-left:16px;padding-right:16px}.library .up-field:before,.library .up-opts:before{left:16px;top:18px;font-size:21px}}
        `;
        document.head.appendChild(style);
      },
      buildScrollCount: (_base, S) => (ctx, body, up, B) => {
        const { spec, util, rng, size } = ctx;
        const panel = body.parentElement;
        panel.style.width = `${Math.max(0, size.width - 8)}px`;
        panel.style.height = `${Math.max(0, size.height - 8)}px`;
        const headH = size.height < 600 ? 74 : 94;
        panel.querySelector('.up-head').style.height = `${headH}px`;
        const bodyH = size.height - 8 - headH - (spec.recoverable ? 44 : 0);
        // Preserve the template's random draws and the exact number of visible rows.
        const answerH = spec.answer === 'typed' ? 46 : 44;
        Math.max(26, Math.min(rng.int(32, 40), Math.floor((B.h - answerH - 40) / spec.view)));
        Math.floor(Math.min(rng.int(380, 470), B.w - 20));
        const RH = Math.max(16, Math.floor((bodyH - 16) / spec.view));
        util.el('div', 'up-label', body, `${spec.rows.length} ${rng.pick(['items', 'entries', 'records'])}`);
        const wrap = util.el('div', 'up-sc', body);
        const list = util.el('div', 'up-sclist', wrap);
        list.style.height = `${spec.view * RH}px`;
        list.style.width = '100%';
        list.dataset.role = 'list';
        const pal = S.palette(spec);
        if (pal.board) {
          list.classList.add('up-low');
          list.style.setProperty('--up-lowboard', pal.board);
        }
        const rowColors = pal.board ? pal.colors : S.ROW_COLORS;
        const iconPx = Math.round(Math.min(spec.glyphs === 'emoji' ? 22 : 20, RH * .6));
        const rows = spec.rows.map(r => {
          const d = util.el('div', 'up-scrow', list);
          d.style.height = `${RH}px`;
          d.dataset.role = 'row';
          const svg = util.svg('svg', {width:iconPx,height:iconPx,viewBox:`0 0 ${iconPx} ${iconPx}`}, d);
          S.drawIcon(util, svg, r.icon, iconPx / 2, iconPx / 2, iconPx, rowColors[r.color], spec.glyphs);
          util.el('span', 'lbl', d, r.label);
          util.el('span', 'meta', d, r.meta);
          return d;
        });
        const track = util.el('div', 'up-sctrack', wrap);
        track.style.height = list.style.height;
        track.dataset.role = 'scrollbar';
        const thumb = util.el('div', 'up-scthumb', track);
        thumb.dataset.role = 'thumb';
        const lbx = env.ui.listbox(list, {
          label:'list', options:rows.map((el,i) => [i,el]),
          onScroll(i) {
            const m = ctx.model;
            const top = Math.round(i * 1000) / 1000;
            const seen = Math.max(m.seen ?? spec.view - 1, Math.round((top + spec.view - 1) * 1000) / 1000);
            if (top !== m.top || seen !== m.seen) ctx.update({...m,top,seen});
          },
          scrollbar:{track,thumb,pad:2,minThumb:24},
        });
        lbx.set({scroll:ctx.model.top || 0});
        let ans;
        if (spec.answer === 'typed') {
          const tf = S.answerField(ctx, body, up, '');
          ans = {sync:m => tf.set(m.text), locate:t => t.field ? tf.locate() : null};
        } else {
          const bt = S.optionButtons(ctx, body, spec.options, k => String(k), up);
          const options = body.querySelector('.up-opts');
          const count = Math.ceil(spec.options.length / 3);
          const available = bodyH - 48 - 28;
          const pad = Math.min(212, Math.max(64, available - count * 60 - (count - 1) * 14));
          const rowH = Math.min(95, Math.floor((available - pad - (count - 1) * 14) / count));
          options.style.paddingTop = `${pad}px`;
          options.style.gridTemplateRows = `repeat(${count},${rowH}px)`;
          ans = {sync:m => bt.set(S.answered(m)), locate:t => t.option !== undefined ? bt.locate(t.option) : null};
        }
        return {
          sync:m => {ans.sync(m);lbx.refresh();},
          locate(t) {
            if (t.pane) return env.util.center(list);
            if (t.thumb) return lbx.locateThumb();
            if (t.scroll !== undefined) return lbx.locateThumbFor(t.scroll);
            return ans.locate(t) || S.fail(t);
          },
        };
      },
    },
  },
});
