export let accounts = JSON.parse(localStorage.getItem('accounts'));

if(!accounts){
    accounts = [

    ];
}


export function saveAccountToStorage(newAccount){
    accounts.push(newAccount);
    localStorage.setItem('accounts', JSON.stringify(accounts));
}