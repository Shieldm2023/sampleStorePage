
export let order = JSON.parse(localStorage.getItem('order'));


if(!order){
    order = [];
}


export function saveOrderToStorage(order){
    localStorage.setItem('order', JSON.stringify(order));
}