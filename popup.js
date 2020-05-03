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
        SendMessageToCurrentActiveTab({ type: DownloadPlayListEvent });
    });
});

AddEventListener(FoundTracksEvent, function (request, sender, sendResponse) {
    $('#foundTracksMessage').html(request.count + ' tracks on this page.');
})

// $.ajax({
//     type: 'POST',
//     url: 'https://to.com/postHere.php',
//     crossDomain: true,
//     data: '{"some":"json"}',
//     dataType: 'json',
//     success: function(responseData, textStatus, jqXHR) {
//         var value = responseData.someKey;
//     },
//     error: function (responseData, textStatus, errorThrown) {
//         alert('POST failed.');
//     }
// });