/*
 * kit/content/locale.js: locales, date/time/number/money formatting without Intl (identical output in every
 * browser and Node version), calendar helpers, and translated interface words. API: see the header of
 * kit/content/core.js. Formats follow CLDR conventions (e.g. fr groups with U+202F, pl with U+00A0, es, it and pl do
 * not group four-digit numbers, Polish long dates use the genitive month).
 */
(function () {
  'use strict';
  const C = env.content;
  const NBSP = ' ';
  const NNBSP = ' ';

  const EN_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const EN_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const split = (s) => s.split(',').map((x) => x.trim());
  const CJK_MONTHS = Array.from({ length: 12 }, (_, i) => `${i + 1}月`);

  // Date patterns: YYYY, MMMMG (genitive month), MMMM, MMM, MM, M, DD, D, EEEE (weekday), EEE; 'quoted' literal.
  const LOCALES = {
    'en-US': {
      name: 'English (United States)', nativeName: 'English (US)', firstDayOfWeek: 0, dateOrder: 'MDY', time24: false,
      decimal: '.', group: ',', minGroup: 1, currency: 'USD', country: 'US', hourPad: false, dayPeriods: ['AM', 'PM'],
      months: EN_MONTHS, monthsShort: split('Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec'),
      weekdays: EN_DAYS, weekdaysShort: split('Sun, Mon, Tue, Wed, Thu, Fri, Sat'),
      fmt: { numeric: 'M/D/YYYY', short: 'MM/DD/YYYY', medium: 'MMM D, YYYY', long: 'MMMM D, YYYY', full: 'EEEE, MMMM D, YYYY', monthYear: 'MMMM YYYY', monthDay: 'MMM D' },
      money: 'prefix',
    },
    'en-GB': {
      name: 'English (United Kingdom)', nativeName: 'English (UK)', firstDayOfWeek: 1, dateOrder: 'DMY', time24: true,
      decimal: '.', group: ',', minGroup: 1, currency: 'GBP', country: 'GB', hourPad: true, dayPeriods: ['am', 'pm'],
      months: EN_MONTHS, monthsShort: split('Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sept, Oct, Nov, Dec'),
      weekdays: EN_DAYS, weekdaysShort: split('Sun, Mon, Tue, Wed, Thu, Fri, Sat'),
      fmt: { numeric: 'D/M/YYYY', short: 'DD/MM/YYYY', medium: 'D MMM YYYY', long: 'D MMMM YYYY', full: 'EEEE, D MMMM YYYY', monthYear: 'MMMM YYYY', monthDay: 'D MMM' },
      money: 'prefix',
    },
    'de-DE': {
      name: 'German (Germany)', nativeName: 'Deutsch', firstDayOfWeek: 1, dateOrder: 'DMY', time24: true,
      decimal: ',', group: '.', minGroup: 1, currency: 'EUR', country: 'DE', hourPad: true, dayPeriods: ['AM', 'PM'],
      months: split('Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober, November, Dezember'),
      monthsShort: split('Jan., Feb., März, Apr., Mai, Juni, Juli, Aug., Sept., Okt., Nov., Dez.'),
      weekdays: split('Sonntag, Montag, Dienstag, Mittwoch, Donnerstag, Freitag, Samstag'),
      weekdaysShort: split('So., Mo., Di., Mi., Do., Fr., Sa.'),
      fmt: { numeric: 'D.M.YYYY', short: 'DD.MM.YYYY', medium: 'D. MMM YYYY', long: 'D. MMMM YYYY', full: 'EEEE, D. MMMM YYYY', monthYear: 'MMMM YYYY', monthDay: 'D. MMM' },
      money: 'suffix',
    },
    'fr-FR': {
      name: 'French (France)', nativeName: 'Français', firstDayOfWeek: 1, dateOrder: 'DMY', time24: true,
      decimal: ',', group: NNBSP, minGroup: 1, currency: 'EUR', country: 'FR', hourPad: true, dayPeriods: ['AM', 'PM'],
      months: split('janvier, février, mars, avril, mai, juin, juillet, août, septembre, octobre, novembre, décembre'),
      monthsShort: split('janv., févr., mars, avr., mai, juin, juil., août, sept., oct., nov., déc.'),
      weekdays: split('dimanche, lundi, mardi, mercredi, jeudi, vendredi, samedi'),
      weekdaysShort: split('dim., lun., mar., mer., jeu., ven., sam.'),
      fmt: { numeric: 'D/M/YYYY', short: 'DD/MM/YYYY', medium: 'D MMM YYYY', long: 'D MMMM YYYY', full: 'EEEE D MMMM YYYY', monthYear: 'MMMM YYYY', monthDay: 'D MMM' },
      money: 'suffix', firstDay: '1er',
    },
    'es-ES': {
      name: 'Spanish (Spain)', nativeName: 'Español (España)', firstDayOfWeek: 1, dateOrder: 'DMY', time24: true,
      decimal: ',', group: '.', minGroup: 2, currency: 'EUR', country: 'ES', hourPad: false, dayPeriods: ['a. m.', 'p. m.'],
      months: split('enero, febrero, marzo, abril, mayo, junio, julio, agosto, septiembre, octubre, noviembre, diciembre'),
      monthsShort: split('ene, feb, mar, abr, may, jun, jul, ago, sept, oct, nov, dic'),
      weekdays: split('domingo, lunes, martes, miércoles, jueves, viernes, sábado'),
      weekdaysShort: split('dom, lun, mar, mié, jue, vie, sáb'),
      fmt: { numeric: 'D/M/YYYY', short: 'DD/MM/YYYY', medium: 'D MMM YYYY', long: "D 'de' MMMM 'de' YYYY", full: "EEEE, D 'de' MMMM 'de' YYYY", monthYear: "MMMM 'de' YYYY", monthDay: 'D MMM' },
      money: 'suffix',
    },
    'pt-BR': {
      name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', firstDayOfWeek: 0, dateOrder: 'DMY', time24: true,
      decimal: ',', group: '.', minGroup: 1, currency: 'BRL', country: 'BR', hourPad: true, dayPeriods: ['AM', 'PM'],
      months: split('janeiro, fevereiro, março, abril, maio, junho, julho, agosto, setembro, outubro, novembro, dezembro'),
      monthsShort: split('jan., fev., mar., abr., mai., jun., jul., ago., set., out., nov., dez.'),
      weekdays: split('domingo, segunda-feira, terça-feira, quarta-feira, quinta-feira, sexta-feira, sábado'),
      weekdaysShort: split('dom., seg., ter., qua., qui., sex., sáb.'),
      fmt: { numeric: 'D/M/YYYY', short: 'DD/MM/YYYY', medium: "D 'de' MMM 'de' YYYY", long: "D 'de' MMMM 'de' YYYY", full: "EEEE, D 'de' MMMM 'de' YYYY", monthYear: "MMMM 'de' YYYY", monthDay: "D 'de' MMM" },
      money: 'prefix-space',
    },
    'it-IT': {
      name: 'Italian (Italy)', nativeName: 'Italiano', firstDayOfWeek: 1, dateOrder: 'DMY', time24: true,
      decimal: ',', group: '.', minGroup: 2, currency: 'EUR', country: 'IT', hourPad: true, dayPeriods: ['AM', 'PM'],
      months: split('gennaio, febbraio, marzo, aprile, maggio, giugno, luglio, agosto, settembre, ottobre, novembre, dicembre'),
      monthsShort: split('gen, feb, mar, apr, mag, giu, lug, ago, set, ott, nov, dic'),
      weekdays: split('domenica, lunedì, martedì, mercoledì, giovedì, venerdì, sabato'),
      weekdaysShort: split('dom, lun, mar, mer, gio, ven, sab'),
      fmt: { numeric: 'D/M/YYYY', short: 'DD/MM/YYYY', medium: 'D MMM YYYY', long: 'D MMMM YYYY', full: 'EEEE D MMMM YYYY', monthYear: 'MMMM YYYY', monthDay: 'D MMM' },
      money: 'suffix',
    },
    'nl-NL': {
      name: 'Dutch (Netherlands)', nativeName: 'Nederlands', firstDayOfWeek: 1, dateOrder: 'DMY', time24: true,
      decimal: ',', group: '.', minGroup: 1, currency: 'EUR', country: 'NL', hourPad: true, dayPeriods: ['a.m.', 'p.m.'],
      months: split('januari, februari, maart, april, mei, juni, juli, augustus, september, oktober, november, december'),
      monthsShort: split('jan, feb, mrt, apr, mei, jun, jul, aug, sep, okt, nov, dec'),
      weekdays: split('zondag, maandag, dinsdag, woensdag, donderdag, vrijdag, zaterdag'),
      weekdaysShort: split('zo, ma, di, wo, do, vr, za'),
      fmt: { numeric: 'D-M-YYYY', short: 'DD-MM-YYYY', medium: 'D MMM YYYY', long: 'D MMMM YYYY', full: 'EEEE D MMMM YYYY', monthYear: 'MMMM YYYY', monthDay: 'D MMM' },
      money: 'prefix-space',
    },
    'pl-PL': {
      name: 'Polish (Poland)', nativeName: 'Polski', firstDayOfWeek: 1, dateOrder: 'DMY', time24: true,
      decimal: ',', group: NBSP, minGroup: 2, currency: 'PLN', country: 'PL', hourPad: true, dayPeriods: ['AM', 'PM'],
      months: split('styczeń, luty, marzec, kwiecień, maj, czerwiec, lipiec, sierpień, wrzesień, październik, listopad, grudzień'),
      monthsGenitive: split('stycznia, lutego, marca, kwietnia, maja, czerwca, lipca, sierpnia, września, października, listopada, grudnia'),
      monthsShort: split('sty, lut, mar, kwi, maj, cze, lip, sie, wrz, paź, lis, gru'),
      weekdays: split('niedziela, poniedziałek, wtorek, środa, czwartek, piątek, sobota'),
      weekdaysShort: split('niedz., pon., wt., śr., czw., pt., sob.'),
      fmt: { numeric: 'D.MM.YYYY', short: 'DD.MM.YYYY', medium: 'D MMM YYYY', long: 'D MMMMG YYYY', full: 'EEEE, D MMMMG YYYY', monthYear: 'MMMM YYYY', monthDay: 'D MMM' },
      money: 'suffix',
    },
    'ja-JP': {
      name: 'Japanese (Japan)', nativeName: '日本語', firstDayOfWeek: 0, dateOrder: 'YMD', time24: true,
      decimal: '.', group: ',', minGroup: 1, currency: 'JPY', country: 'JP', hourPad: false, dayPeriods: ['午前', '午後'], periodFirst: true,
      months: CJK_MONTHS, monthsShort: CJK_MONTHS,
      weekdays: split('日曜日, 月曜日, 火曜日, 水曜日, 木曜日, 金曜日, 土曜日'),
      weekdaysShort: split('日, 月, 火, 水, 木, 金, 土'),
      fmt: { numeric: 'YYYY/M/D', short: 'YYYY/MM/DD', medium: 'YYYY/MM/DD', long: 'YYYY年M月D日', full: 'YYYY年M月D日EEEE', monthYear: 'YYYY年M月', monthDay: 'M月D日' },
      money: 'prefix',
    },
    'zh-CN': {
      name: 'Chinese (Simplified, China)', nativeName: '简体中文', firstDayOfWeek: 1, dateOrder: 'YMD', time24: true,
      decimal: '.', group: ',', minGroup: 1, currency: 'CNY', country: 'CN', hourPad: true, dayPeriods: ['上午', '下午'], periodFirst: true,
      months: CJK_MONTHS, monthsShort: CJK_MONTHS,
      weekdays: split('星期日, 星期一, 星期二, 星期三, 星期四, 星期五, 星期六'),
      weekdaysShort: split('周日, 周一, 周二, 周三, 周四, 周五, 周六'),
      fmt: { numeric: 'YYYY/M/D', short: 'YYYY/MM/DD', medium: 'YYYY年M月D日', long: 'YYYY年M月D日', full: 'YYYY年M月D日EEEE', monthYear: 'YYYY年M月', monthDay: 'M月D日' },
      money: 'prefix',
    },
  };
  for (const [id, loc] of Object.entries(LOCALES)) loc.id = id;
  const LOCALE_IDS = Object.keys(LOCALES);
  const loc = (id) => LOCALES[id] || LOCALES['en-US'];

  // ------------------------------------------------------------ calendar math (proleptic Gregorian, no Date)

  const { pad, civilToDays: daysFromCivil, daysToCivil: civilFromDays } = env.util;
  const toISO = (y, m, d) => `${pad(y, 4)}-${pad(m)}-${pad(d)}`;
  function dateParts(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso));
    if (!m) throw new Error(`content: bad ISO date '${iso}'`);
    return [Number(m[1]), Number(m[2]), Number(m[3])];
  }
  const dayNumber = (iso) => daysFromCivil(...dateParts(iso));
  const fromDayNumber = (n) => toISO(...civilFromDays(n));
  const addDays = (iso, n) => fromDayNumber(dayNumber(iso) + n);
  const dayOfWeek = (iso) => (((dayNumber(iso) + 4) % 7) + 7) % 7; // 1970-01-01 was a Thursday
  const daysInMonth = (y, m) => [31, (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
  function randomDate(rng, opts = {}) {
    const a = dayNumber(opts.from || '2019-01-01');
    const b = dayNumber(opts.to || '2027-12-31');
    return fromDayNumber(rng.int(Math.min(a, b), Math.max(a, b)));
  }

  // ------------------------------------------------------------ formatting

  const TOKENS = /'[^']*'|YYYY|MMMMG|MMMM|MMM|MM|M|DD|D|EEEE|EEE/g;

  function formatDate(iso, localeId = 'en-US', style = 'short') {
    const [y, m, d] = dateParts(iso);
    if (style === 'iso') return toISO(y, m, d);
    const L = loc(localeId);
    const pat = L.fmt[style] || L.fmt.short;
    const wd = dayOfWeek(iso);
    const textual = /MMM|EEE/.test(pat);
    return pat.replace(TOKENS, (t) => {
      switch (t) {
        case 'YYYY': return String(y);
        case 'MMMMG': return (L.monthsGenitive || L.months)[m - 1];
        case 'MMMM': return L.months[m - 1];
        case 'MMM': return L.monthsShort[m - 1];
        case 'MM': return pad(m);
        case 'M': return String(m);
        case 'DD': return pad(d);
        case 'D': return d === 1 && L.firstDay && textual ? L.firstDay : String(d);
        case 'EEEE': return L.weekdays[wd];
        case 'EEE': return L.weekdaysShort[wd];
        default: return t.slice(1, -1);
      }
    });
  }


  function formatNumber(x, localeId = 'en-US', decimals) {
    const L = loc(localeId);
    let dec = decimals;
    if (dec == null) {
      const r = Math.round(Math.abs(x) * 100) / 100;
      dec = Number.isInteger(r) ? 0 : Number.isInteger(r * 10) ? 1 : 2;
    }
    const neg = x < 0 && Math.abs(x).toFixed(dec) !== (0).toFixed(dec);
    const [int, frac] = Math.abs(x).toFixed(dec).split('.');
    let grouped = int;
    if (int.length >= 4 && int.length >= 3 + L.minGroup) grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, L.group);
    return `${neg ? '-' : ''}${grouped}${frac ? L.decimal + frac : ''}`;
  }

  // Symbols a locale writes differently from the currency's own symbol.
  const LOCAL_SYMBOLS = {
    'ja-JP': { JPY: '￥', CNY: '元', USD: '$' },
    'zh-CN': { JPY: 'JP¥', USD: 'US$' },
    'en-US': { CNY: 'CN¥' },
    'en-GB': { USD: 'US$', CNY: 'CN¥' },
    'pt-BR': { USD: 'US$' },
    'fr-FR': { USD: '$US' },
    'de-DE': { USD: '$' },
  };

  function formatMoney(x, code = 'USD', localeId) {
    const cur = (C.currency && C.currency(code)) || { code, symbol: code, decimals: 2, locale: 'en-US' };
    const id = localeId || cur.locale || 'en-US';
    const L = loc(id);
    const sym = (LOCAL_SYMBOLS[id] && LOCAL_SYMBOLS[id][cur.code]) || (cur.code === code ? cur.symbol : code);
    const num = formatNumber(Math.abs(x), id, cur.decimals);
    const neg = x < 0 ? '-' : '';
    const alpha = /[A-Za-z]$/.test(sym);
    switch (L.money) {
      case 'suffix': return `${neg}${num}${NBSP}${sym}`;
      case 'prefix-space': return `${neg}${sym}${NBSP}${num}`;
      default: return `${neg}${sym}${alpha ? NBSP : ''}${num}`;
    }
  }

  // ------------------------------------------------------------ interface words

  // key | en-US | en-GB | de-DE | fr-FR | es-ES | pt-BR | it-IT | nl-NL | pl-PL | ja-JP | zh-CN
  const UI_ROWS = C.rows(`
    submit | Submit | Submit | Absenden | Valider | Enviar | Enviar | Invia | Verzenden | Wyślij | 送信 | 提交
    done | Done | Done | Fertig | Terminé | Hecho | Concluído | Fatto | Klaar | Gotowe | 完了 | 完成
    finish | Finish | Finish | Abschließen | Terminer | Finalizar | Concluir | Termina | Voltooien | Zakończ | 終了 | 结束
    continue | Continue | Continue | Fortfahren | Continuer | Continuar | Continuar | Continua | Doorgaan | Kontynuuj | 続行 | 继续
    save | Save | Save | Speichern | Enregistrer | Guardar | Salvar | Salva | Opslaan | Zapisz | 保存 | 保存
    cancel | Cancel | Cancel | Abbrechen | Annuler | Cancelar | Cancelar | Annulla | Annuleren | Anuluj | キャンセル | 取消
    ok | OK | OK | OK | OK | Aceptar | OK | OK | OK | OK | OK | 确定
    confirm | Confirm | Confirm | Bestätigen | Confirmer | Confirmar | Confirmar | Conferma | Bevestigen | Potwierdź | 確認 | 确认
    apply | Apply | Apply | Übernehmen | Appliquer | Aplicar | Aplicar | Applica | Toepassen | Zastosuj | 適用 | 应用
    next | Next | Next | Weiter | Suivant | Siguiente | Próximo | Avanti | Volgende | Dalej | 次へ | 下一步
    back | Back | Back | Zurück | Retour | Atrás | Voltar | Indietro | Terug | Wstecz | 戻る | 返回
    previous | Previous | Previous | Vorherige | Précédent | Anterior | Anterior | Precedente | Vorige | Poprzedni | 前へ | 上一步
    search | Search | Search | Suchen | Rechercher | Buscar | Pesquisar | Cerca | Zoeken | Szukaj | 検索 | 搜索
    delete | Delete | Delete | Löschen | Supprimer | Eliminar | Excluir | Elimina | Verwijderen | Usuń | 削除 | 删除
    close | Close | Close | Schließen | Fermer | Cerrar | Fechar | Chiudi | Sluiten | Zamknij | 閉じる | 关闭
    acceptAll | Accept all | Accept all | Alle akzeptieren | Tout accepter | Aceptar todo | Aceitar tudo | Accetta tutto | Alles accepteren | Zaakceptuj wszystkie | すべて許可 | 全部接受
    rejectAll | Reject all | Reject all | Alle ablehnen | Tout refuser | Rechazar todo | Rejeitar tudo | Rifiuta tutto | Alles weigeren | Odrzuć wszystkie | すべて拒否 | 全部拒绝
    settings | Settings | Settings | Einstellungen | Paramètres | Configuración | Configurações | Impostazioni | Instellingen | Ustawienia | 設定 | 设置
    menu | Menu | Menu | Menü | Menu | Menú | Menu | Menu | Menu | Menu | メニュー | 菜单
    home | Home | Home | Startseite | Accueil | Inicio | Início | Home | Home | Strona główna | ホーム | 首页
    help | Help | Help | Hilfe | Aide | Ayuda | Ajuda | Aiuto | Help | Pomoc | ヘルプ | 帮助
    signIn | Sign in | Sign in | Anmelden | Se connecter | Iniciar sesión | Entrar | Accedi | Inloggen | Zaloguj się | ログイン | 登录
    signOut | Sign out | Sign out | Abmelden | Se déconnecter | Cerrar sesión | Sair | Esci | Uitloggen | Wyloguj się | ログアウト | 退出登录
    profile | Profile | Profile | Profil | Profil | Perfil | Perfil | Profilo | Profiel | Profil | プロフィール | 个人资料
    account | Account | Account | Konto | Compte | Cuenta | Conta | Account | Account | Konto | アカウント | 账户
    cart | Cart | Basket | Warenkorb | Panier | Carrito | Carrinho | Carrello | Winkelwagen | Koszyk | カート | 购物车
    checkout | Checkout | Checkout | Zur Kasse | Passer la commande | Tramitar pedido | Finalizar compra | Vai alla cassa | Afrekenen | Przejdź do kasy | レジに進む | 去结算
    filter | Filter | Filter | Filtern | Filtrer | Filtrar | Filtrar | Filtra | Filteren | Filtruj | 絞り込み | 筛选
    sort | Sort | Sort | Sortieren | Trier | Ordenar | Ordenar | Ordina | Sorteren | Sortuj | 並べ替え | 排序
    more | More | More | Mehr | Plus | Más | Mais | Altro | Meer | Więcej | もっと見る | 更多
    less | Less | Less | Weniger | Moins | Menos | Menos | Meno | Minder | Mniej | 表示を減らす | 收起
    yes | Yes | Yes | Ja | Oui | Sí | Sim | Sì | Ja | Tak | はい | 是
    no | No | No | Nein | Non | No | Não | No | Nee | Nie | いいえ | 否
    edit | Edit | Edit | Bearbeiten | Modifier | Editar | Editar | Modifica | Bewerken | Edytuj | 編集 | 编辑
    add | Add | Add | Hinzufügen | Ajouter | Añadir | Adicionar | Aggiungi | Toevoegen | Dodaj | 追加 | 添加
    remove | Remove | Remove | Entfernen | Retirer | Quitar | Remover | Rimuovi | Verwijderen | Usuń | 削除 | 移除
    upload | Upload | Upload | Hochladen | Importer | Subir | Enviar arquivo | Carica | Uploaden | Prześlij | アップロード | 上传
    download | Download | Download | Herunterladen | Télécharger | Descargar | Baixar | Scarica | Downloaden | Pobierz | ダウンロード | 下载
    send | Send | Send | Senden | Envoyer | Enviar | Enviar | Invia | Versturen | Wyślij | 送信 | 发送
    reply | Reply | Reply | Antworten | Répondre | Responder | Responder | Rispondi | Beantwoorden | Odpowiedz | 返信 | 回复
    forward | Forward | Forward | Weiterleiten | Transférer | Reenviar | Encaminhar | Inoltra | Doorsturen | Przekaż dalej | 転送 | 转发
    archive | Archive | Archive | Archivieren | Archiver | Archivar | Arquivar | Archivia | Archiveren | Archiwizuj | アーカイブ | 归档
    open | Open | Open | Öffnen | Ouvrir | Abrir | Abrir | Apri | Openen | Otwórz | 開く | 打开
    share | Share | Share | Teilen | Partager | Compartir | Compartilhar | Condividi | Delen | Udostępnij | 共有 | 分享
    print | Print | Print | Drucken | Imprimer | Imprimir | Imprimir | Stampa | Afdrukken | Drukuj | 印刷 | 打印
    copy | Copy | Copy | Kopieren | Copier | Copiar | Copiar | Copia | Kopiëren | Kopiuj | コピー | 复制
    paste | Paste | Paste | Einfügen | Coller | Pegar | Colar | Incolla | Plakken | Wklej | 貼り付け | 粘贴
    undo | Undo | Undo | Rückgängig | Annuler | Deshacer | Desfazer | Annulla | Ongedaan maken | Cofnij | 元に戻す | 撤销
    refresh | Refresh | Refresh | Aktualisieren | Actualiser | Actualizar | Atualizar | Aggiorna | Vernieuwen | Odśwież | 更新 | 刷新
    reset | Reset | Reset | Zurücksetzen | Réinitialiser | Restablecer | Redefinir | Reimposta | Herstellen | Resetuj | リセット | 重置
    clear | Clear | Clear | Leeren | Effacer | Borrar | Limpar | Cancella | Wissen | Wyczyść | クリア | 清除
    skip | Skip | Skip | Überspringen | Passer | Omitir | Pular | Salta | Overslaan | Pomiń | スキップ | 跳过
    select | Select | Select | Auswählen | Sélectionner | Seleccionar | Selecionar | Seleziona | Selecteren | Wybierz | 選択 | 选择
    view | View | View | Ansehen | Afficher | Ver | Ver | Visualizza | Bekijken | Wyświetl | 表示 | 查看
    details | Details | Details | Details | Détails | Detalles | Detalhes | Dettagli | Details | Szczegóły | 詳細 | 详情
    total | Total | Total | Gesamt | Total | Total | Total | Totale | Totaal | Razem | 合計 | 合计
    quantity | Quantity | Quantity | Menge | Quantité | Cantidad | Quantidade | Quantità | Aantal | Ilość | 数量 | 数量
    price | Price | Price | Preis | Prix | Precio | Preço | Prezzo | Prijs | Cena | 価格 | 价格
    language | Language | Language | Sprache | Langue | Idioma | Idioma | Lingua | Taal | Język | 言語 | 语言
    notifications | Notifications | Notifications | Benachrichtigungen | Notifications | Notificaciones | Notificações | Notifiche | Meldingen | Powiadomienia | 通知 | 通知
    loading | Loading... | Loading... | Wird geladen... | Chargement... | Cargando... | Carregando... | Caricamento... | Laden... | Ładowanie... | 読み込み中... | 加载中...
    today | Today | Today | Heute | Aujourd'hui | Hoy | Hoje | Oggi | Vandaag | Dzisiaj | 今日 | 今天
    required | Required | Required | Pflichtfeld | Obligatoire | Obligatorio | Obrigatório | Obbligatorio | Verplicht | Wymagane | 必須 | 必填
    login | Log in | Log in | Einloggen | Connexion | Acceder | Login | Login | Aanmelden | Logowanie | ログイン | 登录
    register | Sign up | Sign up | Registrieren | S'inscrire | Registrarse | Cadastrar-se | Registrati | Registreren | Zarejestruj się | 新規登録 | 注册
    password | Password | Password | Passwort | Mot de passe | Contraseña | Senha | Password | Wachtwoord | Hasło | パスワード | 密码
    email | Email | Email | E-Mail | E-mail | Correo electrónico | E-mail | Email | E-mail | E-mail | メールアドレス | 电子邮件
    projects | Projects | Projects | Projekte | Projets | Proyectos | Projetos | Progetti | Projecten | Projekty | プロジェクト | 项目
    reports | Reports | Reports | Berichte | Rapports | Informes | Relatórios | Report | Rapporten | Raporty | レポート | 报告
    team | Team | Team | Team | Équipe | Equipo | Equipe | Team | Team | Zespół | チーム | 团队
    billing | Billing | Billing | Abrechnung | Facturation | Facturación | Cobrança | Fatturazione | Facturering | Płatności | 請求 | 账单
    docs | Docs | Docs | Dokumentation | Documentation | Documentación | Documentação | Documentazione | Documentatie | Dokumentacja | ドキュメント | 文档
    activity | Activity | Activity | Aktivität | Activité | Actividad | Atividade | Attività | Activiteit | Aktywność | アクティビティ | 动态
    inbox | Inbox | Inbox | Posteingang | Boîte de réception | Bandeja de entrada | Caixa de entrada | Posta in arrivo | Inbox | Odebrane | 受信トレイ | 收件箱
    files | Files | Files | Dateien | Fichiers | Archivos | Arquivos | File | Bestanden | Pliki | ファイル | 文件
    feedback | Feedback | Feedback | Feedback | Commentaires | Comentarios | Feedback | Feedback | Feedback | Opinie | フィードバック | 反馈
    preview | Preview | Preview | Vorschau | Aperçu | Vista previa | Visualizar | Anteprima | Voorbeeld | Podgląd | プレビュー | 预览
    saveDraft | Save draft | Save draft | Entwurf speichern | Enregistrer le brouillon | Guardar borrador | Salvar rascunho | Salva bozza | Concept opslaan | Zapisz szkic | 下書き保存 | 保存草稿
    resetView | Reset view | Reset view | Ansicht zurücksetzen | Réinitialiser la vue | Restablecer vista | Redefinir visualização | Reimposta vista | Weergave herstellen | Resetuj widok | 表示をリセット | 重置视图
    export | Export | Export | Exportieren | Exporter | Exportar | Exportar | Esporta | Exporteren | Eksportuj | エクスポート | 导出
    history | History | History | Verlauf | Historique | Historial | Histórico | Cronologia | Geschiedenis | Historia | 履歴 | 历史记录
    yourTask | Your task | Your task | Ihre Aufgabe | Votre tâche | Tu tarea | Sua tarefa | Il tuo compito | Jouw taak | Twoje zadanie | あなたのタスク | 你的任务
    instructions | Instructions | Instructions | Anleitung | Instructions | Instrucciones | Instruções | Istruzioni | Instructies | Instrukcje | 手順 | 说明
    toDo | To do | To do | Zu erledigen | À faire | Pendiente | A fazer | Da fare | Te doen | Do zrobienia | やること | 待办
    goal | Goal | Goal | Ziel | Objectif | Objetivo | Objetivo | Obiettivo | Doel | Cel | 目標 | 目标
    dashboard | Dashboard | Dashboard | Übersicht | Tableau de bord | Panel | Painel | Pannello | Dashboard | Pulpit | ダッシュボード | 仪表板
    workspace | Workspace | Workspace | Arbeitsbereich | Espace de travail | Espacio de trabajo | Espaço de trabalho | Area di lavoro | Werkruimte | Obszar roboczy | ワークスペース | 工作区
    portal | Portal | Portal | Portal | Portail | Portal | Portal | Portale | Portaal | Portal | ポータル | 门户
    admin | Admin | Admin | Verwaltung | Administration | Administración | Administração | Amministrazione | Beheer | Administracja | 管理 | 管理后台
    footSaved | All changes are saved automatically. | All changes are saved automatically. | Alle Änderungen werden automatisch gespeichert. | Toutes les modifications sont enregistrées automatiquement. | Todos los cambios se guardan automáticamente. | Todas as alterações são salvas automaticamente. | Tutte le modifiche vengono salvate automaticamente. | Alle wijzigingen worden automatisch opgeslagen. | Wszystkie zmiany są zapisywane automatycznie. | 変更はすべて自動的に保存されます。 | 所有更改都会自动保存。
    footHelp | Need help? Contact your administrator. | Need help? Contact your administrator. | Hilfe benötigt? Wenden Sie sich an Ihren Administrator. | Besoin d'aide ? Contactez votre administrateur. | ¿Necesitas ayuda? Contacta con tu administrador. | Precisa de ajuda? Fale com o administrador. | Serve aiuto? Contatta l'amministratore. | Hulp nodig? Neem contact op met je beheerder. | Potrzebujesz pomocy? Skontaktuj się z administratorem. | お困りですか？管理者にお問い合わせください。 | 需要帮助？请联系管理员。
    footStatus | Status: all systems normal | Status: all systems normal | Status: alle Systeme in Betrieb | État : tous les systèmes fonctionnent | Estado: todos los sistemas operativos | Status: todos os sistemas normais | Stato: tutti i sistemi operativi | Status: alle systemen normaal | Status: wszystkie systemy działają | ステータス：すべて正常 | 状态：所有系统正常
    footRights | All rights reserved. | All rights reserved. | Alle Rechte vorbehalten. | Tous droits réservés. | Todos los derechos reservados. | Todos os direitos reservados. | Tutti i diritti riservati. | Alle rechten voorbehouden. | Wszelkie prawa zastrzeżone. | 無断転載を禁じます。 | 版权所有。
    cookieText | We use cookies to improve your experience and measure traffic. | We use cookies to improve your experience and measure traffic. | Wir verwenden Cookies, um Ihr Erlebnis zu verbessern und den Datenverkehr zu messen. | Nous utilisons des cookies pour améliorer votre expérience et mesurer l'audience. | Usamos cookies para mejorar tu experiencia y medir el tráfico. | Usamos cookies para melhorar sua experiência e medir o tráfego. | Utilizziamo i cookie per migliorare la tua esperienza e misurare il traffico. | We gebruiken cookies om je ervaring te verbeteren en het verkeer te meten. | Używamy plików cookie, aby ulepszać Twoje doświadczenia i mierzyć ruch. | 当サイトでは、利便性の向上とアクセス解析のためにCookieを使用しています。 | 我们使用 Cookie 来改善您的体验并统计流量。
    cookieText2 | Cookies help us remember your preferences and keep the service secure. | Cookies help us remember your preferences and keep the service secure. | Cookies helfen uns, Ihre Einstellungen zu speichern und den Dienst sicher zu halten. | Les cookies nous aident à mémoriser vos préférences et à sécuriser le service. | Las cookies nos ayudan a recordar tus preferencias y a mantener el servicio seguro. | Os cookies nos ajudam a lembrar suas preferências e a manter o serviço seguro. | I cookie ci aiutano a ricordare le tue preferenze e a mantenere sicuro il servizio. | Cookies helpen ons je voorkeuren te onthouden en de dienst veilig te houden. | Pliki cookie pomagają nam zapamiętać Twoje preferencje i dbać o bezpieczeństwo usługi. | Cookieは設定の保存とサービスの安全性の維持に役立ちます。 | Cookie 帮助我们记住您的偏好并保障服务安全。
    toastSynced | Changes synced a moment ago. | Changes synced a moment ago. | Änderungen wurden soeben synchronisiert. | Modifications synchronisées à l'instant. | Cambios sincronizados hace un momento. | Alterações sincronizadas agora mesmo. | Modifiche sincronizzate un attimo fa. | Wijzigingen zojuist gesynchroniseerd. | Zmiany zsynchronizowano przed chwilą. | 変更を同期しました。 | 更改已同步。
    toastExport | Your export is ready. | Your export is ready. | Ihr Export ist fertig. | Votre export est prêt. | Tu exportación está lista. | Sua exportação está pronta. | La tua esportazione è pronta. | Je export is klaar. | Twój eksport jest gotowy. | エクスポートの準備ができました。 | 导出已完成。
    toastRestored | Connection restored. | Connection restored. | Verbindung wiederhergestellt. | Connexion rétablie. | Conexión restablecida. | Conexão restabelecida. | Connessione ripristinata. | Verbinding hersteld. | Połączenie przywrócone. | 接続が回復しました。 | 连接已恢复。
    chatHello | Hi! Need any help today? | Hi! Need any help today? | Hallo! Können wir Ihnen heute helfen? | Bonjour ! Besoin d'aide aujourd'hui ? | ¡Hola! ¿Necesitas ayuda hoy? | Olá! Precisa de ajuda hoje? | Ciao! Hai bisogno di aiuto oggi? | Hoi! Kunnen we je ergens mee helpen? | Cześć! Potrzebujesz dziś pomocy? | こんにちは！何かお困りですか？ | 您好！今天需要帮助吗？
    chatPlans | Have questions about plans? Chat with us. | Have questions about plans? Chat with us. | Fragen zu unseren Tarifen? Schreiben Sie uns. | Des questions sur nos offres ? Discutez avec nous. | ¿Tienes preguntas sobre los planes? Chatea con nosotros. | Dúvidas sobre os planos? Fale conosco. | Domande sui piani? Scrivici in chat. | Vragen over abonnementen? Chat met ons. | Masz pytania o plany? Napisz do nas. | プランについてのご質問はチャットでどうぞ。 | 对套餐有疑问？和我们聊聊。
    promoUpgrade | Upgrade to Pro and get 3 months free. | Upgrade to Pro and get 3 months free. | Jetzt auf Pro upgraden und 3 Monate gratis erhalten. | Passez à Pro et profitez de 3 mois offerts. | Pásate a Pro y consigue 3 meses gratis. | Mude para o Pro e ganhe 3 meses grátis. | Passa a Pro e ottieni 3 mesi gratis. | Upgrade naar Pro en krijg 3 maanden gratis. | Przejdź na Pro i zyskaj 3 miesiące za darmo. | Proにアップグレードすると3か月無料。 | 升级到专业版，免费获得 3 个月。
    promoTrial | Try the new reporting suite free for 14 days. | Try the new reporting suite free for 14 days. | Testen Sie die neue Berichtsfunktion 14 Tage kostenlos. | Essayez gratuitement la nouvelle suite de rapports pendant 14 jours. | Prueba gratis la nueva suite de informes durante 14 días. | Experimente grátis o novo pacote de relatórios por 14 dias. | Prova gratis la nuova suite di report per 14 giorni. | Probeer de nieuwe rapportagesuite 14 dagen gratis. | Wypróbuj nowy pakiet raportów za darmo przez 14 dni. | 新しいレポート機能を14日間無料でお試しください。 | 免费试用新版报表套件 14 天。
    bannerMaint | Scheduled maintenance tonight 22:00-23:00 UTC. | Scheduled maintenance tonight 22:00-23:00 UTC. | Geplante Wartung heute Nacht 22:00-23:00 UTC. | Maintenance prévue ce soir de 22:00 à 23:00 UTC. | Mantenimiento programado esta noche de 22:00 a 23:00 UTC. | Manutenção programada hoje à noite, 22:00-23:00 UTC. | Manutenzione programmata stasera 22:00-23:00 UTC. | Gepland onderhoud vanavond 22:00-23:00 UTC. | Planowana konserwacja dziś w nocy 22:00-23:00 UTC. | 今夜22:00〜23:00（UTC）にメンテナンスを行います。 | 今晚 22:00-23:00 (UTC) 进行计划维护。
    bannerShared | You are viewing a shared workspace. | You are viewing a shared workspace. | Sie sehen einen geteilten Arbeitsbereich. | Vous consultez un espace de travail partagé. | Estás viendo un espacio de trabajo compartido. | Você está vendo um espaço de trabalho compartilhado. | Stai visualizzando un'area di lavoro condivisa. | Je bekijkt een gedeelde werkruimte. | Przeglądasz udostępniony obszar roboczy. | 共有ワークスペースを表示しています。 | 您正在查看共享工作区。
    bannerTrial | Your trial ends in 5 days. | Your trial ends in 5 days. | Ihr Testzeitraum endet in 5 Tagen. | Votre essai se termine dans 5 jours. | Tu prueba termina en 5 días. | Seu teste termina em 5 dias. | La tua prova termina tra 5 giorni. | Je proefperiode eindigt over 5 dagen. | Twój okres próbny kończy się za 5 dni. | 試用期間はあと5日で終了します。 | 您的试用将在 5 天后结束。
    necessaryOnly | Necessary only | Necessary only | Nur notwendige | Nécessaires uniquement | Solo necesarias | Somente necessários | Solo necessari | Alleen noodzakelijke | Tylko niezbędne | 必須のみ | 仅必要
    accept | Accept | Accept | Akzeptieren | Accepter | Aceptar | Aceitar | Accetta | Accepteren | Akceptuj | 同意する | 接受
    gotIt | Got it | Got it | Verstanden | Compris | Entendido | Entendi | Ho capito | Begrepen | Rozumiem | 了解 | 知道了
    noThanks | No thanks | No thanks | Nein, danke | Non merci | No, gracias | Não, obrigado | No, grazie | Nee, bedankt | Nie, dziękuję | 結構です | 不用了
    maybeLater | Maybe later | Maybe later | Vielleicht später | Plus tard | Quizás más tarde | Talvez depois | Forse più tardi | Misschien later | Może później | 後で | 以后再说
    upgradeNow | Upgrade now | Upgrade now | Jetzt upgraden | Passer à Pro | Mejorar ahora | Fazer upgrade | Esegui l'upgrade | Nu upgraden | Ulepsz teraz | 今すぐアップグレード | 立即升级
    startTrial | Start trial | Start trial | Testphase starten | Commencer l'essai | Iniciar prueba | Iniciar teste | Inizia la prova | Proefperiode starten | Rozpocznij okres próbny | 無料トライアル開始 | 开始试用
    learnMore | Learn more | Learn more | Mehr erfahren | En savoir plus | Más información | Saiba mais | Scopri di più | Meer informatie | Dowiedz się więcej | 詳しく見る | 了解更多
    dismiss | Dismiss | Dismiss | Ausblenden | Ignorer | Descartar | Dispensar | Ignora | Sluiten | Odrzuć | 閉じる | 忽略
  `);
  const UI_WORDS = {};
  LOCALE_IDS.forEach((id, i) => {
    UI_WORDS[id] = {};
    for (const row of UI_ROWS) UI_WORDS[id][row[0]] = row[i + 1];
  });
  const uiWord = (key, localeId = 'en-US') => (UI_WORDS[localeId] && UI_WORDS[localeId][key]) || UI_WORDS['en-US'][key] || key;

  Object.assign(C, {
    LOCALES,
    LOCALE_IDS,
    formatDate,
    formatNumber,
    formatMoney,
    UI_WORDS,
    uiWord,
    dateParts,
    toISO,
    addDays,
    dayOfWeek,
    daysInMonth,
    randomDate,
  });
})();
