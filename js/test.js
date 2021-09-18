// HttpClient �r skapad av n�gon p� stackoverflow f�r �teranv�ndning av GET requests
function HttpClient() {
    this.Get = function (aUrl, aCallback) {
        let anHttpRequest = new XMLHttpRequest();
        // N�r metodens readystate �ndras s� anv�nds denna funktionalitet
        anHttpRequest.onreadystatechange = function () {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText); // detta �r text response fr�n GET request
        }

        anHttpRequest.open("GET", aUrl, true); // �ppnar requesten (detta �ndrar readystate tror jag)
        anHttpRequest.send(null); // vet inte varf�r null, detta �r taget fr�n stackoverflow
    }
}

// Laddar in about content och skriver ut den i inneh�llet
function SetContent() {
    let aboutContent = document.getElementById("about-content");
    let newContent = "";

    // Anv�nd denna funktionalitet f�r att g�ra den faktiskta requesten med den uppbyggda metoden
    let client = new HttpClient();
    client.Get('https://api.ignurof.xyz/about', function (response) {
        newContent = response; // Sparar svaret i en str�ng
        aboutContent.insertAdjacentHTML('afterbegin', newContent); // Detta skriver ut HTML koden p� sidan och m�ste finnas i scope
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

    // Skapa en ny instans av HttpClient och skicka en GET request till projects. JSON.parse svaret f�r att manipulera det som en array
    let client = new HttpClient();
    client.Get('https://api.ignurof.xyz/projects', function (response) {
        let projects = JSON.parse(response); // Sparar svaret i en str�ng
        // Tar array och l�gger den i metoden
        // D� jag har parsat ett JSON objekt till en array s� g�r det att iterera �ver den precis som vanligt
        GenerateProjectsHTML(projects);
    });

    function GenerateProjectsHTML(arr) {
        let out = "";

        // Loop over the entire JSON array (all projects that were returned with GET request)
        // Display HTML elements with values based on the returned objects
        let i;
        for (i = 0; i < arr.length; i++) {
            // Styling f�r ett nytt kort
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
        // Skriv in all ny HTML efter starten av div, eller f�rsta lediga plats
        dynamicCards.insertAdjacentHTML('afterbegin', out);
    }
}

function ChangeProject(id, direction) {
    let back = id + 1; // D� jag h�mtar listan med projekt i DESC order, s� har index 0 i array h�gst projectID, vilket inneb�r att tillbaka m�ste r�kna upp�t.
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
        projects = JSON.parse(response); // Sparar svaret i en str�ng
        
        // Tar array och l�gger den i metoden
        // D� jag har parsat ett JSON objekt till en array s� g�r det att iterera �ver den precis som vanligt
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

            // V�lj r�tt project
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

                    // TODO: G�r om denna styling till project content med ovan variabler som inneh�ll
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

        // Kolla om vi har hamnat p� en projektsida som inte existerar, if so, redirecta till home
        if (pID == null) {
            if (currentID > projects[0]) {
                window.location.href = "/index.html";
            }

            if (currentID < projects[projects.length - 1]) {
                window.location.href = "/index.html";
            }
        }

        let wrapper = document.getElementById("wrapper");
            // Skriv in all ny HTML efter starten av div, eller f�rsta lediga plats
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

    // TODO: Fixa s� det �r den faktiska form datan som skickas ist�llet f�r debug
    // �ndra ocks� om i index.html i contactform s� att det �r en button ist�llet

    // Om input �r okej s� kan vi s�nda datan, annars skrivs error ut.
    if (canSendData == true) {
        // construct an HTTP request - taget fr�n https://stackoverflow.com/questions/1255948/post-data-in-json-format
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

        // send the collected data as JSON
        // ASP.NET verkar inte vilja ta emot den raw JSON, s� om jag stringy f�rst s� funkar det
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