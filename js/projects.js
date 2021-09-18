// Load the Projects JSON using async Fetch call
const LoadProjects = async() => {
    let apiUrl = "https://localhost:5001/projects";

    // Send the request
    let request = await fetch(apiUrl);
    if(request.ok) {
        // If the request was returned 200 OK then parse the response as json
        let projects = await request.json();
        // Call the method
        GenerateProjectCards(projects);
    } else {
        // Output potential error in console
        Debug("Connection error: " + request.status);
    }
}

// Loops over all available projects and inserts project card HTML into div
const GenerateProjectCards = (arr) => {
    let projectsArea = document.getElementById("cards");

    let newCard = "";
    for(let x = 0; x < arr.length; x++){
        newCard = `<div id="card">
        <a href="/project.html?projectid=${arr[x].id}">
        <button type="submit">
        <img src="${arr[x].imageA}'" alt="Image Text"/>
        <h4>${arr[x].name}</h4>
        <p>${arr[x].summary}</p>
        </button>
        </a>
        </div>`;

        // Insert content text into appropriate HTML-element
        projectsArea.insertAdjacentHTML('afterbegin', newCard); 
    }
}

// When whole site document is loaded, call the method
if(document.readyState = "complete"){
    LoadProjects();
}