const BASE_URL = { map: "https://api.mapbox.com/geocoding/v5/mapbox.places/", bus:"https://api.winnipegtransit.com/v3/trip-planner.json?"}
const BASE_PARAM = {busKey:"api-key=l_gZhdBTSoir8KZExWIJ&", key: "access_token=pk.eyJ1IjoiYXJ5YW5zMTIzIiwiYSI6ImNrbW1iM2h0eDFqZGkycW11M2EwMTRlbjEifQ.uFN4S1V7OTo42b9dhCLZ2Q", bbox: "bbox=-97.325875,49.766204,-96.953987,49.99275", limit: "limit=10" };
const originForm = document.querySelector(".origin-form");
const originIpu = document.querySelector(".origin-form input");
const originUl = document.querySelector(".origins");
const destForm = document.querySelector(".destination-form");
const destIpu = document.querySelector(".destination-form input");
const destUl = document.querySelector(".destinations");
const button = document.querySelector("button");
const ulTrip = document.querySelector(".my-trip");
button.style.display = "none";
const slectedList = document.getElementsByClassName("selected");
//1 === origins
//2 === destinations

function timeConvert(time) {
  time = time.split("T").join(" ");
  return new Date(time);
}

async function display(type, str) {
  if (type === 1) {
    originUl.innerHTML = "";
    let data = await getStreets(str);
    console.log(data);
    data.features.forEach((itm) => {
      itm.place_name = itm.place_name.split(",");
      originUl.insertAdjacentHTML("beforeend",
        `
        <li data-long="${itm.center[0]}" data-lat="${itm.center[1]}">
          <div class="name"> ${itm.place_name[0]}</div>
          <div>${itm.place_name[1]}</div>
        </li>
        `
      );
    })
  } else if (type === 2) {
    destUl.innerHTML = "";
    let data = await getStreets(str);
    console.log(data);
    data.features.forEach((itm) => {
      itm.place_name = itm.place_name.split(",");
      destUl.insertAdjacentHTML("beforeend",
        `
        <li data-long="${itm.center[0]}" data-lat="${itm.center[1]}">
          <div class= "name" > ${itm.place_name[0]}</div>
          <div>${itm.place_name[1]}</div>
        </li >
        `
      );
    })
  } 
}

async function route(orginLong, originLat, destLong, destLat) {
  console.log(slectedList[0].dataset.long,slectedList[0].dataset.lat,slectedList[1].dataset.long,slectedList[1].dataset.lat);
  let data = await fetch(`${BASE_URL.bus + BASE_PARAM.busKey}origin=geo/${originLat},${orginLong}&destination=geo/${destLat},${destLong}`);
  data = await data.json();
  let list = data.plans.sort((a,b) => {
    a = timeConvert(a.times.end);
    b = timeConvert(b.times.end);
    return a.getTime() < b.getTime()
  })
  display(3, data.plans[0]);
}
async function getStreets(str) {
  let data = await fetch(`${BASE_URL.map}${str}.json?${BASE_PARAM.key}&${BASE_PARAM.bbox}&${BASE_PARAM.limit}`)
  data = await data.json();
  return data;
}

//1 === origin
function unslectAll(type) {
  if (type === 1) {
    let itm = originUl.querySelector(".selected");
    if (itm) {
      itm.classList.remove("selected");
    }
  } else {
    let itm = destUl.querySelector(".selected");
    if (itm) {
      itm.classList.remove("selected");
    }
  }
}
originForm.onsubmit = (e) => {
  e.preventDefault();
  if (originIpu.value.length > 0) {
    display(1, originIpu.value);
    originIpu.value = "";
  }
}

destForm.onsubmit = (e) => {
  e.preventDefault();
  if (destIpu.value.length > 0) {
    display(2, destIpu.value);
    destIpu.value = "";
  }
}

originUl.onclick = (e) => {
  let li = e.target.closest("li");
  console.log(li);
  if (li) {
    unslectAll(1);
    li.classList.add("selected");
    if (slectedList.length === 2) {
      button.style.display = "inline-block";
    } else if (slectedList.length < 2) {
      button.style.display = "none";
    }
  }
}

destUl.onclick = (e) => {
  let li = e.target.closest("li");
  console.log(li);
  if (li) {
    unslectAll(2);
    li.classList.add("selected");
    if (slectedList.length === 2) {
      button.style.display = "inline-block";
    } else if (slectedList.length < 2) {
      button.style.display = "none";
    }
  }
}

button.onclick = () => {
  route(slectedList[0].dataset.long,slectedList[0].dataset.lat,slectedList[1].dataset.long,slectedList[1].dataset.lat);
}