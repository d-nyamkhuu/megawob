/* handle-text/sampling.js: shared sampling; private task lib. */
(function () {
  'use strict';
  const lib = env.taskOf('handle-text').lib;
  const C = env.content;
  const { keepIdx, cap } = env.util;

  const UNICODE = ['ÖK', 'Cancél', '♥♥♥', '确定', '取消', 'ヘルプ', 'Grüße', 'Straße', 'Café Zoë', 'naïve',
    'façade', 'São Paulo', 'Łódź', 'Kraków', 'Ærøskøbing', 'smørrebrød', 'jalapeño', 'Ελλάδα', 'Москва',
    'привет', 'こんにちは', '東京', 'Ñandú', 'crème brûlée', 'Zürich', 'Malmö', 'Reykjavík', 'Dvořák',
    'Gdańsk', 'résumé', 'piñata', 'Ångström', 'über', '€12,50', '½ cup', '№ 42', '→ next', '★★★☆☆',
    '✓ done', '¿Qué tal?', '¡Hola!', 'Œuvre', 'Þór', 'İstanbul', 'Ünïcödé', '☕ break', 'déjà vu', 'Mötley',
    'Brontë', '100 °C', 'α β γ', 'Ω-7', '±0.5 mm', 'français', 'bientôt', 'forêt', 'maïs', 'açaí', 'coração', 'azúcar',
    'buñuelo', 'cigüeña', 'niñez', 'fjäll', 'rødgrød', 'håndværk', 'süß', 'Frühling', 'Käse', 'příběh', 'štěstí',
    'żółw', 'książka', 'tükör', 'gyümölcs', 'lumière', 'œillet', 'Þoka', 'Tromsø', 'Besançon', 'Tübingen', 'Wrocław',
    'Chișinău', 'Спасибо', 'окно', 'Αθήνα', 'θάλασσα', '书签', '雨傘', 'おやすみ', 'カタカナ', '¿Dónde?', '¡Bravo!', 'éclair',
    'mosaïque', 'trèfle', 'château', 'goûter', 'pêche', 'cañón', 'brújula', 'otoño', 'sandía', 'fogão', 'limão',
    'pássaro', 'gemütlich', 'Würfel', 'Schlüssel', 'blåbär', 'sjöbris', 'snøfnugg', 'sæbe', 'kůň', 'řeřicha', 'źródło',
    'węzeł', 'eső', 'szőlő', 'mărțișor', 'sărbătoare', 'Pärnu', 'Kőszeg', 'Nîmes', 'Białystok', 'Húsavík', 'κήπος',
    'χαρτί', 'радуга', 'карандаш', 'ほたる', 'もみじ', '星座', '拼图', '灯笼', '海豚', '¿Por qué?', 'écureuil', 'étagère', 'velouté',
    'flâneur', 'câlin', 'añoranza', 'vergüenza', 'miércoles', 'relámpago', 'abóbora', 'lã', 'peúga', 'avião',
    'Flüstern', 'Fußabdruck', 'Fähre', 'Zöpfe', 'fönster', 'skärgård', 'grønnsak', 'tæppe', 'pączek', 'łabędź', 'čaj',
    'oříšek', 'függöny', 'csütörtök', 'împreună', 'mănușă', 'þögn', 'ελπίδα', 'ταξίδι', 'ψωμί', 'улыбка', 'зеркало',
    'улитка', 'たけのこ', 'ひまわり', 'ぬいぐるみ', '風鈴', '积木', '邮票', '瀑布', '¡Olé!', '¿Cuándo?'];

  const UNI_BUTTONS = ['ÖK', 'Cancél', '♥♥♥', '确定', '取消', 'ヘルプ', 'Готово', 'Отмена',
    'Hjälp', 'Zurück', 'Weiter →', 'Aceptar', 'Atrás', 'Ναι', 'Όχι', 'はい', 'いいえ', 'Ça va', '✓ Done', '✗ Nope',
    'Ouvrir', 'Cerrar', 'Удалить', '印刷', '刷新', 'Kopiér', '貼り付け', 'Ritaglia', 'Geri al', '縮小', 'Döndür', 'Trier',
    'Filtruj', '共有', '下载', '暂停', 'Lås', '解锁', 'Unisci', 'Diviser', 'Skjul', 'Показать', 'Σύνδεση', 'Odhlásit',
    'Przypnij', 'Eşitle', 'Renommer', 'Mover', 'Duplicar', 'Esporta', 'Importuj', 'Bläddra', 'Inviter', 'Seguir',
    'Bewerten', 'Nahlásit', 'Слушать', '巻き戻し', '早送り', 'Ripeti', 'Losuj', 'Vollbild', '拡大', '折り返し', '整列', '復元', '圧縮',
    '解凍', 'Σχόλιο', 'Répondre', '編集', '下書き', 'Opmaak', '録音', '重试', 'Geçmiş', 'Деталі', 'Archiver', 'Traduire',
    'Comparer', 'Résumer', 'Prüfen', 'Añadir', 'Subrayar', 'Cifrar', 'お気に入り', '太字', '斜体', '置換', '添付', '停止', '字数',
    'Pravopis', 'Převést', 'Odepnij', 'İmzala', 'Цитувати', 'Αρίθμηση', 'Σάρωση', '繁體', '跳过', 'Vincular', 'Échanger',
    '音量', '速度', '边框'];

  const TITLES = [
    'Note', 'Memo', 'Draft', 'Reply', 'Snippet', 'Quote', 'Excerpt', 'Message', 'Comment', 'Summary', 'Topic',
    'Entry', 'Record', 'Review', 'Thought', 'Notice', 'Brief', 'Item', 'Caption', 'Segment'
  ];

  const VALUE_LABELS = {
    'tracking code': 'Tracking code', 'order number': 'Order number', 'invoice ID': 'Invoice ID', reference: 'Reference',
    'coupon code': 'Coupon code', 'account ID': 'Account ID', 'booking code': 'Booking code', 'serial number': 'Serial number',
  };

  const TERMS = [
    'By using the Service you agree to be bound by these Terms.',
    'You must be at least sixteen years old to create an account.',
    'You are responsible for keeping your password confidential.',
    'The Provider may update these Terms at any time by posting a revised version.',
    'Continued use of the Service after a change means you accept the new Terms.',
    'You may not copy, modify or distribute any part of the Service without permission.',
    'Fees are billed in advance and are not refundable except where required by law.',
    'The Provider may suspend accounts that violate these Terms.',
    'All content you upload remains your property.',
    'You grant the Provider a limited license to host and display your content.',
    'The Service is provided "as is" without warranties of any kind.',
    'In no event shall the Provider be liable for indirect or consequential damages.',
    'Either party may terminate this agreement with thirty days written notice.',
    'These Terms are governed by the laws of the place where the Provider is registered.',
    'Personal data is processed as described in the Privacy Notice.',
    'You agree not to use automated means to access the Service.',
    'Notices will be sent to the email address associated with your account.',
    'If any provision is found unenforceable, the remaining provisions stay in effect.',
    'Failure to enforce a right does not waive that right.',
    'You may not assign this agreement without prior written consent.',
    'Support is available on business days during regular office hours.',
    'Scheduled maintenance may make the Service unavailable for short periods.',
    'Beta features are offered for evaluation and may change without notice.',
    'You are responsible for all activity that occurs under your account.',
    'You may close your account at any time through the account settings.',
    'The Provider may remove content that breaches these Terms.',
    'You must provide accurate information when you register.',
    'Your account is for your personal use and may not be shared.',
    'You may keep copies of materials you download for your own use.',
    'The Service may include links to resources maintained by others.',
    'The Provider does not control content offered by third parties.',
    'You are responsible for checking that your devices meet the Service requirements.',
    'Some parts of the Service may be subject to additional terms.',
    'You may contact support with questions about your account.',
    'The Provider may set limits on storage and file size.',
    'You must promptly update information that becomes inaccurate.',
    'Your access may depend on the availability of your internet connection.',
    'The Provider may preserve records as required by applicable law.',
    'You must have permission to share material you upload.',
    'The Provider may review reports of suspected misuse.',
    'You may opt out of nonessential service announcements in your settings.',
    'Service features may vary by location and language.',
    'You may export certain account information while your account is active.',
    'The Service may display content in a format that differs by device.',
    'You agree to comply with laws that apply to your use of the Service.',
    'The Provider may decline a registration that contains incomplete information.',
    'You must not interfere with the operation of the Service.',
    'You may stop using the Service whenever you choose.',
    'A delay in delivering a notice does not change these Terms.',
    'The Provider may retain account records for a limited period after closure.',
    'You are responsible for any equipment needed to access the Service.',
    'The Service may change as new features become available.',
    'You may request a copy of notices sent to your account email.',
    'The Provider may restrict access to protect users and service operations.',
    'You must not misrepresent your identity when using the Service.',
    'Any permissions granted under these Terms are limited to their stated purpose.',
    'The Provider may use aggregated information to improve the Service.',
    'You may report content that appears to violate these Terms.',
    'The Provider will make reasonable efforts to keep account information available.',
    'You remain responsible for content after sharing it through the Service.',
    'The Provider may communicate service changes through account notices.',
    'The Provider may set reasonable rules for account access.',
    'Account credentials should be changed if you believe they were exposed.',
    'The Provider may disable credentials that appear compromised.',
    'You are responsible for reviewing activity shown in your account.',
    'Content you share may be visible to its intended recipients.',
    'You should avoid including confidential details in public posts.',
    'The Provider may make backup copies to support service operations.',
    'Backups may not include every item stored on the Service.',
    'The Provider may limit the types of files accepted for upload.',
    'Files may be checked for harmful code before they are made available.',
    'You must not use the Service to send unsolicited messages.',
    'The Provider may limit message delivery to reduce unwanted activity.',
    'You may choose which profile details are visible to other users.',
    'The Provider may display your chosen profile name with shared content.',
    'The Provider may remove a file that cannot be processed safely.',
    'Some features may require a compatible browser or device.',
    'The Service may not support every file format or language.',
    'The Provider may change the layout or availability of individual features.',
    'Access to certain features may require a separate account setting.',
    'You may receive notices within the Service as well as by email.',
    'Account notices may be stored in your message history.',
    'The Provider may correct errors in information displayed by the Service.',
    'Displayed dates and times may reflect your device settings.',
    'You may save a copy of information before changing account details.',
    'The Service may not preserve drafts left unfinished.',
    'You must not attempt to bypass limits applied to your account.',
    'The Provider may review technical logs when investigating a service issue.',
    'Technical logs may include the time and type of a request.',
    'The Provider may use temporary files to deliver requested features.',
    'Temporary files may be removed after they are no longer needed.',
    'You may withdraw a permission granted through an account setting.',
    'The Provider may provide some features through a separate service partner.',
    'These Terms apply to each account profile you create on the Service.',
    'The Provider may publish contact details for service inquiries.',
    'Requests sent through the Service may be recorded with their receipt time.',
    'Changes to account settings take effect after they are saved.',
    'Some requests may take time to appear in your activity history.',
    'You may revise a request while it remains pending.',
    'The Service may limit the number of sessions open at once.',
    'Sessions may end automatically after a period of inactivity.',
    'The Provider may pause a feature while investigating an outage.',
    'Optional profile fields may be left empty.',
    'You may choose a time zone for dates shown in your account.',
    'File sizes shown by the Service may be rounded for readability.',
    'The Provider may offer help materials within the Service.',
    'You may print information displayed in your account for reference.',
    'The Service may use cookies to remember your preferences.',
    'Your browser may need to allow cookies for some features to work.',
    'The Provider may archive older announcements in your message history.',
    'A saved preference may apply to future sessions on your account.',
    'The Service may limit how long a shared link remains available.',
    'You are responsible for checking the recipients before sharing a link.',
    'The Provider may label content with the date it was received.',
    'The Service may sort records using the settings you select.',
    'You may receive a confirmation when certain account changes are made.',
    'The Provider may ask you to verify a change to account access.',
    'A verification code may expire after a short period.',
    'The Service may reject files that exceed its published size limit.',
    'Information may be delayed while it is being synchronized.',
    'The Service may temporarily show incomplete results during an update.',
    'You may use available filters to narrow the records shown.',
    'The Provider may group related notices in your account history.',
    'Some information may be available only after you sign in.',
    'The Service may remember the language selected in your profile.',
    'You may change notification preferences in your account settings.',
    'The Provider may send a reminder before a temporary feature expires.',
    'A feature may be unavailable while your account details are being updated.',
    'The Service may limit repeated requests made within a short time.',
    'The Provider may record the version of the Service used for a request.',
    'Information displayed in the Service may be refreshed periodically.',
  ];

  const SECTIONS = ['Acceptance', 'Accounts', 'Use of the Service', 'Fees and payment', 'Content', 'Warranties',
    'Liability', 'Termination', 'Privacy', 'General', 'Support', 'Changes', 'Definitions', 'Eligibility', 'Access',
    'License', 'User submissions', 'Security', 'Confidentiality', 'Suspension', 'Dispute resolution', 'Governing law',
    'Assignment', 'Notices', 'Waiver', 'Severability', 'Force majeure', 'Entire agreement', 'Renewal', 'Taxes',
    'Records', 'Restrictions', 'Export compliance', 'Open source', 'Feedback', 'Indemnification', 'Claims', 'Remedies',
    'Enforcement', 'Survival', 'Language', 'No agency', 'Publicity', 'Service levels', 'Data retention',
    'Electronic records', 'Service scope', 'External platforms', 'Compatible devices', 'Regional access',
    'Accessibility', 'Account recovery', 'Account inactivity', 'Authorized users', 'Usage limits', 'Digital goods',
    'Subscription terms', 'Trial periods', 'Billing inquiries', 'Payment methods', 'Promotional offers',
    'Service credits', 'Error corrections', 'System monitoring', 'Audit rights', 'Compliance duties', 'Data transfers',
    'Location data', 'Interpretation', 'Interoperability', 'Network access', 'Tax documentation', 'Price adjustments',
    'Account closure', 'Content moderation', 'Backup copies', 'Data accuracy', 'Data correction', 'Data disclosures',
    'Privacy choices', 'Claim deadlines', 'Beneficiary rights', 'Binding effect', 'Counterparts', 'Language versions',
    'Section headings', 'Written amendments', 'Delegated access', 'Data export', 'Service logs', 'Purchase orders',
    'Usage summaries'];

  const ORD = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'];

  const ORDN = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

  const DOC_TITLES = {
    support: ['Support FAQ', 'Help center article'], product: ['Product guide', 'Catalog notes'], news: ['Newsletter', 'Weekly digest'],
    policy: ['Policy handbook', 'Terms summary'], howto: ['How-to guide', 'Setup instructions'], meeting: ['Meeting minutes', 'Project brief'],
    chat: ['Chat transcript', 'Team thread'], travel: ['Travel guide', 'Trip notes'], finance: ['Quarterly update', 'Finance report'],
    science: ['Science digest', 'Research summary'], community: ['Community newsletter', 'Club bulletin'],
  };

  // Sentences without quotes or line breaks (they are copied and quoted in instructions).
  function sentences(spec, domain) {
    const all = domain && C.SENTENCE_GROUPS[domain] ? C.SENTENCE_GROUPS[domain] : C.SENTENCES;
    return C.split(all, spec.csplit).filter((s) => !/["“”\n]/.test(s) && s.length <= 140);
  }

  const DOMAINS = () => Object.keys(C.SENTENCE_GROUPS);

  // Greedy word wrap to at most cols characters per line.
  function wrap(text, cols) {
    const lines = [];
    let cur = '';
    for (const w of text.split(/\s+/).filter(Boolean)) {
      if (cur && (cur + ' ' + w).length > cols) {
        lines.push(cur);
        cur = w;
      } else cur = cur ? cur + ' ' + w : w;
    }
    if (cur) lines.push(cur);
    return lines;
  }

  function fieldSpec(rng, kind) {
    const labels = {
      copy: [
        'Paste here', 'Answer', 'Your text', 'Text', 'Copied text', 'Response', 'Paste field', 'Clipboard',
        'Text area', 'Clip text', 'Text input', 'Input'
      ],
      type: ['Text', 'Answer', 'Your entry', 'Input', 'Value', 'Content', 'Entry', 'Body', 'Writing', 'Freeform'],
      word: ['Answer', 'Word', 'Your answer', 'Found word', 'Term', 'Keyword', 'Word input', 'Chosen term'],
    }[kind];
    const ph = {
      copy: [
        'Paste the text here', 'Ctrl+V to paste', '', 'Text', 'Paste text', 'Text below', 'Paste in box',
        'Pasted content'
      ],
      type: ['Type here', '', 'Enter text', 'Type below'],
      word: ['Type the word', '', 'One word', 'Type one', 'Enter one', 'Word here'],
    }[kind];
    return { label: rng.pick(labels), placeholder: rng.pick(ph) };
  }

  function codeValue(rng, key) {
    const fns = { 'tracking code': C.trackingCode, 'order number': C.orderId, 'invoice ID': C.invoiceId, 'coupon code': C.couponCode };
    if (fns[key]) return fns[key](rng);
    if (key === 'booking code') return C.letters(rng, 6);
    if (key === 'serial number') return `${C.letters(rng, 2)}${C.digits(rng, 6)}-${C.alnum(rng, 3)}`;
    if (key === 'account ID') return `ACC-${C.digits(rng, 7)}`;
    return `REF ${C.alnum(rng, 4)}-${C.digits(rng, 4)}`;
  }

  function unicodeText(rng) {
    const a = rng.pick(UNICODE);
    return rng.pick([
      () => a,
      () => `${a} ${rng.pick(UNICODE.filter((x) => x !== a))}`,
      () => `${a} ${rng.int(2, 99)}`,
      () => `${cap(rng.pick(['note', 'menu', 'city', 'label', 'sign', 'shop']))} ${a}`,
    ])();
  }

  // ---------------------------------------------------------------- sampling: scrolling

  // Wrapped lines of real text; avoid targets without letters.
  function textLines(rng, spec, lo, hi, cols) {
    for (let k = 0; ; k++) {
      const paras = C.paragraphs(rng, rng.int(2, 4), { csplit: spec.csplit, min: 3, max: 6 });
      const lines = wrap(paras.join(' '), cols);
      if ((lines.length >= lo && lines.length <= hi) || k > 30) return lines.slice(0, hi);
    }
  }

  const SPINNERS = [
    { label: 'Value', unit: '', step: 1, decimals: 0, min: null, max: null },
    { label: 'Quantity', unit: '', step: 1, decimals: 0, min: 0, max: 999 },
    { label: 'Guests', unit: '', step: 1, decimals: 0, min: 1, max: 500 },
    { label: 'Temperature', unit: '°C', step: 0.5, decimals: 1, min: null, max: null },
    { label: 'Volume', unit: '%', step: 1, decimals: 0, min: 0, max: 100 },
    { label: 'Font size', unit: 'pt', step: 1, decimals: 0, min: 6, max: 400 },
    { label: 'Interval', unit: 'min', step: 5, decimals: 0, min: 0, max: 2000 },
    { label: 'Weight', unit: 'kg', step: 0.25, decimals: 2, min: 0, max: null },
    { label: 'Offset', unit: 'px', step: 2, decimals: 0, min: null, max: null },
    { label: 'Budget', unit: '$', step: 10, decimals: 0, min: 0, max: null },
    { label: 'Apples', unit: '', step: 1, decimals: 0, min: 0, max: 999 },
    { label: 'Books', unit: '', step: 1, decimals: 0, min: 0, max: 999 },
    { label: 'Chairs', unit: '', step: 1, decimals: 0, min: 0, max: 999 },
    { label: 'Tickets', unit: '', step: 1, decimals: 0, min: 0, max: 999 },
    { label: 'Packets', unit: '', step: 1, decimals: 0, min: 0, max: 999 },
    { label: 'Attempts', unit: '', step: 1, decimals: 0, min: 0, max: 999 },
    { label: 'Threads', unit: '', step: 1, decimals: 0, min: 0, max: 999 },
    { label: 'Layers', unit: '', step: 1, decimals: 0, min: 0, max: 999 },
    { label: 'Columns', unit: '', step: 1, decimals: 0, min: 0, max: 999 },
    { label: 'Stitches', unit: '', step: 1, decimals: 0, min: 0, max: 999 },
    { label: 'Beads', unit: '', step: 1, decimals: 0, min: 0, max: 999 },
    { label: 'Candles', unit: '', step: 1, decimals: 0, min: 0, max: 999 },
    { label: 'Tiles', unit: '', step: 1, decimals: 0, min: 0, max: 999 },
    { label: 'Pencils', unit: '', step: 1, decimals: 0, min: 0, max: 999 },
    { label: 'Photos', unit: '', step: 1, decimals: 0, min: 0, max: 999 },
    { label: 'Crates', unit: '', step: 1, decimals: 0, min: 0, max: 999 },
    { label: 'Rounds', unit: '', step: 1, decimals: 0, min: 0, max: 999 },
    { label: 'Folders', unit: '', step: 1, decimals: 0, min: 0, max: 999 },
    { label: 'Seeds', unit: '', step: 1, decimals: 0, min: 0, max: 999 },
    { label: 'Balloons', unit: '', step: 1, decimals: 0, min: 0, max: 999 },
    { label: 'Samples', unit: '', step: 1, decimals: 0, min: 0, max: 999 },
    { label: 'Windows', unit: '', step: 1, decimals: 0, min: 0, max: 999 },
    { label: 'Bookmarks', unit: '', step: 1, decimals: 0, min: 0, max: 999 },
    { label: 'Deliveries', unit: '', step: 1, decimals: 0, min: 0, max: 999 },
    { label: 'Characters', unit: '', step: 1, decimals: 0, min: 0, max: 999 },
    { label: 'Vehicles', unit: '', step: 1, decimals: 0, min: 0, max: 999 },
    { label: 'Episodes', unit: '', step: 1, decimals: 0, min: 0, max: 999 },
    { label: 'Bridges', unit: '', step: 1, decimals: 0, min: 0, max: 999 },
    { label: 'Triangles', unit: '', step: 1, decimals: 0, min: 0, max: 999 },
    { label: 'Workshops', unit: '', step: 1, decimals: 0, min: 0, max: 999 },
  ];

  const SHORT_WORDS = new Set(['new', 'all', 'not', 'our', 'your', 'free', 'next', 'last', 'main', 'only', 'very', 'more', 'two', 'old', 'full', 'each', 'some', 'this']);

  // ---------------------------------------------------------------- difficulty ladder

  // opts.level 'easy' (lv 1) / 'medium' (lv 0.5): the sampled episode is eased in place (fewer boxes, lines,
  // items; shorter documents; nearer spinner targets), drawing only from the 'level' fork, so normal samples
  // exactly what it always did. What the instruction names, and the answer, stay. 'edit' and unicode 'type' /
  // 'copy' have no easier form and keep their normal draw.
  function levelAdjust(spec, lv, r) {
    const easy = lv >= 1;
    const k = (e, m) => (easy ? e : m);
    switch (spec.scenario) {
      case 'copy-paste': {
        const keep = keepIdx(r, spec.boxes.length, [spec.want.box], k(0, 1));
        if (keep.length < spec.boxes.length) {
          spec.boxes = keep.map((i) => spec.boxes[i]);
          spec.want = { ...spec.want, box: keep.indexOf(spec.want.box) };
          if (spec.boxes.length === 1) spec.refBy = 'only';
        }
        break;
      }
      case 'copy-paste-2': {
        const box = spec.boxes[0];
        if (spec.mode === 'sentence') {
          if (easy) {
            const t = box.text.slice(spec.want.start, spec.want.end);
            spec.boxes = [{ ...box, text: t }];
            spec.want = { box: 0, start: 0, end: t.length };
            spec.k = 0;
          } else spec.boxes = [{ ...box, text: box.text.slice(0, spec.want.end) }];
        } else if (spec.mode === 'line') {
          const keep = keepIdx(r, box.lines.length, [spec.k], k(2, 3));
          const lines = keep.map((i) => box.lines[i]);
          const kk = keep.indexOf(spec.k);
          const start = lines.slice(0, kk).reduce((a, x) => a + x.length + 1, 0);
          spec.boxes = [{ ...box, text: lines.join('\n'), lines }];
          spec.want = { box: 0, start, end: start + lines[kk].length };
          spec.k = kk;
        } else {
          const pre = `${VALUE_LABELS[spec.label]}: `;
          const at = box.lines.findIndex((l) => l.startsWith(pre));
          const keep = keepIdx(r, box.lines.length, [0, at], k(1, 2));
          const lines = keep.map((i) => box.lines[i]);
          const kk = keep.indexOf(at);
          const start = lines.slice(0, kk).reduce((a, x) => a + x.length + 1, 0) + pre.length;
          spec.boxes = [{ ...box, text: lines.join('\n'), lines }];
          spec.want = { box: 0, start, end: start + box.lines[at].length - pre.length };
        }
        spec.answer = spec.boxes[0].text.slice(spec.want.start, spec.want.end);
        break;
      }
      case 'unicode':
        if (spec.mode === 'button') {
          const keep = keepIdx(r, spec.items.length, [spec.items.findIndex((x) => x.type === 'button' && x.label === spec.target)], k(2, 3));
          spec.items = keep.map((i) => spec.items[i]);
        }
        break;
      case 'scroll-text': {
        const rows = spec.rows;
        if (spec.mode === 'edge') {
          const ratio = spec.start / Math.max(1, lib.maxScroll(spec));
          spec.lines = spec.lines.slice(0, rows + k(3, 5));
          spec.start = Math.round(ratio * lib.maxScroll(spec));
          break;
        }
        const line = spec.mode === 'last' ? Math.min(spec.line, rows + k(2, 4)) : Math.min(spec.line, rows + k(1, 3));
        const lines = spec.lines.slice(0, spec.mode === 'last' ? line + 1 : line + 1 + k(1, 2));
        const ws = lines[line].split(' ');
        const w = spec.which === 'first' ? ws[0] : ws[ws.length - 1];
        if (line >= rows && /^[\p{L}][\p{L}'’-]*[.,;:!?]?$/u.test(w) && lib.wordOnly(w).length >= 2) {
          spec.lines = lines;
          spec.line = line;
          spec.answer = lib.wordOnly(w);
        }
        break;
      }
      case 'sign-agreement':
        if (spec.lines.length > spec.rows + k(4, 10)) spec.lines = spec.lines.slice(0, spec.rows + k(4, 10));
        if (easy) spec.name = spec.name.split(' ')[0];
        break;
      case 'spinner': {
        const cap = { click: k(4, 7), type: k(60, 110), hold: k(35, 45) }[spec.mode];
        const d = spec.target - spec.start;
        if (Math.abs(d) > cap) {
          const t = spec.start + Math.sign(d) * cap;
          if ((spec.min === null || t >= spec.min) && (spec.max === null || t <= spec.max)) spec.target = t;
        }
        break;
      }
      case 'find': {
        const lo = Math.max(0, spec.para - k(3, 5));
        const hi = Math.min(spec.paragraphs.length, spec.para + 1 + k(0, 1));
        if (lo > 0 || hi < spec.paragraphs.length) {
          const paragraphs = spec.paragraphs.slice(lo, hi);
          const pi = spec.para - lo;
          const base = paragraphs.slice(0, pi).reduce((a, x) => a + x.length + 2, 0);
          const start = base + paragraphs[pi].indexOf(spec.phrase);
          Object.assign(spec, { paragraphs, doc: paragraphs.join('\n\n'), para: pi, want: { start, end: start + spec.phrase.length } });
        }
        break;
      }
      default: break;
    }
  }
  Object.assign(lib, { wrap, TITLES, unicodeText, sentences, codeValue, VALUE_LABELS, ORD, ORDN, UNI_BUTTONS, SPINNERS, fieldSpec, DOMAINS, textLines, SECTIONS, TERMS, SHORT_WORDS, DOC_TITLES, levelAdjust });
})();
