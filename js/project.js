let projects;

const LoadDynamicProject = async() => {
    let apiUrl = "https://localhost:5001/projects";

    // Send the request
    let request = await fetch(apiUrl);
    if(request.ok) {
        // If the request was returned 200 OK then parse the response as json
        projects = await request.json();
        // Call the method
        GenerateProjectContent(projects);
    } else {
        // Output potential error in console
        Debug("Connection error: " + request.status);
    }
}

const GenerateProjectContent = (arr) => {
    // running on https://www.example.com?name=n1&name=n2
    let params = new URLSearchParams(location.search);
    let paramValue = params.get('projectid');

    // Reference the url parameter value
    let projectID = paramValue;

    // make the array variables easier to read
    let pID;
    let pNAME;
    let pSUMMARY;
    let pCONTENT;
    let pIMAGEA;
    let pIMAGEB;
    let pIMAGEC;
    let pIMAGED;

    let newProjectContent = "";

    for(let i = 0; i < arr.length; i++){
        if (arr[i].id == projectID){
            pID = arr[i].id;
            pNAME = arr[i].name;
            pSUMMARY = arr[i].summary;
            pCONTENT = arr[i].content;
            pIMAGEA = arr[i].imageA;
            pIMAGEB = arr[i].imageB;
            pIMAGEC = arr[i].imageC;
            pIMAGED = arr[i].imageD;

            newProjectContent = `<div id="dynamic-project-header">
            <form action="project.html" method="get">
            <button class="btn-back" type="submit">
            <
            </button>
            <input name="projectid" type="hidden" value="${ChangeProject(pID, "back")}" />
            </form>
            <h1 class="name">${pNAME}</h1>
            <form action="project.html" method="get">
            <button class="btn-forward" type="submit">
            >
            </button>
            <input name="projectid" type="hidden" value="${ChangeProject(pID, "forward")}" />
            </form>
            </div>
            <div id="dynamic-project-content">
            <p class="content">
            ${pCONTENT}
            </p>
            <img class="ImgThumbnail" id="imagea" src="img/${pIMAGEA}" alt="No Image" />
            <img class="ImgThumbnail" id="imageb" src="img/${pIMAGEB}" alt="No Image" />
            <img class="ImgThumbnail" id="imagec" src="img/${pIMAGEC}" alt="No Image" />
            <img class="ImgThumbnail" id="imaged" src="img/${pIMAGED}" alt="No Image" />
            </div>`;
        }
    }

    // verify that the projectID exist, otherwise redirect
    if(pID == null){
        if (projectID > projects[0]) {
            window.location.href = "/about.html";
        }
    
        if (projectID < projects[projects.length - 1]) {
            window.location.href = "/about.html";
        }
    }
    

    // Reference element
    let wrapper = document.getElementById("wrapper");
    // Insert into HTML-element
    wrapper.insertAdjacentHTML('afterbegin', newProjectContent);
}

const ChangeProject = (id, dir) => {
    let back = id + 1; // Då jag hämtar listan med projekt i DESC order, så har index 0 i array högst projectID, vilket innebär att tillbaka måste räkna uppåt.
    let forward = id - 1;

    if (dir == "back") {
        return back;
    }

    if (dir == "forward") {
        return forward;
    }
}

// When whole site document is loaded, call the method
if(document.readyState = "complete"){
    LoadDynamicProject();
}