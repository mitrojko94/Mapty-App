//USING THE GEOLOCATION API

if (navigator.geolocation)
  //kao input uzima callback f-ju. Prva f-ja je f-ja koja se vraca kad pretrazivac nadje kordinate korisnika, a druga f-ja je "Error Callback" koja izbacuje gresku ako se pojavi prilikom dobavljanja kordinata
  navigator.geolocation.getCurrentPosition(
    function (position) {
      //Uvek se ova f-ja poziva sa nekim parametrom
      //console.log(position);;

      //Dobavljam kordinate iz objekta
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      console.log(latitude, longitude);

      //Pravlje URL linka u pretrazivacu, u Google Maps, pomocu nasih dobijenih kordinata
      console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
    },
    function () {
      alert("Could not get your position");
    }
  );
