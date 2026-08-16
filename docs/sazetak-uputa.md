# Sažetak uputa za izradu završnog rada – Veleučilište u Bjelovaru

> Referenca za pisanje koda i dokumentacije za projekt **PcCompPicker**.
> **Službeni naziv teme:** Razvoj interaktivne web aplikacije za konfiguriranje računala i provjeru kompatibilnosti komponenti
> (Stručni prijediplomski studij Računarstvo, mentor: Dario Vidić, v. pred.).

## 1. Ishodi završnog rada

1. Razviti interaktivnu klijentsku web aplikaciju za odabir i konfiguriranje računalnih komponenti koristeći **React** i **TypeScript**.
2. Izraditi responzivno korisničko sučelje s naglaskom na pristupačnost te mogućnost intuitivnog filtriranja i pretraživanja komponenti.
3. Implementirati logički algoritam za automatsku provjeru međusobne hardverske kompatibilnosti odabranih komponenti.
4. Primijeniti odgovarajuće tehnike upravljanja stanjem aplikacije za dinamički izračun ukupne cijene i predviđene potrošnje energije (TDP) cijelog sustava.
5. Ostvariti komunikaciju aplikacije s vanjskim programskim sučeljem (API) ili strukturiranim skupom podataka u svrhu dohvaćanja tehničkih specifikacija hardvera.

## 2. Struktura dokumentacije završnog rada (obavezan redoslijed)

1. **Naslovna stranica** – prema predlošku (poglavlje 6).
2. **ZR obrazac** – izvornik dobiven od Studentske službe.
3. **Zahvala** (opcionalno) – iza ZR obrasca, prije sadržaja.
4. **Sadržaj** – automatski generirana tablica, provjeriti prije predaje.
5. **Uvod** (~1 stranica) – svrha, cilj, zadatak, dosadašnje spoznaje, metode, kratki opis strukture rada.
6. **Glavni dio rada** – poglavlja/potpoglavlja koja obrađuju zadanu temu; slike/tablice imaju naslove i pozivaju se u tekstu prije prikaza; rezultati se interpretiraju u odnosu na uvod.
7. **Zaključak** (1–2 stranice) – rezime, osvrt na ciljeve, ključni rezultati, ograničenja/primjena. Bez citata i referenci na slike/tablice.
8. **Literatura** – Vancouver stil (poglavlje 4).
9. **Oznake i kratice** – abecedno, s prijevodom stranih kratica.
10. **Sažetak, naslov, ključne riječi (HR)** – 100–300 riječi, 3–5 ključnih riječi.
11. **Abstract, Title, Keywords (EN)** – isti format.
12. **Prilozi** (opcionalno).
13. **Izjava o autorstvu** – potpisana/skenirana ili digitalno potpisana.
14. **Suglasnost za pravo pristupa u repozitoriju** – potpisana/skenirana ili digitalno potpisana.

> ZR obrazac, Izjava o autorstvu i Suglasnost se ne broje i ne navode u sadržaju. Svako poglavlje počinje na novoj stranici.

## 3. Formalno oblikovanje teksta

- Format A4, font **Times New Roman 12 pt**, obostrano poravnanje, prored **1,5**, margine **25 mm** sve strane.
- Numeracija stranica dolje desno; stranica 1 = Uvod.
- Naslovi poglavlja: VELIKA SLOVA, 14 pt, bold (`1. NASLOV`).
- Potpoglavlja: mala slova, 14 pt, bold (`1.1. Potpoglavlje`).
- Odjeljci (treća razina, max. preporučeno): mala slova, 12 pt, bold (`1.1.1. Podnaslov`).

### Slike, tablice, programski kod

- Numeracija dvobrojna: `broj_poglavlja.redni_broj` (npr. `Slika 3.2`, `Tablica 3.2`, `Programski kod 3.2`).
- **Slika i programski kod** → opis **ispod** (potpisuju se). **Tablica** → opis **iznad** (natpisuje se).
- Font opisa: **11 pt, italic**; centrirano; jedan prazan red iza naslova.
- Obavezno pozivanje u tekstu prije prikaza, npr.: "Na slici 3.2 prikazano je…", "Iz tablice 3.2 vidi se da…", "Funkcija je prikazana u programskom kodu 3.2.", ili u zagradi: "Mikroupravljač ESP32 (slika 2.1) koristi se za…".
- Slika preuzeta iz literature → referenca u uglatoj zagradi na kraju opisa (npr. `Slika 2.3: Opis [2]`).
- Manje slike mogu se grupirati i označiti `a) b) c)`, zajednički potpis ispod.
- Jednoličan format kroz cijeli rad; ne opisivati svaku brojku, samo ključne elemente.

**Primjeri:**
```
Slika 3.2: Arhitektura komponenti React aplikacije PcCompPicker
Tablica 3.1: Popis podržanih tipova komponenti i njihovih atributa
Programski kod 3.1: Funkcija za provjeru kompatibilnosti utora CPU-a i matične ploče
```

## 4. Citiranje literature (Vancouver stil)

- Literatura se navodi **redoslijedom pojavljivanja u tekstu** (prva referenca u tekstu = prva u popisu).
- U tekstu: `[1]`, za više referenci: `[2, 3, 6]`.
- Parafrazirati; doslovan citat mora biti u navodnicima.

| Vrsta izvora | Format |
|---|---|
| Knjiga | `Prezime I. Naslov: podnaslov. Izdanje. Mjesto: Izdavač; Godina.` |
| Poglavlje u knjizi | `Prezime I. Naslov poglavlja. U: Urednik ur. Naslov knjige. Mjesto: Izdavač; Godina. str. X-Y.` |
| E-knjiga | `Prezime I. Naslov [Online]. Mjesto: Izdavač; Godina. Dostupno na: URL. (Datum pristupa)` |
| Članak u časopisu | `Prezime I. Naslov. Časopis. Godina;Broj(svezak):str.` |
| Članak u online časopisu | `Prezime I. Naslov. Časopis [Elektronički časopis]. Godina. Dostupno na: URL. (Datum pristupa)` |
| Članak u zborniku radova | `Prezime I. Naslov. U: Urednik ur. Naslov zbornika. Mjesto: Izdavač. Godina. str. X-Y.` |
| Web stranica | `Autor/izvor. Naslov stranice [Online]. Godina. Dostupno na: URL. (Datum pristupa)` |
| Diplomski/magistarski/doktorski rad | `Prezime I. Naslov. Vrsta rada. Mjesto: Fakultet; Godina.` |

> Tehnički izvori (API dokumentacija, specifikacije hardvera, MDN/React/TypeScript dokumentacija) → format "web stranica" s datumom pristupa.

## 5. Jezik i stil

- Znanstveni stil, standardni hrvatski jezik, **pasiv ili 3. lice jednine** (nikad 1. lice).
- Bez kratica u naslovu rada; bez boja u tekstu (samo crno).
- Strane riječi bez hrvatskog ekvivalenta → *kurzivom* (i u zagradi uz hrvatski pojam, npr. "brojilo (engl. *counter*)").
- Neprihvatljivo koristiti strane riječi ako hrvatski izraz postoji.
- Pravopisni znak odmah iza riječi, bez razmaka prije (`riječ1, riječ2`, ne `riječ1 , riječ2`).
- Isječci koda u radu: numeracija i pozivanje u tekstu kao slike (poglavlje 3), font opisa 11 pt italic, sam kod u monospace fontu; prikazivati samo relevantne, sažete isječke, ne cijele datoteke.
- Nazivi varijabli/funkcija u tekstu pišu se kurzivom (npr. funkcija *isSocketCompatible*).
- Ustaljeni IT pojmovi bez hrvatskog ekvivalenta (React, hook, API, JSON) → kurziv pri prvom spomenu; nazivi tehnologija (React, TypeScript, Vite) pišu se uspravno kao vlastita imena.

## 7. Dodatne napomene / postupak predaje

- Rad se mentoru predaje elektronski (`.doc` ili `.pdf`).
- Naslov na ZR obrascu i naslovnici mora biti **potpuno identičan**.
- Mjesec/godina na naslovnici prema **datumu obrane** (npr. "Bjelovar, rujan 2026.").
- Provjera izvornosti (Turnitin) prije slanja mentoru – minimalno **85%** izvornosti.
- Odgovornost za točnost, izvornost i pravopisnu ispravnost snosi student (potvrđuje se Izjavom o autorstvu).

## 8. Kriteriji ocjenjivanja (ponderi)

| Kategorija | Ponder | Elementi |
|---|---|---|
| **1. Samostalno služenje literaturom** | 0,2 | Korištenje relevantne literature; razumijevanje plagiranja/citiranja/parafraziranja; samostalno rješavanje problema uz literaturu. |
| **2. Samostalno rješavanje problemskog zadatka** | 0,5 | Analiza i modeliranje rješenja; usvajanje znanja/vještina; odabir metoda/alata; integracija znanja u samostalnu izvedbu projekta modernim tehnologijama. |
| **3. Pisano i usmeno predstavljanje rada** | 0,3 | Pisano oblikovanje; argumentacija; plan i organizacija prezentacije; jezično/etički ispravno predstavljanje. |

Konačna ocjena = `Ocjena1 × 0,2 + Ocjena2 × 0,5 + Ocjena3 × 0,3`

> Kategorija 2 (ponder 0,5) najizravnije se odnosi na kvalitetu same aplikacije — najvažniji fokus praktičnog dijela rada.
