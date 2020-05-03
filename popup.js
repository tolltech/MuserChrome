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

    $('#refreshLinkInput').click(function () {
        var json = $('#jsonHiddenInput').val();

        $.ajax({
            type: 'POST',
            url: domainHost + 'sync/inputtracksexternal',
            contentType: 'application/json; charset=utf-8',
            crossDomain: true,
            data: { Text: json },
            dataType: 'json',
            cache: false,
            success: function (responseData, textStatus, jqXHR) {
                alert(responseData);
                $('#goToSiteHref').attr("href", domainHost + responseData);
            },
            error: function (responseData, textStatus, errorThrown) {
                alert('POST failed.\r\n' 
                + JSON.stringify(responseData) + '\r\n'
                + JSON.stringify(textStatus) + '\r\n'
                + JSON.stringify(errorThrown) + '\r\n'
                 );
            }
        });
    });


});

AddEventListener(FoundTracksEvent, function (request, sender, sendResponse) {
    var tracksCount = request.payload;
    $('#foundTracksMessage').html(tracksCount + ' tracks on this page');
    $('#downloadJsonButton').val('Download ' + tracksCount + 'tracks in JSON');
})

AddEventListener(FoundTracksFullEvent, function (request, sender, sendResponse) {
    var tracksModel = request.payload;

    $('#jsonHiddenInput').val(JSON.stringify(tracksModel));
})
