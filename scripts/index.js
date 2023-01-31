let main = document.querySelector("main");
const api = new Api(Cookies.get('username'));
let popupInfo = document.querySelector('#popup-info')
let closeInfo = document.querySelector('.close-info')
let imgInfo = document.querySelector('.info-img')
let deletBtn = document.querySelector(".delete-btn")
let idCat = document.querySelector('.id-cat').textContent;
let popupEditOpen = document.querySelector('#popup-edit');
let idCatEdit = document.querySelector('.id-cat-edit');
let idReturnEdit = 0;
function closeInfoo() {
  popupInfo.classList.remove("active");
  popupInfo.parentElement.classList.remove("active");
  console.log('work')
  // popupInfo.children[2].innerText="";
  // popupInfo.children[3].innerText="";
  // imgInfo.removeAttribute('src')
};

function catId(id) {
  return api.getCat(id)
    .then(response => response.json())
    .then(data => data.data)
}
const updCards = function (data) {
  main.innerHTML = "";
  data.forEach(function (cat) {
    if (cat.id) {
      let card = `<div id=${cat.id} class="${cat.favourite ? "card like" : "card"}" style="background-image:url(${cat.img_link || "images/cat.jpg"})"><span>${cat.name}</span></div>`;
      main.innerHTML += card;
    }
  });
  let cards = document.getElementsByClassName("card");
  for (let i = 0, cnt = cards.length; i < cnt; i++) {
    const width = cards[i].offsetWidth;
    cards[i].style.height = width * 0.6 + "px";
  }
  for (value of main.childNodes) {
    value.addEventListener('click', e => {
      let objCat = catId(parseInt(e.srcElement.id));
      objCat.then((result) => result.img_link)
      if (!popupForm.classList.contains("active")) {
        popupInfo.classList.add('active')
        popupForm.parentElement.classList.add("active");
        objCat.then((result) => {
          popupInfo.children[2].innerText = `Имя питомца:${result.name}`;
          popupInfo.children[5].innerText = `Рейтинг питомца: ${result.rate}`;
          imgInfo.setAttribute('src', `${result.img_link}`);
          popupInfo.children[4].innerText = `Описание: ${result.description}`;
          popupInfo.children[6].innerText = `Любимый питомец: ${result.favourite ? 'Да' : 'Нет'}`;
          popupInfo.children[7].innerText = `Возраст: ${result.age}`;
          popupInfo.children[8].innerText = `Индификатор кота: ${result.id}`;
          popupInfo.children[9].setAttribute('onclick', `deleteCat(${parseInt(result.id)})`)
          popupInfo.children[10].setAttribute("onClick", 'activeEdit()');
          idCatEdit.id=`${result.id}`;
          idCatEdit.innerText=`Индификатор кота: ${result.id}`;
          idReturnEdit = result.id;
          console.log(result);
        })
      }
    })
  }
}
function deleteCat(id) {
  console.log(typeof (id))
  api.delCat(id);
  getCats(api);
  closeInfoo();
}

function activeEdit() {
  popupInfo.classList.remove("active");
  popupInfo.parentElement.classList.remove("active");
  popupEditOpen.classList.add('active');
  popupEditOpen.parentElement.classList.add("active");
  catId(idReturnEdit).then(result => {
    popupEditOpen.children[4].value=result.age;
    popupEditOpen.children[5].value=result.name;
    popupEditOpen.children[6].value=result.rate;
    popupEditOpen.children[7].value=result.description;
    popupEditOpen.children[9].value=result.img_link;
    result
  })
}
function closeEdit(){
  popupEditOpen.classList.remove('active');
  popupEditOpen.parentElement.classList.remove('active');
}
function putCat(){
api.updCat(idReturnEdit, {
  age: popupEditOpen.children[4].value,
  name: popupEditOpen.children[5].value,
  rate: popupEditOpen.children[6].value,
  description: popupEditOpen.children[7].value,
  img_link: popupEditOpen.children[9].value
})
closeEdit();
alert('Информация изменена')
}
let addBtn = document.querySelector("#add");
let popupForm = document.querySelector("#popup-form");
let closePopupForm = popupForm.querySelector(".popup-close");
addBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (!popupForm.classList.contains("active")) {
    popupForm.classList.add("active");
    popupForm.parentElement.classList.add("active");
  }
});
closePopupForm.addEventListener("click", () => {
  popupForm.classList.remove("active");
  popupForm.parentElement.classList.remove("active");
});


let form = document.forms[0];
form.img_link.addEventListener("change", (e) => {
  form.firstElementChild.style.backgroundImage = `url(${e.target.value})`;
});
form.img_link.addEventListener("input", (e) => {
  form.firstElementChild.style.backgroundImage = `url(${e.target.value})`;
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let body = {};
  for (let i = 0; i < form.elements.length; i++) {
    let inp = form.elements[i];
    if (inp.type === "checkbox") {
      body[inp.name] = inp.checked;
    } else if (inp.name && inp.value) {
      if (inp.type === "number") {
        body[inp.name] = +inp.value;
      } else {
        body[inp.name] = inp.value;
      }
    }
  }
  console.log(body);
  api.addCat(body)
    .then(res => res.json())
    .then(data => {
      if (data.message === "ok") {
        form.reset();
        closePopupForm.click();
        api.getCat(body.id)
          .then(res => res.json())
          .then(cat => {
            if (cat.message === "ok") {
              catsData.push(cat.data);
              localStorage.setItem("cats", JSON.stringify(catsData));
              getCats(api, catsData);
            } else {
              console.log(cat);
            }
          })
      } else {
        console.log(data);
        api.getIds().then(r => r.json()).then(d => console.log(d));
      }
    })
});

let catsData = localStorage.getItem("cats");
catsData = catsData ? JSON.parse(catsData) : [];

const getCats = function (api, store) {
  if (!store.length) {
    api.getCats()
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.message === "ok") {
          localStorage.setItem("cats", JSON.stringify(data.data));
          catsData = [...data.data];
          updCards(data.data);
        }
      })
  } else {
    updCards(store);
  }
}

const loginPopupBtn = document.querySelector('.login-popup');
const logOutBtn = document.querySelector('.logOut-btn');

function authCheked(){
  if(Cookies.get('username') !== undefined){
    getCats(api, catsData);
    loginPopupBtn.classList.add('hiden');
    logOutBtn.classList.remove('hiden');
  } else {
    loginPopupBtn.classList.remove('hiden');
    logOutBtn.classList.add('hiden');
    main.innerHTML ="";
  }
};
authCheked();

const popupLogin = document.querySelector('#auth-popup');

loginPopupBtn.addEventListener('click', (e) => {
popupLogin.classList.add('active');
popupLogin.parentElement.classList.add('active');
})

const closeLogin = document.querySelector('#close-login-popop');

closeLogin.addEventListener('click', (e) => {
  popupLogin.classList.remove('active');
  popupLogin.parentElement.classList.remove('active');
})

const hintBtn = document.querySelector('.hint');

hintBtn.addEventListener('click', (e) => {
  alert("Логин: kuchenkoDmitriy (Логин соответствует имени, где хранятся коты); пароль: 1234");
})

const loginBtn = document.querySelector('.login');
const inputLogin = document.querySelector('#auth-form').children[1];
const inputPass = document.querySelector('#auth-form').children[3];


loginBtn.addEventListener('click', (e) => {
  Cookies.set("username", inputLogin.value);
  Cookies.set("password", inputPass.value);
  popupLogin.classList.remove('active');
  popupLogin.parentElement.classList.remove('active');
  authCheked();
})

logOutBtn.addEventListener('click', (e) => {
  Cookies.remove('username');
  authCheked();
})