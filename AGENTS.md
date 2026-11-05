# Werkinstructies WiHTML

Werk in een aparte branch en maak een reviewbare pull request. Publiceer niet rechtstreeks vanuit een ontwikkelbranch.

## Controleer steeds twee schermen
- De **editor** waarin een docent de les ontwerpt.
- De **presentatie** waarin leerlingen het lesmateriaal zien.

De presentatie moet bruikbaar blijven zonder zichtbaar editorpaneel. Docenttools zijn kleine overlays; ze mogen de dia niet verschuiven.

## Ontwerp
Volg docs/ontwerpafspraken.md. Gebruik een Figma-bestand pas als referentie wanneer de bron en versie zijn vastgelegd. Beoordeel broncode van een werkend Surge-voorbeeld op gedrag, niet op het hostingplatform.

## Didactiek
Een lesdeel beschrijft wat leerlingen zelf doen. Houd het onthullen van antwoorden onder controle van de docent. Er is geen automatische EAI-score voor leskwaliteit en geen claim dat stemverandering leren bewijst.

## Voorkom regressies
Controleer per wijziging:
1. Opbouw van alle lesdelen.
2. Antwoord pas tonen op het bedoelde moment.
3. Overlay openen/sluiten zonder layoutwijziging.
4. Wisactie voor aantekeningen op de juiste dia.
5. Zelfstandige export, zonder editorafhankelijkheden.
6. Contrast, toetsenbord en schermformaten.

Documenteer concrete resultaten. Een syntaxiscontrole is geen visuele browsertest.
