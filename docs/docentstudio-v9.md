# Docentstudio v9 als functionele referentie

De oorspronkelijke Docentstudio v9 (verdubbelen en halveren, 5 havo) is de functionele referentie. Een nieuwe sjabloonfunctie mag de docentgereedschappen, de dia-opbouw of de lesvragen niet vervangen.

## Wat in WiHTML nu is gebouwd

De complete v9-les staat nu ook als zelfstandige referentie in de repository. Dat voorkomt dat bestaande rijke oefeningen verdwijnen terwijl de algemene generator nog groeit.

| Onderdeel uit v9 | WiHTML-status |
| --- | --- |
| 16:9 presentatie met dia-navigatie | Aanwezig |
| Inhoud vóór antwoorden onthullen | Aanwezig, met apart onthulmoment |
| Interactieve exponentiële grafiek | Aanwezig, eigen implementatie |
| Twee stemrondes per vraag | Aanwezig, lokaal in browser |
| Stemrondes terughalen en vergelijken | Aanwezig |
| Pen, ongedaan maken en wissen per dia | Aanwezig |
| Compacte docenttoolbox als overlay | Aanwezig |
| Docentnotities | Aanwezig |
| Aftelklok | Aanwezig |
| Dia-overzicht | Aanwezig |
| Willekeurige leerling kiezen | Aanwezig, zonder serveropslag |
| Volledig scherm en wit scherm | Aanwezig |
| Eigen HTML-sjabloon ontwerpen | Aanwezig, met gecontroleerde HTML en CSS |
| HTML-sjabloon importeren/exporteren | Aanwezig |
| Markeerstift, gum, spotlicht, afdekken | Aanwezig, met sluit- en verwijderbediening |
| Stopwatch en aftelklok met vaste en eigen tijden | Aanwezig |
| Compacte dia, passend schalen, printen, apart docentvenster | Aanwezig; verschillende projectoren nog niet fysiek getest |
| Volledige originele v9-les | Bewaard als eigen HTML-voorbeeld in `examples/verdubbelen-halveren-v9.html` |

De functienamen hierboven slaan op de huidige broncode. Bewijs van werking komt uit GitHub Actions, voor zover een functie in de browsertest is opgenomen. De aanwezigheid van een knop is op zichzelf geen bevestiging dat deze op alle apparaten werkt.

## Zelf een HTML-sjabloon maken

Open in de leseditor **Sjabloon maken**. Kies een voorbeeld of schrijf je eigen HTML-indeling en CSS. In de HTML zijn twee plekken verplicht:

```html
<section class="wi-shell">
  <main class="wi-content" data-slot="content"></main>
  <footer class="wi-bottom" data-slot="footer"></footer>
</section>
```

De generator plaatst de lesinhoud in `content` en de voettekst in `footer`. De docentgereedschappen blijven bovenop de dia werken en maken geen deel uit van het sjabloon. Er is ook een optionele plek met `data-slot="phase"`.

Gebruik uitsluitend toegestane HTML-elementen en klassennamen die beginnen met `wi-`. Er worden geen scripts, iframes of externe bronnen uitgevoerd. De CSS wordt gecontroleerd en alleen binnen de presentatie toegepast. Daardoor kan een docent de vormgeving aanpassen zonder toegang tot willekeurige JavaScript-uitvoering.

Een sjabloon kun je bewaren als `.html` of `.json` en later in een andere les importeren. De gemaakte les bewaart een eigen kopie van dat sjabloon, zodat de zelfstandige lesexport hetzelfde ontwerp gebruikt.

## Nog te verbeteren

- Werk de grafiek en table-interacties uit tot het niveau van de oorspronkelijke les.
- Vergelijk het gedrag van de losse v9-les met de les die WiHTML uit dezelfde gegevens zou produceren. De inhoudelijke uitwerkingen zijn niet allemaal als generieke lescomponent beschikbaar.
- Voeg een gerichte browsercontrole per tool toe.
- Beoordeel alle voorbeeldlesdelen visueel op projectie en op een tweede scherm.
- Controleer de HTML-export na iedere wijziging in lesinhoud, sjabloonstructuur en presentatiescript.
