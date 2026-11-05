# Visueel werken in WiHTML

De lesinhoud komt uit het JSON-bestand of wordt in WiHTML gemaakt. De docent hoeft geen HTML te schrijven om inhoud te veranderen. De HTML-export blijft de uitvoer, niet het bewerkingsscherm.

## Nieuwe werkwijze

- **Links:** de volgorde van lesdelen. Versleep een lesdeel of gebruik de knoppen om het te verplaatsen.
- **Midden:** de geselecteerde dia. Klik op titel, vraag, antwoorden, opgaven, stappen en tabelcellen om de tekst te veranderen. Knoppen voegen onderdelen toe of verwijderen ze.
- **Boven de dia:** kies een werkvorm en de verdeling van het scherm. Eén vlak, gelijke kolommen, 60/40 en 40/60 zijn direct zichtbaar.
- **Bekijk deze dia:** opent de werkelijke interactieve presentatie op de geselecteerde dia. Daar test je bijvoorbeeld stemrondes, grafieken en het onthullen van een antwoord.
- **Vormgeving en sjablonen:** kies kleuren, lettertype en witruimte. Wie een eigen HTML-structuur of CSS wil schrijven, kan de geavanceerde editor openen.
- **Alle velden tonen:** maakt de uitgebreidere instellingen beschikbaar, waaronder instructies voor docent en leerling, tabellen, experimenten en aanvullende tekst.
- **Concept herstellen:** bij bewerken wordt een kopie in de lokale browser bewaard. De docent kiest zelf of een vorig concept wordt hersteld. Het blijft nodig om JSON te downloaden voor gebruik op een ander apparaat.

De studio toont de inhoud in een bewerkbaar voorbeeld. De knop **Bekijk deze dia** toont het daadwerkelijke lesresultaat met de gekozen presentatievorm en docentgereedschappen. Die twee weergaven worden niet als pixelidentiek gepresenteerd.

## Ontwerpkeuzes

De aanpassingen bouwen voort op twee al gebruikte patronen van eaimodel.nl:

- Het Prompt Framework toont invoer en resultaat naast elkaar, zodat een keuze direct zichtbaar wordt.
- LEIF laat één werkhandeling tegelijk zien, met eenvoudige hervatting. De gebruiker hoeft geen lange formulieren door om een kleine wijziging te maken.

WiHTML neemt de bruikbare onderdelen daarvan over, maar houdt de 16:9-lespresentatie apart. Een docent kan de les ontwerpen zonder dat editorvelden op het digibord verschijnen. De oorspronkelijke Docentstudio-v9-interacties blijven werken.

## Wat niet automatisch gebeurt

WiHTML controleert geen wiskundige juistheid. Het maakt geen ontbrekende uitwerkingen of berekeningen. Een lokaal concept is geen centrale opslag en niet automatisch beschikbaar op een andere computer. In een eigen HTML-sjabloon zijn alleen gecontroleerde HTML-elementen en CSS toegestaan, geen scripts of externe bronnen.

## Controleren

De GitHub Actions-browsertest controleert:

- direct bewerken van tekst, antwoorden en oefeningen;
- behoud van de bewerkte gegevens in het onderliggende lesbestand;
- keuze van een andere werkvorm en vlakverdeling;
- dupliceren en verslepen van lesdelen;
- aanpassen van een sjabloon zonder HTML te schrijven;
- opnieuw openen van de geëxporteerde HTML met de bewerkte inhoud;
- herstellen van een lokaal concept, waar de browser opslag toestaat;
- de mobiele breedte en screenshots;
- de bestaande stem-, grafiek- en presentatiefuncties.

Dit is een technische browsercontrole en nog geen gebruikerstest met een groep wiskundedocenten.

## Controle van bewaren en opnieuw openen (5 november 2026)

De editor bewaart rechtstreeks bewerkte waarden zonder ze opnieuw door de regelnotatie van het uitgebreide formulier te halen. Regeleinden, verticale strepen, lege hulpvelden en begripsvragen met twee of drie keuzes blijven intact. Een volledig lesbestand behoudt bij openen de opgeslagen volgorde en lesroute. Losse inhoud gebruikt de gekozen route.

Grafiekexperimenten zijn op de dia te bewerken via naam, onderzoeksvraag, instructie en getallen. De presentatie gebruikt ook beginwaarden buiten het oorspronkelijke bereik van de schuifregelaars. Ongeldige getallen krijgen een melding. Een dia verwijderen en het onthulmoment van een meerkeuzevraag kiezen kunnen rechtstreeks in de visuele editor.

De aanvullende browserproef `tests/journey.mjs` doorloopt alle negen werkvormen, echte versleepbediening, opslaan en opnieuw openen van JSON, eigen vormgeving en het openen van de HTML zonder netwerk. Ook uitgeschakelde tools, toetsenbordbediening van een grafiekschuif, antwoordafdekking na navigeren via het overzicht en herstel direct na herladen worden gecontroleerd. Een gebruikerstest met wiskundedocenten en controle op een fysiek digibord blijven afzonderlijke stappen.
