/* find-fact/_base-dashboard: reference builders. S is the live reference unit scope;
 * the wrappers in reference.js retain every design override and its original call order.
 * B holds one render's local state, shared by its setup, painting and interaction functions. */
(function () {
  'use strict';

  function renderDashboard(S, ctx) {
    const B = { S, ctx };
    B.rr = (...args) => roundRect(B, ...args);
    B.panel = (...args) => drawPanel(B, ...args);
    B.drawKpis = (...args) => drawDashboardKpis(B, ...args);
    B.drawChart = (...args) => drawDashboardChart(B, ...args);
    B.bubble = (...args) => drawBubble(B, ...args);
    B.drawBoard = (...args) => drawDashboardBoard(B, ...args);
    B.drawNotes = (...args) => drawDashboardNotes(B, ...args);
    B.drawSide = (...args) => drawDashboardSide(B, ...args);
    B.draw = (...args) => drawDashboard(B, ...args);
    setupDashboard(B);
    B.rng0 = { notesSub: B.rng.pick(['shared', 'draft', 'last week']) };
    B.rng0.sparkTitle = B.rng.pick(['Trend', 'Last 12 weeks', 'Weekly trend']);
    B.rng0.sparkNote = B.rng.pick(['Compared with the same period last year.', 'Rolling 12-week view.', 'Updated every Monday.']);
    B.hoverLocal = null;
    B.draw();
    B.hitAt = (e) => {
      const r = B.cv.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const z = B.zones.find((q) => q && x >= q.x && x < q.x + q.w && y >= q.y && y < q.y + q.h);
      return z ? z.i : null;
    };
    B.cv.addEventListener('pointermove', (e) => {
      const i = B.hitAt(e);
      if (i === B.hoverLocal) return;
      B.hoverLocal = i;
      B.draw();
      B.cv.style.cursor = i === null ? 'default' : B.tooltipV ? 'help' : 'pointer';
      if (i !== null) {
        B.S.env.log('hover', { what: B.tooltipV ? B.spec.mode : 'bar', key: i });
        if (B.ctx.model.hover !== i) B.ctx.update({ ...B.ctx.model, hover: i });
      }
    });
    B.cv.addEventListener('pointerleave', () => {
      if (B.hoverLocal === null) return;
      B.hoverLocal = null;
      B.draw();
    });
    B.ans = B.util.el('div', 'db-ans', B.app);
    B.lab = B.util.el('label', '', B.ans, B.rng.pick(['Answer', 'Your answer', 'Reading']));
    B.inp = B.util.el('input', '', B.ans);
    B.inp.type = 'text';
    B.inp.autocomplete = 'off';
    B.inp.spellcheck = false;
    B.inp.id = 'db-ans';
    B.inp.dataset.role = 'field';
    B.inp.placeholder = B.rng.pick(['Type the answer', '', 'Answer']);
    B.lab.htmlFor = B.inp.id;
    B.ans.style.right = (B.sideLeft || !B.side ? B.P : B.P) + 'px';
    B.ans.style.bottom = Math.round((B.ansH - 48) / 2 + B.P - 4) + 'px';
    B.field = B.S.env.ui.textField(B.inp, { value: B.ctx.model.answers[0], label: 'answer0', onInput: (v) => B.ctx.update({ ...B.ctx.model, answers: [v] }) });
    B.S.dbView = {
      sync(m) { B.field.set(m.answers[0]); },
      locate(t) {
        if (t.field === 0) return B.field.locate();
        const k = t.bar !== undefined ? t.bar : t.tip;
        if (k === undefined || !B.zones[k]) return null;
        const r = B.cv.getBoundingClientRect();
        return [r.left + B.zones[k].cx, r.top + B.zones[k].cy];
      },
    };
    B.S.dropAnswer(B.ctx, B.app);
    return { anchors: [B.app], sync: (m) => B.S.dbView.sync(m) };
  }

  function roundRect(B, x, y, w, h, r, fill, stroke) {
    B.g.beginPath();
    B.g.moveTo(x + r, y);
    B.g.arcTo(x + w, y, x + w, y + h, r);
    B.g.arcTo(x + w, y + h, x, y + h, r);
    B.g.arcTo(x, y + h, x, y, r);
    B.g.arcTo(x, y, x + w, y, r);
    B.g.closePath();
    if (fill) { B.g.fillStyle = fill; B.g.fill(); }
    if (stroke) { B.g.strokeStyle = stroke; B.g.lineWidth = 1; B.g.stroke(); }
  }

  function drawPanel(B, x, y, w, h, title, sub) {
    B.rr(x + 0.5, y + 0.5, w - 1, h - 1, 10, B.V.panel, B.V.line);
    B.g.fillStyle = B.V.fg;
    B.g.font = B.F(700, 15);
    B.g.textAlign = 'left';
    B.g.textBaseline = 'alphabetic';
    B.g.fillText(title, x + 16, y + 26);
    if (sub) {
      const tw = B.g.measureText(title).width;
      B.g.font = B.F(500, 12.5);
      B.g.fillStyle = B.V.muted;
      B.g.fillText(sub, x + 16 + tw + 10, y + 26);
    }
  }

  function drawDashboardKpis(B) {
    const n = B.kpis.length;
    const tw = (B.cw - 2 * B.P - (n - 1) * 12) / n;
    B.kpis.forEach(([label, value], i) => {
      const x = B.P + i * (tw + 12);
      B.rr(x + 0.5, B.P + 0.5, tw - 1, B.kpiH - 1, 10, B.V.panel, B.V.line);
      B.g.textAlign = 'left';
      B.g.fillStyle = B.V.muted;
      B.g.font = B.F(600, 12);
      B.g.fillText(label.toUpperCase(), x + 14, B.P + 22, tw - 28);
      B.g.fillStyle = B.V.fg;
      B.g.font = B.F(700, B.kpiH < 70 ? 20 : 24);
      B.g.fillText(value, x + 14, B.P + B.kpiH - 16, tw - 28);
      if (B.kpiDelta[i] && !/^[+−]/.test(value) && tw > 150) {
        B.g.font = B.F(600, 12);
        B.g.textAlign = 'right';
        B.g.fillStyle = B.kpiDelta[i] > 0 ? '#2f9e44' : '#e03131';
        B.g.fillText(`${B.kpiDelta[i] > 0 ? '▲' : '▼'} ${Math.abs(B.kpiDelta[i]).toFixed(1)}%`, x + tw - 14, B.P + B.kpiH - 18);
      }
    });
  }

  function drawDashboardChart(B, hover) {
    const x0 = B.mainX;
    const y0 = B.mainY;
    B.panel(x0, y0, B.mainW, B.mainH, B.spec.title, B.spec.unit);
    // legend (top right)
    B.g.font = B.F(500, 12.5);
    const lw = B.g.measureText(B.seriesName).width;
    B.g.fillStyle = B.color;
    if (B.spec.kind === 'bar') B.g.fillRect(x0 + B.mainW - lw - 40, y0 + 16, 12, 12);
    else { B.g.fillRect(x0 + B.mainW - lw - 42, y0 + 21, 16, 3); }
    B.g.fillStyle = B.V.muted;
    B.g.textAlign = 'left';
    B.g.fillText(B.seriesName, x0 + B.mainW - lw - 22, y0 + 26);
    const n = B.spec.cats.length;
    const rot = n > 8 || B.mainW / n < 70;
    const pad = { l: 52, r: 18, t: 46, b: rot ? 54 : 32 };
    const pw = B.mainW - pad.l - pad.r;
    const ph = B.mainH - pad.t - pad.b;
    const y = (v) => y0 + pad.t + ph * (1 - v / B.spec.max);
    const half = B.spec.values.some((v) => v % B.spec.step !== 0);
    const ticks = B.spec.max / B.spec.step;
    B.g.lineWidth = 1;
    for (let k = 0; k <= ticks; k++) {
      const v = k * B.spec.step;
      B.g.strokeStyle = B.V.line;
      B.g.setLineDash([]);
      B.g.beginPath();
      B.g.moveTo(x0 + pad.l, Math.round(y(v)) + 0.5);
      B.g.lineTo(x0 + pad.l + pw, Math.round(y(v)) + 0.5);
      B.g.stroke();
      if (half && k < ticks) {
        B.g.setLineDash([3, 4]);
        B.g.beginPath();
        B.g.moveTo(x0 + pad.l, Math.round(y(v + B.spec.step / 2)) + 0.5);
        B.g.lineTo(x0 + pad.l + pw, Math.round(y(v + B.spec.step / 2)) + 0.5);
        B.g.stroke();
        B.g.setLineDash([]);
      }
      B.g.fillStyle = B.V.muted;
      B.g.font = B.F(500, 12);
      B.g.textAlign = 'right';
      B.g.fillText(String(v), x0 + pad.l - 8, y(v) + 4);
    }
    B.g.strokeStyle = B.V.muted;
    B.g.beginPath();
    B.g.moveTo(x0 + pad.l + 0.5, y0 + pad.t);
    B.g.lineTo(x0 + pad.l + 0.5, Math.round(y(0)) + 0.5);
    B.g.lineTo(x0 + pad.l + pw, Math.round(y(0)) + 0.5);
    B.g.stroke();
    const bw = pw / n;
    const cx = (i) => x0 + pad.l + bw * (i + 0.5);
    B.zones.length = 0;
    if (B.spec.kind === 'line') {
      B.g.strokeStyle = B.color;
      B.g.lineWidth = 2.5;
      B.g.beginPath();
      B.spec.values.forEach((v, i) => (i ? B.g.lineTo(cx(i), y(v)) : B.g.moveTo(cx(i), y(v))));
      B.g.stroke();
      B.g.lineWidth = 1;
    }
    B.spec.values.forEach((v, i) => {
      const on = hover === i;
      if (B.spec.kind === 'bar') {
        B.g.fillStyle = B.color;
        B.g.globalAlpha = hover !== null && !on ? 0.75 : 1;
        B.rr(cx(i) - bw * 0.3, y(v), bw * 0.6, y(0) - y(v), 3, B.color);
        B.g.globalAlpha = 1;
      } else {
        B.g.beginPath();
        B.g.arc(cx(i), y(v), on ? 6.5 : 5, 0, Math.PI * 2);
        B.g.fillStyle = on ? B.color : B.V.panel;
        B.g.fill();
        B.g.strokeStyle = B.color;
        B.g.lineWidth = 2;
        B.g.stroke();
        B.g.lineWidth = 1;
      }
      B.g.fillStyle = B.V.muted;
      B.g.font = B.F(500, 12);
      if (rot) {
        B.g.save();
        B.g.translate(cx(i), y(0) + 14);
        B.g.rotate(-Math.PI / 6);
        B.g.textAlign = 'right';
        B.g.fillText(B.spec.cats[i], 4, 4);
        B.g.restore();
      } else {
        B.g.textAlign = 'center';
        B.g.fillText(B.spec.cats[i], cx(i), y(0) + 20);
      }
      if (B.spec.labels) {
        B.g.fillStyle = B.V.fg;
        B.g.font = B.F(600, 12);
        B.g.textAlign = 'center';
        B.g.fillText(String(v), cx(i), y(v) - 8);
      }
      const my = B.spec.kind === 'bar' ? (y(v) + y(0)) / 2 : y(v);
      B.zones.push({ x: x0 + pad.l + bw * i, y: y0 + pad.t, w: bw, h: ph, i, cx: cx(i), cy: B.spec.kind === 'bar' ? Math.max(y(v) + 4, my) : my, top: y(v) });
    });
    B.chartGeo = { x0, y0, w: B.mainW, h: B.mainH };
    if (hover !== null && hover !== undefined && B.zones[hover]) {
      const z = B.zones[hover];
      B.bubble([`${B.spec.cats[hover]}: ${B.spec.values[hover]} ${B.spec.unit}`], z.cx, z.top - 10, 'above');
    }
  }

  function drawBubble(B, lines, ax, ay, where) {
    B.g.font = B.F(600, 13);
    const tw = Math.max(...lines.map((l) => B.g.measureText(Array.isArray(l) ? `${l[0]}  ${l[1]}` : l).width)) + 22;
    const th = lines.length * 20 + 12;
    let bx = where === 'left' ? ax - tw - 14 : ax - tw / 2;
    let by = where === 'left' ? ay - th / 2 : where === 'below' ? ay + 10 : ay - th;
    bx = Math.max(4, Math.min(B.cw - tw - 4, bx));
    if (where === 'below' && by + th > B.ch - 4) by = ay - th - 30;
    by = Math.max(4, Math.min(B.ch - th - 4, by));
    B.g.save();
    B.g.shadowColor = 'rgba(0,0,0,.25)';
    B.g.shadowBlur = 10;
    B.rr(bx, by, tw, th, 7, B.V.fg);
    B.g.restore();
    lines.forEach((l, k) => {
      const ly = by + 6 + 20 * k + 14;
      B.g.textAlign = 'left';
      if (Array.isArray(l)) {
        B.g.font = B.F(500, 13);
        B.g.fillStyle = B.V.panel;
        B.g.globalAlpha = 0.72;
        B.g.fillText(l[0], bx + 11, ly);
        const w0 = B.g.measureText(l[0]).width;
        B.g.globalAlpha = 1;
        B.g.font = B.F(700, 13);
        B.g.fillText(l[1], bx + 11 + w0 + 8, ly);
      } else {
        B.g.font = B.F(600, 13);
        B.g.fillStyle = B.V.panel;
        B.g.fillText(l, bx + 11, ly);
      }
    });
  }

  function drawDashboardBoard(B, hover) {
    const x0 = B.mainX;
    const y0 = B.mainY;
    B.panel(x0, y0, B.mainW, B.mainH, B.spec.title, `${B.spec.rows.length} items`);
    const n = B.spec.rows.length;
    const rowH = Math.max(26, Math.min(40, Math.floor((B.mainH - 80) / n)));
    const fs = rowH < 31 ? 13 : 14.5;
    const colX = [x0 + 18, x0 + 18 + (B.mainW - 80) * 0.42, x0 + 18 + (B.mainW - 80) * 0.7];
    const hy = y0 + 58;
    B.g.font = B.F(700, 11.5);
    B.g.fillStyle = B.V.muted;
    B.g.textAlign = 'left';
    B.spec.columns.forEach((c, i) => B.g.fillText(c.toUpperCase(), colX[i], hy));
    B.g.strokeStyle = B.V.line;
    B.g.beginPath();
    B.g.moveTo(x0 + 10, hy + 9.5);
    B.g.lineTo(x0 + B.mainW - 10, hy + 9.5);
    B.g.stroke();
    B.zones.length = 0;
    B.spec.rows.forEach((r, k) => {
      const ry = hy + 10 + k * rowH;
      if (k % 2 === 1) { B.g.fillStyle = B.V.fg; B.g.globalAlpha = 0.03; B.g.fillRect(x0 + 10, ry, B.mainW - 20, rowH); B.g.globalAlpha = 1; }
      r.cells.forEach((c, i) => {
        B.g.font = B.F(i === 0 ? 600 : 400, fs);
        B.g.fillStyle = i === 0 ? B.V.fg : B.V.muted;
        B.g.fillText(c, colX[i], ry + rowH / 2 + fs * 0.35, (i < 2 ? colX[i + 1] - colX[i] : x0 + B.mainW - 60 - colX[i]) - 10);
      });
      const icx = x0 + B.mainW - 32;
      const icy = ry + rowH / 2;
      const on = hover === k;
      if (on) { B.g.fillStyle = B.V.accent; B.g.globalAlpha = 0.14; B.g.beginPath(); B.g.arc(icx, icy, 13, 0, Math.PI * 2); B.g.fill(); B.g.globalAlpha = 1; }
      B.g.strokeStyle = on ? B.V.accent : B.V.muted;
      B.g.lineWidth = 1.6;
      B.g.beginPath();
      B.g.arc(icx, icy, 8, 0, Math.PI * 2);
      B.g.stroke();
      B.g.beginPath();
      B.g.moveTo(icx, icy - 1);
      B.g.lineTo(icx, icy + 4);
      B.g.stroke();
      B.g.fillStyle = on ? B.V.accent : B.V.muted;
      B.g.beginPath();
      B.g.arc(icx, icy - 4, 1.1, 0, Math.PI * 2);
      B.g.fill();
      B.g.lineWidth = 1;
      B.zones.push({ x: icx - 13, y: icy - 13, w: 26, h: 26, i: k, cx: icx, cy: icy });
    });
    if (hover !== null && hover !== undefined && B.zones[hover]) B.bubble(B.spec.rows[hover].tip, B.zones[hover].cx, B.zones[hover].cy, 'left');
  }

  function drawDashboardNotes(B, hover) {
    const x0 = B.mainX;
    const y0 = B.mainY;
    B.panel(x0, y0, B.mainW, B.mainH, B.spec.title, B.rng0.notesSub);
    B.zones.length = 0;
    // Fit the font: every line must fit the panel width.
    for (B.notesFont = 16; B.notesFont > 12; B.notesFont--) {
      B.g.font = B.F(400, B.notesFont);
      const widest = Math.max(...B.spec.notes.map((line) => line.reduce((w, seg) => w + B.g.measureText(seg.abbr !== undefined ? B.spec.abbrs[seg.abbr].abbr : seg.text).width, 0)));
      if (widest + 70 < B.mainW && B.spec.notes.length * B.notesFont * 2.1 + 70 < B.mainH) break;
    }
    const lh = Math.round(B.notesFont * 2.1);
    B.spec.notes.forEach((line, k) => {
      const ly = y0 + 64 + k * lh;
      let x = x0 + 40;
      B.g.fillStyle = B.V.muted;
      B.g.beginPath();
      B.g.arc(x0 + 26, ly - B.notesFont * 0.35, 2.5, 0, Math.PI * 2);
      B.g.fill();
      for (const seg of line) {
        if (seg.abbr === undefined) {
          B.g.font = B.F(400, B.notesFont);
          B.g.fillStyle = B.V.fg;
          B.g.textAlign = 'left';
          B.g.fillText(seg.text, x, ly);
          x += B.g.measureText(seg.text).width;
          continue;
        }
        const t = B.spec.abbrs[seg.abbr].abbr;
        const on = hover === seg.abbr;
        B.g.font = B.F(700, B.notesFont);
        B.g.fillStyle = on ? B.V.accent : B.V.fg;
        B.g.fillText(t, x, ly);
        const w = B.g.measureText(t).width;
        B.g.strokeStyle = on ? B.V.accent : B.V.fg;
        B.g.setLineDash([2, 2]);
        B.g.lineWidth = 1.4;
        B.g.beginPath();
        B.g.moveTo(x, ly + 4.5);
        B.g.lineTo(x + w, ly + 4.5);
        B.g.stroke();
        B.g.setLineDash([]);
        B.g.lineWidth = 1;
        B.zones[seg.abbr] = { x: x - 2, y: ly - B.notesFont - 2, w: w + 4, h: B.notesFont + 9, i: seg.abbr, cx: x + w / 2, cy: ly - B.notesFont * 0.35 };
        x += w;
      }
    });
    if (hover !== null && hover !== undefined && B.zones[hover]) B.bubble([B.spec.abbrs[hover].full], B.zones[hover].cx, B.zones[hover].y + B.zones[hover].h, 'below');
  }

  function drawDashboardSide(B) {
    if (!B.side) return;
    const h = B.mainH;
    if (B.donut) {
      B.panel(B.sideX, B.mainY, B.side, h, B.donut[0]);
      const total = B.donutVals.reduce((a, b) => a + b, 0);
      const R = Math.max(36, Math.min(B.side * 0.32, (h - 92 - 22 * B.donut[1].length) / 2));
      const cxd = B.sideX + B.side / 2;
      const cyd = B.mainY + 48 + R + 6;
      let a = -Math.PI / 2;
      B.donutVals.forEach((v, i) => {
        const da = (v / total) * Math.PI * 2;
        B.g.beginPath();
        B.g.arc(cxd, cyd, R, a, a + da);
        B.g.arc(cxd, cyd, R * 0.58, a + da, a, true);
        B.g.closePath();
        B.g.fillStyle = B.S.DB_PALETTE[(i + 2) % B.S.DB_PALETTE.length];
        B.g.fill();
        a += da;
      });
      let ly = cyd + R + 26;
      B.donut[1].forEach((label, i) => {
        if (ly > B.mainY + h - 10) return;
        B.g.fillStyle = B.S.DB_PALETTE[(i + 2) % B.S.DB_PALETTE.length];
        B.g.fillRect(B.sideX + 18, ly - 10, 10, 10);
        B.g.fillStyle = B.V.fg;
        B.g.font = B.F(500, 13);
        B.g.textAlign = 'left';
        B.g.fillText(label, B.sideX + 36, ly);
        B.g.textAlign = 'right';
        B.g.fillStyle = B.V.muted;
        B.g.fillText(`${Math.round((B.donutVals[i] / total) * 100)}%`, B.sideX + B.side - 18, ly);
        ly += 22;
      });
    } else if (!B.tooltipV) {
      B.panel(B.sideX, B.mainY, B.side, h, B.rng0.sparkTitle);
      const sx = B.sideX + 18;
      const sw = B.side - 36;
      const sy = B.mainY + 50;
      const sh = Math.min(120, h - 80);
      B.g.strokeStyle = B.color;
      B.g.lineWidth = 2;
      B.g.beginPath();
      B.spark.forEach((v, i) => {
        const px = sx + (sw * i) / (B.spark.length - 1);
        const py = sy + sh * (1 - v / 100);
        if (i) B.g.lineTo(px, py);
        else B.g.moveTo(px, py);
      });
      B.g.stroke();
      B.g.lineWidth = 1;
      B.g.fillStyle = B.V.muted;
      B.g.font = B.F(500, 12.5);
      B.g.textAlign = 'left';
      B.g.fillText(B.rng0.sparkNote, sx, sy + sh + 24, sw);
    } else {
      B.panel(B.sideX, B.mainY, B.side, h, 'Activity this week');
      const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
      const bx = B.sideX + 22;
      const bwid = (B.side - 44) / 7;
      const by = B.mainY + 50;
      const bh = Math.min(150, h - 90);
      const mx = Math.max(...B.actBars);
      B.actBars.forEach((v, i) => {
        B.g.fillStyle = B.V.accent;
        B.g.globalAlpha = 0.55;
        const hh = (bh * v) / mx;
        B.g.fillRect(bx + bwid * i + bwid * 0.2, by + bh - hh, bwid * 0.6, hh);
        B.g.globalAlpha = 1;
        B.g.fillStyle = B.V.muted;
        B.g.font = B.F(500, 12);
        B.g.textAlign = 'center';
        B.g.fillText(days[i], bx + bwid * (i + 0.5), by + bh + 18);
      });
    }
  }

  function drawDashboard(B) {
    B.g.clearRect(0, 0, B.cw, B.ch);
    B.g.fillStyle = B.V.bg;
    B.g.fillRect(0, 0, B.cw, B.ch);
    B.drawKpis();
    if (!B.tooltipV) B.drawChart(B.hoverLocal);
    else if (B.spec.mode === 'icon') B.drawBoard(B.hoverLocal);
    else B.drawNotes(B.hoverLocal);
    B.drawSide();
  }

  function setupDashboard(B) {
    ({ spec: B.spec, util: B.util, rng: B.rng } = B.ctx);
    if (!document.getElementById('db-style')) {
      const st = document.createElement('style');
      st.id = 'db-style';
      st.textContent = B.S.DB_CSS;
      document.head.append(st);
    }
    B.V = B.S.dbVars();
    B.box = B.S.usable(B.ctx);
    B.W = Math.round(Math.min(B.box.w - 12, 1280));
    B.H = Math.round(Math.min(B.box.h - 10, 780));
    B.app = B.util.el('div', 'db-app', B.ctx.stage);
    B.app.style.width = B.W + 'px';
    B.app.style.height = B.H + 'px';
    B.align = B.rng.pick(['start', 'center', 'end']);
    B.app.style.left = Math.round(B.box.x + (B.align === 'start' ? 6 : B.align === 'end' ? B.box.w - B.W - 6 : (B.box.w - B.W) / 2)) + 'px';
    B.app.style.top = Math.round(B.box.y + Math.max(0, (B.box.h - B.H) / 2)) + 'px';
    B.bar = B.util.el('div', 'db-bar', B.app);
    B.brand = B.util.el('div', 'db-brand', B.bar);
    B.util.el('i', '', B.brand);
    B.util.el('span', '', B.brand, B.rng.pick(B.S.DB_APPS));
    B.nav = B.util.el('div', 'db-nav', B.bar);
    B.navs = B.rng.sample(B.S.DB_NAV, B.W > 900 ? 4 : 3);
    B.navs.forEach((n, i) => B.util.el('span', i === 0 ? 'on' : '', B.nav, n));
    B.util.el('div', 'db-chip', B.bar, B.rng.pick(B.S.DB_RANGES));
    B.cw = B.W - 2;
    B.ch = B.H - 2 - 44;
    B.cv = B.util.el('canvas', 'db-canvas', B.app);
    B.dpr = window.devicePixelRatio || 1;
    B.cv.width = Math.round(B.cw * B.dpr);
    B.cv.height = Math.round(B.ch * B.dpr);
    B.cv.style.width = B.cw + 'px';
    B.cv.style.height = B.ch + 'px';
    B.cv.setAttribute('aria-hidden', 'true');
    B.g = B.cv.getContext('2d');
    B.g.setTransform(B.dpr, 0, 0, B.dpr, 0, 0);
    B.F = (w, px) => `${w} ${px}px ${B.V.font}`;
    B.P = 14;
    B.ansH = 50;
    B.kpiH = B.ch < 520 ? 66 : 80;
    B.side = B.cw >= 860 ? Math.round(Math.min(300, B.cw * 0.28)) : 0;
    B.sideLeft = B.side && B.rng.bool(0.3);
    B.mainX = B.P + (B.sideLeft ? B.side + B.P : 0);
    B.mainW = B.cw - 2 * B.P - (B.side ? B.side + B.P : 0);
    B.mainY = B.P + B.kpiH + B.P;
    B.mainH = B.ch - B.mainY - B.P - B.ansH - 6;
    B.sideX = B.sideLeft ? B.P : B.cw - B.P - B.side;
    B.tooltipV = B.spec.scenario === 'tooltip';
    B.kpis = [];
    if (!B.tooltipV) {
      const total = B.spec.values.reduce((a, b) => a + b, 0);
      B.kpis.push([`Total ${B.spec.unit}`, total.toLocaleString('en-US')], ['Average', (Math.round((total / B.spec.values.length) * 10) / 10).toLocaleString('en-US')]);
      B.kpis.push(['Change', `${B.rng.bool(0.6) ? '+' : '−'}${(B.rng.int(5, 190) / 10).toFixed(1)}%`]);
      if (B.cw >= 820) B.kpis.push([B.rng.pick(['Target', 'Forecast']), (Math.round(total * B.rng.float(0.9, 1.25) / 10) * 10).toLocaleString('en-US')]);
    } else if (B.spec.mode === 'icon') {
      B.kpis.push([`${B.spec.title} listed`, String(B.spec.rows.length)]);
      if (B.spec.dataset === 'inventory') {
        const stock = B.spec.rows.map((r) => Number(r.cells[2]));
        B.kpis.push(['Low stock', String(stock.filter((v) => v < 25).length)], ['Units on hand', stock.reduce((a, b) => a + b, 0).toLocaleString('en-US')]);
        if (B.cw >= 820) B.kpis.push(['Reorders open', String(B.rng.int(0, 6))]);
      } else {
        const st = {};
        for (const r of B.spec.rows) st[r.cells[2]] = (st[r.cells[2]] || 0) + 1;
        for (const [k, v] of Object.entries(st).slice(0, B.cw >= 820 ? 3 : 2)) B.kpis.push([k, String(v)]);
      }
    } else {
      B.kpis.push(['Action items', String(B.rng.int(4, 14))], ['Decisions', String(B.rng.int(1, 6))], ['Attendees', String(B.rng.int(5, 16))]);
      if (B.cw >= 820) B.kpis.push(['Next sync', B.rng.pick(['Mon 10:00', 'Tue 14:30', 'Thu 09:15', 'Fri 11:00'])]);
    }
    B.kpiDelta = B.kpis.map(() => (B.rng.bool(0.5) ? (B.rng.bool(0.6) ? 1 : -1) * B.rng.int(2, 150) / 10 : 0));
    B.donut = B.side && !B.tooltipV && B.spec.mode !== 'max' && B.spec.mode !== 'min' ? B.rng.pick(B.S.DB_DONUT) : null;
    B.donutVals = B.donut ? B.donut[1].map(() => B.rng.int(5, 40)) : null;
    B.spark = Array.from({ length: 12 }, () => B.rng.int(20, 100));
    B.actBars = Array.from({ length: 7 }, () => B.rng.int(2, 30));
    B.seriesName = B.rng.pick(['This period', 'Current', B.spec.unit && !B.tooltipV ? B.S.cap1(B.spec.unit) : 'Count']);
    B.color = B.rng.pick(B.S.DB_PALETTE.slice(0, 2).concat([B.V.accent]));
    B.zones = [];
    B.chartGeo = null;
    B.notesFont = 15;
  }

  env.template('find-fact/_base-dashboard', () => ({ renderDashboard }));
})();
