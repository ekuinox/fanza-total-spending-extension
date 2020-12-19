console.log('hello world fanza-total-spending-extension');
console.log(document.querySelector('#purchaseDate'))

fetch('/history').then(r => r.text()).then(text => console.log(text));

chrome.runtime.onMessage.addListener((message, sender) => {
    console.log([message, sender]);
});
