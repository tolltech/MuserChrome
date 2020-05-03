var wasTollMuserInjected;
if (!wasTollMuserInjected) {
    wasTollMuserInjected = true;

    function DownloadFile(text, name) {
        var csv = 'data:text/plain;charset=utf-8,'
            + encodeURIComponent(text);

        var link = document.createElement('a');
        link.setAttribute('href', csv);
        link.setAttribute('download', name);
        link.style.display = 'none';
        document.body.appendChild(link); // Required for FF

        link.click();
    }

    function DownloadJsonFile(obj, name) {
        var csv = 'data:text/plain;charset=utf-8,'
            + encodeURIComponent(JSON.stringify(obj));

        var link = document.createElement('a');
        link.setAttribute('href', csv);
        link.setAttribute('download', name);
        link.style.display = 'none';
        document.body.appendChild(link); // Required for FF

        link.click();
    }

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

    function DownloadPlayList() {
        var tracks = ParsePlayList();
        var date = new Date();

        playlistName = tracks.Playlist || date.getFullYear() + '_' + (date.getMonth() + 1) + '_' + date.getDate();
        DownloadJsonFile(tracks.Tracks, playlistName + '_' + window.location.host + window.location.pathname + '.json');
    }

    AddEventListener(DownloadPlayListEvent, DownloadPlayList);
}

var tracks = ParsePlayList();
SendMessageToExtension({ type: FoundTracksEvent, count: tracks.Tracks.length });