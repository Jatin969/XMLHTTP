const breedSelector = document.getElementById("select-breed");
const subBreedSelector = document.getElementById("select-sub-breed");
const searchButton = document.getElementById("search-button");
const numberSelector = document.getElementById("select-numbers");
const contentDisplay = document.getElementById("content-display");

let req = new XMLHttpRequest();

let data;

req.open("GET", "https://dog.ceo/api/breeds/list/all", true);
req.onerror = (e) => {
    errorLog(req.statusText);
};

req.send();

req.addEventListener("load", function(e){
    data = JSON.parse(this.responseText).message;
    insertInBreedSelection(data);
});

function insertInBreedSelection(data){
    for(let breed in data){
        insertEachInBreedSelection(breed);
    }
}

function insertEachInBreedSelection(breed){
    breed = (breed + "").toUpperCase();
    let val = document.createElement("option");
    val.innerHTML = breed;
    val.value = breed;
    breedSelector.appendChild(val);
}

function addOptionToSubBreedSelector(subBreed){
        let temp = subBreed.toUpperCase() ;
        let val = document.createElement("option");
        val.innerText = temp;
        val.value = temp;
        subBreedSelector.appendChild(val);
}

function setDefaultStateOfSubBreedSelector(){
    subBreedSelector.innerHTML = "";
    let def = document.createElement("option");
    def.innerText = "ANY";
    def.value = "ANY";
    def.selected = true;
    subBreedSelector.appendChild(def);
}

breedSelector.addEventListener("change", function(e) {
    if(breedSelector.value !== "ANY"){
        let breed = e.target.value.toLowerCase();
        setDefaultStateOfSubBreedSelector();
        let listOfSubBreeds = data[breed];
        listOfSubBreeds.forEach(function(subBreed){addOptionToSubBreedSelector(subBreed);})
    }
})

function generalSearchRequest(count){
    let request = new XMLHttpRequest();
    request.open("GET", `https://dog.ceo/api/breeds/image/random/${count}`, true);
    request.send();
    request.addEventListener("error", function(e){console.error(e.message);})
    request.addEventListener("load", function(e){
        let content = JSON.parse(this.responseText).message;
        displayContent(content,count);
    })
}

function withoutSubBreedSearch(breed, count){
    let request = new XMLHttpRequest();
    request.open("GET", `https://dog.ceo/api/breed/${breed}/images/random/${count}`, true);
    request.send();
    request.addEventListener("error", function(e){console.error(e.message);})
    request.addEventListener("load", function(e){
        let content = JSON.parse(this.responseText).message;
        displayContent(content,count);
    })
}

function withSubBreedSearch(breed, subBreed, count){
    let request = new XMLHttpRequest();
    request.open("GET", `https://dog.ceo/api/breed/${breed}/${subBreed}/images/random/${count}`, true);
    request.send();
    request.addEventListener("error", function(e){console.error(e.message);})
    request.addEventListener("load", function(e){
        let content = JSON.parse(this.responseText).message;
        displayContent(content, count);
    })
}


function displayContent(content, count){
    console.log(content.length);
    contentDisplay.innerHTML = "";
    let contentCount = 0;
    content.forEach((e) => {
        contentCount++;
        let newDog = document.createElement("div");
        newDog.classList.add("card","m-4");
        newDog.innerHTML = `<img class="card-img w-100 h-100 object-fit-cover border rounded" src="${e}" alt="Card image cap">`;
        contentDisplay.appendChild(newDog);
    });

    if(parseInt(count,10) !== content.length) {
        let heading = document.createElement("h2");
        heading.innerText = "Sorry, we have no more relative images according to your search.";
        contentDisplay.appendChild(heading); 
    }          
}

async function searchFetch(breed, subBreed, count){
    let url = "";
    if(breed === "any"){
        url = `https://dog.ceo/api/breeds/image/random/${count}`;
    }else if(breed !== "any" && subBreed === "any"){
        url = `https://dog.ceo/api/breed/${breed}/images/random/${count}`;
    }else if(breed !=="any" && subBreed !== "any"){
        url = `https://dog.ceo/api/breed/${breed}/${subBreed}/images/random/${count}`;
    }

    fetch(url,{method : 'GET'})
    .then(response => {
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(function(response){
        displayContent(response.message,count);
    })
    .catch(error => errorLog(error.message));
}

function search(breed, subBreed, count){
    if(breed === "any"){
        generalSearchRequest(count);
    }else if(breed !== "any" && subBreed === "any"){
        withoutSubBreedSearch(breed, count);
    }else if(breed !=="any" && subBreed !== "any"){
        withSubBreedSearch(breed, subBreed, count);
    }
}

function errorLog(e) {
    console.log(e);
}

searchButton.addEventListener("click",() => { 
    searchFetch(breedSelector.value.toLowerCase(),subBreedSelector.value.toLowerCase(), numberSelector.value)
});