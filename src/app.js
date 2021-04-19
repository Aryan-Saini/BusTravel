const BASE_URL = { map: "https://api.mapbox.com/geocoding/v5/mapbox.places/" }
const BASE_PARAM = { key: "access_token=pk.eyJ1IjoiYXJ5YW5zMTIzIiwiYSI6ImNrbW1iM2h0eDFqZGkycW11M2EwMTRlbjEifQ.uFN4S1V7OTo42b9dhCLZ2Q", bbox: "bbox=-97.325875,49.766204,-96.953987,49.99275", limit: "limit=10" };
const originForm = document.querySelector(".origin-form");
const originIpu = document.querySelector(".origin-form input");
const originUl = document.querySelector(".origins");
const destForm = document.querySelector(".destination-form");
const destIpu = document.querySelector(".destination-form input");
const destUl = document.querySelector(".destinations");
const button = document.querySelector("button");
//1 === origins
//2 === destinations
async function display(num, str) {
  if (num === 1) {
    originUl.innerHTML = "";
    let data = await getStreets(str);
    console.log(data);
    data.features.forEach((itm) => {
      itm.place_name = itm.place_name.split(",");
      originUl.insertAdjacentHTML("beforeend",
        `
        <li data-long="${itm.center[0]}" data-lat="${itm.center[0]}">
          <div class= "name" > ${itm.place_name[0]}</div>
          <div>${itm.place_name[1]}</div>
        </li >
        `
      );
    })
  } else if (num === 2) {
    destUl.innerHTML = "";
    let data = await getStreets(str);
    console.log(data);
    data.features.forEach((itm) => {
      itm.place_name = itm.place_name.split(",");
      destUl.insertAdjacentHTML("beforeend",
        `
        <li data-long="${itm.center[0]}" data-lat="${itm.center[0]}">
          <div class= "name" > ${itm.place_name[0]}</div>
          <div>${itm.place_name[1]}</div>
        </li >
        `
      );
    })
  }
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
  if (originIpu.value.length > 1) {
    display(1, originIpu.value);
  }
}

destForm.onsubmit = (e) => {
  e.preventDefault();
  if (destIpu.value.length > 1) {
    display(2, destIpu.value);
  }
}

originUl.onclick = (e) => {
  let li = e.target.closest("li");
  console.log(li);
  if (li) {
    unslectAll(1);
    li.classList.add("selected");
  }
}

destUl.onclick = (e) => {
  let li = e.target.closest("li");
  console.log(li);
  if (li) {
    unslectAll(2);
    li.classList.add("selected");
  }
}
