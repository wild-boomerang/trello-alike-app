// "use strict";

function signUp() {
    let email = document.getElementById("email-input").value;
    let password = document.getElementById("password-input").value;
    let password_repeat = document.getElementById("repeat-password-input").value;

    console.log("Attempt to register...");

    if (password === password_repeat) {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(async (userCredential) => {
                // Signed in
                let user = userCredential.user;
                // await is necessary for correct write to database
                await database.ref("users/" + user.uid).set({
                    "email": user.email
                });
                document.getElementById("registerForm").reset();
                location.href = "boards.html";
            })
            .catch((error) => {
                let errorCode = error.code;
                let errorMessage = error.message;
                alert(errorCode);
                alert(errorMessage);
            });
    }
    else {
        alert("Password don't match!");
    }
}

function signIn() {
    let email = document.getElementById("email-input").value;
    let password = document.getElementById("password-input").value;

    console.log("Attempt to login...");

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            // let user = userCredential.user;
            document.getElementById("loginForm").reset();
            location.href = "boards.html";
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            alert(errorMessage);
        });
}

function signOut() {
    firebase.auth().signOut().then(function() {
        console.log('Signed Out');
    }, function(error) {
        console.error('Sign Out Error', error);
        alert(error.message);
    });
}
