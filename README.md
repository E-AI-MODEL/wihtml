# WiHTML

Een rustige editor voor interactieve wiskundelessen. De docent stelt de les samen en gebruikt de gegenereerde HTML als presentatie.

## Proefversie

Open `index.html` in een browser. De editor bevat een voorbeeldles **Verdubbelen en halveren** (5 havo). Je kunt lesdelen bewerken, toevoegen, verwijderen en anders ordenen. Via **Bekijk presentatie** open je de leerlingweergave; via **Download HTML** maak je een zelfstandig lesbestand. Met **Sjabloon maken** ontwerp je de dia-indeling in HTML en CSS, bekijk je direct het resultaat en exporteer of importeer je eigen HTML-sjablonen. Met **Bewaar lesbestand** maak je een JSON-bestand dat je later opnieuw kunt openen.

Deze versie bevat een compacte presentatietoolbox met pen, ongedaan maken, wissen per dia, docentnotities, afteltimer, stemteller en vergelijking van twee stemrondes. De antwoorden worden per vraag in deze browser bewaard. De volledige oorspronkelijke Docentstudio v9 is nog niet één-op-één in de repository opgenomen; andere gereedschappen moeten selectief worden overgenomen en getest.

## Ontwerp

We gebruiken drie verschillende bronnen, elk voor een ander doel:
- **Figma:** vormgeving en interfacegedrag, nadat de echte ontwerpbestanden beschikbaar zijn.
- **Werkende HTML-referenties, waaronder Surge:** voorbeelden voor grafieken, bediening, lesinteractie en praktische technische oplossingen.
- **EAI-model:** inhoudelijke vragen bij lesontwerp: wat doet de leerling, wat doet de docent en wanneer krijgt de leerling hulp?

Lees [de ontwerpafspraken](docs/ontwerpafspraken.md) en [het bronregister](docs/referenties.md).

De editor en presentatie hebben een eigen vormgeving. Een presentatiedia blijft 16:9 en docentgereedschap komt er als klein overlaypalet bovenop.

## Controle

```sh
python3 tests/check_site.py
```

Hiervoor is Node.js nodig om de JavaScript-syntaxis te controleren. Er draait ook een automatische Chromium-test via GitHub Actions. Die controleert de presentatienavigatie, de eerste en tweede stemronde, tekenfuncties, de grafiek, mobiele bediening en het opnieuw openen van geëxporteerde HTML. De test is technisch: een docent moet de les ook nog op een echt digibord beoordelen.

## Volgende ontwikkeling

- De oorspronkelijke les en Docentstudio v9 systematisch als regressiereferentie opnemen.
- De stemrondevergelijking verder uitwerken als lesoverstijgend, bruikbaar verslag zonder leerlinggegevens.
- De overige Docentstudio-functies alleen overnemen waar die een concrete leshandeling helpen.
- Wiskundige componenten losmaken van de lesgegevens en grafieken gericht testen.
- De visuele stijl verder aanscherpen aan de hand van een concreet Figma-ontwerp.

Niet rechtstreeks naar `main` publiceren zonder review.

## Zelf lesonderdelen bouwen

De docent kan een nieuwe les starten met **Nieuwe les**, waarna de eigen les een unieke identificatie krijgt voor lokale stemrondes.

De editor biedt zeven configureerbare onderdelen:

| Onderdeel | Werking in de presentatie |
| --- | --- |
| Tekst of opdracht | Eigen tekst en uitleg |
| Meerkeuzevraag | Stemmen tellen en antwoord later onthullen |
| Grafiekonderzoek | Groeifactor, beginwaarde en doelfactor instellen; hulplijnen pas na keuze |
| Stapsgewijze uitwerking | Docent onthult één stap tegelijk |
| Onderzoekstabel | Leerlingen voorspellen waarden; docent onthult ze één voor één |
| Zelfstandig oefenen | Opgaven, hulp en uitwerkingen afzonderlijk te tonen |
| Verklaren en vergelijken | Twee kolommen met afgedekte informatie en een bespreekbare conclusie |

De editor bewaart alle lesonderdelen in JSON en neemt ze mee in de zelfstandige HTML-export. De docent bepaalt welke onderdelen leerlingen eerst zonder hulp uitvoeren. Een ontwerpcontrole signaleert ontbrekende leerlingactiviteiten, maar beoordeelt niet automatisch de kwaliteit van een les.

De originele volledig uitgewerkte v9-les blijft als apart voorbeeld beschikbaar in `examples/verdubbelen-halveren-v9.html`. De zeven algemene onderdelen dekken veel van de leshandelingen, maar zijn geen één-op-één vervanging voor elk specifiek rekeninstrument in v9.

## Docentstudio v9

[Vergelijking met de originele Docentstudio v9](docs/docentstudio-v9.md): welke hulpmiddelen zijn overgenomen, welke nog ontbreken en hoe de sjabloonfunctie werkt. De lesinhoud en de docentoverlays blijven los van het HTML-sjabloon.
