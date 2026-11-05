# Een les maken vanuit JSON

De docent kiest in WiHTML de volgorde, de vlakverdeling en de docentfuncties. Daarna kan hij of zij een JSON-bestand met de lesinhoud openen. WiHTML maakt de dia's en de interactieve HTML-presentatie. Er zijn geen leerlingaccounts of externe AI-aanroepen nodig.

## Kies je invoer

**Losse lesinhoud:** [voorbeeld-lesinhoud.json](../examples/voorbeeld-lesinhoud.json). Dit bestand bevat `inhoud`, `vragen` en `opgaven`. WiHTML zet deze om naar tekst, vragen en oefeningen. Niet elk wiskundig onderwerp vraagt dezelfde soort grafiek; die voeg je als grafiek-lesdeel toe.

**Uitgewerkte lesdelen:** [voorbeeld-lesdelen.json](../examples/voorbeeld-lesdelen.json). Hier kies je per onderdeel meteen de werkvorm. Het bestand kan uit een andere editor, een eigen script of een bestaand digitaal lesplan komen.

## Velden

| JSON-veld | Betekenis |
|---|---|
| `titel` | Titel van de les |
| `niveau` | Leerjaar en niveau |
| `leerdoelen` | Tekst of lijst met doelen |
| `inhoud` | Lijst met tekstonderdelen of één tekst |
| `vragen` | Vragen; met `antwoorden` wordt het een meerkeuzevraag |
| `opgaven` | Lijst met oefeningen, eventueel met `hint` en `uitwerking` |
| `lesdelen` | Lijst van zelfgekozen werkvormen en hun inhoud |
| `vlakverdeling` | `single`, `equal`, `left`, `right` of de Nederlandstalige varianten |
| `functies` | Aan/uitkeuzes voor bijvoorbeeld `stemmen`, `tekenen`, `timer` en `notities` |

De zeven werkvormen onder `lesdelen` zijn `tekst`, `meerkeuze`, `grafiek`, `stappen`, `tabel`, `oefenen` en `vergelijken`.

Voor `grafiek` zijn een positieve `beginwaarde` en een `groeifactor` groter dan nul en ongelijk aan 1 verplicht. De `doelfactor` is optioneel. De grafiek laat nu exponentiële groei en afname zien, en kan met een lineaire grafiek worden vergeleken. WiHTML verzint geen groeifactor of uitwerking die niet in de lesinhoud staat.

**Vragen zonder opgegeven juiste antwoorden** blijven open voor controle door de docent. De generator geeft geen oordeel over feitelijke juistheid of leerresultaten.

## Opbouw zonder verlies van inhoud

De routekeuze zet bestaande lesdelen in een andere volgorde. Alle ingelezen lesdelen blijven bestaan. De docent kan daarna handmatig onderdelen toevoegen, verplaatsen of verwijderen.

De vlakverdeling is per les in te stellen en per lesdeel te veranderen. Een eigen HTML/CSS-sjabloon is apart te bewerken en te hergebruiken.

## Bewaren en gebruiken

**Bewaar lesbestand** levert een WiHTML-JSON op, inclusief de keuzes, teksten en sjabloon. **Download HTML** levert de zelfstandige lespresentatie. De gegevens blijven in de browser en op het apparaat van de docent. WiHTML verstuurt ze niet naar GitHub.

JSON-bestanden zijn beperkt tot 2 MB en maximaal 120 lesdelen. Niet-ondersteunde werkvormen worden geweigerd met een foutmelding; de reeds geopende les blijft dan behouden.

De import is een deterministische omzetting van velden naar lesonderdelen. Het is geen inhoudelijke AI-generatie. Controleer de didactische opbouw en wiskunde voordat je de les gebruikt.
