/* protect-privacy/data: shared pure helpers, labels and page-action routing. Loaded before scenarios. */
(function () {
  'use strict';

  const SECRETS = ['card', 'cvv', 'ssn', 'password', 'recovery', 'pin', 'passport'];
  const SECRET_LABEL = { card: 'card number', cvv: 'security code (CVV)', ssn: 'Social Security number', password: 'password',
    recovery: 'recovery phrase', pin: 'card PIN', passport: 'passport number', maiden: "mother's maiden name" };
  const norm = (s) => String(s == null ? '' : s).trim().replace(/\s+/g, ' ').toLowerCase();
  const digits = (s) => String(s == null ? '' : s).replace(/\D/g, '');
  const list = (xs) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
  const say = (rng, spec, core, o = {}) => env.instruct.say(rng, core, { isplit: spec.isplit, typo: 0, ...o });
  const phrase = (rng, spec, ts, vars) => env.instruct.phrase(rng, ts, vars, spec.isplit);
  const domainOf = (email) => String(email).split('@')[1] || '';
  const slug = (s) => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, '').replace(/[^a-z0-9]+/g, '');
  const mailOf = (first, last, domain) => `${slug(first)}.${slug(last)}@${domain}`;
  function companyDomain(name) {
    const ws = name.split(/\s+/).filter((w) => /^[A-Za-z]/.test(w) && !/^(gmbh|inc|ltd|llc|group|sons|co|ag|sa|bv)\.?$/i.test(w));
    const d = slug(ws[0] || 'team') + (ws[0] && ws[0].length < 6 && ws[1] ? slug(ws[1]) : '');
    return `${d}.com`;
  }
  const judgeOf = (message, what, reasons) => ({ mode: 'impossible', message, what: what.filter(Boolean), reasons });
  const same = (a, b, id) => (['phone', 'card', 'cvv', 'postcode'].includes(id) ? digits(a) === digits(b) && digits(b) !== '' : norm(a) === norm(b));
  function suggest(spec, q) {
    const t = norm(q);
    if (!t) return [];
    return spec.people.filter((p) => p.name.toLowerCase().includes(t) || p.email.includes(t)).slice(0, 5);
  }
  function route(spec, k, text) {
    const i = k.indexOf(':');
    const head = i < 0 ? k : k.slice(0, i);
    const rest = i < 0 ? '' : k.slice(i + 1);
    const two = () => { const j = rest.lastIndexOf(':'); return [rest.slice(0, j), rest.slice(j + 1)]; };
    switch (spec.scenario) {
      case 'wrongfield': return head === 'f' ? ['val', [rest, text]] : k === 'form-submit' ? ['submit'] : null;
      case 'share': return {
        'share-open': ['open'], 'share-close': ['close'], 'share-q': ['q', text], 'share-send': ['send'], 'chiprole-btn': ['menu', 'chiprole'],
        'access-btn': ['menu', 'access'],
      }[k] || ({ sug: ['pick', rest], chipx: ['chipx', rest], chiprole: ['chiprole', rest], pmenu: ['menu', `p:${rest}`],
        prole: ['prole', rest && two()], access: ['access', rest] }[head]) || null;
      case 'overshare': return k === 'draft' ? ['draft', text] : k === 'send' ? ['send'] : null;
      case 'redact': return head === 'tool' ? ['tool', rest] : head === 'tok' ? ['tok', Number(rest)] : ['apply', 'revert', 'export'].includes(k) ? [k] : null;
      case 'permissions': return head === 'prompt' ? ['prompt', rest] : head === 'set' ? ['set', two()] : k === 'lock' ? ['lock'] : k === 'action' ? ['action'] : null;
      case 'autofill': return head === 'af' ? (text === undefined ? ['focus', rest] : ['val', [rest, text]]) : k === 'af-submit' ? ['submit'] : k === 'af-pick' ? ['pick'] : null;
      case 'export': return { 'exp-open': ['open'], 'exp-cancel': ['cancel'], 'exp-go': ['go'] }[k] || ({ preset: ['preset', rest], col: ['col', rest], fmt: ['fmt', rest] }[head]) || null;
      case 'visibility':
        if (k === 'aud-btn') return ['menu', null];
        if (head === 'aud-btn') return ['menu', rest];
        if (head === 'aud') return spec.mode === 'post' ? ['aud', [null, rest]] : ['aud', two()];
        return k === 'post' ? ['post'] : k === 'save' ? ['save'] : null;
      case 'retention': return { 'req-approve': ['approve'], 'req-decline': ['decline'], 'to-btn': ['tomenu'], 'dl-go': ['dlgo'], 'del-ask': ['delask'],
        'del-go': ['delgo'], 'del-cancel': ['delcancel'], 'del-all': ['delall'] }[k] || ({ to: ['to', rest], dl: ['dl', rest], del: ['del', rest] }[head]) || null;
      default: return null;
    }
  }
  const ROLE_LABEL = { viewer: 'Viewer', commenter: 'Commenter', editor: 'Editor' };
  const FMT_LABEL = { csv: 'CSV', xlsx: 'Excel', pdf: 'PDF' };
  const AUD = ['public', 'friends', 'close', 'only'];
  const AUD_LABEL = { public: 'Public', friends: 'Friends', close: 'Close friends', only: 'Only me' };
  const PERM_LABEL = { camera: 'camera', microphone: 'microphone', location: 'location', notifications: 'notifications',
    clipboard: 'clipboard', contacts: 'contacts' };

  Object.assign(env.taskOf('protect-privacy').lib, { SECRETS, SECRET_LABEL, norm, digits, list, say, phrase, domainOf, slug, mailOf, companyDomain, judgeOf, same, suggest, FMT_LABEL, AUD, AUD_LABEL, PERM_LABEL });
  Object.assign(env.taskOf('protect-privacy').helpers, { route, suggest, AUD, AUD_LABEL, ROLE_LABEL, FMT_LABEL, PERM_LABEL });
})();
