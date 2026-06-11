/*
 * logic.js — tīrā lietojumprogrammas loģika (bez saskarnes).
 * Funkcijas ir atdalītas no DOM, lai tās varētu automātiski testēt (skat. tests/logic.test.js).
 * Atbilst specifikācijas funkcijām K3 (atzīmēšana) un K5 (datu validācija).
 */
(function (global) {
  "use strict";

  // Atgriež šodienas datumu formātā GGGG-MM-DD (lieto dienas atiestatīšanai).
  function todayStr(d) {
    d = d || new Date();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  // K5 — paraduma datu validācija.
  // Atgriež { ok: true } vai { ok: false, error: "..." }.
  function validateHabit(name, goalRaw) {
    name = (name || "").trim();
    if (!name) {
      return { ok: false, error: "Lūdzu, ievadiet paraduma nosaukumu." };
    }
    var hasGoal = goalRaw !== "" && goalRaw !== null && goalRaw !== undefined;
    if (hasGoal) {
      var g = Number(goalRaw);
      if (!Number.isFinite(g) || g <= 0 || !Number.isInteger(g)) {
        return { ok: false, error: "Mērķim jābūt pozitīvam veselam skaitlim." };
      }
    }
    return { ok: true };
  }

  // Izveido jaunu paraduma objektu (pieņem, ka dati jau validēti).
  function makeHabit(name, goalRaw, unit, frequency) {
    var hasGoal = goalRaw !== "" && goalRaw !== null && goalRaw !== undefined;
    return {
      id: "h" + Date.now() + Math.floor(Math.random() * 1000),
      name: (name || "").trim(),
      goal: hasGoal ? Number(goalRaw) : null,
      unit: (unit || "").trim(),
      frequency: frequency || "Katru dienu",
      count: 0,
      done: false
    };
  }

  // K3 — maina paraduma izpildes statusu šai dienai.
  // Ar mērķi: pieskāriens palielina skaitītāju; sasniedzot mērķi, paradums kļūst izpildīts;
  //          vēlreiz pieskaroties, skaitītājs tiek atiestatīts (var atsaukt).
  // Bez mērķa: pārslēdz izpildīts / nav izpildīts.
  function toggleHabit(h) {
    if (h.goal) {
      if (h.count >= h.goal) {
        h.count = 0;
        h.done = false;
      } else {
        h.count += 1;
        if (h.count >= h.goal) h.done = true;
      }
    } else {
      h.done = !h.done;
    }
    return h;
  }

  // Dienas progress: izpildīto paradumu skaits no kopējā.
  function computeProgress(habits) {
    var total = habits.length;
    var done = habits.filter(function (h) { return h.done; }).length;
    return { done: done, total: total };
  }

  // Vai ir sākusies jauna diena (salīdzina ar saglabāto datumu).
  function isNewDay(savedDate, now) {
    return savedDate !== todayStr(now);
  }

  // Atiestata visu paradumu dienas izpildi (jaunas dienas sākumā).
  function applyDailyReset(habits) {
    return habits.map(function (h) {
      h.count = 0;
      h.done = false;
      return h;
    });
  }

  var api = {
    todayStr: todayStr,
    validateHabit: validateHabit,
    makeHabit: makeHabit,
    toggleHabit: toggleHabit,
    computeProgress: computeProgress,
    isNewDay: isNewDay,
    applyDailyReset: applyDailyReset
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;          // Node (testiem)
  }
  global.HabitLogic = api;          // Pārlūks
})(typeof window !== "undefined" ? window : global);
