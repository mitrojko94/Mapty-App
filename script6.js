const form = document.querySelector(".form");
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

  constructor(coords, distance, duration) {
    this.coords = coords; //Niz od lat i lng [lat, lng]
    this.distance = distance; //in km
    this.duration = duration; //in min
  }
}

//Child classes
class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }

  //Metoda za izracunavanje tempa(pace)
  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
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
  #mapEvent;

  //Poziva se odmah(constructor) kad se kreira novi objekat od ove klase. Posto se on odmah ucita, kako se strana obnovi, tako moze da se uradi i sa _getPosition(), zato mu ga prosledjujemo
  constructor() {
    this._getPosition(); //Stavio sam this, da se odnosi na trenutni objekat(misli se na app)

    //U eventHandleru this uvek upucuje na objekat na koji je nakacen eventHandler
    form.addEventListener("submit", this._newWorkout.bind(this)); //Stavljam bind(this), da bi mi se odnosilo na f-ju app, jer se bez toga ondnosi na form

    //Ne mora da se kaci metoda bind(this), jer ne koristi this i nije bitno kako ce on da izgleda
    inputType.addEventListener("change", this._toggleElevationField);
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
    console.log(`https://www.google.pt/maps/@${latitude}, ${longitude}`);
    const coords = [latitude, longitude];

    //console.log(this); //Vrati mi undefined, jer u regularnoj f-ji this je uvek undefined
    this.#map = L.map("map").setView(coords, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot//{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on("click", this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  _toggleElevationField() {
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  _newWorkout(e) {
    e.preventDefault();
    //console.log(this);

    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        "";

    //console.log(this.#mapEvent);
    const { lat, lng } = this.#mapEvent.latlng;

    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: "running-popup",
        })
      )
      .setPopupContent("Workout")
      .openPopup();
  }
}

const app = new App();
