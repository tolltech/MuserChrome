$(document).ready(function () {

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTab = tabs && tabs[0];

        if (!currentTab || !currentTab.id) {
            return;
        }

        chrome.scripting.executeScript({
            target: {tabId: currentTab.id, allFrames: false},
            files: ['jquery.js'],
        });

        chrome.scripting.executeScript({
            target: {tabId: currentTab.id, allFrames: false},
            files: ['constants.js'],
        });

        chrome.scripting.executeScript({
            target: {tabId: currentTab.id, allFrames: false},
            files: ['common.js'],
        });

        chrome.scripting.executeScript({
            target: {tabId: currentTab.id, allFrames: false},
            files: ['trigger.js'],
        });
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
    $('#refreshLinkInput').val('Import ' + tracksCount + ' tracks on tolltech.ru');
})
