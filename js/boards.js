firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        let uid = user.uid;
        alert(uid);
        // ...
    } else {
        // User is signed out
        // ...
        alert("You are disabled!");
        location.href = "login.html";
    }
});
