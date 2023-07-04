var wasTollMuserInjected;
var playlistDomChangeEvents = [];

if (!wasTollMuserInjected) {
    wasTollMuserInjected = true;

    function ParsePlayListYandex(jqTracks) {
        var tracks = jqTracks;
        var trackInfos = [];

        for (var i = 0; i < tracks.length; ++i) {
            var track = $(tracks[i]);
            var song = (track.find('a.d-track__title').html() ?? track.find('.d-track__title').html()).trim();

            var artists = $(track).find('.d-track__artists a');
            var artist = artists.map(function () { return $(this).html(); }).toArray().join(', ');

            trackInfos.push({ Artist: artist, Song: song, OrderId: parseInt(track.attr('data-id')) });
        }

        return trackInfos;
    }

    function DownloadPlayList() {
        var tracks = GetTotalTracks();
        var date = new Date();

        playlistName = tracks.Playlist || date.getFullYear() + '_' + (date.getMonth() + 1) + '_' + date.getDate();

        SendMessageToExtension(DownloadPlayListCallBackEvent,
            {
                Tracks: tracks.Tracks,
                FileName: playlistName + '_' + window.location.host + window.location.pathname + '.json'
            });
    }

    AddEventListener(DownloadPlayListEvent, DownloadPlayList);

    AddEventListener(RequestToGetUrlEvent, function () {
        alert(playlistDomChangeEvents[0]);
        var tracks = [];//GetTotalTracks();
        SendMessageToExtension(GoToTolltechEvent, tracks.Tracks);
    });

    AddEventListener(GetTracksInfoEvent, function () {
        var tracks = [];//GetTotalTracks();
        SendMessageToExtension(FoundTracksEvent, playlistDomChangeEvents.length);
    });

    function GetTotalTracks() {
        var playlistName = $('input.page-playlist__title').val() ?? $('.page-playlist__title').html();
        var totalTracks = new Map();

        for (var i = 0; i < playlistDomChangeEvents.length; ++i) {
            var tracks = ParsePlayListYandex($(playlistDomChangeEvents[i]));

            for (var j = 0; j < tracks.length; ++j) {
                totalTracks.set(tracks[j].OrderId, tracks[j]);
            }
        }

        var sortedTracks = Array.from(totalTracks.values()).sort(function (a, b) { return a.OrderId - b.OrderId });
        return { Tracks: sortedTracks, Playlist: playlistName };
    }

    var firstListHtml = $('.page-playlist__tracks-list').find('.lightlist__cont').html();
    if (firstListHtml) {
        playlistDomChangeEvents.push(firstListHtml);
    }

    var eee = 0;
    $('.page-playlist__tracks-list').bind('DOMSubtreeModified', function (e) {
        if (e.target.firstChild && e.target.firstChild.classList &&
            e.target.firstChild.classList.contains('d-track')) {
            playlistDomChangeEvents.push(e.target.innerHTML);
        }
    });
}