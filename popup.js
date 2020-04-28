function DownloadPlaylistFromActiveTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTab = tabs && tabs[0];

        if (!currentTab || !currentTab.id) {
            return;
        }

        chrome.tabs.executeScript(currentTab.id, { file: "jquery.js" });
        chrome.tabs.executeScript(currentTab.id, { file: "trigger.js" });
    });
}

$(document).ready(function () {
    $('#downloadJsonButton').click(function () {
        DownloadPlaylistFromActiveTab();
    });
});

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