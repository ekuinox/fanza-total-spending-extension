chrome.browserAction.onClicked.addListener(tab => {
    if (tab.id == null) return;
    chrome.tabs.sendMessage(tab.id, ['clicked', tab]);
});
