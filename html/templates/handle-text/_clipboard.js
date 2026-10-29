/* handle-text/_clipboard: shared clipboard units; S supplies live state and resolved parts. */
(function () {
  'use strict';
  function liveSel(S) {
    if (!S.st || !S.st.sels) return null;
    let out = null;
    for (let i = 0; i < S.st.sels.length; i++) {
      const r = S.st.sels[i].read();
      if (!r || !(r.end > r.start)) continue;
      if (out) return null;
      out = { box: i, start: r.start, end: r.end };
    }
    if (out) {
      const range = window.getSelection().getRangeAt(0);
      const c = S.st.sels[out.box].container;
      if (!c.contains(range.startContainer) || !c.contains(range.endContainer)) return null;
    }
    return out;
  }

  function copied(S, text) {
    S.st.clip = text;
    S.env.log('copy', { chars: [...text].length });
    if (S.st.copyModel) {
      const m = S.st.ctx.model;
      if (m.clip !== text) S.st.ctx.update({ ...m, clip: text });
    }
  }

  function onCopy(S, e) {
    if (!S.live()) return;
    const ae = document.activeElement;
    let text = '';
    if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA') && S.st.card.contains(ae) && ae.type !== 'password') {
      text = ae.value.slice(ae.selectionStart ?? 0, ae.selectionEnd ?? 0);
      if (text) S.copied(text); // native copy / cut of the field's selection proceeds
      return;
    }
    const sel = S.liveSel();
    if (sel && S.st.editBox) text = S.st.ctx.spec.snippet.text.slice(sel.start, sel.end);
    else if (sel) text = S.fam().helpers.copyText(S.st.ctx.spec, sel);
    else text = String(window.getSelection() || '').replace(/\s+/g, ' ').trim();
    if (!text) return;
    if (e.clipboardData) e.clipboardData.setData('text/plain', text);
    e.preventDefault();
    S.copied(text);
  }

  function onPaste(S, e) {
    if (!S.live()) return;
    const el = e.target;
    if (!S.isTextInput(el) || !S.st.card.contains(el)) return;
    e.preventDefault();
    if (S.st.clip === null || S.st.clip === undefined) return;
    const text = el.tagName === 'TEXTAREA' ? S.st.clip : S.st.clip.replace(/\r?\n/g, ' ');
    const a = el.selectionStart ?? el.value.length;
    const b = el.selectionEnd ?? el.value.length;
    el.setRangeText(text, a, b, 'end');
    S.env.log('paste', { chars: [...text].length });
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function install(S) {
    if (S.installed) return;
    S.installed = true;
    document.addEventListener('copy', S.onCopy);
    document.addEventListener('cut', S.onCopy);
    document.addEventListener('paste', S.onPaste);
    document.addEventListener('selectionchange', () => {
      if (!S.live()) return;
      if (S.st.onSelection) S.st.onSelection();
      if (!S.st.copyModel || !S.st.sels) return;
      const s = S.modelSel(S.liveSel());
      const m = S.st.ctx.model;
      if (s && !S.sameSel(s, m.sel)) S.st.ctx.update({ ...m, sel: s });
    });
    // Press-and-hold ends wherever the pointer is released.
    const release = () => {
      if (!S.live() || !S.st.spinHold) return;
      const m = S.st.ctx.model;
      if (m.hold) {
        S.env.log('release', { what: 'spinner' });
        S.st.ctx.update({ ...m, hold: null });
      }
    };
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
  }
  env.template('handle-text/_clipboard', () => ({ liveSel, copied, onCopy, onPaste, install }));
})();
