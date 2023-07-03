var wasTollMuserInjected;
if (!wasTollMuserInjected) {
    wasTollMuserInjected = true;

    function ParsePlayList() {
        var tracks = $('div.audio_row');
        var trackInfos = [];

        var playlistName = $('.AudioPlaylistSnippet__title--main').html();

        for (var i = 0; i < tracks.length; ++i) {
            var track = $(tracks[i]);
            var artist = track.find('a.artist_link, .audio_row__performer_title a').html();
            var song = track.find('span.audio_row__title_inner').html();
            trackInfos.push({ Artist: artist, Song: song });
        }

        return { Tracks: trackInfos, Playlist: playlistName };
    }

    function ParsePlayListYandex() {
        var tracks = $('.page-playlist__tracks-list div.d-track');
        var trackInfos = [];

        var playlistName = $('input.page-playlist__title').val() ?? $('.page-playlist__title').html();

        for (var i = 0; i < tracks.length; ++i) {
            var track = $(tracks[i]);
            var song = (track.find('a.d-track__title').html() ?? track.find('.d-track__title').html()).trim();

            var artists = $(track).find('.d-track__artists a');
            var artist = artists.map(function() {return $(this).html();}).toArray().join(', ');

            trackInfos.push({ Artist: artist, Song: song });
        }

        return { Tracks: trackInfos, Playlist: playlistName };
    }

    function DownloadPlayList() {
        var tracks = ParsePlayListYandex();
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
        var tracks = ParsePlayListYandex();
        SendMessageToExtension(GoToTolltechEvent, tracks.Tracks);
    });
    
    AddEventListener(GetTracksInfoEvent, function () {        
        var tracks = ParsePlayListYandex(); 
        SendMessageToExtension(FoundTracksEvent, tracks.Tracks.length);
    });
}