// ==UserScript==
// @name         Pinterest - Publication automatique de pins
// @namespace    baddane.tools
// @version      1.0
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @description  Publie des pins automatiquement depuis un fichier Excel (max 10/jour), avec délais aléatoires pour éviter le bannissement.
// @match        https://www.pinterest.com/*
// @match        https://pinterest.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

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
- Maximum 10 pins par jour (compteur réinitialisé à minuit)
- Délai aléatoire de 3 à 8 minutes entre chaque pin
- Pause automatique si Pinterest retourne une erreur
*/

(function () {
  'use strict';

  const KEY = 'pin-auto-etat';
  const KEY_JOURNAL = 'pin-auto-journal';
  const KEY_QUOTA = 'pin-auto-quota';
  const MAX_PAR_JOUR = 10;
  const DELAI_MIN = 3 * 60 * 1000; // 3 min
  const DELAI_MAX = 8 * 60 * 1000; // 8 min
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

  // ---------- État persistant ----------
  const charger = () => { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; } };
  const sauver = s => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} };
  const effacer = () => { try { localStorage.removeItem(KEY); } catch (e) {} };
  const chargerJournal = () => { try { return JSON.parse(localStorage.getItem(KEY_JOURNAL)) || []; } catch (e) { return []; } };
  const sauverJournal = j => { try { localStorage.setItem(KEY_JOURNAL, JSON.stringify(j)); } catch (e) {} };

  // ---------- Quota journalier ----------
  function getQuota() {
    try {
      const q = JSON.parse(localStorage.getItem(KEY_QUOTA)) || {};
      const aujourdhui = new Date().toISOString().slice(0, 10);
      if (q.date !== aujourdhui) return { date: aujourdhui, count: 0 };
      return q;
    } catch (e) { return { date: new Date().toISOString().slice(0, 10), count: 0 }; }
  }
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

    // Méthode 1 : chercher dans les données de la page
    try {
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

    // Récupérer les tableaux
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
            page_size: 50
          },
          context: {}
        })
      })
    });
    if (!resp.ok) throw new Error(`Erreur API boards : ${resp.status}`);
    const data = await resp.json();
    return (data?.resource_response?.data || []).map(b => ({ id: b.id, name: b.name, url: b.url }));
  }

  async function uploadImageFromUrl(imageUrl) {
    const csrf = getCsrfToken();

    // Télécharger l'image
    const imgResp = await fetch(imageUrl, { mode: 'cors' });
    if (!imgResp.ok) throw new Error(`Image inaccessible : ${imgResp.status} — ${imageUrl}`);
    const blob = await imgResp.blob();
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
      throw new Error(`Upload image échoué (${resp.status}) : ${txt.slice(0, 200)}`);
    }
    const data = await resp.json();
    if (!data.success) throw new Error('Upload image refusé par Pinterest : ' + JSON.stringify(data).slice(0, 200));
    return data.image_url; // URL interne Pinterest de l'image uploadée
  }

  async function createPin({ title, description, link, imageUrl, boardId, altText }) {
    const csrf = getCsrfToken();

    // D'abord uploader l'image
    const uploadedImageUrl = await uploadImageFromUrl(imageUrl);

    // Créer le pin
    const pinData = {
      options: {
        board_id: boardId,
        description: description || '',
        link: link || '',
        title: title || '',
        image_url: uploadedImageUrl,
        method: 'uploaded',
        upload_metric: { source: 'pinner_upload_standalone' },
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
    $('pin-ap-go').disabled = enCours || !plan || getQuota().count >= MAX_PAR_JOUR;
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
    const tempsEstime = aPublier > 1 ? `${Math.round(aPublier * 5.5)} min environ` : '< 1 min';

    log(`✅ ${pins.length} pin(s) prêt(s).\n` +
      `📊 Quota restant aujourd'hui : ${resteDuJour}\n` +
      `➡️ ${aPublier} pin(s) seront publiés maintenant (les autres demain)\n` +
      `⏱️ Durée estimée : ${tempsEstime}\n\n` +
      pins.slice(0, 8).map(p => `• ${p.titre.slice(0, 35)} → ${p.boardName}`).join('\n') +
      (pins.length > 8 ? `\n… et ${pins.length - 8} autres` : '') +
      '\n\nCliquez « Publier » pour lancer.');
    majBoutons();
  };

  // ---------- Lancement / arrêt ----------
  $('pin-ap-go').onclick = () => {
    if (!plan || getQuota().count >= MAX_PAR_JOUR) return;
    sauver({ enCours: true, pins: plan, i: 0, debut: new Date().toISOString() });
    majBoutons();
    publier();
  };

  $('pin-ap-stop').onclick = () => {
    const s = charger();
    if (s) { s.enCours = false; sauver(s); }
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
      const min = Math.floor(rest / 60000);
      const sec = Math.floor((rest % 60000) / 1000);
      $('pin-ap-countdown').textContent = `${min}:${String(sec).padStart(2, '0')}`;
      if (rest <= 0) { clearInterval(timerInterval); $('pin-ap-timer').style.display = 'none'; }
    }, 1000);
  }

  // ---------- Publication ----------
  async function publier() {
    const s = charger();
    if (!s || !s.enCours) return;

    while (s.i < s.pins.length) {
      if (!charger()?.enCours) break;

      // Vérifier le quota
      const q = getQuota();
      if (q.count >= MAX_PAR_JOUR) {
        s.enCours = false; sauver(s);
        $('pin-ap-timer').style.display = 'none';
        log(`📊 Limite de ${MAX_PAR_JOUR} pins atteinte pour aujourd'hui.\n${s.pins.length - s.i} pin(s) restant(s) à publier demain.\n\nRelancez le script demain — il reprendra où il s'est arrêté.`);
        majQuotaUI(); majBoutons();
        return;
      }

      const p = s.pins[s.i];
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
        journal.push({ titre: p.titre, tableau: p.boardName, lien: p.lien, statut: 'OK', pinId: pinId, le: new Date().toLocaleString('fr-FR') });
        sauverJournal(journal);
        incrQuota();
        majQuotaUI();

        s.i++; sauver(s);
        log(`✅ Pin ${s.i}/${s.pins.length} publié — « ${p.titre.slice(0, 40)} »`);

      } catch (err) {
        const journal = chargerJournal();
        journal.push({ titre: p.titre, tableau: p.boardName, lien: p.lien, statut: 'ERREUR', pinId: err.message.slice(0, 100), le: new Date().toLocaleString('fr-FR') });
        sauverJournal(journal);

        // Si c'est une erreur d'image (CORS, 404, etc.), passer au suivant
        if (/image|upload|inaccessible|cors/i.test(err.message)) {
          log(`⚠️ Pin ${s.i + 1} — Image inaccessible, pin ignoré :\n${err.message.slice(0, 150)}`);
          s.i++; sauver(s);
          await sleep(5000);
          continue;
        }

        // Sinon, arrêter (possible rate limit ou ban temporaire)
        s.enCours = false; sauver(s);
        $('pin-ap-timer').style.display = 'none';
        log(`❌ Erreur sur le pin ${s.i + 1} :\n${err.message.slice(0, 300)}\n\nArrêt par sécurité. Attendez quelques minutes puis relancez.`);
        majBoutons();
        return;
      }

      // S'il reste des pins, attendre un délai aléatoire
      if (s.i < s.pins.length && charger()?.enCours) {
        const delai = rand(DELAI_MIN, DELAI_MAX);
        const min = Math.round(delai / 60000);
        log(`✅ Pin ${s.i}/${s.pins.length} publié.\n⏳ Prochain dans ~${min} min (délai anti-spam)…`);
        startCountdown(delai);
        await sleep(delai);
        $('pin-ap-timer').style.display = 'none';
      }
    }

    // Tous terminés
    const s2 = charger();
    if (s2) { s2.enCours = false; sauver(s2); }
    $('pin-ap-timer').style.display = 'none';
    log(`✅ Terminé ! ${s.i} pin(s) publiés.\nExportez le journal pour contrôle.`);
    majQuotaUI(); majBoutons();
  }

  // ---------- Reprise au chargement ----------
  const s0 = charger();
  if (s0 && s0.enCours) {
    log(`Reprise en cours… ${s0.i}/${s0.pins.length} pins traités.`);
    setTimeout(publier, 2000);
  } else {
    const journal = chargerJournal();
    if (journal.length) log(`Dernier journal : ${journal.length} pin(s). Cliquez « Journal CSV » pour exporter.`);
  }
  majBoutons();
})();
