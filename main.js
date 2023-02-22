// console.clear();

function deleteElement(index) {
  const element = document.getElementById(`e-${index}`);

  //   console.log(`e-${index}`);
  element.parentNode.removeChild(element);
}

function pushElement(index, items) {
  //Создаем элементы
  const element = createElement("div", "element", `e-${idECounter}`);
  const elementInformation = createElement("div", "element__information");
  const elementName = createElement("p", "element__name");
  const elementOwner = createElement("p", "element__owner");
  const elementStars = createElement("p", "element__stars");
  const elementActions = createElement("div", "element__actions");
  const elementDelete = createElement(
    "button",
    "element__delete",
    `ed-${idECounter}`
  );
  //   console.log(`e-${idECounter}`);
  idECounter++;

  //Вкладываем элементы друг в друга
  element.appendChild(elementInformation);
  element.appendChild(elementActions);
  elementInformation.appendChild(elementName);
  elementInformation.appendChild(elementOwner);
  elementInformation.appendChild(elementStars);
  elementActions.appendChild(elementDelete);

  //Наполняем элементы
  elementName.textContent = `Name: ${items[index].name}`;
  elementOwner.textContent = `Owner: ${items[index].owner.login}`;
  elementStars.textContent = `Stars: ${items[index].stargazers_count}`;
  elementDelete.textContent = "Delete";

  //Добавляем элемент на страницу
  results.appendChild(element);
}

function deleteSearchElements() {
  let searchAutocompleteClone;

  //Удаляем старые результаты, создаем клон элемента, заменяем
  //элемент на странице на его клона, заменяем элемент в коде
  //на его клона. Таким образом, мы избавляем элемент от всех
  //его слушателей. Сбрасываем счетчик ID
  searchAutocomplete.replaceChildren();
  searchAutocompleteClone = searchAutocomplete.cloneNode(true);
  searchAutocomplete.parentNode.replaceChild(
    searchAutocompleteClone,
    searchAutocomplete
  );
  searchAutocomplete = searchAutocompleteClone;
  idSECounter = 0;
}

function createElement(tagName, className, id) {
  const element = document.createElement(tagName);

  if (className) {
    element.classList.add(className);
  }
  if (id) {
    element.id = id;
  }

  return element;
}

function pushSearchElements(items) {
  //Берем первые 5 результатов, создаем фрагмент, который мы
  //будем наполнять элементами
  const first5Items = [...items].slice(0, 5);
  const fragment = document.createDocumentFragment();

  //   console.log(first5Items);
  //Наполняем фрагмент элементами
  first5Items.forEach((item) => {
    const element = createElement("li", "search__element", `se-${idSECounter}`);

    // console.log(`se-${idSECounter}`);
    idSECounter++;
    element.textContent = item.name;
    fragment.appendChild(element);
  });
  //Удаляем старые элементы
  deleteSearchElements();
  //Добавляем новый фрагмент на страницу
  searchAutocomplete.appendChild(fragment);

  //Добавляем слушатель
  searchAutocomplete.addEventListener("click", (event) => {
    if (event.target.id.slice(0, 3) === "se-") {
      //   console.dir(event.target);
      pushElement(event.target.id.slice(3), items);
      searchInput.value = "";
      deleteSearchElements();
    }
  });
}

async function search() {
  let response;

  //   console.log(this.value);
  if (this.value === "") {
    deleteSearchElements();
  } else {
    response = await fetch(
      `https://api.github.com/search/repositories?q=${this.value}`
    );
    if (response.ok) {
      response.json().then((result) => pushSearchElements(result.items));
    } else {
      //Можно пробрасывать ошибку
      // response.json().then((error) => {
      //   const err = new Error("Что-то пошло не так");

      //   err.data = error;
      //   throw err;
      // });

      //Можно повторить попытку через 5 секунд
      // setTimeout(search, 5000);

      //Можно просто написать в консоль
      console.log("Что-то пошло не так");
    }
  }
}

function debounce(callback, delay) {
  let timeout;

  return function (...rest) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback.apply(this, rest);
    }, delay);

    return;
  };
}

//Находим элементы, с которыми мы будем работать
const searchInput = document.querySelector(".search__input");
let searchAutocomplete = document.querySelector(".search__autocomplete");
const results = document.querySelector(".results");
//Создаем счетчики для ID, чтобы каждый добавленный элемент был
//уникальным
let idSECounter = 0;
let idECounter = 0;

//Добавляем слушателей
searchInput.addEventListener("keyup", debounce(search, 1000));
results.addEventListener("click", (event) => {
  if (event.target.id.slice(0, 3) === "ed-") {
    deleteElement(event.target.id.slice(3));
  }
});
