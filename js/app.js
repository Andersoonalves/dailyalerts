/* =====================================================
   DAILYALERTS — APP.JS
   LocalStorage + Notificações + PWA
   ===================================================== */

(function () {
  'use strict';

  // ===== STORAGE KEYS =====
  const KEYS = {
    WATER_ALERTS: 'da_water_alerts',
    MEDICINE_ALERTS: 'da_medicine_alerts',
    WATER_HISTORY: 'da_water_history',
    MEDICINE_HISTORY: 'da_medicine_history',
    WATER_GOAL: 'da_water_goal',
    THEME: 'da_theme',
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

  // ===== INIT =====
  function init() {
    loadState();
    renderAll();
    bindEvents();
    initTheme();
    requestNotificationPermission();
    startAlertChecker();
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
    // Water
    const today = getTodayKey();
    const waterToday = state.waterHistory
      .filter(h => h.date === today)
      .reduce((sum, h) => sum + h.amount, 0);
    const waterPct = Math.min(100, Math.round((waterToday / state.waterGoal) * 100));

    document.getElementById('waterCount').textContent = `${waterToday}ml`;
    document.getElementById('waterProgress').style.width = `${waterPct}%`;

    // Medicine
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
          <input type="checkbox" ${a.enabled ? 'checked' : ''} onchange="window.app.toggleWaterAlert(${i})">
          <span class="slider"></span>
        </label>
        <button class="alert-delete" onclick="window.app.deleteWaterAlert(${i})" aria-label="Excluir">
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
          <input type="checkbox" ${a.enabled ? 'checked' : ''} onchange="window.app.toggleMedicineAlert(${i})">
          <span class="slider"></span>
        </label>
        <button class="alert-delete" onclick="window.app.deleteMedicineAlert(${i})" aria-label="Excluir">
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
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Tabs
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Bottom nav
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => handleNav(item.dataset.nav));
    });

    // Action buttons
    document.getElementById('addWaterBtn').addEventListener('click', openModal.bind(null, 'quickWaterModal'));
    document.getElementById('takeMedicineBtn').addEventListener('click', openMedicineHistory);

    // Add alert buttons
    document.getElementById('addWaterAlertBtn').addEventListener('click', openModal.bind(null, 'waterAlertModal'));
    document.getElementById('addMedicineAlertBtn').addEventListener('click', openModal.bind(null, 'medicineAlertModal'));

    // Modal close buttons
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => closeModal(btn.dataset.close));
    });

    // Close modal on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal(overlay.id);
      });
    });

    // Day selector buttons
    document.querySelectorAll('.day-btn').forEach(btn => {
      btn.addEventListener('click', () => btn.classList.toggle('active'));
    });

    // Quick amount buttons
    document.querySelectorAll('.quick-amount').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.quick-amount').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('customWaterAmount').value = btn.dataset.amount;
      });
    });

    // Water goal slider
    document.getElementById('waterGoalSlider').addEventListener('input', (e) => {
      state.waterGoal = parseInt(e.target.value, 10);
      document.getElementById('waterGoalDisplay').textContent = `${state.waterGoal}ml`;
      saveState();
      renderStats();
    });

    // Save water alert
    document.getElementById('saveWaterAlertBtn').addEventListener('click', saveWaterAlert);

    // Save medicine alert
    document.getElementById('saveMedicineAlertBtn').addEventListener('click', saveMedicineAlert);

    // Confirm water
    document.getElementById('confirmWaterBtn').addEventListener('click', confirmWater);
  }

  // ===== THEME =====
  function initTheme() {
    if (state.isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.querySelector('#themeToggle .material-icons-round').textContent = 'light_mode';
    }
  }

  function toggleTheme() {
    state.isDark = !state.isDark;
    if (state.isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.querySelector('#themeToggle .material-icons-round').textContent = 'light_mode';
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.querySelector('#themeToggle .material-icons-round').textContent = 'dark_mode';
    }
    localStorage.setItem(KEYS.THEME, state.isDark ? 'dark' : 'light');
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
      case 'water':
        switchTab('water');
        break;
      case 'medicine':
        switchTab('medicine');
        break;
      case 'add':
        openModal('quickWaterModal');
        break;
      case 'settings':
        switchTab('water');
        break;
      default:
        switchTab('water');
    }
  }

  // ===== MODALS =====
  function openModal(id) {
    document.getElementById(id).classList.add('active');
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

    // Take the first pending medicine
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
  function startAlertChecker() {
    // Check every 30 seconds
    setInterval(checkAlerts, 30000);
    // Also check on visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) checkAlerts();
    });
  }

  function checkAlerts() {
    const now = new Date();
    const currentTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const today = now.getDay();

    // Check water alerts
    state.waterAlerts.forEach(alert => {
      if (!alert.enabled) return;
      if (!alert.days.includes(today)) return;
      if (alert.time === currentTime && !alert._notified) {
        sendNotification('💧 Hora de beber água!', alert.message);
        alert._notified = true;
        setTimeout(() => { alert._notified = false; }, 60000);
      }
    });

    // Check medicine alerts
    state.medicineAlerts.forEach(alert => {
      if (!alert.enabled) return;
      if (!alert.days.includes(today)) return;
      if (alert.time === currentTime && !alert._notified) {
        sendNotification(`💊 Hora do remédio: ${alert.name}`, alert.message);
        alert._notified = true;
        setTimeout(() => { alert._notified = false; }, 60000);
      }
    });
  }

  // ===== NOTIFICATIONS =====
  function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  function sendNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: 'icons/icon-192.png',
        badge: 'icons/icon-192.png',
        vibrate: [200, 100, 200],
      });
    }
    showToast(title, 'info');
  }

  // ===== TOAST =====
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="material-icons-round">${type === 'success' ? 'check_circle' : type === 'warning' ? 'warning' : 'info'}</span> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
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
  window.app = {
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
