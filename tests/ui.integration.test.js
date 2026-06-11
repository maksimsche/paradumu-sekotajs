/*
 * ui.integration.test.js — pārbauda, vai saskarne ielādējas un galvenās darbības strādā (jsdom).
 * Palaišana: node tests/ui.integration.test.js
 */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const logic = fs.readFileSync(path.join(__dirname, "..", "js", "logic.js"), "utf8");
const app = fs.readFileSync(path.join(__dirname, "..", "js", "app.js"), "utf8");

let pass = 0, fail = 0;
const check = (n, c) => c ? (pass++, console.log("  [OK]  " + n)) : (fail++, console.log("  [FAIL] " + n));

const dom = new JSDOM(html, { runScripts: "outside-only", pretendToBeVisual: true, url: "https://example.org/" });
const { window } = dom;
// vienkāršs localStorage aizstājējs
const store = {};
window.localStorage = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: k => { delete store[k]; }
};
window.confirm = () => true;   // dzēšanas apstiprinājums
window.alert = () => {};

// ielādē skriptus tajā pašā kontekstā
window.eval(logic);
window.eval(app);
window.document.dispatchEvent(new window.Event("DOMContentLoaded"));

const doc = window.document;

console.log("\n== Sākuma stāvoklis ==");
check("redzams saraksta ekrāns", !doc.getElementById("screen-list").classList.contains("hidden"));
check("forma paslēpta", doc.getElementById("screen-form").classList.contains("hidden"));
check("tukšs saraksts -> redzams 'empty' paziņojums", !doc.getElementById("empty").classList.contains("hidden"));

console.log("\n== K2: pievienot paradumu caur formu ==");
doc.getElementById("btn-add").click();
check("atvērās forma", !doc.getElementById("screen-form").classList.contains("hidden"));
// mēģina saglabāt ar tukšu nosaukumu -> kļūda (K5)
doc.getElementById("btn-save").click();
check("tukšs nosaukums -> redzama kļūda", !doc.getElementById("form-error").classList.contains("hidden"));
// aizpilda korekti
doc.getElementById("f-name").value = "Izdzert ūdeni";
doc.getElementById("f-goal").value = "3";
doc.getElementById("f-unit").value = "glāzes";
doc.getElementById("btn-save").click();
check("pēc saglabāšanas atgriežas sarakstā", !doc.getElementById("screen-list").classList.contains("hidden"));
check("sarakstā parādās 1 paradums", doc.querySelectorAll("#habit-list .habit").length === 1);
check("progress rāda 0/1", doc.getElementById("ring-text").textContent === "0/1");

console.log("\n== K3: atzīmēt izpildi (mērķis 3) ==");
const checkBtn = doc.querySelector("#habit-list .habit .check");
checkBtn.click(); checkBtn.click(); checkBtn.click();
check("pēc 3 pieskārieniem paradums izpildīts", doc.querySelector("#habit-list .habit").classList.contains("done"));
check("progress rāda 1/1", doc.getElementById("ring-text").textContent === "1/1");

console.log("\n== K4: dzēst paradumu ==");
doc.querySelector("#habit-list .habit").click();   // izvēlas
doc.getElementById("btn-del").click();              // dzēš (confirm=true)
check("saraksts atkal tukšs", doc.querySelectorAll("#habit-list .habit").length === 0);
check("atkal redzams 'empty' paziņojums", !doc.getElementById("empty").classList.contains("hidden"));

console.log("\n----------------------------------------");
console.log("Izpildīti: " + pass + "   Neizdevās: " + fail);
console.log("----------------------------------------\n");
process.exit(fail === 0 ? 0 : 1);
