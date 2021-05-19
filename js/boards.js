let signed_user;
// console.log(signed_user);

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        signed_user = user;
        showBoards(signed_user);
    } else {
        // User is signed out
        console.log("You are disabled!");
        location.href = "login.html";
    }
});

function createOrUpdateBoard() {
    let board_name = document.getElementById("board_name").value;
    let board_color = document.getElementById("board_color").value;
    let boardUid = document.getElementById("boardUid").innerText;

    if (signed_user !== undefined) {
        if (boardUid === "") {
            writeBoard(signed_user, board_name, board_color);
        } else {
            updateBoard(signed_user, boardUid, board_name, board_color);
        }
        closeModal();
    } else {
        alert("You are not authenticated yet!");
    }
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

function AddNewElement(uid, title, color) {
    let li = document.createElement("li");
    li.style.backgroundColor = color;

    let boardButton = document.createElement("a");
    boardButton.style.backgroundColor = color;
    boardButton.onclick = function() {
        localStorage.setItem("selectedBoardUid", uid);
        localStorage.setItem("selectedBoardColor", color);
        location.href = "cards.html";
    };

    let editButton = document.createElement("img");
    editButton.src = "../res/edit.svg";
    editButton.className = "editButton";
    editButton.onclick = function() {
        document.getElementById("create-board-form").style.backgroundColor = color;
        modal.style.display = "block";
        document.getElementById("board_name").value = title;
        document.getElementById("board_color").value = color;
        document.getElementById("deleteButton").style.display = "inline";
        document.getElementById("boardUid").innerText = uid;
    };

    li.appendChild(boardButton);
    li.appendChild(editButton);
    boardButton.appendChild(document.createTextNode(title));

    let list = document.getElementById("boards");
    list.insertBefore(li, list.childNodes[0]);
}

function deleteBoardWrapper() {
    let boardUid = document.getElementById("boardUid").innerText;

    deleteBoard(signed_user, boardUid);
    closeModal();
}
