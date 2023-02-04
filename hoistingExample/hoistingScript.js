const dataField = document.getElementById("data");


console.log(dataField);
console.log(update);
console.log(helloWorld);
console.log(value);

update();


var value = 10;
console.log(value);


function update() {
    dataField.innerHTML = `The Sum of value = ${value}and secondValue = ${secondValue} is ${value + secondValue}`;
}

var helloWorld = () => {
    dataField.innerHTML = `<h1>Hello World </h1>`;
}

var secondValue = 20;

