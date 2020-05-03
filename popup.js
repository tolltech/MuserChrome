$(document).ready(function () {

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTab = tabs && tabs[0];

        if (!currentTab || !currentTab.id) {
            return;
        }

        chrome.tabs.executeScript(currentTab.id, { file: "jquery.js" });
        chrome.tabs.executeScript(currentTab.id, { file: "constants.js" });
        chrome.tabs.executeScript(currentTab.id, { file: "common.js" });
        chrome.tabs.executeScript(currentTab.id, { file: "trigger.js" });
    });

    $('#downloadJsonButton').click(function () {
        SendMessageToCurrentActiveTab(DownloadPlayListEvent);
    });

    $('#refreshLinkInput').click(function () {
        SendMessageToCurrentActiveTab(RequestToGetUrlEvent)
    });
});

AddEventListener(FoundTracksEvent, function (tracksCount, sender, sendResponse) {
    $('#foundTracksMessage').html(tracksCount + ' tracks on this page');
    $('#downloadJsonButton').val('Download ' + tracksCount + ' tracks in JSON');
})

AddEventListener(FoundTracksFullEvent, function (payload, sender, sendResponse) {
    var url = payload.url;
    var text = 'Import ' + payload.count + ' tracks on tolltech.ru';
    $('#goToSiteHref').html(text);
    $('#goToSiteHref').attr("href", url);
})
