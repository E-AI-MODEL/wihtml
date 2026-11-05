# Ontwerpafspraken voor WiHTML

## Wat bouwen we?
Een wiskundelessengenerator met twee duidelijk verschillende omgevingen:
1. **Les maken:** een rustige werkplek waarin de docent de lesvolgorde, leerlingactiviteit, vragen, antwoorden en notities bewerkt.
2. **Les geven:** een schermvullende presentatie waarin de docent de regie houdt. Gereedschap verschijnt alleen als zwevende laag, zonder dat de dia verschuift.

De inhoud is bewerkbaar. De spelerscode en de vormgeving worden hergebruikt; een nieuwe les hoeft niet opnieuw geprogrammeerd te worden.

## Drie soorten bronnen

| Bron | Wat halen we eruit? | Wat nemen we niet automatisch over? |
| --- | --- | --- |
| Figma-ontwerp | Typografie, afstanden, contrast, componentgedrag, toetsenbordfocus, varianten en responsive regels | Een geïsoleerd mooi scherm zonder geteste bediening |
| Werkende HTML, onder andere het Surge-lesvoorbeeld | Grafiekgedrag, bruikbare lesinteracties, onthulvolgorde, foutafhandeling, navigatie en offline gebruik | Hostingkeuzes, eenmalige code of aannames dat de referentie technisch optimaal is |
| EAI-model | Vragen over leerlingactiviteit, wie welke taak uitvoert, hulp tijdens oefening en zelfstandige controle | Een totaalscore of automatische claim dat een les tot leren leidt |

**Surge is de plek waar een HTML-voorbeeld kan worden gepubliceerd, niet de technische standaard zelf.** Onderzoek de broncode en test de werkende functionaliteit voordat iets in WiHTML wordt hergebruikt.

## Vormgeving: bewust rustig

- Warm wit als achtergrond, donkere tekst en één terughoudende accentkleur.
- Gebruik witruimte om samenhang te tonen, niet kaarten om elk veld af te bakenen.
- Eén duidelijke paginatitel, sobere sectiekoppen, geen decoratieve cijfers, gradients of willekeurige pictogrammen.
- Gebruik een leesbaar serif-lettertype voor de hoofdvraag en een eenvoudige sans-serif voor bediening en gegevens.
- Lespresentaties volgen een vaste 16:9-verhouding. Geen vaste boven- en onderbalken die kostbare projectieruimte innemen.
- Een tool verschijnt op de dia als klein, tijdelijk palet. Geen zijpaneel dat het lesmateriaal kleiner maakt.
- Verwijderen van toegevoegde elementen moet onmiddellijk herkenbaar zijn. Aantekeningen blijven per dia gescheiden.
- Vermijd onleesbare lichtgrijze tekst. Controleer contrast op projectoren, ook bij gedimd lokaallicht.
- Een dia bevat zo weinig mogelijk gelijktijdige aanwijzingen. Verberg uitwerkingen totdat de docent ze toont.

## EAI in het ontwerp

Een lesdeel beschrijft wat de leerling zelfstandig moet doen en wat de docent of software doet. De maker kiest expliciet wanneer feedback of een modelantwoord verschijnt. De generator mag helpen ordenen en ontbrekende velden signaleren, maar neemt niet de wiskundige juistheid of didactische beslissing over.

Een exit ticket toetst zonder automatisch getoonde inhoudelijke hulp. Stemuitslagen zijn groepsinformatie: een veranderde uitslag betekent niet automatisch dat een individuele leerling iets heeft geleerd.

## Referenties en hergebruik

Bewaar bij elk referentieontwerp:
- de bronlink, datum, screenshot of lokale bronversie;
- welke eigenschap is overgenomen;
- het bijbehorende gedrag en de controle die daarvoor is uitgevoerd;
- eventuele beperkingen, licentie en afhankelijkheden.

Neem niet blind Figma-code, bibliotheken, fonts of afbeeldingen over. Een lokaal werkende HTML moet zonder verplichte externe scripts kunnen blijven functioneren.

## Definitie van klaar

Een les of UI-onderdeel is pas klaar voor gebruik als:
- vragen en antwoorden leesbaar zijn op laptop en digibord;
- bediening, sluitknoppen en overlays op beide schermgroottes werken;
- de lesinhoud niet verspringt bij openen van een tool;
- docentacties niet per ongeluk een antwoord onthullen;
- de gegenereerde HTML los van de generator opent;
- berekeningen en lesvolgorde kloppen;
- toetsenbordbediening, focus en contrast zijn gecontroleerd;
- de maker duidelijk ziet wat is getest en wat nog niet.
