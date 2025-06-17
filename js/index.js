// Select elements
var siteName = document.getElementById("bookmarkName");
var siteURL = document.getElementById("bookmarkURL");
var submitBtn = document.getElementById("submitBtn");
var tableContent = document.getElementById("tableContent");

var deleteBtns;
var visitBtns;

var closeBtn = document.getElementById("closeBtn");
var boxModal = document.querySelector(".box-info");
var bookmarks = [];

if (localStorage.getItem("bookmarksList")) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarksList"));
    for (let i = 0; i < bookmarks.length; i++) {
        displayBookmark(i);
    }
}

// =====> Display Bookmark List

function displayBookmark(indexOfWebsite) {
    var userURL = bookmarks[indexOfWebsite].siteURL;

    var httpsRegex = /^https?:\/\//;
    var validURL = userURL;

    if (!httpsRegex.test(userURL)) {
        validURL = `https://${userURL}`;
    }

    var newBookmark = `
        <tr>
            <td>${indexOfWebsite + 1}</td>
            <td>${bookmarks[indexOfWebsite].siteName}</td>              
            <td>
                <button class="btn btn-visit" data-index="${indexOfWebsite}">
                    <i class="fa-solid fa-eye pe-2"></i>Visit
                </button>
            </td>
            <td>
                <button class="btn btn-delete pe-2" data-index="${indexOfWebsite}">
                    <i class="fa-solid fa-trash-can"></i> Delete
                </button>
            </td>
        </tr>`;

    tableContent.innerHTML += newBookmark;

    // Adding delete event
    deleteBtns = document.querySelectorAll(".btn-delete");

    for (let j = 0; j < deleteBtns.length; j++) {
        deleteBtns[j].addEventListener("click", deleteBookmark);
    }

    // Adding visit event
    visitBtns = document.querySelectorAll(".btn-visit");

    for (let l = 0; l < visitBtns.length; l++) {
        visitBtns[l].addEventListener("click", visitWebsite);
    }
}

// =====> Clear Input

function clearInput() {
    siteName.value = "";
    siteURL.value = "";
    siteName.classList.remove("is-valid", "is-invalid");

    siteURL.classList.remove("is-valid", "is-invalid");

}

// =====> Capitalize first character

function capitalize(str) {
    if (str.length == 0) return str;

    return str.charAt(0).toUpperCase() + str.slice(1);
}

// =====> Submit

submitBtn.addEventListener("click", function (e) {
    e.preventDefault();

    if (
        siteName.classList.contains("is-valid") &&
        siteURL.classList.contains("is-valid")
    ) {
        var bookmark = {
            siteName: capitalize(siteName.value.trim()),
            siteURL: siteURL.value.trim()
        };
        bookmarks.push(bookmark);
        localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));

        tableContent.innerHTML = ""; // Clear table
        for (let i = 0; i < bookmarks.length; i++) {
            displayBookmark(i);
        }

        clearInput();

    } else {
        boxModal.classList.remove("d-none");

    }
});

// =====> Delete

function deleteBookmark(e) {
    tableContent.innerHTML = ""; // clear first
    var deletedIndex = e.target.dataset.index;

    bookmarks.splice(deletedIndex, 1);
    localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));

    for (let k = 0; k < bookmarks.length; k++) {
        displayBookmark(k);
    }
}

// =====> Visit

function visitWebsite(e) {
    var websiteIndex = e.target.dataset.index;

    var httpsRegex = /^https?:\/\//;

    var url = bookmarks[websiteIndex].siteURL;

    if (httpsRegex.test(url)) {
        window.open(url, '_blank'); // Open in new tab
    } else {
        window.open(`https://${url}`, '_blank'); // Open in new tab
    }
}

// =====> Validation

var nameRegex = /^[A-Za-z0-9 ]{3,}$/;
var urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/.*)?$/;

siteName.addEventListener("input", function () {
    validate(siteName, nameRegex);
});

// Validate URL
siteURL.addEventListener("input", function () {
    validate(siteURL, urlRegex);
});

// Validation function
function validate(element, regex) {
    var test = new RegExp(regex);
    if (test.test(element.value.trim())) {
        element.classList.add("is-valid");

        element.classList.remove("is-invalid");

    } else if (element.value.trim().length > 0) {
        element.classList.add("is-invalid");

        element.classList.remove("is-valid");

    } else {
        element.classList.remove("is-invalid");

        element.classList.remove("is-valid");

    }
}


//Close Modal

function closeModal() {
    boxModal.classList.add("d-none");

}

closeBtn.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
    if (e.key == "Escape") {
        closeModal();
    }
});

// Close when clicking outside
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("box-info")) {
        closeModal();
    }
});
