const LoadSpecificProject = async() => {
    let apiUrl = "http://api.ignurof.xyz/project/";
    let params = new URLSearchParams(location.search);
    let paramValue = params.get("projectid");

    let newUrl = apiUrl + paramValue;

    let request = await fetch(newUrl);
    if(request.ok) {
        let response = await request.json();
        /*
            {
                "id":1,
                "title":"Jetpack Doggo 1",
                "summary":"C#, Unity",
                "content":"Text about the game",
                "images":["jp1.jpg","jp2.jpg","jp3.jpg","jp4.jpg"]
            }
            OR
            {
                "error": 0
            }
        */

        // Redirect if backend did not like the request, aka projectid does not exist on projectList
        if(response.error == 0){
            window.location.href = "/about.html";
        }

        let newProjectContent = `<div id="dynamic-project-header">
        <form action="project.html" method="get">
        <button class="btn-back" type="submit">
        <
        </button>
        <input name="projectid" type="hidden" value="${ChangeProject(response.id, "back")}" />
        </form>
        <h1 class="name">${response.title}</h1>
        <form action="project.html" method="get">
        <button class="btn-forward" type="submit">
        >
        </button>
        <input name="projectid" type="hidden" value="${ChangeProject(response.id, "forward")}" />
        </form>
        </div>
        <div id="dynamic-project-content">
        <p class="content">
        ${response.content}
        </p>
        <img class="ImgThumbnail" id="imagea" src="img/${response.images[0]}" alt="No Image" />
        <img class="ImgThumbnail" id="imageb" src="img/${response.images[1]}" alt="No Image" />
        <img class="ImgThumbnail" id="imagec" src="img/${response.images[2]}" alt="No Image" />
        <img class="ImgThumbnail" id="imaged" src="img/${response.images[3]}" alt="No Image" />
        </div>`;   

        // Reference element
        let wrapper = document.getElementById("wrapper");
        // Insert into HTML-element
        wrapper.insertAdjacentHTML('afterbegin', newProjectContent);
    } else {
        console.error("Connection error: " + request.status);
    }
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
    LoadSpecificProject();
}