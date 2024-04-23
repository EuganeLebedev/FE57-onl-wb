const cartNode = document.querySelector("#cart")
const cartBtn = document.querySelector(".header__busket")
const cartCloseBtns = document.querySelectorAll(".cart.popup__area, .cart__close")

let apiUrl = 'http://127.0.0.1:8000/product?item_id=';

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

    removeFromCart = (event) => {
        event.preventDefault()
        let productID = Number(event.target.getAttribute("productid"));
        let cart = this.getCart();
        cart = cart.filter(obj => obj.id !== productID);
        sessionStorage.setItem(this.cartId, JSON.stringify(cart))
        fillCart()
        this.setBusketCount()
    }

    addToCart = (event) => {
        event.preventDefault()
        let productID = Number(event.target.closest(".product__container").id)
        let productNode = document.getElementById(`${productID}`)
        const productQuantityNode = event.target.closest(".product__form").querySelector(".product__quantity")
        const productForms = productNode.querySelectorAll(".product__form")
        let quantity = Number(productQuantityNode.value)
        let cart = this.getCart()
        let product = cart.find(obj => obj.id === productID);
        if (product) {
            if (quantity === 0) {
                cart = cart.filter(obj => obj.id !== productID);
                productForms.forEach(productForm => {
                    productForm.classList.remove("ordered");
                    let formQuantityNode = productForm.querySelector(".product__quantity")
                    formQuantityNode.value = 1;
                })

            } else {
                product.quantity = quantity;
                // productForm.classList.add("ordered");
                productForms.forEach(productForm => {
                    productForm.classList.add("ordered");
                    let formQuantityNode = productForm.querySelector(".product__quantity")
                    formQuantityNode.value = quantity;
                })

            }
        } else if (quantity > 0) {
            cart.push({"id": productID, "quantity": quantity})
            // productForm.classList.add("ordered")
            productForms.forEach(productForm => {
                productForm.classList.add("ordered");
            })
        }
        sessionStorage.setItem(this.cartId, JSON.stringify(cart))
        this.setBusketCount()

    }

    setBusketCount = () => {
        const busketCount = document.querySelector(".header__busket-count");
        let cart = storageCart.getCart()
        busketCount.innerHTML = cart ? cart.length : ''
    }
}

let storageCart = new Cart("wbCart");

function displayCart (event) {
    cartNode.classList.toggle("tagged")
}

function randomInteger(min, max) {
    let rand = min + Math.random() * (max - min);
    return Math.round(rand);
}

async function fillCart (event) {
    let cart = storageCart.getCart();
    let ul = cartNode.querySelector(".cart__items");
    ul.innerHTML = "";
    let total = 0;
    for (const product of cart) {
        const response = await fetch(`${apiUrl}${product.id}`);
        const data = await response.json();
        let li = document.createElement('li');
        li.classList.add("cart__item");
        total += data.price * product.quantity
        const img_id = randomInteger(1,5);
        li.innerHTML = `
                    <div class="cart__info-wrapper">
                        <div class="cart__image">
                            <img src="http://127.0.0.1:8000/file/product?id=${img_id}" alt="Image not found">
                        </div>
                        <div class="cart__info">
                            <h2 lass="cart__name">${data.name}</h2>
                        </div>
                        <div class="cart__buttons">
                            <div class="cart__form">
                                <p>Price <span>${data.price}</span> EUR</p>
                                <div class="number">
                                    <button class="number-minus" type="button" onclick="this.nextElementSibling.stepDown(); this.nextElementSibling.onchange();">-</button>
                                    <input type="number" class="product__quantity" value="${product? product.quantity : 1}" min="0" readonly>
                                    <button class="number-plus" type="button" onclick="this.previousElementSibling.stepUp(); this.previousElementSibling.onchange();">+</button>
                                </div>
                                <button class="btn product__remove" type="submit" productId="${product.id}">Remove</button>
                            </div>
                        </div>
                    </div>
        `
        ul.appendChild(li);
        li.querySelector(".product__remove").addEventListener("click", storageCart.removeFromCart)
    }
    let totalNode = document.createElement('span');
    totalNode.innerHTML = `Total ordered ${total} EUR`
    ul.after(totalNode)
}

cartBtn.addEventListener("click", displayCart)
cartBtn.addEventListener("click", fillCart)
cartCloseBtns.forEach(node => {
    node.addEventListener("click", displayCart)
})

export {Cart}