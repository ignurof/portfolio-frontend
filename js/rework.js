// Method that prints out input string
const Print = function(str){
    console.log(str);
}

// Declare and initialize variable that is local to the scope, in this case the whole thing
// Reference a HTML-element with the id "test"
let test = document.getElementById("test");
// Adds an event listener to the HTML-element that listens to clicks, and calls the appropriate method when it happens
test.addEventListener("click", Print);