import { randomInteger } from "./utils.js"
// import { Cart } from "./cart.js"

class Cart {

    constructor(cartId) {
        this.cartId = cartId
        if (!sessionStorage.getItem(this.cartId)) {
            sessionStorage.setItem(this.cartId, JSON.stringify([]))
        }
    }

    getCart = () => {
        let cart = sessionStorage.getItem(this.cartId)
        return JSON.parse(cart)
    }

    getProduct = (productID) => {
        if (!productID) {
            return undefined
        }
        let cart = JSON.parse(sessionStorage.getItem(this.cartId)) || new Array()
        let product = cart.find(obj => obj.id === productID);
        return product
    }

    setQuantity(productID, quantity) {
        if (!productID) {
            return undefined
        }
        let cart = JSON.parse(sessionStorage.getItem(this.cartId)) || new Array()
        let product = cart.find(obj => obj.id === productID);
        product.quantity = quantity

    }

    addToCart = (event) => {
        event.stopPropagation()
        event.preventDefault()
        const productForm = event.target.closest(".product__form")
        let productID = Number(event.target.closest(".product__container").id)
        const productQuantityNode = productForm.querySelector(".product__quantity")
        let quantity = Number(productQuantityNode.value)
        let cart = this.getCart()
        let product = cart.find(obj => obj.id === productID);
        if (product) {
            if (quantity === 0) {
                cart = cart.filter(obj => obj.id !== productID);
                productForm.classList.remove("ordered");
                productQuantityNode.value = 1;

            } else {
                product.quantity = quantity;
                productForm.classList.add("ordered");

            }
        } else if (quantity > 0) {
            cart.push({"id": productID, "quantity": quantity})
            productForm.classList.add("ordered")
        }
        sessionStorage.setItem(this.cartId, JSON.stringify(cart))
        setBusketCount()

    }
}

let storageCart = new Cart("wbCart");
const apiUrl = 'http://127.0.0.1:8000';


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
    products.forEach(product => {
        const img_id = randomInteger(1,5);
        const li = document.createElement('li');
        const productInCart = storageCart.getProduct(product.id);

        li.classList.add("product__container");
        li.id = `${product.id}`
        li.innerHTML = `
                    <div class="product__image-wrapper">
                        <img class="product__image" src="img/products/${img_id}.webp" alt="No image found">
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
                                <button class="product__add" type="submit">Add</button>
                            </form>
                    
                    </div>
                    <div class="product__detailed" id="detailed_${product.id}">
                        <div href="#header" class="search__area">
                            <div class="detailed__wrapper">
                                <div class="detailed__img-wrapper">
                                    <img class="detailed__img" src="img/products/${img_id}.webp">
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
                                            <button class="product__add" type="submit">Add</button>
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

getProducts().then(products => {addItems(products)});
