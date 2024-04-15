import { Cart } from "./cart.js"

let storageCart = new Cart("wbCart");
const apiUrl = 'http://127.0.0.1:8000';

function randomInteger(min, max) {
    let rand = min + Math.random() * (max - min);
    return Math.round(rand);
}

async function getProducts() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching todos:', error);
        return [];
    }
}


function addItems(products) {
    const ul = document.querySelector(".products__list")
    ul.innerHTML = ""
    products.forEach(product => {
        const img_id = randomInteger(1,5);
        const li = document.createElement('li');
        const productInCart = storageCart.getProduct(product.id);

        li.classList.add("product__container");
        li.id = `${product.id}`
        li.innerHTML = `
                    <div class="product__image-wrapper">
                        <img class="product__image" src="http://127.0.0.1:8000/file/product?id=${img_id}" alt="No image found">
                    </div>
                    <a class="product__preview_wrapper" href="#detailed_${product.id}">
                        Preview
                    </a>
                    <div class="product__description">
                        <h2 class="product__name">${product.name}</h2>
                            <form class="product__form ${productInCart? 'ordered' : ''}">
                                <p>Price <span>${product.price}</span> EUR</p>
                                <div class="number">
                                    <button class="number-minus" type="button" onclick="this.nextElementSibling.stepDown(); this.nextElementSibling.onchange();">-</button>
                                    <input type="number" class="product__quantity" value="${productInCart? productInCart.quantity : 1}" min="0" readonly>
                                    <button class="number-plus" type="button" onclick="this.previousElementSibling.stepUp(); this.previousElementSibling.onchange();">+</button>
                                </div>
                                <button class="btn product__add" type="submit">Add</button>
                            </form>
                    
                    </div>
                    <div class="product__detailed" id="detailed_${product.id}">
                        <div href="#header" class="search__area">
                            <div class="detailed__wrapper">
                                <div class="detailed__img-wrapper">
                                    <img class="detailed__img" src="http://127.0.0.1:8000/file/product?id=${img_id}" alt="No image found">
                                </div>
                                <div class="detailed__info-wrapper">
                                    <div class="detailed__info">
                                        <h2 lass="detailed__name">${product.name}</h2>
                                        <p class="detailed__description">${product.description}</p>
                                    </div>
                                    <div class="detailed__buttons">
                                        <form class="product__form ${productInCart? 'ordered' : ''}">
                                            <p>Price <span>${product.price}</span> EUR</p>
                                            <div class="number">
                                                <button class="number-minus" type="button" onclick="this.nextElementSibling.stepDown(); this.nextElementSibling.onchange();">-</button>
                                                <input type="number" class="product__quantity" value="${productInCart? productInCart.quantity : 1}" min="0" readonly>
                                                <button class="number-plus" type="button" onclick="this.previousElementSibling.stepUp(); this.previousElementSibling.onchange();">+</button>
                                            </div>
                                            <button class="btn product__add" type="submit">Add</button>
                                        </form>
                                    </div>
                                    <a href="#header" class="detailed__close">X</a>
                                </div>
                            </div>

                        </div>
                    </div>
`;
        ul.appendChild(li);
        setBusketCount()
        const addBtns = li.querySelectorAll(".product__add, .number-minus, .number-plus");
        addBtns.forEach(btn => {
            btn.addEventListener("click", storageCart.addToCart);
        })
    });
}

function setBusketCount () {
    const busketCount = document.querySelector(".header__busket-count");
    let cart = storageCart.getCart()
    busketCount.innerHTML = cart ? cart.length : ''
}

async function searchProducts (event) {
    const searchInput = document.querySelector(".search__input")
    if (!searchInput) {
        return
    }
    event.preventDefault()
    let products = await getProducts();
    products = products.filter(obj => obj.name.includes(searchInput.value));
    addItems(products)
    searchInput.value = ""
}

getProducts().then(products => {addItems(products)});
const searchSubmit = document.querySelector(".search__submit")
searchSubmit.addEventListener("click", searchProducts)

export { setBusketCount }