$(document).ready(function () {
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
