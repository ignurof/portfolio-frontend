// HttpClient är skapad av någon på stackoverflow för återanvändning av GET requests
function HttpClient() {
    this.Get = function (aUrl, aCallback) {
        let anHttpRequest = new XMLHttpRequest();
        // När metodens readystate ändras så används denna funktionalitet
        anHttpRequest.onreadystatechange = function () {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText); // detta är text response från GET request
        }

        anHttpRequest.open("GET", aUrl, true); // öppnar requesten (detta ändrar readystate tror jag)
        anHttpRequest.send(null); // vet inte varför null, detta är taget från stackoverflow
    }
}

// Laddar in about content och skriver ut den i innehållet
function SetContent() {
    let aboutContent = document.getElementById("about-content");
    let newContent = "";

    // Använd denna funktionalitet för att göra den faktiskta requesten med den uppbyggda metoden
    let client = new HttpClient();
    client.Get('https://api.ignurof.xyz/about', function (response) {
        newContent = response; // Sparar svaret i en sträng
        aboutContent.insertAdjacentHTML('afterbegin', newContent); // Detta skriver ut HTML koden på sidan och måste finnas i scope
    });
}

function LoadAbout() {
    SetContent();
}

function LoadProjects() {
    SetProjects();
}

function Redirect() {
    window.location.href = "/projects.html";
}


function SetProjects() {
    // Skapa referens till cards elementet
    let dynamicCards = document.getElementById("cards");

    // Skapa en ny instans av HttpClient och skicka en GET request till projects. JSON.parse svaret för att manipulera det som en array
    let client = new HttpClient();
    client.Get('https://api.ignurof.xyz/projects', function (response) {
        let projects = JSON.parse(response); // Sparar svaret i en sträng
        // Tar array och lägger den i metoden
        // Då jag har parsat ett JSON objekt till en array så går det att iterera över den precis som vanligt
        GenerateProjectsHTML(projects);
    });

    function GenerateProjectsHTML(arr) {
        let out = "";

        // Loop over the entire JSON array (all projects that were returned with GET request)
        // Display HTML elements with values based on the returned objects
        let i;
        for (i = 0; i < arr.length; i++) {
            // Styling för ett nytt kort
            let newCard = '<div id="card">' +
                '<a href="/project.html?projectid=' + arr[i].id + '">' +
                '<button type="submit">' +
                '<img src="img/' + arr[i].imageA + '" alt="Image Text"/>' +
                '<h4>' + arr[i].name + '</h4>' +
                '<p>' + arr[i].summary + '</p>' +
                '</button>' +
                '</a>' +
                '</div>';

            out += newCard;
        }
        // Skriv in all ny HTML efter starten av div, eller första lediga plats
        dynamicCards.insertAdjacentHTML('afterbegin', out);
    }
}

function ChangeProject(id, direction) {
    let back = id + 1; // Då jag hämtar listan med projekt i DESC order, så har index 0 i array högst projectID, vilket innebär att tillbaka måste räkna uppåt.
    let forward = id - 1;

    if (direction == "back") {
        return back;
    }

    if (direction == "forward") {
        return forward;
    }
}

let projects;

// Loads the dynamic project page content
function LoadDynamicProjectContent() {
    // running on https://www.example.com?name=n1&name=n2
    let params = new URLSearchParams(location.search);
    let paramValue = params.get('projectid');

    let currentID = paramValue;

    let client = new HttpClient();
    client.Get('https://api.ignurof.xyz/projects', function (response) {
        projects = JSON.parse(response); // Sparar svaret i en sträng
        
        // Tar array och lägger den i metoden
        // Då jag har parsat ett JSON objekt till en array så går det att iterera över den precis som vanligt
        GenerateDynamicProjectHTML(projects);
    });


    function GenerateDynamicProjectHTML(arr) {
        let out = "";

        let pID;
        let pNAME;
        let pSUMMARY;
        let pCONTENT;
        let pIMAGEA;
        let pIMAGEB;
        let pIMAGEC;
        let pIMAGED;

            // Välj rätt project
        let i;
            for (i = 0; i < arr.length; i++) {
                if (arr[i].id == currentID) {
                    pID = arr[i].id;
                    pNAME = arr[i].name;
                    pSUMMARY = arr[i].summary;
                    pCONTENT = arr[i].content;
                    pIMAGEA = arr[i].imageA;
                    pIMAGEB = arr[i].imageB;
                    pIMAGEC = arr[i].imageC;
                    pIMAGED = arr[i].imageD;

                    // TODO: Gör om denna styling till project content med ovan variabler som innehåll
                    let newProjectContent = '<div id="dynamic-project-header">' +
                        '<form action="project.html" method="get">' +
                        '<button class="btn-back" type="submit">' +
                        '<' +
                        '</button>' +
                        '<input name="projectid" type="hidden" value="' + ChangeProject(pID, "back") + '" />' +
                        '</form>' +
                        '<h1 class="name">' + pNAME + '</h1>' +
                        '<form action="project.html" method="get">' +
                        '<button class="btn-forward" type="submit">' +
                        '>' +
                        '</button>' +
                        '<input name="projectid" type="hidden" value="' + ChangeProject(pID, "forward") + '" />' +
                        '</form>' +
                        '</div>' +
                        '<div id="dynamic-project-content">' +
                        '<p class="content">' +
                        pCONTENT +
                        '</p>' +
                        '<img class="ImgThumbnail" id="imagea" src="img/' + pIMAGEA + '" alt="No Image" />' +
                        '<img class="ImgThumbnail" id="imageb" src="img/' + pIMAGEB + '" alt="No Image" />' +
                        '<img class="ImgThumbnail" id="imagec" src="img/' + pIMAGEC + '" alt="No Image" />' +
                        '<img class="ImgThumbnail" id="imaged" src="img/' + pIMAGED + '" alt="No Image" />' +
                        '</div>';

                    out += newProjectContent;
                }
            }

        // Kolla om vi har hamnat på en projektsida som inte existerar, if so, redirecta till home
        if (pID == null) {
            if (currentID > projects[0]) {
                window.location.href = "/index.html";
            }

            if (currentID < projects[projects.length - 1]) {
                window.location.href = "/index.html";
            }
        }

        let wrapper = document.getElementById("wrapper");
            // Skriv in all ny HTML efter starten av div, eller första lediga plats
            wrapper.insertAdjacentHTML('afterbegin', out);

    }
    //alert("Loaded content" + currentID); debug purposes
}


function TestMessage() {
    let formName = document.contactform.uname.value;
    let formEmail = document.contactform.email.value;
    let formMessage = document.contactform.message.value;

    let canSendData = false;

    // Verifiera input
    if (formName != "" && formEmail != "" && formMessage != "") {
        canSendData = true;
    }

    let message = {
        "name": formName,
        "email": formEmail,
        "message": formMessage
    };

    //var debugMsg = 1337;

    // /message
    let url = "https://api.ignurof.xyz/message";

    // TODO: Fixa så det är den faktiska form datan som skickas istället för debug
    // Ändra också om i index.html i contactform så att det är en button istället

    // Om input är okej så kan vi sända datan, annars skrivs error ut.
    if (canSendData == true) {
        // construct an HTTP request - taget från https://stackoverflow.com/questions/1255948/post-data-in-json-format
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

        // send the collected data as JSON
        // ASP.NET verkar inte vilja ta emot den raw JSON, så om jag stringy först så funkar det
        xhr.send(JSON.stringify(message));

        xhr.onloadend = function () {
            // done
            let resp = xhr.response;
            alert(resp);
        };
    }
    else {
        alert("Please fill out all the fields!");
    }
}