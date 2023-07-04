var wasTollMuserInjected;
var playlistsCache = {};
var playlistDomChangeEvents = [];

if (!wasTollMuserInjected) {
    wasTollMuserInjected = true;

    function ParsePlayListYandex(jqTracks) {
        var tracks = jqTracks || $('.page-playlist__tracks-list div.d-track');
        var trackInfos = [];

        var playlistName = $('input.page-playlist__title').val() ?? $('.page-playlist__title').html();

        for (var i = 0; i < tracks.length; ++i) {
            var track = $(tracks[i]);
            var song = (track.find('a.d-track__title').html() ?? track.find('.d-track__title').html()).trim();
            var orderId = track.attr('data-id');

            var artists = $(track).find('.d-track__artists a');
            var artist = artists.map(function () { return $(this).html(); }).toArray().join(', ');

            trackInfos.push({ Artist: artist, Song: song, OrderId: track.attr('data-id')});
        }

        return { Tracks: trackInfos, Playlist: playlistName };
    }

    function DownloadPlayList() {
        var tracks = GetTracksFromCacheOrHot();
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
        var tracks = GetTracksFromCacheOrHot();
        SendMessageToExtension(GoToTolltechEvent, tracks.Tracks);
    });

    AddEventListener(GetTracksInfoEvent, function () {
        var tracks = GetTracksFromCacheOrHot();
        SendMessageToExtension(FoundTracksEvent, tracks.Tracks.length);
    });

    function GetTracksFromCacheOrHot() {
        var tracks = ParsePlayListYandex();

        if (playlistsCache[tracks.Playlist]) {
            
        }

        return tracks;
    }
    
    function GetTracksFromCache(){
        var currentTracks = ParsePlayListYandex();

        return {
            Playlist: tracks.Playlist,
            Tracks: playlistsCache[tracks.Playlist].map(function () { return JSON.parse(this); }).toArray()
        };
    }

    $('.page-playlist__tracks-list').bind('DOMSubtreeModified', function (e) {        
        playlistDomChangeEvents.push($(e.target).html());        
    });
}