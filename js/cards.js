let signed_user;
let selectedBoardUid = localStorage.getItem("selectedBoardUid");
let selectedBoardColor = localStorage.getItem("selectedBoardColor");
// console.log(signed_user);

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        signed_user = user;
        showInfo();
        showLists();
    } else {
        // User is signed out
        console.log("You are disabled!");
        location.href = "login.html";
    }
});

function showInfo() {
    document.getElementsByClassName("main-container")[0].style.backgroundColor = selectedBoardColor;
}

function showLists() {
    let listsRef = database.ref('users/' + signed_user.uid + "/boards/" + selectedBoardUid + '/lists');
    listsRef.on('value', function (snapshot) {
        // Clearing lists, but saving add button
        let listsList = document.getElementById("listsContainer");
        let addListButton = document.getElementById("addListButton");

        addListButton.parentNode.removeChild(addListButton);
        while (listsList.hasChildNodes()) {
            listsList.removeChild(listsList.firstChild);
        }
        listsList.appendChild(addListButton);

        snapshot.forEach(function (childSnapshot) {
            let data = childSnapshot.val();
            let list = addList(childSnapshot.key, data.title);
            listsList.insertBefore(list, listsList.childNodes[0]);
        });
    });
}

function addList(uid, title) {
    let list = document.createElement("li");
    list.classList.add("cards-container")

    let listHeaderButton = document.createElement("button");
    listHeaderButton.classList.add("card-header-li");
    listHeaderButton.appendChild(document.createTextNode(title));
    listHeaderButton.onclick = function() {
        showListModal();
        document.getElementById("listTitle").value = title;
        document.getElementById("deleteListButton").style.display = "inline";
        document.getElementById("listUid").appendChild(document.createTextNode(uid));
    };

    let addCardButton = document.createElement("button");
    addCardButton.classList.add("card-header-li");
    addCardButton.appendChild(document.createTextNode("Add another card"));
    // addCardButton.onclick = showListModal;

    // let cardsList = document.createElement("ul");
    // cardsList.id = uid;
    //
    // let cardsRef = database.ref('users/' + signed_user.uid + "/boards/" + selectedBoardUid + '/lists/' + uid + "/cards");
    // cardsRef.on('value', function (snapshot) {
    //     let cardsList = document.getElementById(uid);
    //
    //     while (cardsList.hasChildNodes()) {
    //         cardsList.removeChild(cardsList.firstChild);
    //     }
    //
    //     snapshot.forEach(function (childSnapshot) {
    //         let data = childSnapshot.val();
    //         let card = addCard(childSnapshot.key, data.title, data.description, data.color, data.expireDate);
    //         cardsList.appendChild(card);
    //     });
    // });

    list.appendChild(listHeaderButton);
    // list.appendChild(cardsList);
    list.appendChild(addCardButton);

    return list;
}

function addCard(uid, title, description, color, expireDate) {
    let cardLi = document.createElement("li");
    let a = document.createElement("a");
    a.appendChild(document.createTextNode(title));

    cardLi.appendChild(a);
    return cardLi;
}

function createOrUpdateList() {
    let listTitle = document.getElementById("listTitle").value;
    let listUid = document.getElementById("listUid").innerText;

    if (signed_user !== undefined) {
        if (listUid === "") {
            createList(signed_user, selectedBoardUid, listTitle);
        } else {
            updateList(signed_user, selectedBoardUid, listUid, listTitle);
        }
        closeListModal();
    } else {
        alert("You are not authenticated yet!");
    }
}

function deleteListWrapper() {
    let listUid = document.getElementById("listUid").innerText;

    deleteList(signed_user, selectedBoardUid, listUid);
    closeListModal();
}
