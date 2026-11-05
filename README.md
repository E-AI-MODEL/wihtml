# WiHTML

Een rustige editor voor interactieve wiskundelessen. De docent stelt de les samen en gebruikt de gegenereerde HTML als presentatie.

## Proefversie

Open `index.html` in een browser. De editor bevat een voorbeeldles **Verdubbelen en halveren** (5 havo). Je kunt lesdelen bewerken, toevoegen, verwijderen en anders ordenen. Via **Bekijk presentatie** open je de leerlingweergave; via **Download HTML** maak je een zelfstandig lesbestand. Met **Bewaar lesbestand** maak je een JSON-bestand dat je later opnieuw kunt openen.

Deze eerste versie is een proef, niet een volledig getest lesproduct. De oorspronkelijke Docentstudio v9 is in het gesprek ontwikkeld, maar nog niet als bronbestand in deze repository geïntegreerd. De proefversie bevat dus nog niet alle eerder gebouwde docentgereedschappen en stemrondefuncties.

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

Hiervoor is Node.js nodig om de JavaScript-syntaxis te controleren. De test is statisch. Controleer de bediening ook in een echte browser op laptop en digibord voordat je de les gebruikt.

## Volgende ontwikkeling

- De oorspronkelijke les en Docentstudio v9 systematisch als regressiereferentie opnemen.
- Twee opgeslagen stemrondes met vergelijking en terughalen in de presentatie.
- Compacte tools voor timer, tekenen, ongedaan maken en wissen per dia.
- Wiskundige componenten losmaken van de lesgegevens en grafieken gericht testen.
- De visuele stijl verder aanscherpen aan de hand van een concreet Figma-ontwerp.

Niet rechtstreeks naar `main` publiceren zonder review.
