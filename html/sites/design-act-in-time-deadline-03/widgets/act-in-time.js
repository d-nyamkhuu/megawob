// Design on templates/act-in-time/base.js: the base site's act-in-time widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-deadline-03',
  name: 'design',
  split: 'train',
  scenarios: ['deadline'],
  template: 'act-in-time/base',
  design: {
    parts: {
      'buildDeadline': (base, S) => function buildDeadline(ctx, f) {
        const { env, sec1, spinner } = S;
        const { spec, util, rng } = ctx;
        const fam = env.taskDef;
        const ev = (e) => { ctx.update(fam.helpers.act(ctx.model, spec, e)); sync(ctx.model); };
        const main = util.el('div', 'ut-main', f.body);
        const mr = main.getBoundingClientRect();
        const card = util.el('div', 'ut-dl', main);
        card.style.left = Math.round(rng.float(0.1, 0.9) * Math.max(0, mr.width - 440)) + 'px';
        card.style.top = Math.round(rng.float(0.1, 0.9) * Math.max(0, mr.height - 270)) + 'px';
        const h3 = util.el('h3', '', card);
        const p = util.el('p', '', card);
        const state = util.el('div', 'ut-dlstate', card);
        const spin = spinner(util, state);
        const stTxt = util.el('span', '', state);
        const bar = util.el('div', 'ut-dlbar', card);
        const barI = util.el('i', '', bar);
        const row = util.el('div', spec.kind === 'slot' ? 'ut-chips2' : 'ut-row', card);
        // Keep the choices inside the frame even when the editorial copy is tall.
        // Visibility preserves their geometry while the availability window loads.
        Object.assign(row.style, {
          position: 'absolute', left: '20px', right: '20px', bottom: '20px',
          flexWrap: 'wrap', gap: '8px', zIndex: '2', background: '#f8f5ee',
        });
        if (spec.kind !== 'slot') row.style.justifyContent = rng.pick(['flex-start', 'flex-end', 'center']);
        const els = spec.buttons.map((bt) => {
          const el = util.el('button', 'ut-btn' + (bt.key === 'go' && spec.kind === 'offer' ? ' primary' : ''), row, bt.label);
          el.type = 'button';
          el.dataset.key = bt.key;
          el.addEventListener('click', () => ev({ button: bt.key }));
          return el;
        });
        function sync(m) {
          const ready = fam.helpers.deadlineReady(spec, m.t);
          const over = fam.helpers.deadlineOver(spec, m.t);
          const live = ready && !over;
          row.style.visibility = ready ? 'visible' : 'hidden';
          h3.textContent = spec.title;
          p.textContent = spec.text;
          spin.svg.style.display = ready ? 'none' : '';
          spin.arc.setAttribute('transform', `rotate(${Math.round((m.t / spec.beat) * 135) % 360} 11 11)`);
          // the first claim inside the window is confirmed on the card, with the time that was left
          const claim = m.clicks.find((c) => c.key === 'go' && fam.helpers.deadlineReady(spec, c.t) && !fam.helpers.deadlineOver(spec, c.t));
          if (!ready) {
            const openingMs = Math.max(0, spec.ready - m.t);
            const minutes = String(Math.floor(openingMs / 60000)).padStart(2, '0');
            const seconds = String(Math.floor(openingMs / 1000) % 60).padStart(2, '0');
            stTxt.innerHTML = `<span class="ut-opening">${spec.kind === 'slot' ? 'Slots open in' : 'Offer opens in'}</span><strong class="ut-opening-time">${minutes} : ${seconds}</strong><small class="ut-opening-units">MINUTES　 SECONDS</small>`;
          } else stTxt.textContent = claim ? `${spec.kind === 'slot' ? 'Slot booked' : 'Offer claimed'} with ${sec1(spec.ready + spec.window - claim.t)} s to spare`
            : over ? (spec.kind === 'slot' ? 'The slots were released.' : 'This offer has expired.') : `${spec.kind === 'slot' ? 'Held for' : 'Ends in'} ${sec1(fam.helpers.deadlineLeft(spec, m.t))} s`;
          bar.style.visibility = over ? 'hidden' : 'visible';
          const frac = Math.max(0, Math.min(1, fam.helpers.deadlineLeft(spec, m.t) / spec.window));
          barI.style.width = `${100 * frac}%`;
          bar.classList.toggle('low', frac < 0.34);
          for (const el of els) {
            el.classList.toggle('skeleton', !ready);
            el.setAttribute('aria-disabled', live ? 'false' : 'true');
            el.style.opacity = over ? '0.4' : '';
          }
          f.setStatus(claim ? '<b>Done</b>' : over ? 'Expired' : live ? `<b>${sec1(fam.helpers.deadlineLeft(spec, m.t))} s</b> left` : 'Loading');
        }
        return {
          sync,
          locate(tg) {
            const i = tg.button ? spec.buttons.findIndex((b) => b.key === tg.button) : -1;
            return i >= 0 ? util.center(els[i]) : null;
          },
        };
      },
    },
  },
});
