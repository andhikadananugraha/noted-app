// show formbook
const showOn = document.getElementById('addBook');
const showOff = document.getElementById('close');
const overlay = document.getElementById('formBook');

showOn.addEventListener('click', function () {
    clear();
    overlay.style.display = 'flex';
    const h2 = document.querySelector('.input_section .title-input h2');
    h2.innerText = 'Add New Book'

    const editNameButton = document.getElementById('bookSubmit');
    editNameButton.innerText = 'Add Book';
});

showOff.addEventListener('click', function () {
    overlay.style.display = 'none';
    selectedEditBook.length = 0;
});

// Web Storage
const STORAGE_KEY = 'BOOKSHELF_APPS';
const SAVED_EVENT = 'saved-book';

// memeriksa apakah localStorage didukung oleh browser atau tidak
function storageExist() {
    if (typeof (Storage) === undefined) {
        alert('Unfortunately, your browser does not support local storage.');
        return false;
    }
    return true;
}

// menyimpan data ke localStorage based on Key yang sudah ditetapkan sebelumnya.
function saveData() {
    if (storageExist()) {
        const parsed /* string */ = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event('SAVED_EVENT'));
    }
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

// memuat data dari localStorage & memasukkan data hasil parsing ke variabel books
function loadDataFromStorage() {
    const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        };
    };

    document.dispatchEvent(new Event(RENDER_EVENT));
}

// add preventDefault on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    overlay.style.display = 'none';
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (isEdit == true) {
            saveEditBook();
        } else {
            addBook();
        }
        clear();
        selectedEditBook.splice(0, selectedEditBook.length);
    });

    showOn.addEventListener('click', function (event) {
        event.preventDefault();
        overlay.style.display = 'flex';
    });

    showOff.addEventListener('click', function (event) {
        event.preventDefault();
        overlay.style.display = 'none';
    });

    if (storageExist()) {
        loadDataFromStorage();
    }
});

// clear value
function clear() {
    document.getElementById('inputBookTitle').value = '';
    document.getElementById('inputBookAuthor').value = '';
    document.getElementById('inputBookYear').value = '';
    document.getElementById('inputBookIsComplete').checked = false;
    overlay.style.display = 'none';
}

// var book
const books = [];
const RENDER_EVENT = 'render-book';

function generateId() {
    return +new Date();
};

// return book
function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    };
};

// render event
document.addEventListener(RENDER_EVENT, function () {
    console.log(books);
});

document.addEventListener(RENDER_EVENT, () => {
    const unfinished = document.getElementById('incompleteBookshelfList');
    const finished = document.getElementById('completeBookshelfList');

    unfinished.innerHTML = '';
    finished.innerHTML = '';

    for (const book of books) {
        const bookElement = newBook(book);
        if (book.isCompleted) {
            finished.append(bookElement);
        } else {
            unfinished.append(bookElement);
        }
    }
})

function addBook() {
    isEdit = false;
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = parseInt(document.getElementById('inputBookYear').value);
    const isCompleted = document.getElementById('inputBookIsComplete').checked;

    const generateID = generateId();
    const bookObject = generateBookObject(generateID, title, author, year, isCompleted);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
};

// funtion to create a new book
function newBook(bookObject) {
    const img = document.createElement('img');
    if (bookObject.isCompleted) {
        img.setAttribute('src', 'assets/img/done.png');
    } else {
        img.setAttribute('src', 'assets/img/ready.png');
    }

    // card image
    const cardImage = document.createElement('div');
    cardImage.classList.add('card-img');
    cardImage.append(img);

    // card-body>content
    const bookTitle = document.createElement('h3');
    bookTitle.innerText = bookObject.title;

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = bookObject.author;

    const bookYear = document.createElement('p');
    bookYear.innerText = bookObject.year;

    const content = document.createElement('div');
    content.classList.add('content');
    content.append(bookTitle, bookAuthor, bookYear);

    // card-body>action
    const action = document.createElement('div');
    action.classList.add('action');

    // card-body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    cardBody.append(content, action);

    if (bookObject.isCompleted) {
        const undoIcon = document.createElement('i');
        undoIcon.classList.add('bi');
        undoIcon.classList.add('bi-arrow-clockwise');

        const undoButton = document.createElement('button');
        undoButton.setAttribute('type', 'button');
        undoButton.classList.add('undo');
        undoButton.append(undoIcon);

        undoButton.addEventListener('click', function () {
            addUnfinished(bookObject.id);
        });

        const editIcon = document.createElement('i');
        editIcon.classList.add('bi');
        editIcon.classList.add('bi-pencil-square');

        const editButton = document.createElement('button');
        editButton.setAttribute('type', 'button');
        editButton.classList.add('edit');
        editButton.append(editIcon);

        editButton.addEventListener('click', function () {
            editBook(bookObject.id);
        });

        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('bi');
        deleteIcon.classList.add('bi-trash-fill');

        const deleteButton = document.createElement('button');
        deleteButton.setAttribute('type', 'button');
        deleteButton.classList.add('delete');
        deleteButton.append(deleteIcon);

        deleteButton.addEventListener('click', function () {
            deleteBook(bookObject.id);
        });

        action.append(undoButton, editButton, deleteButton);

    } else {
        const doneIcon = document.createElement('i');
        doneIcon.classList.add('bi');
        doneIcon.classList.add('bi-check-circle');

        const doneButton = document.createElement('button');
        doneButton.setAttribute('type', 'button');
        doneButton.classList.add('done');
        doneButton.append(doneIcon);

        doneButton.addEventListener('click', function () {
            addFinished(bookObject.id);
        });

        const editIcon = document.createElement('i');
        editIcon.classList.add('bi');
        editIcon.classList.add('bi-pencil-square');

        const editButton = document.createElement('button');
        editButton.setAttribute('type', 'button');
        editButton.classList.add('edit');
        editButton.append(editIcon);

        editButton.addEventListener('click', function () {
            editBook(bookObject.id);
        });

        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('bi');
        deleteIcon.classList.add('bi-trash-fill');

        const deleteButton = document.createElement('button');
        deleteButton.setAttribute('type', 'button');
        deleteButton.classList.add('delete');
        deleteButton.append(deleteIcon);

        deleteButton.addEventListener('click', function () {
            deleteBook(bookObject.id);
        });

        action.append(doneButton, editButton, deleteButton);
    };

    const card = document.createElement('article');
    card.classList.add('card');
    card.append(cardImage, cardBody);

    return card;
};

// function to add unfinished book
function addUnfinished(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
};

// function to add finished book
function addFinished(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
}

const selectedEditBook = [];
var isEdit = false;

// function to edit book
function editBook(bookId) {
    isEdit = true;
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    selectedEditBook.push(bookTarget);
    overlay.style.display = 'flex';
    document.getElementById('inputBookTitle').value = bookTarget.title;
    document.getElementById('inputBookAuthor').value = bookTarget.author;
    document.getElementById('inputBookYear').value = bookTarget.year;
    document.getElementById('inputBookIsComplete').checked = bookTarget.isCompleted;

    const h2 = document.querySelector('.input_section .title-input h2');
    h2.innerText = 'Form Edit'

    const editNameButton = document.getElementById('bookSubmit');
    editNameButton.innerText = 'Update Book';
}

function saveEditBook() {
    isEdit = false;
    const getBookId = selectedEditBook[0].id;
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    const isCompleted = document.getElementById('inputBookIsComplete').checked;

    const bookTarget = findBook(getBookId);

    if (bookTarget == null) return;

    bookTarget.id = getBookId;
    bookTarget.title = title;
    bookTarget.author = author;
    bookTarget.year = year;
    bookTarget.isCompleted = isCompleted;

    selectedEditBook.splice(0, selectedEditBook.length);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

// function to delete book
function deleteBook(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget == -1) return;

    const confirmDelete = confirm('Delete file?');
    if (confirmDelete === true) {
        books.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
    } else {
        return;
    }

    saveData();
}

// function to findbook
function findBook(bookId) {
    for (const book of books) {
        if (book.id === bookId) {
            return book;
        };
    };
    return null;
};

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

// searchBook
const search = document.getElementById('searchBookTitle');

search.addEventListener('keyup', function (event) {
    const searchBook = event.target.value.toLowerCase();
    const listBooks = document.querySelectorAll('.book_list article');

    listBooks.forEach((book) => {
        const bookTitle = book.querySelector('.content h3').innerText.toLowerCase();
        if (bookTitle.includes(searchBook)) {
            book.style.display = 'flex';
        } else {
            book.style.display = 'none';
        }
    });
});

const searchSubmit = document.getElementById('searchSubmit');

searchSubmit.addEventListener('click', function (event) {
    event.preventDefault();
});