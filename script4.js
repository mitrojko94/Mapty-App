//DISPLAYING A MAP USING LEAFLET LIBRARY

//Skidam putanju za biblioteku Leaflet i kopiram ga u nas index.html, u head deo, ali pre povezivanja nase skripte sa fajlom index
//Koristim sa script tag prefiks defer, jer mi je bitan red kojim ce biti izvrseno ovo sve

//U zagradi L.map() ide id za mapu, mora biti isti ovde, a i u fajlu index.html. Ako promenim ovde, menjam i tamo i obrnuto
//L je globalna varijabla u skripti leaflet.js i mozemo joj pristupiti iz svih ostalih skripti
//console.log(firstName); //Izbacuje mi u konzoli ime, jer je to globalna varijabla u skripti other.js. Svaka varijabla koja je globalna, bice dostupna u svim drugim skriptama, sve dok se pojavljuje pre skripte u kojoj mi radimo
const form = document.querySelector(".form");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");
const inputType = document.querySelector(".form__input--type");

let map, mapEvent; //Stavio sam ovde, da bih mogao da joj pristupim iz koga, ovo je sada globalna varijabla

navigator.geolocation.getCurrentPosition(function (position) {
  const { latitude } = position.coords;
  const { longitude } = position.coords;
  //console.log(latitude, longitude);

  const coords = [latitude, longitude]; //Stavio sam u listu moje kordinate, jer mi metoda setView i marker prima listu

  //Ubacivanje koda za prikaz mape
  map = L.map("map").setView(coords, 13); //Drugi parametar 13, odnosi se na zumiranje, koliko ce biti zumirano. Sto je veci broj, to ce biti zumiranje vece
  //console.log(map);

  //Ima vise stilova za opetstreetmap, to moze da se nadje na internetu
  L.tileLayer("https://{s}.tile.openstreetmap.fr/hot//{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  //DISPLAYING A MAP MARKER
  //Ovo on() dolazi iz biblioteke Leaflet. Kao parametar callback f-ji dodajem mapEvent, a to je event koji je kreirala biblioteka Leaflet
  map.on(
    "click",
    function (mapE) {
      mapEvent = mapE; //Stavio sam ovako, jer mi treba za dole mapE, zbog toga je mapEvent jednak tome i zato je globalna varijabla, da bih mogao da je koristim
      //RENDERING WORKOUT INPUT FORM
      form.classList.remove("hidden");
      inputDistance.focus(); //Omogucava da kad se klikne na mapi, da se odmah fokusira na kucanje daljine
    },
    function () {
      alert("Coudn not find your location");
    }
  );
});

//DODAVANJE EVENTLISTENER-A NA FORMU(U OKVIRU LEKCIJE RENDERING WORKOUT INPUT FORM)
form.addEventListener("submit", function (e) {
  e.preventDefault();

  //Clear input fields(uvek staviti ime polja.value, jer brisem value, a ne ceo element)
  inputDistance.value =
    inputDuration.value =
    inputCadence.value =
    inputElevation.value =
      "";

  //Display marker
  console.log(mapEvent);
  const { lat, lng } = mapEvent.latlng;
  //console.log(lat, lng);

  //Stavio sam kao parametre markeru lat i lng, da se izbaci marker tamo gde ja kliknem na mapi
  //U metodi bindPopup mogu da napravim novi Popup, koji ce da mi ima neke opcije
  //Kad nesto hocu da dodam ili promenim, odem u dokumentaciju, tamo pise sta sve moze i kako moze da se menja

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false, //Ovo omogucava da se prozor ne zatvori, kad korisnik klikne negde na mapi
        className: "running-popup", //Ime klase u fajlu css, koja je stilizovana tamo i ovde je pozivam da bih imao neki css
      })
    )
    .setPopupContent("Workout")
    .openPopup();
});

//Menjanje sa running na cycling
inputType.addEventListener("change", function () {
  //Posto koristim metodu toggle()n pravim da je uvek jedna klasa vidljiva, a druga nije
  inputElevation.closest(".form__row").classList.toggle("form__row--hidden"); //Trazim najblizeg roditelja i njegovo ime stavljam kao parametar
  inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
});
