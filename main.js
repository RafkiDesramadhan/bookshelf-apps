const books = [];
const RENDER_BOOK = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APP";

const isStorageExist = () => {
  if (typeof Storage === undefined) {
    alert("Browser anda tidak mendukung local storage!");
    return false;
  }
  return true;
};

const generateId = () => {
  return +new Date();
};

const generateBookObject = (id, title, author, year, isComplete) => {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
};

const loadDataFromStorage = () => {
  const dataLocal = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(dataLocal);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_BOOK));
};

const saveData = () => {
  if (isStorageExist()) {
    const dataParsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, dataParsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
};

document.addEventListener(SAVED_EVENT, () => {
  console.log(localStorage.getItem(STORAGE_KEY));
  alert("Data telah disimpan!");
});

const addBook = () => {
  const id = generateId();
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  let isComplete = document.getElementById("inputBookIsComplete");
  if (isComplete.checked) {
    isComplete = true;
  } else {
    isComplete = false;
  }

  const bookObject = generateBookObject(id, title, author, year, isComplete);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_BOOK));
  saveData();
};

const findId = (id) => {
  for (const book of books) {
    if (book.id === id) {
      return book;
    }
  }
  return null;
};

const findIdIndex = (id) => {
  for (const index in books) {
    if (books[index].id === id) {
      return index;
    }
  }
  return -1;
};

const addReadComplete = (id) => {
  const idTarget = findId(id);

  if (idTarget === null) return;

  idTarget.isComplete = true;

  document.dispatchEvent(new Event(RENDER_BOOK));
  saveData();
};

const addReadIncomplete = (id) => {
  const idTarget = findId(id);

  if (idTarget === null) return;

  idTarget.isComplete = false;

  document.dispatchEvent(new Event(RENDER_BOOK));
  saveData();
};

const removeBook = (id) => {
  const idTarget = findIdIndex(id);

  if (idTarget === -1) return;

  books.splice(idTarget, 1);
  document.dispatchEvent(new Event(RENDER_BOOK));
  saveData();
};

const search = (e) => {
  const title = document.getElementById("searchBookTitle").value;
  const dataFilter = books.filter((book) => book.title === title);
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  incompleteBookshelfList.innerHTML = "";

  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );
  completeBookshelfList.innerHTML = "";

  if (dataFilter === "undefined") return true;

  if (dataFilter.length === 0) {
    document.dispatchEvent(new Event(RENDER_BOOK));
  } else {
    for (const data of dataFilter) {
      const bookElement = makeBook(data);
      if (!data.isComplete) {
        incompleteBookshelfList.append(bookElement);
      } else {
        completeBookshelfList.append(bookElement);
      }
    }
  }
  e.preventDefault();
};

const makeBook = (data) => {
  const titleElement = document.createElement("h3");
  titleElement.innerText = data.title;

  const authorElement = document.createElement("p");
  authorElement.innerText = `Penulis: ${data.author}`;

  const yearElement = document.createElement("p");
  yearElement.innerText = `Tahun ${data.year}`;

  const articleElement = document.createElement("article");
  articleElement.classList.add("book_item");

  articleElement.append(titleElement, authorElement, yearElement);
  articleElement.setAttribute("id", data.id);

  if (data.isComplete) {
    const buttonIncompleteElement = document.createElement("button");
    buttonIncompleteElement.classList.add("green");
    buttonIncompleteElement.innerText = "Belum dibaca";

    buttonIncompleteElement.addEventListener("click", () => {
      addReadIncomplete(data.id);
    });

    const buttonDeleteElement = document.createElement("button");
    buttonDeleteElement.classList.add("red");
    buttonDeleteElement.innerText = "Hapus buku";

    buttonDeleteElement.addEventListener("click", () => {
      removeBook(data.id);
    });

    const actionElement = document.createElement("div");
    actionElement.classList.add("action");

    actionElement.append(buttonIncompleteElement, buttonDeleteElement);
    articleElement.append(actionElement);
  } else {
    const buttonCompleteElement = document.createElement("button");
    buttonCompleteElement.classList.add("green");
    buttonCompleteElement.innerText = "Selesai dibaca";

    buttonCompleteElement.addEventListener("click", () => {
      addReadComplete(data.id);
    });

    const buttonDeleteElement = document.createElement("button");
    buttonDeleteElement.classList.add("red");
    buttonDeleteElement.innerText = "Hapus buku";

    buttonDeleteElement.addEventListener("click", () => {
      removeBook(data.id);
    });

    const actionElement = document.createElement("div");
    actionElement.classList.add("action");

    actionElement.append(buttonCompleteElement, buttonDeleteElement);
    articleElement.append(actionElement);
  }

  return articleElement;
};

document.addEventListener("DOMContentLoaded", () => {
  const inputBook = document.getElementById("inputBook");
  inputBook.addEventListener("submit", (e) => {
    e.preventDefault();
    addBook();
  });

  const searchBook = document.getElementById("searchBook");
  searchBook.addEventListener("submit", (e) => {
    e.preventDefault();
    search();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_BOOK, () => {
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  incompleteBookshelfList.innerHTML = "";

  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );
  completeBookshelfList.innerHTML = "";

  for (const book of books) {
    const bookElement = makeBook(book);
    if (!book.isComplete) {
      incompleteBookshelfList.append(bookElement);
    } else {
      completeBookshelfList.append(bookElement);
    }
  }
});
