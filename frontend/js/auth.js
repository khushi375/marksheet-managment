const API_BASE =
    "http://localhost:5000/api";


function getToken() {

    return localStorage.getItem(
        "examToken"
    );
}


function isLoggedIn() {

    return !!getToken();
}


function authHeaders() {

    return {
        Authorization:
            "Bearer " +
            getToken()
    };
}


function protectPage() {

    if (!isLoggedIn()) {

        window.location.href =
            "login.html";
    }
}


function logout() {

    localStorage.removeItem(
        "examToken"
    );

    localStorage.removeItem(
        "adminData"
    );

    localStorage.removeItem(
        "selectedClassId"
    );

    localStorage.removeItem(
        "selectedClassName"
    );

    window.location.href =
        "login.html";
}


function setSelectedClass(
    id,
    name
) {

    localStorage.setItem(
        "selectedClassId",
        id
    );

    localStorage.setItem(
        "selectedClassName",
        name
    );
}


function getSelectedClassId() {

    return localStorage.getItem(
        "selectedClassId"
    );
}


function getSelectedClassName() {

    return localStorage.getItem(
        "selectedClassName"
    );
}