const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");
const inputType = document.querySelector(".form__input--type");

//MANAGING WORKOUT DATA: CREATING CLASSES
//Parent class
class Workout {
  date = new Date();
  id = (Date.now() + "").slice(-10);
  clicks = 0;

  constructor(coords, distance, duration) {
    this.coords = coords; //Niz od lat i lng [lat, lng]
    this.distance = distance; //in km
    this.duration = duration; //in min
  }

  _setDescription() {
    //Kad stavim u neku metodu kod ispod(linija koda 22), onda mi prettier ignorise tu liniju, taj kod i ne formatira ga lepo
    //prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }

  click() {
    this.clicks++;
  }
}

//Child classes
class Running extends Workout {
  type = "running";

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription(); //Treba mi ovde, u child class, jer imam u ovoj klasi type koji mi treba za racunanje. Radice zbog scope chaina, ova klasa ce imati pristup svim metodama roditeljske klase
  }

  //Metoda za izracunavanje tempa(pace)
  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = "cycling"; //Bice dostupna na svim distancama. Isto je kao da sam napisao u liniji koda 44

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
    //this.type = "cycling";
  }

  //Metoda za izracunavanje brzine(speed)
  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60); //Delim duration sa 60, da bi bilo u satima
    return this.speed;
  }
}

// const run1 = new Running([39, -12], 5.2, 24, 178);
// const cycling1 = new Cycling([39, -12], 27, 95, 523);
// console.log(run1, cycling1);

//REFACTORING FOR PROJECT ARCHITECTURE - APPLICATION ARCHITECTURE
class App {
  //Private field
  #map;
  #mapZoomLevel = 13;
  #mapEvent;
  #workouts = [];

  //Poziva se odmah(constructor) kad se kreira novi objekat od ove klase. Posto se on odmah ucita, kako se strana obnovi, tako moze da se uradi i sa _getPosition(), zato mu ga prosledjujemo
  constructor() {
    //U constructoru mi je sav kod koji hocu da se ucita kad se ucita i stranica
    //Get user's position
    this._getPosition(); //Stavio sam this, da se odnosi na trenutni objekat(misli se na app)

    //U eventHandleru this uvek upucuje na objekat na koji je nakacen eventHandler
    form.addEventListener("submit", this._newWorkout.bind(this)); //Stavljam bind(this), da bi mi se odnosilo na f-ju app, jer se bez toga ondnosi na form

    //Attach event handlers
    //Ne mora da se kaci metoda bind(this), jer ne koristi this i nije bitno kako ce on da izgleda
    inputType.addEventListener("change", this._toggleElevationField);

    //MOVE TO MARKER ON CLICK - nastavna lekcija
    //Posto nemam objekat na koji cu da kacim eventHandler, koristim event delegation
    containerWorkouts.addEventListener("click", this._moveToPopup.bind(this));

    //Get data from local storage
    this._getLocalStorage();
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        //Kad sam pozvao metodu bind(this) onda ona pravi novu f-ju i this upucuje na ono sto hocemo
        this._loadMap.bind(this),
        function () {
          alert("Coudn not find your location");
        }
      );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    //console.log(`https://www.google.pt/maps/@${latitude}, ${longitude}`);
    const coords = [latitude, longitude];

    //console.log(this); //Vrati mi undefined, jer u regularnoj f-ji this je uvek undefined
    this.#map = L.map("map").setView(coords, this.#mapZoomLevel);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot//{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on("click", this._showForm.bind(this));

    this.#workouts.forEach((value, index, arr) => {
      this._renderWorkoutMarker(value); //Ne radi, jer mapa jos nije ucitana kad se pozove ova metoda. Zato je stavljam u metodu _loadMap, da se ucita sa pojavom mape
    });
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  _hideForm() {
    //Empty inputs
    inputDistance.value =
      inputCadence.value =
      inputDuration.value =
      inputElevation.value =
        "";

    //Sakrivanje forme
    form.style.display = "none";
    form.classList.add("hidden");
    setTimeout(() => (form.style.display = "grid"), 1000); //Poziva callback f-ju posle 1 sekunde
  }

  _toggleElevationField() {
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  _newWorkout(e) {
    //F-ja za proveru unosu podataka
    const validInputs = (...inputs) =>
      //Ide kroz moj inputs i proverava da li su pozitivni. Vraca True, ako su svi inputi pozitivni
      inputs.every(inp => Number.isFinite(inp));

    //F-ja za proveru da li su inputi pozitivni
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    e.preventDefault();

    //CREATING A NEW WORKOUT - naslov lekcije

    //Get data from form

    //inputType.value je running ili cycling, zavisi sta se odabere
    //Kad stavim ovako ispod, tipa linija koda 123, tako dobijam unetu vrednost za distance u formi
    const type = inputType.value;
    const distance = Number(inputDistance.value);
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng; //Stavio sam ovde, da bih mogao da imam varijable od lat i lng i da bi mogao da ih koristim dole u kodu(linija koda 152)
    let workout; //Stavio sam ovo kao globalnu varijablu da bi mogao da joj pristupim dole iz blok koda

    //If workout running, create running object
    if (type === "running") {
      const cadence = +inputCadence.value;

      //Check if data is valid. To znaci da su svi brojevi, pozitivni
      //Koristm guard class, to znaci da radim u if naredbi suprotno od onoga sto hocu. Ako je to tacno onda samo vratim f-ju
      //Ovu proveru sam radio ovde, jer da sam je stavio van ovoga bilo bi tesko napraviti, jer je samo jednom aktivan running ili cycling, nisu oba istovremeno

      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(cadence)
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert("Input have to be positive numbers!");

      //Create new running object
      workout = new Running([lat, lng], distance, duration, cadence);
    }

    //If workout cycling, create cycling object
    if (type === "cycling") {
      const elevation = +inputElevation.value;
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert("Input have to be positive numbers!");

      //Create new cycling object
      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    //Add new object to workout array
    this.#workouts.push(workout);
    //console.log(workout);

    //Render workout on map as marker
    this._renderWorkoutMarker(workout);

    //Render workout on list
    this._renderWorkout(workout);

    //Hide form and clear input fields
    this._hideForm();

    //Set local storage to all workouts
    this._setLocalStorage();
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords) //Kordinate dolazi iz workout.coords, jer se mora znati gde ce marker da se stavi
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`, //Stavio sam type, jer mi je to running ili cycling i kao temporal literal, da bih imao razlicite boje
        })
      )
      .setPopupContent(
        `${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"} ${workout.description}`
      ) //Ovo ce mi biti izbaceno kao tekst
      .openPopup();
  }

  //RENDERING WORKOUTS - naslov lekcije (prikazivanje nasih dogadjana na mapi)
  _renderWorkout(workout) {
    let html = `
    <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"
            }</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
    `;

    if (workout.type == "running")
      html += `
    <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
          </li>
    `;

    if (workout.type == "cycling")
      html += `
            <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>
          </li>
            `;

    //Dodaje novi element kao sibling(brat i sestra) element na kraj forme. U prevodu kad god dodajem novi element bice prvi na displeju korisnika
    form.insertAdjacentHTML("afterend", html);
  }

  //MOVE TO MARKER ON CLICK - nastavna lekcija
  //Radim pomocu event delegation
  _moveToPopup(e) {
    const workoutEl = e.target.closest(".workout");
    //console.log(workoutEl);

    if (!workoutEl) return;
    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );
    //console.log(workout);

    // //Prvi parametar su kordinate, drugi parametar je zumiranje. Misli se na metodu setView()
    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });

    //Using the public interface
    //Click metoda mi ne radi, jer kad radim prebacivanje objekta u string i obrnuto izgubi se prototype chain. Nisu vise objekti koji su kreirani od strane running ili cycling klase, vec su regularni objekti
    //workout.click();
  }

  //WORKING WITH LOCAL STORAGE - nastavna lekcija
  //Objekti koji dolaze iz localStore nemaju svi nasledjivanje, ne nasledjuju svi metode od svog roditelja
  _setLocalStorage() {
    //LocalStorage je API koji pretrazivac planira za nas i mi mozemo da ga uzmemo
    //JSON.stringify - sluzi da bilo koji objekat JS konvertujem u string
    //LocalStorage ne koristiti za smestaj velikih podataka, jer ce usporiti aplikaciju. Koristiti samo za male aplikacije

    localStorage.setItem("workouts", JSON.stringify(this.#workouts)); //Prvi parametar je ime storaga, a drugi parametar je string koji hocemo da sacuvamo i koji ce biti povezan sa imenom. Ovo je kao par key: value
  }

  //Pravim metodu za dobavljanje podataka, da kad ucitam stranicu da mi stoje na mapi podaci
  _getLocalStorage() {
    //JSON.parse radi suprtono od JSON.stringify tj. pretvara string u objekat
    const data = JSON.parse(localStorage.getItem("workouts")); //Prosledim kao parametar ime kljuca u localStorage.setItem()
    //console.log(data);

    if (!data) return;

    this.#workouts = data; //Kad ucitam stranicu, pozove se metoda _getLocalStorage i moj niz(workouts) je prazan. A ako imam neki podatak u local storage, niz ce biti jednak tom podatku koji vec postoji

    this.#workouts.forEach((value, index, arr) => this._renderWorkout(value));
  }

  //Brisanje podataka iz localStorage, iz konzole
  reset() {
    localStorage.removeItem("workouts"); //Prosledim kao parametar kljuc koji sadrzi nase podatke
    location.reload();
  }
}

const app = new App();
