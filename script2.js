//HOW TO PLAN A WEB PROJECT

//Pre nego sto se pocne praviti projekat obavezno je planiranje projekta
//1. korak je User Stories(to je opis funkcionalnosti aplikacija iz perspektive korisnika. Sve korisnikove price zajedno opisuju celu aplikaciju)
//2. korak je Features(osobine aplikacije)
//3. korak je Flowchart(gde stavljamo sve osobine aplikacije) i na osnovu ovoga saznajemo sta cemo da pravimo
//4. korak je Architecture(kako cemo organizovati kod i koje cemo osobine JS koristiti)
//Kad smo zavrsili ova 4 koraka, zavrsili smo proces planiranja i prelazimo na proces izdrade, pravljenja aplikacije(development step)

//1. USER STORIES - to je opis funkcionalnosti aplikacije iz perspektive korisnika i sve korisnikove price zajedno, daju celu sliku o funkcionalnosti aplikacije
//Najcesci oblik je: As a [type of user](misli se na ko, tipa user, admin i slicno), I want [an action](misli se na sta) sto that [a benefit](misli se na zasto)

//Primer: Kao korisnik, hocu da logujem trcanje sa lokacijom, distancom, vremenom, tempom i minutima, tako da mogu da obracam paznju na trcanje
//Primer: Kao korisnik, hocu da vidim ceo trening, tako da mogu da pratim moj proces napretka
//Primer: Kao korisnik hocu da vidim moj trening na mapi, da znam gde sam vezbao najvise
//Primer: Kao korisnik hocu da vidim moju aplikaciju, mesta gde sam vezbao i kad izadjem iz aplikacije, pa ponovo udjem

//Koristimo User Stories da objasnimo sta ce aplikacija da radi, to je glavni razlog i cilj ovoga

//2. FEATURES - osobine koje aplikacija treba da ima, a koje su zasnovane na user storires
//Trba nam mapa gde ce korisnik moci da klikne i da unese mesto vezbanja i to je najbolji nacin da dobijes kordinate lokacije
//Treba nam "geolocation" da prikazemo mapu trenutne lokacije
//Treba nam forma da unesem ostale podatke(vreme, tempo, minuti, rastojanje)
//Treba nam lista sa svim treninzima, jer korisnik zeli da vidi sve
//Treba da prikazemo sva vezbanja na mapi
//Treba nam local storage API, jer cemo tu da sacuvamo podatke, tako da kad korisnik izadje iz aplikacije, pa ponovo udje, ima sacuvane podatke

//3. FLOWCHART - sadrzi osobine koje treba da implementiramo, ali sadrzi kako razliciti delovi aplikacije radi jedni sa drugim
//Kad god pocinjemo, treba da pocnemo sa dogadjajem, a to je u ovom slucaju "page loads"
//Treba nam geolocation da dobijemo kordinate korisnika, a zatim hocemo da centriramo mapu da nam pokaze gde je tacno korisnik
//Treba nam forma koja se prikazuje kad god korisnik klikne negde na mapu
//Zuta boja su akcije, a zelena boja su kad nesto radimo na aplikaciji, a crvenom boje su operacije koje se desavaju asihrono
//Imamo eventListener na formi i kad god korisnik unese neku formu, ona ce biti prikazana na mapi i u listi
//Hocemo da sacuvamo podatke u pretrazivac, i kad korisnik napravi na mapi neku formu ona se sacuvava u local storage APi od pretrazivaca
//Kad god se stranica ucita, dobijamo te podatke iz local storage i oni se ucitavaju na mapi i u listi. To moze da se desi tek kad je lokacija ucitana i prikazana mapa
//Pomeranje mapa kad god kliknemo na neki trening koji smo uradili. Samo nam treba eventHandler na listi i kad god korisnik klikne na listu, pomerice se na lokaciju treninga

//ASYNC znaci da u operaciji kojoj treba neko vreme  i posle zavrsetka, kad je zavrsena, onda ostatak operacije koji zavisi od toga biva izvrsen

//4. ARCHITECTURE - poslednji korak u fazi planiranja
