// ==UserScript==
// @name         Pinterest - Publication automatique de pins
// @namespace    baddane.tools
// @version      1.4
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @description  Publie des pins automatiquement depuis un fichier Excel (max 5/jour, étalés de 9 h à 21 h), avec délais aléatoires pour éviter le bannissement.
// @match        https://www.pinterest.com/*
// @match        https://pinterest.com/*
// @match        https://*.pinterest.com/*
// @match        https://*.pinterest.fr/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @run-at       document-idle
// ==/UserScript==

/*
FICHIER PRÊT À L'EMPLOI POUR AQUAMETRE :
  npm run epingles:tampermonkey   → epingles-tampermonkey.csv (à charger dans le panneau)
*/

/*
FORMAT DU FICHIER EXCEL (colonnes) :

  Titre         Description                     Lien                          Image URL                              Tableau           Alt Text
  Mon article   Description de mon pin...       https://monsite.com/article   https://monsite.com/images/photo.jpg   Nom du tableau    Texte alternatif

- Titre : titre du pin (max 100 caractères)
- Description : description du pin (max 500 caractères)
- Lien : URL de destination quand on clique sur le pin
- Image URL : URL publique de l'image à utiliser
- Tableau : nom exact du tableau Pinterest (board) où publier
- Alt Text : texte alternatif pour l'accessibilité (optionnel)

LIMITES DE SÉCURITÉ :
- Maximum 5 pins par jour (compteur réinitialisé à minuit)
- Délai aléatoire de 1 h 30 à 3 h entre chaque pin, publication entre 9 h et 21 h
  seulement : un rythme humain réparti sur la journée, pas une rafale
- Pause automatique si Pinterest retourne une erreur
*/

(function () {
  'use strict';

  const KEY = 'pin-auto-etat';
  const KEY_JOURNAL = 'pin-auto-journal';
  const KEY_QUOTA = 'pin-auto-quota';
  const MAX_PAR_JOUR = 5;
  const DELAI_MIN = 90 * 60 * 1000;  // 1 h 30
  const DELAI_MAX = 180 * 60 * 1000; // 3 h
  const HEURE_DEBUT = 9, HEURE_FIN = 21; // plage de publication, heure locale
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

  // ---------- État persistant ----------
  const charger = () => { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; } };
  const sauver = s => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} };
  const effacer = () => { try { localStorage.removeItem(KEY); } catch (e) {} };
  const chargerJournal = () => { try { return JSON.parse(localStorage.getItem(KEY_JOURNAL)) || []; } catch (e) { return []; } };
  const sauverJournal = j => { try { localStorage.setItem(KEY_JOURNAL, JSON.stringify(j)); } catch (e) {} };

  // ---------- Quota journalier ----------
  // Date locale : toISOString() donne la date UTC, et le compteur ne repartait
  // donc pas à minuit heure locale.
  const jourLocal = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  function getQuota() {
    try {
      const q = JSON.parse(localStorage.getItem(KEY_QUOTA)) || {};
      const aujourdhui = jourLocal();
      if (q.date !== aujourdhui) return { date: aujourdhui, count: 0 };
      return q;
    } catch (e) { return { date: jourLocal(), count: 0 }; }
  }

  // ---------- Un seul onglet publie à la fois ----------
  // Deux onglets Pinterest ouverts reprenaient chacun la file au chargement et
  // publiaient en parallèle, doublant le rythme et le quota réel.
  // sessionStorage survit au rechargement de l'onglet : sans lui, un simple F5
  // faisait passer l'onglet pour un autre et bloquait sa propre file.
  const ONGLET = (() => {
    try {
      let id = sessionStorage.getItem('pin-auto-onglet');
      if (!id) { id = Math.random().toString(36).slice(2); sessionStorage.setItem('pin-auto-onglet', id); }
      return id;
    } catch (e) { return Math.random().toString(36).slice(2); }
  })();
  const BATTEMENT_MAX = 3 * 60 * 1000; // un onglet en arrière-plan ne bat qu'une fois par minute
  function prendreMain(s) {
    if (s.onglet && s.onglet !== ONGLET && Date.now() - (s.battement || 0) < BATTEMENT_MAX) return false;
    s.onglet = ONGLET; s.battement = Date.now(); sauver(s);
    return true;
  }
  setInterval(() => {
    const s = charger();
    if (s && s.enCours && s.onglet === ONGLET) { s.battement = Date.now(); sauver(s); }
  }, 20000);

  // Erreur qui ne concerne que ce pin (image) : on le saute au lieu de tout arrêter.
  // Ramène un instant dans la plage de publication : avant 9 h, au matin
  // même ; après 21 h, au lendemain. Heure de départ tirée entre 9 h et 11 h
  // pour ne pas publier chaque jour à la même minute.
  function dansPlage(t) {
    const d = new Date(t);
    if (d.getHours() >= HEURE_DEBUT && d.getHours() < HEURE_FIN) return t;
    if (d.getHours() >= HEURE_FIN) d.setDate(d.getDate() + 1);
    d.setHours(HEURE_DEBUT, rand(0, 119), rand(0, 59), 0);
    return d.getTime();
  }

  const erreurImage = msg => Object.assign(new Error(msg), { image: true });
  function incrQuota() {
    const q = getQuota();
    q.count++;
    localStorage.setItem(KEY_QUOTA, JSON.stringify(q));
    return q;
  }

  // ---------- CSRF Token ----------
  function getCsrfToken() {
    const m = document.cookie.match(/csrftoken=([^;]+)/);
    return m ? m[1] : '';
  }

  // ---------- API Pinterest (appels internes) ----------
  async function getBoards() {
    const csrf = getCsrfToken();
    // Récupérer l'username depuis la page
    const appEl = document.getElementById('__PWS_DATA__') || document.querySelector('[data-relay-response]');
    let username = '';

    // Méthode 0 : l'utilisateur connecté, dans le contexte que Pinterest injecte.
    // La méthode 1 seule prenait le premier "username" venu, qui sur une page
    // de pin ou de profil est souvent celui d'un autre compte.
    for (const id of ['__PWS_INITIAL_PROPS__', '__PWS_DATA__']) {
      try {
        const d = JSON.parse(document.getElementById(id)?.textContent || 'null');
        const u = d?.context?.user?.username || d?.props?.context?.user?.username || d?.initialReduxState?.viewer?.username;
        if (u) { username = u; break; }
      } catch (e) {}
    }

    // Méthode 1 : chercher dans les données de la page
    if (!username) try {
      const scripts = document.querySelectorAll('script[type="application/json"]');
      for (const s of scripts) {
        const d = JSON.parse(s.textContent);
        if (d && typeof d === 'object') {
          const str = JSON.stringify(d);
          const m = str.match(/"username"\s*:\s*"([^"]+)"/);
          if (m) { username = m[1]; break; }
        }
      }
    } catch (e) {}

    // Méthode 2 : chercher dans le header de profil
    if (!username) {
      const profLink = document.querySelector('a[href*="/settings/"], [data-test-id="header-profile"]');
      if (profLink) {
        const href = profLink.getAttribute('href') || '';
        const m = href.match(/\/([^/]+)\/?$/);
        if (m) username = m[1];
      }
    }

    // Méthode 3 : via l'API UserResource
    if (!username) {
      try {
        const resp = await fetch('/resource/UserResource/get/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-CSRFToken': csrf, 'X-Requested-With': 'XMLHttpRequest' },
          credentials: 'include',
          body: new URLSearchParams({
            source_url: '/',
            data: JSON.stringify({ options: { field_set_key: 'unauth' }, context: {} })
          })
        });
        const data = await resp.json();
        username = data?.resource_response?.data?.username || '';
      } catch (e) {}
    }

    if (!username) throw new Error('Impossible de détecter votre nom d\'utilisateur Pinterest. Connectez-vous d\'abord.');

    // Récupérer les tableaux, page par page : au-delà de 50 tableaux, ceux qui
    // n'avaient pas reçu de pin récemment passaient pour introuvables.
    const tous = [];
    let bookmark = null;
    for (let page = 0; page < 20; page++) {
      const resp = await fetch('/resource/BoardsResource/get/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-CSRFToken': csrf, 'X-Requested-With': 'XMLHttpRequest', 'X-APP-VERSION': 'unknown' },
        credentials: 'include',
        body: new URLSearchParams({
          source_url: `/${username}/`,
          data: JSON.stringify({
            options: {
              username: username,
              field_set_key: 'profile_grid_item',
              filter: 'all',
              sort: 'last_pinned_to',
              page_size: 50,
              ...(bookmark ? { bookmarks: [bookmark] } : {})
            },
            context: {}
          })
        })
      });
      if (!resp.ok) throw new Error(`Erreur API boards : ${resp.status}`);
      const data = await resp.json();
      tous.push(...(data?.resource_response?.data || []).map(b => ({ id: b.id, name: b.name, url: b.url })));
      bookmark = data?.resource_response?.bookmark || data?.resource?.options?.bookmarks?.[0];
      if (!bookmark || bookmark === '-end-') break;
    }
    return tous;
  }

  // Les sites d'images n'envoient presque jamais d'en-tête CORS : un fetch()
  // depuis pinterest.com échouait donc pour la plupart des images. Le
  // téléchargement passe par Tampermonkey, qui n'est pas soumis à CORS.
  function telechargerImage(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET', url, responseType: 'blob', timeout: 60000,
        onload: r => (r.status >= 200 && r.status < 300 && r.response)
          ? resolve(r.response)
          : reject(erreurImage(`Image inaccessible : ${r.status} — ${url}`)),
        onerror: () => reject(erreurImage(`Image inaccessible (réseau) — ${url}`)),
        ontimeout: () => reject(erreurImage(`Image inaccessible (délai dépassé) — ${url}`))
      });
    });
  }

  async function uploadImageFromUrl(imageUrl) {
    const csrf = getCsrfToken();

    // Télécharger l'image
    const blob = await telechargerImage(imageUrl);
    if (blob.type && !/^image\//.test(blob.type)) throw erreurImage(`Ce n'est pas une image (${blob.type}) — ${imageUrl}`);
    const ext = imageUrl.split('.').pop().split('?')[0].toLowerCase();
    const mimeMap = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp' };
    const mime = blob.type || mimeMap[ext] || 'image/jpeg';
    const filename = `pin_image.${ext || 'jpg'}`;

    // Upload via l'API Pinterest
    const formData = new FormData();
    formData.append('img', new File([blob], filename, { type: mime }));

    const resp = await fetch('/upload-image/?img_type=pin_image', {
      method: 'POST',
      headers: { 'X-CSRFToken': csrf, 'X-Requested-With': 'XMLHttpRequest' },
      credentials: 'include',
      body: formData
    });
    if (!resp.ok) {
      const txt = await resp.text();
      throw erreurImage(`Upload image échoué (${resp.status}) : ${txt.slice(0, 200)}`);
    }
    const data = await resp.json();
    if (!data.success) throw erreurImage('Upload image refusé par Pinterest : ' + JSON.stringify(data).slice(0, 200));
    return data.image_url; // URL interne Pinterest de l'image uploadée
  }

  async function createPin({ title, description, link, imageUrl, boardId, altText }) {
    const csrf = getCsrfToken();

    // D'abord uploader l'image. Si l'envoi échoue, on laisse Pinterest aller
    // chercher l'image lui-même à son URL publique (méthode « scraped »).
    let uploadedImageUrl = null;
    try { uploadedImageUrl = await uploadImageFromUrl(imageUrl); }
    catch (err) { if (!err.image) throw err; console.warn('[Auto-Pin] upload impossible, essai par URL :', err.message); }

    // Créer le pin
    const pinData = {
      options: {
        board_id: boardId,
        description: description || '',
        link: link || '',
        title: title || '',
        image_url: uploadedImageUrl || imageUrl,
        method: uploadedImageUrl ? 'uploaded' : 'scraped',
        ...(uploadedImageUrl ? { upload_metric: { source: 'pinner_upload_standalone' } } : {}),
        user_mention_tags: []
      },
      context: {}
    };

    if (altText) {
      pinData.options.alt_text = altText;
    }

    const resp = await fetch('/resource/PinResource/create/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-CSRFToken': csrf, 'X-Requested-With': 'XMLHttpRequest', 'X-APP-VERSION': 'unknown' },
      credentials: 'include',
      body: new URLSearchParams({
        source_url: '/pin-creation-tool/',
        data: JSON.stringify(pinData)
      })
    });

    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`Création pin échouée (${resp.status}) : ${txt.slice(0, 300)}`);
    }
    const data = await resp.json();
    if (data?.resource_response?.error) {
      throw new Error('Pinterest a refusé : ' + JSON.stringify(data.resource_response.error).slice(0, 300));
    }
    return data?.resource_response?.data?.id || 'ok';
  }

  // ---------- Parsing Excel ----------
  const pad = n => String(n).padStart(2, '0');
  function celluleEnTexte(v) {
    if (v === null || v === undefined) return '';
    if (v instanceof Date) return `${pad(v.getDate())}/${pad(v.getMonth() + 1)}/${v.getFullYear()}`;
    return String(v).replace(/[\t\r\n]+/g, ' ').trim();
  }

  function lireTableau(texte) {
    const erreurs = [];
    const lignes = texte.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const pins = [];
    lignes.forEach((l, n) => {
      const c = l.split(/\t/).map(x => x.trim());
      if (n === 0 && /titre/i.test(c[0])) return;
      const [titre, description, lien, imageUrl, tableau, altText] = c;
      if (!titre) { erreurs.push(`Ligne ${n + 1} : titre manquant`); return; }
      if (!imageUrl) { erreurs.push(`Ligne ${n + 1} : URL image manquante`); return; }
      if (!tableau) { erreurs.push(`Ligne ${n + 1} : nom du tableau manquant`); return; }
      if (!/^https?:\/\//i.test(imageUrl)) { erreurs.push(`Ligne ${n + 1} : URL image invalide « ${imageUrl.slice(0, 50)} »`); return; }
      if (lien && !/^https?:\/\//i.test(lien)) { erreurs.push(`Ligne ${n + 1} : lien invalide « ${lien.slice(0, 50)} »`); return; }
      // La ligne d'exemple du modèle Excel n'est pas marquée « exemple » : sans
      // ce garde-fou elle partait sur Pinterest comme un vrai pin.
      if (/monsite\.com/i.test(lien + imageUrl)) { erreurs.push(`Ligne ${n + 1} : ligne d'exemple du modèle (monsite.com), à supprimer`); return; }
      pins.push({ titre: (titre || '').slice(0, 100), description: (description || '').slice(0, 500), lien: lien || '', imageUrl, tableau, altText: altText || '' });
    });
    return { pins, erreurs };
  }

  // ---------- Interface ----------
  const css = `
  #pin-ap{position:fixed;right:18px;bottom:18px;z-index:99999;width:400px;background:#fff;border:1px solid #ddd;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,.18);font:13px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#333}
  #pin-ap header{background:#E60023;color:#fff;padding:12px 16px;border-radius:16px 16px 0 0;font-weight:700;display:flex;justify-content:space-between;cursor:pointer;font-size:14px}
  #pin-ap .b{padding:14px 16px}
  #pin-ap textarea{width:100%;height:70px;box-sizing:border-box;font:12px monospace;border:1px solid #ccc;border-radius:8px;padding:8px}
  #pin-ap .row{display:flex;gap:6px;margin-top:10px;flex-wrap:wrap}
  #pin-ap button{border:0;border-radius:24px;padding:8px 14px;cursor:pointer;font-weight:600;font-size:12px;transition:opacity .15s}
  #pin-ap .v{background:#E60023;color:#fff}#pin-ap .go{background:#2E7D32;color:#fff;flex:1}
  #pin-ap .st{background:#666;color:#fff}#pin-ap .jr{background:#EFEFEF;color:#333}
  #pin-ap button:disabled{opacity:.35;cursor:default}
  #pin-ap .quota{background:#FFF3CD;border:1px solid #FFD93D;border-radius:8px;padding:8px 10px;margin-bottom:10px;font-size:12px}
  #pin-ap .info{background:#E8F5E9;border:1px solid #81C784;border-radius:8px;padding:8px 10px;margin-bottom:10px;font-size:12px}
  #pin-ap-log{margin-top:10px;font-size:12px;white-space:pre-line;max-height:200px;overflow:auto;color:#555}
  #pin-ap .timer{background:#FFF8E1;border-radius:8px;padding:6px 10px;margin-top:8px;font-size:12px;display:none}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const panel = document.createElement('div');
  panel.id = 'pin-ap';
  const q = getQuota();
  panel.innerHTML = `
    <header><span>📌 Auto-Pin (${q.count}/${MAX_PAR_JOUR} aujourd'hui)</span><span id="pin-ap-min">–</span></header>
    <div class="b" id="pin-ap-body">
      <div class="quota" id="pin-ap-quota">📊 Quota du jour : <b>${q.count}</b> / ${MAX_PAR_JOUR} pins${q.count >= MAX_PAR_JOUR ? ' — <span style="color:#C62828">LIMITE ATTEINTE, reprenez demain</span>' : ''}</div>
      <div style="margin-bottom:6px"><b>1.</b> Chargez votre fichier Excel :</div>
      <input type="file" id="pin-ap-file" accept=".xlsx,.xls,.csv" style="width:100%;margin-bottom:8px">
      <div style="margin-bottom:6px;color:#888;font-size:11px">… ou collez (Titre ⇥ Description ⇥ Lien ⇥ Image URL ⇥ Tableau ⇥ Alt Text) :</div>
      <textarea id="pin-ap-txt" placeholder="Mon titre	Ma description	https://monsite.com	https://monsite.com/image.jpg	Nom du tableau	Alt text"></textarea>
      <div class="row">
        <button class="v" id="pin-ap-ver">Vérifier</button>
        <button class="go" id="pin-ap-go" disabled>Publier</button>
        <button class="st" id="pin-ap-stop" disabled>Arrêter</button>
      </div>
      <div class="timer" id="pin-ap-timer">⏳ Prochain pin dans : <b id="pin-ap-countdown">--:--</b></div>
      <div class="row"><button class="jr" id="pin-ap-jr">Journal CSV</button><button class="jr" id="pin-ap-raz">Réinitialiser</button></div>
      <div id="pin-ap-log"></div>
    </div>`;
  document.body.appendChild(panel);
  const $ = id => document.getElementById(id);
  $('pin-ap-min').onclick = () => { const b = $('pin-ap-body'); b.style.display = b.style.display === 'none' ? '' : 'none'; };
  const log = t => { $('pin-ap-log').textContent = t; };

  function majQuotaUI() {
    const q = getQuota();
    $('pin-ap-quota').innerHTML = `📊 Quota du jour : <b>${q.count}</b> / ${MAX_PAR_JOUR} pins${q.count >= MAX_PAR_JOUR ? ' — <span style="color:#C62828">LIMITE ATTEINTE, reprenez demain</span>' : ''}`;
    const hdr = panel.querySelector('header span:first-child');
    if (hdr) hdr.textContent = `📌 Auto-Pin (${q.count}/${MAX_PAR_JOUR} aujourd'hui)`;
  }

  let plan = null;
  let boards = null;

  function majBoutons() {
    const s = charger();
    const enCours = !!(s && s.enCours);
    const aReprendre = !!(s && s.pins && s.i < s.pins.length);
    $('pin-ap-go').disabled = enCours || !(plan || aReprendre) || getQuota().count >= MAX_PAR_JOUR;
    $('pin-ap-go').textContent = !plan && aReprendre ? `Reprendre (${s.i}/${s.pins.length})` : 'Publier';
    $('pin-ap-ver').disabled = enCours;
    $('pin-ap-txt').disabled = enCours;
    $('pin-ap-file').disabled = enCours;
    $('pin-ap-stop').disabled = !enCours;
    $('pin-ap-jr').disabled = !chargerJournal().length;
  }

  // ---------- Import Excel ----------
  $('pin-ap-file').onchange = async e => {
    const f = e.target.files[0]; if (!f) return;
    if (typeof XLSX === 'undefined') { log('❌ Lecteur Excel non chargé.'); return; }
    try {
      const wb = XLSX.read(await f.arrayBuffer(), { type: 'array', cellDates: true });
      const nom = wb.SheetNames.find(n => /pin/i.test(n)) || wb.SheetNames[0];
      const lignes = XLSX.utils.sheet_to_json(wb.Sheets[nom], { header: 1, raw: true, blankrows: false });
      const texte = lignes
        .map(r => [0, 1, 2, 3, 4, 5].map(i => celluleEnTexte(r[i])))
        .filter(r => r.some(Boolean) && !/exemple/i.test(r[0]))
        .map(r => r.join('\t')).join('\n');
      $('pin-ap-txt').value = texte;
      log(`Fichier « ${f.name} » chargé.`);
      $('pin-ap-ver').click();
    } catch (err) { log('❌ ' + err.message); }
    e.target.value = '';
  };

  // ---------- Vérification ----------
  $('pin-ap-ver').onclick = async () => {
    $('pin-ap-ver').disabled = true;
    log('Vérification en cours…');

    const { pins, erreurs } = lireTableau($('pin-ap-txt').value);
    if (erreurs.length) { plan = null; log('❌ À corriger :\n' + erreurs.slice(0, 15).join('\n')); majBoutons(); return; }
    if (!pins.length) { plan = null; log('Aucune ligne trouvée.'); majBoutons(); return; }

    // Charger les tableaux Pinterest
    try {
      log('Chargement de vos tableaux Pinterest…');
      boards = await getBoards();
      if (!boards.length) { plan = null; log('❌ Aucun tableau trouvé. Créez au moins un tableau sur Pinterest.'); majBoutons(); return; }
    } catch (err) {
      plan = null; log('❌ ' + err.message); majBoutons(); return;
    }

    // Vérifier que chaque tableau demandé existe
    const introuvables = [];
    pins.forEach((p, i) => {
      const found = boards.find(b => b.name.toLowerCase().trim() === p.tableau.toLowerCase().trim());
      if (found) {
        p.boardId = found.id;
        p.boardName = found.name;
      } else {
        introuvables.push(`Ligne ${i + 1} : tableau « ${p.tableau} » introuvable`);
      }
    });

    if (introuvables.length) {
      plan = null;
      const noms = boards.map(b => `  • ${b.name}`).join('\n');
      log('❌ Tableaux introuvables :\n' + introuvables.join('\n') + '\n\nTableaux disponibles :\n' + noms);
      majBoutons(); return;
    }

    plan = pins;
    const q = getQuota();
    const resteDuJour = MAX_PAR_JOUR - q.count;
    const aPublier = Math.min(pins.length, resteDuJour);
    const tempsEstime = aPublier > 1 ? `étalés sur la journée, ${Math.round((DELAI_MIN + DELAI_MAX) / 120000)} min en moyenne entre deux` : 'immédiat';

    log(`✅ ${pins.length} pin(s) prêt(s).\n` +
      `📊 Quota restant aujourd'hui : ${resteDuJour}\n` +
      `➡️ ${aPublier} pin(s) seront publiés maintenant (les autres demain)\n` +
      `⏱️ Rythme : ${tempsEstime}, de ${HEURE_DEBUT} h à ${HEURE_FIN} h\n\n` +
      pins.slice(0, 8).map(p => `• ${p.titre.slice(0, 35)} → ${p.boardName}`).join('\n') +
      (pins.length > 8 ? `\n… et ${pins.length - 8} autres` : '') +
      '\n\nCliquez « Publier » pour lancer.');
    majBoutons();
  };

  // ---------- Lancement / arrêt ----------
  // Clé d'un pin : sert à ne pas republier ce que le journal marque déjà OK.
  const cle = p => `${p.imageUrl}|${(p.boardName || p.tableau || '').toLowerCase()}`;

  $('pin-ap-go').onclick = () => {
    if (getQuota().count >= MAX_PAR_JOUR) return;
    const ancien = charger();
    if (ancien && ancien.enCours && ancien.onglet && ancien.onglet !== ONGLET && Date.now() - (ancien.battement || 0) < BATTEMENT_MAX) {
      log('⚠️ Un autre onglet Pinterest publie déjà. Fermez-le ou attendez qu\'il termine.'); return;
    }
    // Reprise : une file inachevée (quota atteint hier, arrêt manuel) repart
    // où elle s'était arrêtée. Avant, « Publier » repartait de zéro et
    // republiait en double les pins de la veille.
    if (ancien && ancien.pins && ancien.i < ancien.pins.length && (!plan || plan.every((p, k) => ancien.pins[k] && cle(ancien.pins[k]) === cle(p)))) {
      ancien.enCours = true; ancien.prochainA = 0; ancien.onglet = ONGLET; ancien.battement = Date.now();
      sauver(ancien);
    } else {
      if (!plan) return;
      sauver({ enCours: true, pins: plan, i: 0, debut: new Date().toISOString(), onglet: ONGLET, battement: Date.now() });
    }
    majBoutons();
    publier();
  };

  $('pin-ap-stop').onclick = () => {
    const s = charger();
    if (s) { s.enCours = false; s.onglet = null; sauver(s); }
    $('pin-ap-timer').style.display = 'none';
    log('⏹ Arrêté. Les pins restants peuvent être repris en relançant.');
    majBoutons();
  };

  $('pin-ap-raz').onclick = () => {
    effacer(); plan = null; boards = null;
    $('pin-ap-timer').style.display = 'none';
    log('Réinitialisé.');
    majBoutons();
  };

  // ---------- Export journal ----------
  $('pin-ap-jr').onclick = () => {
    const journal = chargerJournal(); if (!journal.length) return;
    const esc = v => `"${String(v).replace(/"/g, '""')}"`;
    const csv = '﻿' + ['Titre;Tableau;Lien;Statut;Pin ID;Horodatage'].concat(
      journal.map(j => [j.titre, j.tableau, j.lien, j.statut, j.pinId, j.le].map(esc).join(';'))).join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = `journal_pins_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
  };

  // ---------- Compte à rebours ----------
  let timerInterval = null;
  function startCountdown(ms) {
    $('pin-ap-timer').style.display = 'block';
    const fin = Date.now() + ms;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      const rest = Math.max(0, fin - Date.now());
      const h = Math.floor(rest / 3600000);
      const min = Math.floor((rest % 3600000) / 60000);
      const sec = Math.floor((rest % 60000) / 1000);
      $('pin-ap-countdown').textContent = h ? `${h} h ${String(min).padStart(2, '0')}` : `${min}:${String(sec).padStart(2, '0')}`;
      if (rest <= 0) { clearInterval(timerInterval); $('pin-ap-timer').style.display = 'none'; }
    }, 1000);
  }

  // ---------- Publication ----------
  // Enregistre l'avancement sans écraser un « Arrêter » cliqué pendant l'envoi :
  // la copie en mémoire gardait enCours = true et annulait l'arrêt.
  function enregistrer(s) {
    const disque = charger();
    if (disque && !disque.enCours) s.enCours = false;
    s.battement = Date.now();
    sauver(s);
  }

  async function publier() {
    const s = charger();
    if (!s || !s.enCours) return;
    if (!prendreMain(s)) {
      // L'autre onglet a peut-être été fermé : on retente quand son verrou expire.
      log('⏸ Un autre onglet Pinterest publie déjà cette file. Reprise ici automatique s\'il est fermé.');
      majBoutons();
      setTimeout(publier, BATTEMENT_MAX);
      return;
    }

    while (s.i < s.pins.length) {
      if (!charger()?.enCours) break;

      // Délai anti-spam restant : enregistré, il survit à un rechargement de
      // page. Avant, recharger relançait le pin suivant au bout de 2 s.
      s.prochainA = dansPlage(Math.max(s.prochainA || 0, Date.now()));
      const attente = s.prochainA - Date.now();
      if (attente > 0) {
        const quand = attente > 60 * 60 * 1000
          ? `${new Date(s.prochainA).toDateString() === new Date().toDateString() ? 'aujourd\'hui' : 'demain'} à ${new Date(s.prochainA).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}. Laissez l'onglet ouvert et le PC allumé, sans mise en veille`
          : `dans ~${Math.ceil(attente / 60000)} min (délai anti-spam)`;
        log(`⏳ Prochain pin (${s.i + 1}/${s.pins.length}) ${quand}…`);
        startCountdown(attente);
        // Attente par tranches d'une minute, contrôlée sur l'horloge : un long
        // setTimeout dérive si l'onglet est mis en sommeil ou le PC en veille.
        while (Date.now() < s.prochainA && charger()?.enCours) await sleep(Math.min(60000, s.prochainA - Date.now()));
        $('pin-ap-timer').style.display = 'none';
        if (!charger()?.enCours) break;
      }

      // Vérifier le quota
      const q = getQuota();
      if (q.count >= MAX_PAR_JOUR) {
        // Quota atteint : la file reste active et repart d'elle-même le
        // lendemain, à une heure tirée au hasard entre 9 h et 11 h, si l'onglet
        // est resté ouvert. Avant, il fallait revenir cliquer « Reprendre ».
        const demain = new Date(); demain.setDate(demain.getDate() + 1); demain.setHours(0, 0, 0, 0);
        s.prochainA = dansPlage(demain.getTime());
        enregistrer(s);
        majQuotaUI();
        log(`📊 Limite de ${MAX_PAR_JOUR} pins atteinte pour aujourd'hui.\n${s.pins.length - s.i} pin(s) restant(s).`);
        continue;
      }

      const p = s.pins[s.i];

      // Déjà publié (relance d'un même fichier) : on saute sans consommer de quota.
      if (chargerJournal().some(j => j.statut === 'OK' && j.cle === cle(p))) {
        log(`↷ Pin ${s.i + 1} déjà publié d'après le journal, ignoré.`);
        s.i++; enregistrer(s);
        continue;
      }

      log(`⏳ Pin ${s.i + 1}/${s.pins.length} — « ${p.titre.slice(0, 40)} » → ${p.boardName}\nUpload de l'image…`);

      try {
        const pinId = await createPin({
          title: p.titre,
          description: p.description,
          link: p.lien,
          imageUrl: p.imageUrl,
          boardId: p.boardId,
          altText: p.altText
        });

        const journal = chargerJournal();
        journal.push({ titre: p.titre, tableau: p.boardName, lien: p.lien, statut: 'OK', pinId: pinId, le: new Date().toLocaleString('fr-FR'), cle: cle(p) });
        sauverJournal(journal);
        incrQuota();
        majQuotaUI();

        s.i++;
        s.prochainA = dansPlage(Date.now() + rand(DELAI_MIN, DELAI_MAX));
        enregistrer(s);
        log(`✅ Pin ${s.i}/${s.pins.length} publié — « ${p.titre.slice(0, 40)} »`);

      } catch (err) {
        const journal = chargerJournal();
        journal.push({ titre: p.titre, tableau: p.boardName, lien: p.lien, statut: 'ERREUR', pinId: err.message.slice(0, 100), le: new Date().toLocaleString('fr-FR'), cle: cle(p) });
        sauverJournal(journal);

        // Image introuvable : seul ce pin est en cause, on passe au suivant.
        // Avant, le test portait sur le texte du message, et un refus de
        // Pinterest qui citait « image_url » faisait continuer au lieu d'arrêter.
        if (err.image) {
          log(`⚠️ Pin ${s.i + 1} — Image inaccessible, pin ignoré :\n${err.message.slice(0, 150)}`);
          s.i++; enregistrer(s);
          await sleep(5000);
          continue;
        }

        // Sinon, arrêter (possible rate limit ou ban temporaire)
        s.enCours = false; s.onglet = null; sauver(s);
        $('pin-ap-timer').style.display = 'none';
        log(`❌ Erreur sur le pin ${s.i + 1} :\n${err.message.slice(0, 300)}\n\nArrêt par sécurité. Attendez quelques heures puis cliquez « Reprendre ».`);
        majBoutons();
        return;
      }
    }

    const s2 = charger();
    $('pin-ap-timer').style.display = 'none';
    if (s2 && !s2.enCours) { majQuotaUI(); majBoutons(); return; } // arrêté à la main
    if (s2) { s2.enCours = false; s2.onglet = null; sauver(s2); }
    log(`✅ Terminé ! ${s.pins.length} pin(s) traités.\nExportez le journal pour contrôle.`);
    majQuotaUI(); majBoutons();
  }

  // ---------- Reprise au chargement ----------
  const s0 = charger();
  if (s0 && s0.enCours) {
    log(`Reprise en cours… ${s0.i}/${s0.pins.length} pins traités.`);
    setTimeout(publier, 2000);
  } else if (s0 && s0.pins && s0.i < s0.pins.length) {
    log(`File en attente : ${s0.i}/${s0.pins.length} pins traités. Cliquez « Reprendre » pour continuer.`);
  } else {
    const journal = chargerJournal();
    if (journal.length) log(`Dernier journal : ${journal.length} pin(s). Cliquez « Journal CSV » pour exporter.`);
  }
  majBoutons();
})();
