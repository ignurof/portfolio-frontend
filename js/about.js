// Load the About me content text using async Fetch call
const LoadAbout = async() => {
    let apiUrl = "http://api.ignurof.xyz";
    let content = document.getElementById("about-content");

    // Send the request
    let request = await fetch(apiUrl);
    if(request.ok) {
        // If the request was returned 200 OK then parse the response as text
        let response = await request.text();
        // Insert content text into appropriate HTML-element
        content.insertAdjacentHTML('afterbegin', response); 
    } else {
        // Output potential error in console
        console.log("Connection error: " + request.status);
    }
}

// When whole site document is loaded, call the method
if(document.readyState = "complete"){
    LoadAbout();
}