function SendMessageToExtension(message, callback) {
    chrome.runtime.sendMessage(message, callback);
}

function SendMessageToCurrentActiveTab(message, callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, callback);
    });
}

function AddEventListener(eventType, action) {
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (!request.type || request.type != eventType) {
                return;
            }

            action(request);
        });
}