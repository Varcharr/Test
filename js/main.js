window.onload = () => {

let clientId = "************";
let clientSecret = "*************";
let venuesData = [];
let myIndex = 0;


let x = document.getElementById("all");
let one = document.getElementById("one");
let backBtn = document.getElementById("backBtn");
let big = document.getElementById('big');
let sort = document.getElementById('sort');
let back = document.getElementById('back');
let distanceBtn = document.getElementById("distanceBtn");
let priceBtn = document.getElementById("priceBtn");


let saveData = (data) =>{
  data.response.groups[0].items.forEach((place) =>{
    venuesData.push(place);
  })
  venuesData=venuesData.sort(compareDistance);
  write(data);
}

console.log(venuesData);
//Geolocation
let getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(positionSuccess, positionError);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

let positionSuccess = (position) => {
  // let latitude = position.coords.latitude;
  // let longitude = position.coords.longitude;
  // let latitude = 40.757773;
  // let longitude =  -73.986393;
  let latitude = 55.760196;
  let longitude =  37.624894;
  let url="https://api.foursquare.com/v2/venues/explore?v=20171020&ll="+ latitude +","+ longitude +"&radius=1000&section=coffee&query=coffee&limit=10&venuePhotos=1&openNow=1&client_id="+clientId+"&client_secret="+clientSecret;

  getJSON(url, saveData);
}

let positionError = (error) => {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      x.innerHTML = "You need to enable geolocation if you want to get some coffee."
      break;
    case error.POSITION_UNAVAILABLE:
      x.innerHTML = "Location informations are unavailable."
      break;
    case error.TIMEOUT:
      x.innerHTML = "The request to get user location timed out."
      break;
    case error.UNKNOWN_ERROR:
      x.innerHTML = "An unknown error occurred."
      break;
  }
}

//Adding listeners on all listed venues
let addListeners = () =>{
    let items = document.querySelectorAll(".place");
    items.forEach((item)=>{
      item.onclick = (e) =>{
        e.stopPropagation();
        doThis(item.dataset.id);
      }
    })
}

//Displaying data
let write = () => {
    venuesData.forEach((place) =>{
      let name = place.venue.name;
      let distance = place.venue.location.distance;
      let id = place.venue.id;
      let image = place.venue.featuredPhotos.items[0].prefix+"original"+place.venue.featuredPhotos.items[0].suffix;

      x.innerHTML+="<div class='place' data-id='"+id+"' data-distance='"+distance+"'><img src='"+image+"'><h4>"+name+"</h4><span class='distance'>"+distance+" meters away</span></div>";
    });
    addListeners();
}
let compareDistance = (a,b) => {
  if (a.venue.location.distance < b.venue.location.distance)
    return -1;
  if (a.venue.location.distance > b.venue.location.distance)
    return 1;
  return 0;
}
let comparePrice = (a,b) => {
  if (a.venue.price == null && b.venue.price == null ) return 0;

  if (a.venue.price == null) return -1;
  if (b.venue.price == null) return 1;

  if (a.venue.price.tier < b.venue.price.tier)
    return -1;
  if (a.venue.price.tier > b.venue.price.tier)
    return 1;
  return 0;
}

let applyChanges = (comparation) =>{
  venuesData=venuesData.sort(comparation);
  x.innerHTML="";
  write();
}


distanceBtn.onclick =(e) =>{
  console.log(e);
  applyChanges(compareDistance);
}
priceBtn.onclick =(e) =>{
  console.log(e);
  applyChanges(comparePrice);
}

//Geting data
let getJSON = (url, callback) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload =  (e) => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
	            let res = xhr.responseText;
	               //Executes callback with the response parsed into JSON
                callback(JSON.parse(res));
            }
            else { // Server responded with error
                  x.innerHTML="Error couldn't load data";
                  console.error(xhr.statusText);
            }
        }
    };
    //Error with the request
    xhr.onerror = (e) => {
      x.innerHTML="Error couldn't load data";
      console.error(xhr.statusText);
    };
    // Send the request to the server
    xhr.send(null);
}


let doThis = (id) =>{
  infoState();
  getOne(id);
}

//State when showing informations for one venue
let infoState = () =>{
  x.style.display = 'none';
  one.style.display = "inline-block";
  back.style.display = "block";
  sort.style.display = "none";
}
//State when showing informations all venues
let defaultState = () =>{
  x.style.display = 'block';
  one.style.display = "none";
  back.style.display = "none";
  sort.style.display = "block";
  one.innerHTML="";
}

big.onclick = defaultState;
back.onclick = defaultState;

//Gets one venue informations
let getOne = (id) =>{
  let url = "https://api.foursquare.com/v2/venues/"+id+"?v=20131016&client_id="+clientId+"&client_secret="+clientSecret;
  getJSON(url,displayOne);
}

//Filter tips for word "coffee"
let coffeeTips = (tips) =>{
  let coffee = tips.filter((tip)=>{
    return tip.text.toLowerCase().includes("coffee");
  })
  return coffee;
}
//Tips html creation
let showCoffeTips = (tips) =>{
  if (tips[0] == null) return "";
  let html = "TIPS:<hr>";
  tips.forEach((tip)=>{
    html+="<p class='coffeeTip'>"+tip.text+"</p><hr>";
  })
  return html;
}
//Image html creation
let slideshowImages = (images) =>{
  let html = `<div id="slides">`;
  let numb=images.length;
    if (images.length>=10) numb=10;
      for (let i = 0; i <numb; i++) {
        html+="<img class='smallImg' src='"+images[i].prefix+"original"+images[i].suffix+"'>";
      }
      html  +="</div>";
    return html;
}
//Slide logic
let slideshowEnergy = () =>{
    let i;
    let x = document.getElementsByClassName("smallImg");
    for (i = 0; i < x.length; i++) {
       x[i].style.display = "none";
    }
    myIndex++;
    if (myIndex > x.length) {myIndex = 1}
    x[myIndex-1].style.display = "inline-block";
    setTimeout(slideshowEnergy, 4000);

}

//Showing one venue informations
let displayOne = (data) =>{
  let name = data.response.venue.name;
  let price = data.response.venue.price.message;
  let tips = data.response.venue.tips.groups[0].items;
  let address = data.response.venue.location.address;
  let htmlImages = slideshowImages(data.response.venue.photos.groups[0].items);
  let allTips =showCoffeTips(coffeeTips(tips));

  one.innerHTML+="<div><div class='centerImage'>"+htmlImages+"</div><h1>"+name+"</h1><p class='info'>Prices: "+price+"</p><p class='info'>Addres: "+address+"</p>"+allTips+"</div>";
  slideshowEnergy();

}



getLocation();
};
