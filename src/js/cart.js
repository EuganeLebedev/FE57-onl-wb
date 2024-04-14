// function addToCart () {
//     console.log("ADD TO CART");
// }

class Cart {

    constructor(cartId) {
        this.cartId = cartId
        if (!sessionStorage.getItem(this.cartId)) {
            sessionStorage.setItem(this.cartId, JSON.stringify([]))
        }
        this.productsList = sessionStorage.getItem(this.cartId);
    }

    addToCart = () => {
        console.log("ADD TO CART");

    }
}

export {Cart}