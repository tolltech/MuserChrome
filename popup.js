$(document).ready(function () {
    $('#downloadJsonButton').click(function () {
        SendMessageToCurrentActiveTab(DownloadPlayListEvent);
    });

    $('#refreshLinkInput').click(function () {
        SendMessageToCurrentActiveTab(RequestToGetUrlEvent);
    });

    SendMessageToCurrentActiveTab(GetTracksInfoEvent);    
});

AddEventListener(FoundTracksEvent, function (tracksCount, sender, sendResponse) {
    $('#foundTracksMessage').html(tracksCount + ' tracks on this page');
    $('#downloadJsonButton').val('Download ' + tracksCount + ' tracks in JSON');
    $('#refreshLinkInput').val('Import ' + tracksCount + ' tracks on tolltech.ru');
})

AddEventListener(GoToTolltechEvent, function (tracks, sender, sendResponse) {
    $.ajax({
        type: 'POST',
        url: domainHost + '/sync/inputtracksexternal',
        contentType: 'application/json; charset=utf-8',
        crossDomain: true,
        data: JSON.stringify({ Text: JSON.stringify(tracks) }),
        dataType: 'json',
        cache: false,
        success: function (responseData, textStatus, jqXHR) {
            window.open(domainHost + responseData.url, '_blank');
        },
        complete: function (responseData, textStatus, jqXHR) {
            //alert('complete');
        },
        error: function (responseData, textStatus, errorThrown) {
            // alert('error');
            // alert('POST failed.\r\n'
            //     + JSON.stringify(responseData) + '\r\n'
            //     + JSON.stringify(textStatus) + '\r\n'
            //     + JSON.stringify(errorThrown) + '\r\n'
            // );
        }
    });
})

AddEventListener(DownloadPlayListCallBackEvent, function (tracks, sender, sendResponse) {
    DownloadJsonFile(tracks.Tracks, tracks.FileName);
})

function DownloadJsonFile(obj, name) {
    var csv = 'data:application/octet-stream,'
        + encodeURIComponent(JSON.stringify(obj));

    var link = document.createElement('a');
    link.setAttribute('href', csv);
    link.setAttribute('download', name);
    link.style.display = 'none';
    document.body.appendChild(link); // Required for FF

    link.click();
}
