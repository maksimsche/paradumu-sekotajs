/*
 * logic.test.js — automātiskie testi tīrajai loģikai (logic.js).
 * Palaišana: node tests/logic.test.js
 * Neizmanto ārējās bibliotēkas — vienkāršs assert pamats.
 */
var L = require("../js/logic.js");

var passed = 0, failed = 0;
function check(name, cond) {
  if (cond) { passed++; console.log("  [OK]  " + name); }
  else { failed++; console.log("  [FAIL] " + name); }
}

console.log("\n== K5: validateHabit ==");
check("tukšs nosaukums -> kļūda", L.validateHabit("", "").ok === false);
check("tikai atstarpes -> kļūda", L.validateHabit("   ", "").ok === false);
check("derīgs nosaukums bez mērķa -> ok", L.validateHabit("Lasīt", "").ok === true);
check("derīgs nosaukums ar mērķi 8 -> ok", L.validateHabit("Ūdens", "8").ok === true);
check("mērķis 0 -> kļūda", L.validateHabit("Ūdens", "0").ok === false);
check("negatīvs mērķis -> kļūda", L.validateHabit("Ūdens", "-3").ok === false);
check("teksts mērķa vietā -> kļūda", L.validateHabit("Ūdens", "abc").ok === false);
check("daļskaitlis mērķī -> kļūda", L.validateHabit("Ūdens", "2.5").ok === false);

console.log("\n== makeHabit ==");
var h1 = L.makeHabit("Izdzert ūdeni", "8", "glāzes", "Katru dienu");
check("nosaukums apgriezts un saglabāts", h1.name === "Izdzert ūdeni");
check("mērķis pārvērsts par skaitli", h1.goal === 8);
check("sākotnējais skaitītājs 0", h1.count === 0 && h1.done === false);
var h2 = L.makeHabit("Vingrot", "", "", "Katru dienu");
check("bez mērķa -> goal = null", h2.goal === null);

console.log("\n== K3: toggleHabit (bez mērķa) ==");
var a = L.makeHabit("Vingrot", "", "", "Katru dienu");
L.toggleHabit(a); check("pārslēdz uz izpildīts", a.done === true);
L.toggleHabit(a); check("pārslēdz atpakaļ", a.done === false);

console.log("\n== K3: toggleHabit (ar mērķi 3) ==");
var b = L.makeHabit("Ūdens", "3", "glāzes", "Katru dienu");
L.toggleHabit(b); check("1. pieskāriens -> count 1, nav izpildīts", b.count === 1 && b.done === false);
L.toggleHabit(b); check("2. pieskāriens -> count 2", b.count === 2 && b.done === false);
L.toggleHabit(b); check("3. pieskāriens -> count 3, izpildīts", b.count === 3 && b.done === true);
L.toggleHabit(b); check("4. pieskāriens -> atiestata uz 0", b.count === 0 && b.done === false);

console.log("\n== computeProgress ==");
var list = [
  L.makeHabit("A", "", "", "Katru dienu"),
  L.makeHabit("B", "", "", "Katru dienu"),
  L.makeHabit("C", "", "", "Katru dienu")
];
list[0].done = true;
var p = L.computeProgress(list);
check("3 paradumi, 1 izpildīts -> 1/3", p.done === 1 && p.total === 3);
check("tukšs saraksts -> 0/0", L.computeProgress([]).done === 0 && L.computeProgress([]).total === 0);

console.log("\n== isNewDay / applyDailyReset ==");
var today = L.todayStr(new Date());
check("tas pats datums -> nav jauna diena", L.isNewDay(today, new Date()) === false);
check("cits datums -> jauna diena", L.isNewDay("2000-01-01", new Date()) === true);
check("null datums (pirmā palaišana) -> jauna diena", L.isNewDay(null, new Date()) === true);
var r = L.applyDailyReset([{ count: 5, done: true }, { count: 2, done: true }]);
check("atiestatīšana nodzēš izpildi", r[0].count === 0 && r[0].done === false && r[1].done === false);

console.log("\n----------------------------------------");
console.log("Izpildīti: " + passed + "   Neizdevās: " + failed);
console.log("----------------------------------------\n");
process.exit(failed === 0 ? 0 : 1);
