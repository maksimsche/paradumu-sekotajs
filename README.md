# Paradumu sekotājs

Mobilā (tīmekļa) lietotne veselīgu ikdienas paradumu sekošanai. Lietotne ļauj pierakstīt paradumus,
katru dienu atzīmēt to izpildi un redzēt dienas progresu. Visi dati glabājas lokāli lietotāja ierīcē
(pārlūka `localStorage`), tāpēc lietotne darbojas arī bezsaistē.

Projekts ir realizēts pēc iepriekš izstrādātās programmatūras prasību specifikācijas (PPS).

## Funkcijas (atbilstoši specifikācijai)

| ID | Funkcija | Apraksts |
|----|----------|----------|
| K1 | Apskatīt paradumu sarakstu | Parāda visus paradumus un to izpildi dienai, kā arī dienas progresu. |
| K2 | Pievienot paradumu | Pievieno jaunu paradumu caur formu “Jauns paradums”. |
| K3 | Atzīmēt kā izpildītu | Atzīmē paraduma izpildi; mērķa paradumiem skaita pieskārienus. |
| K4 | Dzēst paradumu | Dzēš izvēlēto paradumu (ar apstiprinājumu). |
| K5 | Ievadīt paraduma datus | Validē un sagatavo paraduma datus (izmanto K2). |

## Tehnoloģijas

- HTML, CSS, JavaScript (bez ārējām bibliotēkām)
- Datu glabāšana: pārlūka `localStorage`
- Testi: Node.js + `jsdom`

## Projekta struktūra

```
paradumu-sekotajs/
├── index.html            # Saskarne un stili
├── js/
│   ├── logic.js          # Tīrā loģika (validācija, atzīmēšana, progress)
│   └── app.js            # Saskarnes loģika (DOM, notikumi, localStorage)
├── tests/
│   ├── logic.test.js     # Vienībtesti loģikai
│   └── ui.integration.test.js  # Integrācijas tests saskarnei (jsdom)
├── docs/
│   └── Lietotaja_celvedis.pdf  # Lietotāja ceļvedis
├── TEST_PLAN.md          # Testa plāns un rezultāti
└── README.md
```

## Palaišana lokāli

Pietiek atvērt `index.html` pārlūkprogrammā. Datu glabāšanai (`localStorage`) ieteicams to atvērt
caur GitHub Pages vai lokālu serveri, piemēram:

```bash
# vienkāršs lokāls serveris
python3 -m http.server 8000
# pēc tam pārlūkā: http://localhost:8000
```

## Testu palaišana

```bash
npm install            # vienreiz, lai instalētu jsdom (vajadzīgs UI testam)
npm test               # palaiž visus testus
# vai atsevišķi:
node tests/logic.test.js
node tests/ui.integration.test.js
```

Visi testi (24 vienībtesti + 12 integrācijas pārbaudes) tiek izpildīti veiksmīgi.
Sīkāk skat. [TEST_PLAN.md](TEST_PLAN.md).

## Izstrādes metodika

Projekts izstrādāts ar iteratīvo un inkrementālo metodi: funkcijas K1–K5 realizētas pa daļām,
katru iterāciju testējot atsevišķi.

## Licence

Izstrādāts mācību nolūkos.
