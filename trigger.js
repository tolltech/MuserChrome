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

    function ParsePlayListYandex() {
        var tracks = $('div.d-track');
        var trackInfos = [];

        var playlistName = $('input.page-playlist__title').val() ?? $('.page-playlist__title').html();

        //alert(playlistName);

        for (var i = 0; i < tracks.length; ++i) {
            var track = $(tracks[i]);
            var song = (track.find('a.d-track__title').html() ?? track.find('.d-track__title').html()).trim();

            var artists = $(track).find('.d-track__artists a');
            var artist = '';
            for (var j=0; j < artists.length; ++j){
                if (j != 0) artist += ',';
                artist += $(artists[j]).html();
            }

            trackInfos.push({ Artist: artist, Song: song });
        }

        return { Tracks: trackInfos, Playlist: playlistName };
    }

    function DownloadPlayList() {
        var tracks = ParsePlayListYandex();
        var date = new Date();

        playlistName = tracks.Playlist || date.getFullYear() + '_' + (date.getMonth() + 1) + '_' + date.getDate();
        DownloadJsonFile(tracks.Tracks, playlistName + '_' + window.location.host + window.location.pathname + '.json');
    }

    AddEventListener(DownloadPlayListEvent, DownloadPlayList);

    function SendUrlForImport(tracks) {
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
                //alert('error');
                // alert('POST failed.\r\n'
                //     + JSON.stringify(responseData) + '\r\n'
                //     + JSON.stringify(textStatus) + '\r\n'
                //     + JSON.stringify(errorThrown) + '\r\n'
                // );
            }
        });
    }

    AddEventListener(RequestToGetUrlEvent, function () {
        var tracks = ParsePlayListYandex();
        // alert(window.location);
        // alert(JSON.stringify( tracks.Tracks));
        SendUrlForImport(tracks.Tracks);
    });
}

 var tracks = ParsePlayListYandex();
 SendMessageToExtension(FoundTracksEvent, tracks.Tracks.length);