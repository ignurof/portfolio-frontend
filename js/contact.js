// Method sends a POST request to back for message insertion
const SendMessage = async() => {
    // Reference relevant fields
    let formName = document.contactform.uname.value;
    let formEmail = document.contactform.email.value;
    let formMessage = document.contactform.message.value;

    // variable used to control if we can send data
    let canSendData = false;

    // Verify that the input is atleast not empty
    if (formName != "" && formEmail != "" && formMessage != "") {
        canSendData = true;
    }

    // JSON, looks the same on backend
    let message = {
        "name": formName,
        "email": formEmail,
        "message": formMessage
    };

    let apiUrl = "https://localhost:5001/message";

    // Parse
    let jsonToSend = JSON.stringify(message);

    // Fields are not empty?
    if(canSendData){
        // Send the POST request
        let request = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: jsonToSend
        });

        if(request.ok) {
            // If the request was returned 200 OK then parse the response as json
            let response = await request.text();
            alert(response);
        } else {
            // Output potential error in console
            console.log("Connection error: " + request.status);
        }
    } else {
        alert("You need to fill out all the required fields first!");
    }
    
}