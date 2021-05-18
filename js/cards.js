let signed_user;
let selectedBoardUid = localStorage.getItem("selectedBoardUid");
let selectedBoardColor = localStorage.getItem("selectedBoardColor");

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
    list.classList.add("cards-container");

    let listHeaderButton = document.createElement("button");
    listHeaderButton.classList.add("card-button");
    listHeaderButton.classList.add("card-header");
    listHeaderButton.appendChild(document.createTextNode(title));
    listHeaderButton.onclick = function() {
        showListModal();
        document.getElementById("listTitle").value = title;
        document.getElementById("deleteListButton").style.display = "inline";
        document.getElementById("listUid").appendChild(document.createTextNode(uid));
    };

    let addCardButton = document.createElement("button");
    addCardButton.classList.add("card-button");
    addCardButton.id = uid;
    addCardButton.appendChild(document.createTextNode("Add another card"));
    addCardButton.onclick = showCardModal;

    let cardsList = document.createElement("ul");

    // drag&drop support
    list.ondrop = function (event) {
        event.preventDefault();
        let data = event.dataTransfer.getData("text");
        let cardUid = event.dataTransfer.getData("cardUid");
        let cardTitle = event.dataTransfer.getData("cardTitle");
        let cardDescription = event.dataTransfer.getData("");
        let cardColor = event.dataTransfer.getData("cardColor");
        let cardExpireDate = event.dataTransfer.getData("cardExpireDate");
        let listUid = event.dataTransfer.getData("listUid");

        list.childNodes[1].appendChild(document.getElementById(data));

        deleteCard(signed_user, selectedBoardUid, listUid, cardUid);
        createCard(signed_user, selectedBoardUid, uid, cardTitle, cardDescription, cardColor, cardExpireDate);
    };
    list.ondragover = function (event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    };

    let cardsRef = database.ref('users/' + signed_user.uid + "/boards/" + selectedBoardUid + '/lists/' + uid + "/cards");
    cardsRef.on('value', function (snapshot) {
        // let cardsList = document.getElementById(uid);
        //
        // while (cardsList.hasChildNodes()) {
        //     cardsList.removeChild(cardsList.firstChild);
        // }

        snapshot.forEach(function (childSnapshot) {
            let data = childSnapshot.val();
            let card = addCard(childSnapshot.key, data.title, data.description, data.color, data.expire_date, uid);
            cardsList.appendChild(card);
        });
    });

    list.appendChild(listHeaderButton);
    list.appendChild(cardsList);
    list.appendChild(addCardButton);

    return list;
}

function addCard(uid, title, description, color, expireDate, listUid) {
    let cardLi = document.createElement("li");
    let a = document.createElement("a");
    a.appendChild(document.createTextNode(title));

    // drag&drop support
    cardLi.id = uid;
    cardLi.draggable = true;
    cardLi.ondragstart = function (event) {
        event.dataTransfer.setData("text", event.target.id);
        event.dataTransfer.setData("cardUid", uid);
        event.dataTransfer.setData("cardTitle", title);
        event.dataTransfer.setData("cardDescription", description);
        event.dataTransfer.setData("cardColor", color);
        event.dataTransfer.setData("cardExpireDate", expireDate);
        event.dataTransfer.setData("listUid", listUid);

        event.dataTransfer.dropEffect = "move";
    };

    cardLi.style.backgroundColor = color;
    cardLi.onclick = function() {
        id = listUid;
        document.getElementById("createCardForm").style.backgroundColor = color;
        showCardModal();
        document.getElementById("cardTitle").value = title;
        document.getElementById("cardDescription").value = description;
        document.getElementById("cardColor").value = color;
        document.getElementById("cardExpireDate").value = expireDate;
        document.getElementById("cardUid").appendChild(document.createTextNode(uid));
        document.getElementById("deleteCardButton").style.display = "inline";
    };

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

function createOrUpdateCard() {
    let cardTitle = document.getElementById("cardTitle").value;
    let cardDescription = document.getElementById("cardDescription").value;
    let cardColor = document.getElementById("cardColor").value;
    let cardExpireDate = document.getElementById("cardExpireDate").value;
    let cardUid = document.getElementById("cardUid").innerText;

    if (signed_user !== undefined) {
        if (cardUid === "") {
            createCard(signed_user, selectedBoardUid, listUidForCard, cardTitle, cardDescription, cardColor, cardExpireDate);
        } else {
            updateCard(signed_user, selectedBoardUid, listUidForCard, cardUid, cardTitle, cardDescription, cardColor, cardExpireDate);
        }
        closeCardModal();
    } else {
        alert("You are not authenticated yet!");
    }
}

function deleteCardWrapper() {
    let cardUid = document.getElementById("cardUid").innerText;

    deleteCard(signed_user, selectedBoardUid, listUidForCard, cardUid);
    closeCardModal();
}
