const Redirect = () => {
    window.location.href = "/projects.html";
}

// When whole site document is loaded, call the method
if(document.readyState = "complete"){
    Redirect();
}