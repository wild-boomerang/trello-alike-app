// Your web app's Firebase configuration
let firebaseConfig = {
    apiKey: "AIzaSyBLyYCZFkuAr-NlDqnor4D39sqy7Yx5rOY",
    authDomain: "trello-alike-app-725b4.firebaseapp.com",
    projectId: "trello-alike-app-725b4",
    databaseURL: "https://trello-alike-app-725b4-default-rtdb.firebaseio.com/",
    storageBucket: "trello-alike-app-725b4.appspot.com",
    messagingSenderId: "394944868208",
    appId: "1:394944868208:web:3daf3d8ac8483bb1e529b5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


// let database = firebase.database();
// function writeUserData(userId, name, email) {
//     firebase.database().ref('users/' + userId).set({
//         username: name,
//         email: email
//     });
// }
//
// writeUserData("2", "name", "email");
// console.log("Data is written");
