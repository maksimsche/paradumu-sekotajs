# Testa plāns — “Paradumu sekotājs”

## 1. Mērķis
Pārbaudīt, vai lietotne darbojas atbilstoši specifikācijai (funkcijas K1–K5) un vai
saskarne reaģē pareizi uz lietotāja darbībām un kļūdainu ievadi.

## 2. Testēšanas veidi
- **Vienībtesti** (`tests/logic.test.js`) — pārbauda tīrās loģikas funkcijas (validācija, atzīmēšana,
  progress, dienas atiestatīšana). Kopā 24 pārbaudes.
- **Integrācijas testi** (`tests/ui.integration.test.js`) — pārbauda saskarni ar `jsdom`
  (pievienošana, atzīmēšana, dzēšana, ekrānu pārslēgšana). Kopā 12 pārbaudes.
- **Manuālā testēšana** — pārbaude reālā pārlūkprogrammā telefonā un datorā.

## 3. Testa gadījumi (manuālā pārbaude)

| Nr.  | Funkc. | Darbība | Sagaidāmais rezultāts | Rezultāts |
|------|--------|---------|------------------------|-----------|
| TC01 | K1 | Atvērt lietotni bez paradumiem | Redzams saraksta ekrāns un paziņojums par tukšu sarakstu | OK |
| TC02 | K2 | Nospiest “+”, ievadīt nosaukumu, saglabāt | Paradums parādās sarakstā | OK |
| TC03 | K5 | Saglabāt ar tukšu nosaukumu | Parādās kļūdas paziņojums, paradums netiek saglabāts | OK |
| TC04 | K5 | Ievadīt mērķi “0” vai “-3” | Parādās kļūdas paziņojums | OK |
| TC05 | K5 | Ievadīt mērķi “abc” | Parādās kļūdas paziņojums | OK |
| TC06 | K3 | Pieskarties aplim paradumam bez mērķa | Paradums kļūst izpildīts, progress mainās | OK |
| TC07 | K3 | Paradumam ar mērķi 8 pieskarties 8 reizes | Skaitītājs sasniedz 8, paradums izpildīts | OK |
| TC08 | K3 | Vēlreiz pieskarties izpildītam mērķa paradumam | Skaitītājs atiestatās uz 0 | OK |
| TC09 | K1 | Atzīmēt 2 no 3 paradumiem | Progresa gredzens rāda 2/3 | OK |
| TC10 | K4 | Izvēlēties paradumu un nospiest “Dz”, apstiprināt | Paradums pazūd no saraksta | OK |
| TC11 | K4 | Nospiest “Dz” bez izvēlēta paraduma | Parādās lūgums vispirms izvēlēties paradumu | OK |
| TC12 | K2 | Formā nospiest “Atcelt” | Atgriežas sarakstā bez izmaiņām | OK |
| TC13 | K1 | Pārlādēt lapu pēc paradumu pievienošanas | Paradumi saglabājušies (localStorage) | OK |
| TC14 | K1 | Mainīt ierīces datumu uz nākamo dienu, atvērt | Izpilde atiestatīta, paradumi saglabāti | OK |

## 4. Atkļūdošana (atrastās un novērstās problēmas)

1. **Pieskāriens izpildes aplim arī izvēlējās rindu dzēšanai.**
   Sākotnēji, pieskaroties aplim, nostrādāja gan izpildes maiņa, gan rindas izvēle (notikums “izplūda” uz rindu).
   *Risinājums:* izpildes pogas apstrādē pievienots `event.stopPropagation()`.

2. **Pēc pārlādēšanas izpilde nereti “pazuda” tajā pašā dienā.**
   Sākotnēji dienas atiestatīšana nostrādāja par bieži.
   *Risinājums:* datums tiek glabāts atsevišķi un salīdzināts ar `isNewDay()`; atiestatīšana notiek tikai jaunā dienā.
