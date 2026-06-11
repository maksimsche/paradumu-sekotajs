/*
 * app.js — saskarnes loģika (DOM): attēlošana, notikumu apstrāde, datu glabāšana.
 * Izmanto tīrās funkcijas no logic.js (globālais objekts HabitLogic).
 */
(function () {
  "use strict";

  var L = window.HabitLogic;
  var HABITS_KEY = "paradumi.habits";
  var DATE_KEY = "paradumi.date";

  var habits = [];
  var selectedId = null;

  // ---------- Datu glabāšana (lokāli, localStorage) ----------
  function load() {
    try {
      habits = JSON.parse(localStorage.getItem(HABITS_KEY)) || [];
    } catch (e) {
      habits = [];
    }
    var savedDate = localStorage.getItem(DATE_KEY);
    // Jaunā dienā atiestata visu paradumu izpildi.
    if (L.isNewDay(savedDate, new Date())) {
      habits = L.applyDailyReset(habits);
      save();
    }
  }

  function save() {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    localStorage.setItem(DATE_KEY, L.todayStr());
  }

  // ---------- Attēlošana (K1) ----------
  function renderDate() {
    var d = new Date();
    var dienas = ["svētdiena","pirmdiena","otrdiena","trešdiena","ceturtdiena","piektdiena","sestdiena"];
    document.getElementById("today").textContent =
      dienas[d.getDay()] + ", " + L.todayStr();
  }

  function renderRing() {
    var p = L.computeProgress(habits);
    var pct = p.total === 0 ? 0 : p.done / p.total;
    var circ = 2 * Math.PI * 18;
    var ring = document.getElementById("ring-fg");
    ring.style.strokeDasharray = circ.toFixed(1);
    ring.style.strokeDashoffset = (circ * (1 - pct)).toFixed(1);
    document.getElementById("ring-text").textContent = p.done + "/" + p.total;
  }

  function renderList() {
    var ul = document.getElementById("habit-list");
    ul.innerHTML = "";
    document.getElementById("empty").classList.toggle("hidden", habits.length > 0);

    habits.forEach(function (h) {
      var li = document.createElement("li");
      li.className = "habit" + (h.done ? " done" : "") + (h.id === selectedId ? " selected" : "");
      li.dataset.id = h.id;

      var check = document.createElement("button");
      check.className = "check";
      check.setAttribute("aria-label", "Atzīmēt kā izpildītu");
      check.textContent = h.done ? "✓" : (h.goal ? String(h.count) : "");

      var info = document.createElement("div");
      info.className = "info";
      var name = document.createElement("span");
      name.className = "name";
      name.textContent = h.name;
      var sub = document.createElement("span");
      sub.className = "sub";
      sub.textContent = h.goal ? (h.count + " / " + h.goal + (h.unit ? " " + h.unit : "")) : h.frequency;
      info.appendChild(name);
      info.appendChild(sub);

      // K3 — pieskāriens aplim maina izpildes statusu.
      check.addEventListener("click", function (ev) {
        ev.stopPropagation();
        L.toggleHabit(h);
        save();
        renderRing();
        renderList();
      });
      // Rindas izvēle dzēšanai (K4).
      li.addEventListener("click", function () {
        selectedId = (selectedId === h.id) ? null : h.id;
        renderList();
      });

      li.appendChild(check);
      li.appendChild(info);
      ul.appendChild(li);
    });
  }

  function renderAll() {
    renderDate();
    renderRing();
    renderList();
  }

  // ---------- Ekrānu pārslēgšana ----------
  function showScreen(id) {
    document.getElementById("screen-list").classList.toggle("hidden", id !== "list");
    document.getElementById("screen-form").classList.toggle("hidden", id !== "form");
  }

  // ---------- K2 — pievienot paradumu ----------
  function openForm() {
    document.getElementById("f-name").value = "";
    document.getElementById("f-goal").value = "";
    document.getElementById("f-unit").value = "";
    document.getElementById("f-freq").value = "Katru dienu";
    hideError();
    showScreen("form");
    document.getElementById("f-name").focus();
  }

  function saveForm() {
    var name = document.getElementById("f-name").value;
    var goal = document.getElementById("f-goal").value;
    var unit = document.getElementById("f-unit").value;
    var freq = document.getElementById("f-freq").value;

    var res = L.validateHabit(name, goal);     // K5 — validācija
    if (!res.ok) {
      showError(res.error);
      return;
    }
    habits.push(L.makeHabit(name, goal, unit, freq));  // K2 — saglabā
    save();
    selectedId = null;
    renderAll();
    showScreen("list");
  }

  function showError(msg) {
    var el = document.getElementById("form-error");
    el.textContent = msg;
    el.classList.remove("hidden");
  }
  function hideError() {
    document.getElementById("form-error").classList.add("hidden");
  }

  // ---------- K4 — dzēst paradumu ----------
  function deleteSelected() {
    if (!selectedId) {
      alert("Vispirms izvēlieties paradumu sarakstā (pieskarieties tā rindai).");
      return;
    }
    var h = habits.find(function (x) { return x.id === selectedId; });
    if (!h) return;
    if (confirm("Vai dzēst paradumu “" + h.name + "”?")) {
      habits = habits.filter(function (x) { return x.id !== selectedId; });
      selectedId = null;
      save();
      renderAll();
    }
  }

  // ---------- Notikumu piesaiste ----------
  function bind() {
    document.getElementById("btn-add").addEventListener("click", openForm);
    document.getElementById("btn-del").addEventListener("click", deleteSelected);
    document.getElementById("btn-save").addEventListener("click", saveForm);
    document.getElementById("btn-cancel").addEventListener("click", function () {
      showScreen("list");
    });
  }

  // ---------- Palaišana ----------
  document.addEventListener("DOMContentLoaded", function () {
    load();
    bind();
    renderAll();
    showScreen("list");
  });
})();
