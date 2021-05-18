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

let database = firebase.database();

function writeBoard(user, board_name, board_color) {
    // Get a key for a new Board.
    let newBoardKey = firebase.database().ref().child('users/' + user.uid + "/boards").push().key;
    database.ref('users/' + user.uid + "/boards/" + newBoardKey).set({
        title: board_name,
        color: board_color
    });
    console.log("Board created");
}

function showBoards(user) {
    let boardsRef = database.ref('users/' + user.uid + "/boards");
    boardsRef.on('value', function (snapshot) {
        // Clearing boards, but saving add button
        let list = document.getElementById("boards");
        let item = document.getElementById("button-li");
        item.parentNode.removeChild(item);
        while (list.hasChildNodes()) {
            list.removeChild(list.firstChild);
        }
        list.appendChild(item);

        snapshot.forEach(function (childSnapshot) {
            let data = childSnapshot.val();
            AddNewElement(childSnapshot.key, data.title, data.color);
        });
    });
}

function updateBoard(user, boardKey, boardName, boardColor) {
    database.ref('users/' + user.uid + "/boards/" + boardKey).update({
        title: boardName,
        color: boardColor
    });
    console.log("Board updated");
}

function deleteBoard(user, boardKey) {
    database.ref('users/' + user.uid + "/boards/" + boardKey).remove();
    console.log("Board deleted");
}

function createList(user, boardUid, listTitle) {
    let newListUid = database.ref().child('users/' + user.uid + "/boards/" + boardUid + "/lists").push().key;
    database.ref('users/' + user.uid + "/boards/" + boardUid + "/lists/" + newListUid).set({
        title: listTitle
    });
    console.log("List created");
}

function updateList(user, boardKey, listUid, listTitle) {
    database.ref('users/' + user.uid + "/boards/" + boardKey + "/lists/" + listUid).update({
        title: listTitle
    });
    console.log("List updated");
}

function deleteList(user, boardKey, listUid) {
    database.ref('users/' + user.uid + "/boards/" + boardKey + "/lists/" + listUid).remove();
    console.log("List deleted");
}













// Updating
function writeNewPost(email, username) {
    // A post entry.
    let userData = {
        email: email,
        username: username
    };

    // Get a key for a new Post.
    let newUserKey = firebase.database().ref().child('users').push().key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    let updates = {};
    updates['/users/' + newUserKey] = userData;
    // updates['/user-posts/' + uid + '/' + newUserKey] = userData;

    return database.ref().update(updates);
}

function updateUserInfo(id, email, username) {
    let userData = {};
    if (email != null) {
        userData.email = email;
    }
    if (username != null) {
        userData.username = username;
    }

    console.log(userData);
    let updates = {};
    updates['/users/' + id] = userData;

    return database.ref().update(updates);
}

// writeNewPost("sadfa", "dfss");
// updateUserInfo(3, null, "11111");
// database.ref("users/" + 3).update({
//     username: "sdaafa"
// });
