# De interactieve export naast Docentstudio v9

De volledige oorspronkelijke les blijft bewaard als `examples/verdubbelen-halveren-v9.html`. Een nieuwe les uit de generator hoeft de oorspronkelijke inhoud niet te kopiëren, maar de docent moet dezelfde soorten interacties kunnen gebruiken.

## Werking in de geëxporteerde HTML

| Handeling | Nu in de generator |
| --- | --- |
| Eerst voorspellen, later antwoord bespreken | Meerkeuzevraag met aanklikbare keuze; een uitgestelde vraag toont het antwoord niet meteen |
| Drie begripsvragen op één dia | `quizset`, antwoordkeuzes per vraag, uitleg op verzoek |
| Vier onderzoeken naar groei en afname | Grafiekdia met tabs voor verdubbelen, beginwaarde, groeifactor en halveren |
| Beginwaarde en groeifactor wijzigen | Directe herberekening van grafiek, formule en waardentabel |
| Lineaire groei vergelijken | Tweede grafieklijn op verzoek |
| Meetpunten en hulplijnen | Eerst verborgen, op verzoek te tonen; klikbare tijdstippen |
| Eerste en tweede klassikale stemming | Vanuit de onderzoekdia terughalen, opnieuw tellen en vergelijken |
| Foutieve uitwerking bespreken | `error`, leerling ontdekt de fout vóór de verbetering verschijnt |
| Rekenen met hulp en uitwerkingen | `practice`, hulp en uitwerking afzonderlijk per opgave |
| Uitleg stapsgewijs tonen | `steps` met één stap per klik |
| Zelfstandige afsluiting | Apart afsluitend oefendeel met uitwerkingen op verzoek |
| Digibordweergave | Eigen presentatiebalk, voortgang en navigatie; editor niet in beeld |
| Docentgereedschap | Bestaande pen, markeerstift, gum, stemrondes, klok, notities en overige tools |

De grafiekdia mag ook een eigen lijst `experimenten` uit de JSON lezen, met per experiment een naam, onderzoeksvraag, instructie, groeifactor, beginwaarde en doelfactor. De docent kan diezelfde lijst in de editor bewerken. Zonder lijst maakt WiHTML vier standaardonderzoeken.

## Wat de browsertest controleert

De test downloadt de HTML vanuit de leseditor en opent dat bestand als een afzonderlijke lokale pagina. Daarna klikt hij in het **geëxporteerde bestand** door de beginvraag, quizgroep, vier experimenttabs, meetpunten, stemrondes, foutenanalyse en het exit ticket. De gedownloade HTML en screenshots worden bij een geslaagde GitHub Actions-run als artefact opgeslagen.

De browsercontrole toont dat de functies technisch werken in Chromium. Zij bewijst niet dat alle dia's op ieder digibord goed passen of dat alle wiskunde in nieuwe lesbestanden correct is. De docent controleert de eigen inhoud.

## Grenzen

De oorspronkelijke v9 is een uitgewerkte les met precies op die inhoud geschreven formuleringen en details. De generator bouwt nieuwe lessen uit algemene onderdelen. Specifieke maatwerkinteracties uit v9 die niet als algemene werkvorm zijn beschreven, verschijnen niet automatisch in iedere nieuwe les. De export werkt zonder account, netwerk of AI-aanroep; stemgegevens zijn groepsaantallen in de lokale browseropslag.

De productieversie op eaimodel.nl wordt pas gewijzigd na review en een geslaagde websitebuild.
