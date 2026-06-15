/* =====================================================
   DAILYALERTS — APP.JS
   LocalStorage + Notificações + Som + Vibração + PWA
   ===================================================== */

(function () {
  'use strict';

  // ===== SVG ICONS =====
  const ICONS = {
    notifications_active: '<svg viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>',
    dark_mode: '<svg viewBox="0 0 24 24"><path d="M9 2c-1.05 0-2.05.16-3 .46 4.06 1.27 7 5.06 7 9.54 0 4.48-2.94 8.27-7 9.54.95.3 1.95.46 3 .46 5.52 0 10-4.48 10-10S14.52 2 9 2z"/></svg>',
    light_mode: '<svg viewBox="0 0 24 24"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/></svg>',
    water_drop: '<svg viewBox="0 0 24 24"><path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zm0 18c-3.35 0-6-2.57-6-6.2 0-2.34 1.95-5.44 6-9.14 4.05 3.7 6 6.79 6 9.14 0 3.63-2.65 6.2-6 6.2z"/></svg>',
    medication: '<svg viewBox="0 0 24 24"><path d="M6 3h12v2H6V3zm11 3H7c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-1 9h-2.5v2.5h-3V15H8v-3h2.5V9.5h3V12H16v3z"/></svg>',
    add: '<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>',
    check_circle: '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
    add_alarm: '<svg viewBox="0 0 24 24"><path d="M7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM12 4c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm1-11h-2v3H8v2h3v3h2v-3h3v-2h-3V9z"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
    home: '<svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>',
    settings: '<svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L3.16 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.58 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>',
    add_circle: '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>',
    delete: '<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>',
    info: '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
    warning: '<svg viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>',
    download: '<svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>',
  };

  function injectIcons() {
    document.querySelectorAll('.material-icons-round').forEach(el => {
      const name = el.textContent.trim();
      if (ICONS[name]) {
        el.innerHTML = ICONS[name];
      }
    });
  }

  // ===== AUDIO ENGINE (Web Audio API) =====
  let audioCtx = null;

  function getAudioCtx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playAlertSound(type) {
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;

      if (type === 'medicine') {
        // Medicine: two-tone chime
        playTone(ctx, 880, now, 0.15, 'sine');
        playTone(ctx, 1100, now + 0.15, 0.15, 'sine');
        playTone(ctx, 880, now + 0.3, 0.2, 'sine');
      } else {
        // Water: gentle bell
        playTone(ctx, 660, now, 0.2, 'sine');
        playTone(ctx, 880, now + 0.12, 0.15, 'sine');
        playTone(ctx, 1100, now + 0.24, 0.3, 'sine');
      }
    } catch (e) {
      console.warn('Audio not available:', e);
    }
  }

  function playTone(ctx, freq, start, dur, type) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.3, start + 0.02);
    gain.gain.linearRampToValueAtTime(0.3, start + dur * 0.7);
    gain.gain.linearRampToValueAtTime(0, start + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + dur + 0.05);
  }

  // ===== VIBRATION =====
  function vibrate(pattern) {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }

  // ===== STORAGE KEYS =====
  const KEYS = {
    WATER_ALERTS: 'da_water_alerts',
    MEDICINE_ALERTS: 'da_medicine_alerts',
    WATER_HISTORY: 'da_water_history',
    MEDICINE_HISTORY: 'da_medicine_history',
    WATER_GOAL: 'da_water_goal',
    THEME: 'da_theme',
    LAST_NOTIFIED: 'da_last_notified',
  };

  // ===== STATE =====
  let state = {
    waterAlerts: [],
    medicineAlerts: [],
    waterHistory: [],
    medicineHistory: [],
    waterGoal: 2000,
    isDark: false,
  };

  // Track which alerts fired today: { "alertIndex": "HH:MM" }
  let notifiedToday = {};

  // ===== INIT =====
  function init() {
    loadState();
    renderAll();
    bindEvents();
    initTheme();
    requestNotificationPermission();
    startAlertChecker();
    resetNotifiedAtMidnight();
    injectIcons();

    // PWA install
    setupPWAInstall();
  }

  // ===== PWA INSTALL =====
  let deferredPrompt = null;
  function setupPWAInstall() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      showInstallBanner();
    });

    window.addEventListener('appinstalled', () => {
      deferredPrompt = null;
      hideInstallBanner();
      showToast('DailyAlerts instalado! 🎉', 'success');
    });
  }

  function showInstallBanner() {
    if (document.getElementById('pwaInstallBanner')) return;
    const banner = document.createElement('div');
    banner.id = 'pwaInstallBanner';
    banner.className = 'pwa-install-banner';
    banner.innerHTML = `
      <div class="pwa-install-content">
        <span class="material-icons-round">download</span>
        <div class="pwa-install-text">
          <strong>Instalar DailyAlerts</strong>
          <span>Adicione à tela inicial para alertas mais rápidos</span>
        </div>
        <button class="btn btn-sm btn-primary" id="pwaInstallBtn">Instalar</button>
        <button class="btn btn-sm btn-icon" id="pwaDismissBtn" aria-label="Fechar">
          <span class="material-icons-round">close</span>
        </button>
      </div>`;
    document.body.appendChild(banner);

    // Inject the icon
    setTimeout(() => {
      banner.querySelectorAll('.material-icons-round').forEach(el => {
        const name = el.textContent.trim();
        if (ICONS[name]) el.innerHTML = ICONS[name];
      });
    }, 0);

    document.getElementById('pwaInstallBtn').addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === 'accepted') {
        hideInstallBanner();
      }
      deferredPrompt = null;
    });

    document.getElementById('pwaDismissBtn').addEventListener('click', () => {
      hideInstallBanner();
      // Don't show again for 7 days
      localStorage.setItem('pa_dismissed', Date.now().toString());
    });

    // Don't show if dismissed in last 7 days
    const dismissed = localStorage.getItem('pa_dismissed');
    if (dismissed && Date.now() - parseInt(dismissed, 10) < 7 * 24 * 3600 * 1000) {
      banner.remove();
    }
  }

  function hideInstallBanner() {
    const banner = document.getElementById('pwaInstallBanner');
    if (banner) banner.remove();
  }

  // ===== LOAD / SAVE =====
  function loadState() {
    try {
      state.waterAlerts = JSON.parse(localStorage.getItem(KEYS.WATER_ALERTS) || '[]');
      state.medicineAlerts = JSON.parse(localStorage.getItem(KEYS.MEDICINE_ALERTS) || '[]');
      state.waterHistory = JSON.parse(localStorage.getItem(KEYS.WATER_HISTORY) || '[]');
      state.medicineHistory = JSON.parse(localStorage.getItem(KEYS.MEDICINE_HISTORY) || '[]');
      state.waterGoal = parseInt(localStorage.getItem(KEYS.WATER_GOAL) || '2000', 10);
      state.isDark = localStorage.getItem(KEYS.THEME) === 'dark';
      notifiedToday = JSON.parse(localStorage.getItem(KEYS.LAST_NOTIFIED) || '{}');
    } catch (e) {
      console.error('Error loading state:', e);
    }
  }

  function saveState() {
    localStorage.setItem(KEYS.WATER_ALERTS, JSON.stringify(state.waterAlerts));
    localStorage.setItem(KEYS.MEDICINE_ALERTS, JSON.stringify(state.medicineAlerts));
    localStorage.setItem(KEYS.WATER_HISTORY, JSON.stringify(state.waterHistory));
    localStorage.setItem(KEYS.MEDICINE_HISTORY, JSON.stringify(state.medicineHistory));
    localStorage.setItem(KEYS.WATER_GOAL, state.waterGoal.toString());
    localStorage.setItem(KEYS.LAST_NOTIFIED, JSON.stringify(notifiedToday));
  }

  // ===== RENDER =====
  function renderAll() {
    renderGreeting();
    renderStats();
    renderWaterAlerts();
    renderMedicineAlerts();
    renderWaterHistory();
    renderMedicineHistory();
    renderWaterGoal();
    injectIcons();
  }

  function renderGreeting() {
    const h = new Date().getHours();
    let greeting, emoji;
    if (h < 12) { greeting = 'Bom dia'; emoji = '☀️'; }
    else if (h < 18) { greeting = 'Boa tarde'; emoji = '🌤️'; }
    else { greeting = 'Boa noite'; emoji = '🌙'; }
    document.getElementById('greetingText').textContent = `${greeting}! ${emoji}`;
  }

  function renderStats() {
    const today = getTodayKey();
    const waterToday = state.waterHistory
      .filter(h => h.date === today)
      .reduce((sum, h) => sum + h.amount, 0);
    const waterPct = Math.min(100, Math.round((waterToday / state.waterGoal) * 100));

    document.getElementById('waterCount').textContent = `${waterToday}ml`;
    document.getElementById('waterProgress').style.width = `${waterPct}%`;

    const medTotal = state.medicineAlerts.filter(a => a.enabled).length;
    const medTaken = state.medicineHistory.filter(h => h.date === today).length;
    const medPct = medTotal > 0 ? Math.min(100, Math.round((medTaken / medTotal) * 100)) : 0;

    document.getElementById('medicineCount').textContent = `${medTaken}/${medTotal}`;
    document.getElementById('medicineProgress').style.width = `${medPct}%`;
  }

  function renderWaterAlerts() {
    const list = document.getElementById('waterAlertList');
    if (state.waterAlerts.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <span class="material-icons-round">water_drop</span>
          <p>Nenhum alerta de água configurado</p>
        </div>`;
      return;
    }
    list.innerHTML = state.waterAlerts.map((a, i) => `
      <div class="alert-item">
        <span class="alert-time">${a.time}</span>
        <div class="alert-info">
          <div class="alert-name">${a.amount}ml</div>
          <div class="alert-detail">${a.message} · ${formatDays(a.days)}</div>
        </div>
        <label class="alert-toggle">
          <input type="checkbox" ${a.enabled ? 'checked' : ''} onchange="window._da.toggleWaterAlert(${i})">
          <span class="slider"></span>
        </label>
        <button class="alert-delete" onclick="window._da.deleteWaterAlert(${i})" aria-label="Excluir">
          <span class="material-icons-round">delete</span>
        </button>
      </div>
    `).join('');
  }

  function renderMedicineAlerts() {
    const list = document.getElementById('medicineAlertList');
    if (state.medicineAlerts.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <span class="material-icons-round">medication</span>
          <p>Nenhum remédio configurado</p>
        </div>`;
      return;
    }
    list.innerHTML = state.medicineAlerts.map((a, i) => `
      <div class="alert-item">
        <span class="alert-time">${a.time}</span>
        <div class="alert-info">
          <div class="alert-name">${a.name}</div>
          <div class="alert-detail">${a.dosage} · ${formatDays(a.days)}</div>
        </div>
        <label class="alert-toggle">
          <input type="checkbox" ${a.enabled ? 'checked' : ''} onchange="window._da.toggleMedicineAlert(${i})">
          <span class="slider"></span>
        </label>
        <button class="alert-delete" onclick="window._da.deleteMedicineAlert(${i})" aria-label="Excluir">
          <span class="material-icons-round">delete</span>
        </button>
      </div>
    `).join('');
  }

  function renderWaterHistory() {
    const list = document.getElementById('waterHistoryList');
    const today = getTodayKey();
    const todayHistory = state.waterHistory.filter(h => h.date === today);

    if (todayHistory.length === 0) {
      list.innerHTML = `<div class="empty-state"><p>Nenhum registro hoje</p></div>`;
      return;
    }
    list.innerHTML = todayHistory.map(h => `
      <div class="history-item">
        <div class="history-icon water">
          <span class="material-icons-round">water_drop</span>
        </div>
        <div class="history-info">
          <div class="history-name">${h.amount}ml de água</div>
          <div class="history-time">${h.time}</div>
        </div>
        <span class="history-amount">+${h.amount}ml</span>
      </div>
    `).join('');
  }

  function renderMedicineHistory() {
    const list = document.getElementById('medicineHistoryList');
    const today = getTodayKey();
    const todayHistory = state.medicineHistory.filter(h => h.date === today);

    if (todayHistory.length === 0) {
      list.innerHTML = `<div class="empty-state"><p>Nenhum remédio registrado hoje</p></div>`;
      return;
    }
    list.innerHTML = todayHistory.map(h => `
      <div class="history-item">
        <div class="history-icon medicine">
          <span class="material-icons-round">medication</span>
        </div>
        <div class="history-info">
          <div class="history-name">${h.name}</div>
          <div class="history-time">${h.time} · ${h.dosage}</div>
        </div>
        <span class="history-amount" style="color: var(--accent-500)">✓</span>
      </div>
    `).join('');
  }

  function renderWaterGoal() {
    const slider = document.getElementById('waterGoalSlider');
    const display = document.getElementById('waterGoalDisplay');
    if (slider) slider.value = state.waterGoal;
    if (display) display.textContent = `${state.waterGoal}ml`;
  }

  // ===== EVENTS =====
  function bindEvents() {
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => handleNav(item.dataset.nav));
    });

    document.getElementById('addWaterBtn').addEventListener('click', () => openModal('quickWaterModal'));
    document.getElementById('takeMedicineBtn').addEventListener('click', openMedicineHistory);

    document.getElementById('addWaterAlertBtn').addEventListener('click', () => openModal('waterAlertModal'));
    document.getElementById('addMedicineAlertBtn').addEventListener('click', () => openModal('medicineAlertModal'));

    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => closeModal(btn.dataset.close));
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal(overlay.id);
      });
    });

    document.querySelectorAll('.day-btn').forEach(btn => {
      btn.addEventListener('click', () => btn.classList.toggle('active'));
    });

    document.querySelectorAll('.quick-amount').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.quick-amount').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('customWaterAmount').value = btn.dataset.amount;
      });
    });

    document.getElementById('waterGoalSlider').addEventListener('input', (e) => {
      state.waterGoal = parseInt(e.target.value, 10);
      document.getElementById('waterGoalDisplay').textContent = `${state.waterGoal}ml`;
      saveState();
      renderStats();
    });

    document.getElementById('saveWaterAlertBtn').addEventListener('click', saveWaterAlert);
    document.getElementById('saveMedicineAlertBtn').addEventListener('click', saveMedicineAlert);
    document.getElementById('confirmWaterBtn').addEventListener('click', confirmWater);
  }

  // ===== THEME =====
  function initTheme() {
    if (state.isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }

  function toggleTheme() {
    state.isDark = !state.isDark;
    if (state.isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem(KEYS.THEME, state.isDark ? 'dark' : 'light');
    renderAll(); // re-render to update icon
  }

  // ===== TABS =====
  function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.toggle('active', c.id === `${tab}Tab`));
  }

  // ===== NAV =====
  function handleNav(nav) {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector(`[data-nav="${nav}"]`)?.classList.add('active');

    switch (nav) {
      case 'water': switchTab('water'); break;
      case 'medicine': switchTab('medicine'); break;
      case 'add': openModal('quickWaterModal'); break;
      case 'settings': switchTab('water'); break;
      default: switchTab('water');
    }
  }

  // ===== MODALS =====
  function openModal(id) {
    document.getElementById(id).classList.add('active');
    // Init audio context on user gesture
    getAudioCtx();
  }

  function closeModal(id) {
    document.getElementById(id).classList.remove('active');
  }

  // ===== WATER =====
  function saveWaterAlert() {
    const time = document.getElementById('waterAlertTime').value;
    const amount = parseInt(document.getElementById('waterAlertAmount').value, 10);
    const message = document.getElementById('waterAlertMessage').value || 'Hora de beber água! 💧';
    const days = getSelectedDays();

    if (!time || !amount) {
      showToast('Preencha todos os campos', 'warning');
      return;
    }

    state.waterAlerts.push({ time, amount, message, days, enabled: true });
    saveState();
    renderWaterAlerts();
    renderStats();
    closeModal('waterAlertModal');
    showToast('Alerta de água criado! 💧', 'success');
  }

  function toggleWaterAlert(index) {
    state.waterAlerts[index].enabled = !state.waterAlerts[index].enabled;
    saveState();
    renderWaterAlerts();
    renderStats();
  }

  function deleteWaterAlert(index) {
    state.waterAlerts.splice(index, 1);
    saveState();
    renderWaterAlerts();
    renderStats();
    showToast('Alerta removido', 'info');
  }

  function confirmWater() {
    const amount = parseInt(document.getElementById('customWaterAmount').value, 10);
    if (!amount || amount < 1) {
      showToast('Informe uma quantidade válida', 'warning');
      return;
    }

    const now = new Date();
    const entry = {
      date: getTodayKey(),
      time: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
      amount,
    };

    state.waterHistory.unshift(entry);
    saveState();
    renderStats();
    renderWaterHistory();
    closeModal('quickWaterModal');
    showToast(`+${amount}ml registrado! 💧`, 'success');
  }

  // ===== MEDICINE =====
  function saveMedicineAlert() {
    const name = document.getElementById('medicineName').value.trim();
    const time = document.getElementById('medicineAlertTime').value;
    const dosage = document.getElementById('medicineDosage').value.trim();
    const message = document.getElementById('medicineAlertMessage').value || 'Hora do remédio! 💊';
    const days = getSelectedDays();

    if (!name || !time) {
      showToast('Preencha o nome e horário', 'warning');
      return;
    }

    state.medicineAlerts.push({ name, time, dosage, message, days, enabled: true });
    saveState();
    renderMedicineAlerts();
    renderStats();
    closeModal('medicineAlertModal');
    showToast(`Remédio "${name}" criado! 💊`, 'success');
  }

  function toggleMedicineAlert(index) {
    state.medicineAlerts[index].enabled = !state.medicineAlerts[index].enabled;
    saveState();
    renderMedicineAlerts();
    renderStats();
  }

  function deleteMedicineAlert(index) {
    state.medicineAlerts.splice(index, 1);
    saveState();
    renderMedicineAlerts();
    renderStats();
    showToast('Remédio removido', 'info');
  }

  function openMedicineHistory() {
    const today = getTodayKey();
    const taken = state.medicineHistory.filter(h => h.date === today).map(h => h.alertIndex);
    const pending = state.medicineAlerts.filter((a, i) => a.enabled && !taken.includes(i));

    if (pending.length === 0) {
      showToast('Todos os remédios de hoje já foram tomados! 🎉', 'success');
      return;
    }

    const med = pending[0];
    const alertIndex = state.medicineAlerts.indexOf(med);
    const now = new Date();

    state.medicineHistory.unshift({
      date: today,
      time: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
      name: med.name,
      dosage: med.dosage,
      alertIndex,
    });

    saveState();
    renderStats();
    renderMedicineHistory();
    showToast(`${med.name} registrado! 💊`, 'success');
  }

  // ===== ALERT CHECKER =====
  function resetNotifiedAtMidnight() {
    const today = getTodayKey();
    const stored = localStorage.getItem(KEYS.LAST_NOTIFIED + '_date');
    if (stored !== today) {
      notifiedToday = {};
      localStorage.setItem(KEYS.LAST_NOTIFIED + '_date', today);
      localStorage.removeItem(KEYS.LAST_NOTIFIED);
    }
  }

  function startAlertChecker() {
    // Check every 15 seconds
    setInterval(checkAlerts, 15000);
    // Also check on visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) checkAlerts();
    });
    // Check immediately
    checkAlerts();
  }

  function checkAlerts() {
    const now = new Date();
    const currentTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const today = now.getDay();

    // Reset at midnight
    resetNotifiedAtMidnight();

    // Check water alerts
    state.waterAlerts.forEach((alert, i) => {
      if (!alert.enabled) return;
      if (!alert.days.includes(today)) return;
      const key = `w_${i}`;
      if (alert.time === currentTime && notifiedToday[key] !== currentTime) {
        notifiedToday[key] = currentTime;
        saveState();
        triggerWaterAlert(alert);
      }
    });

    // Check medicine alerts
    state.medicineAlerts.forEach((alert, i) => {
      if (!alert.enabled) return;
      if (!alert.days.includes(today)) return;
      const key = `m_${i}`;
      if (alert.time === currentTime && notifiedToday[key] !== currentTime) {
        notifiedToday[key] = currentTime;
        saveState();
        triggerMedicineAlert(alert);
      }
    });
  }

  function triggerWaterAlert(alert) {
    playAlertSound('water');
    vibrate([200, 100, 200, 100, 200]);
    sendNotification('💧 Hora de beber água!', alert.message);
    showAlertBanner('💧 Hora de beber água!', alert.message, 'water');
  }

  function triggerMedicineAlert(alert) {
    playAlertSound('medicine');
    vibrate([300, 100, 300, 100, 300]);
    sendNotification(`💊 Hora do remédio: ${alert.name}`, alert.message);
    showAlertBanner(`💊 Hora do remédio: ${alert.name}`, `${alert.dosage} · ${alert.message}`, 'medicine');
  }

  // ===== ALERT BANNER (in-app) =====
  function showAlertBanner(title, body, type) {
    // Remove existing banner
    const existing = document.querySelector('.alert-banner');
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.className = `alert-banner ${type}`;
    banner.innerHTML = `
      <div class="alert-banner-content">
        <div class="alert-banner-text">
          <strong>${title}</strong>
          <span>${body}</span>
        </div>
        <button class="alert-banner-dismiss" aria-label="Dispensar">
          <span class="material-icons-round">close</span>
        </button>
      </div>`;
    document.body.insertBefore(banner, document.body.firstChild);

    // Inject icon
    setTimeout(() => {
      banner.querySelectorAll('.material-icons-round').forEach(el => {
        const name = el.textContent.trim();
        if (ICONS[name]) el.innerHTML = ICONS[name];
      });
    }, 0);

    // Auto dismiss after 30s
    const autoDismiss = setTimeout(() => banner.remove(), 30000);

    // Dismiss on click
    banner.querySelector('.alert-banner-dismiss').addEventListener('click', () => {
      clearTimeout(autoDismiss);
      banner.remove();
    });
  }

  // ===== NOTIFICATIONS =====
  function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      // Delay request so it's not on page load (better UX)
      setTimeout(() => {
        Notification.requestPermission();
      }, 3000);
    }
  }

  function sendNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: 'icons/icon-192.png',
        badge: 'icons/icon-192.png',
        vibrate: [200, 100, 200],
        tag: title, // deduplicate
      });
    }
  }

  // ===== TOAST =====
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="material-icons-round">${type === 'success' ? 'check_circle' : type === 'warning' ? 'warning' : 'info'}</span> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
  }

  // ===== HELPERS =====
  function getTodayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function pad(n) {
    return n.toString().padStart(2, '0');
  }

  function getSelectedDays() {
    const days = [];
    document.querySelectorAll('.day-btn.active').forEach(btn => {
      days.push(parseInt(btn.dataset.day, 10));
    });
    return days;
  }

  function formatDays(days) {
    const names = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    if (days.length === 7) return 'Todos os dias';
    if (days.length === 5 && !days.includes(0) && !days.includes(6)) return 'Dias úteis';
    return days.map(d => names[d]).join(', ');
  }

  // ===== PUBLIC API =====
  window._da = {
    toggleWaterAlert,
    deleteWaterAlert,
    toggleMedicineAlert,
    deleteMedicineAlert,
  };

  // ===== START =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
