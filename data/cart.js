
export let cart = JSON.parse(localStorage.getItem('cart'));


if(!cart){
    cart = [];
}



export function removeFromCart(productID){
    const newCart = [];
    cart.forEach((cartItem) =>{

        if(cartItem.productID !== productID){
            newCart.push(cartItem);
        }

       
    })

    cart = newCart;
    saveToStorage();
}

export function saveToStorage(){
    localStorage.setItem('cart', JSON.stringify(cart));
}