var wasTollMuserInjected;
var playlistDomChangeEvents = [];
var totalTracks = new Map();

setTimeout(function () {

    if (!wasTollMuserInjected) {
        wasTollMuserInjected = true;

        function ParsePlayListYandexGetNewTracks(jqTracks) {
            var tracks = jqTracks;
            var trackInfos = [];

            for (var i = 0; i < tracks.length; ++i) {
                var track = $(tracks[i]);

                var orderId = parseInt(track.attr('data-id'));
                if (!orderId || totalTracks.has(orderId)) {
                    continue;
                }

                var notTrimmedSong = track.find('a.d-track__title').html() ?? track.find('.d-track__title').html();
                var song = notTrimmedSong.trim();

                var artists = $(track).find('.d-track__artists a');
                var artist = artists.map(function () { return $(this).html(); }).toArray().join(', ');

                trackInfos.push({ Artist: artist, Song: song, OrderId: orderId });
            }

            return trackInfos;
        }

        function AlertParseIsProcessing() {
            if (playlistDomChangeEvents.length > 0) {
                alert('Please, wait and try again later. Parsing in progress. ' + playlistDomChangeEvents.length + ' items remain');
                return true;
            }
            return false;
        }

        function DownloadPlayList(noAlert) {
            var tracks = GetTotalTracks(!noAlert);
            var date = new Date();

            if (!noAlert && AlertParseIsProcessing()) {
                return;
            }

            playlistName = tracks.Playlist || date.getFullYear() + '_' + (date.getMonth() + 1) + '_' + date.getDate();

            SendMessageToExtension(DownloadPlayListCallBackEvent,
                {
                    Tracks: tracks.Tracks,
                    FileName: playlistName + '_' + window.location.host + window.location.pathname + '.json'
                });
        }

        AddEventListener(DownloadPlayListEvent, DownloadPlayList);
        AddEventListener(DownloadPlayListEventBrutte, function () { DownloadPlayList(true); });

        AddEventListener(RequestToGetUrlEvent, function () {
            if (AlertParseIsProcessing()) {
                return;
            }

            var tracks = GetTotalTracks(true);
            SendMessageToExtension(GoToTolltechEvent, tracks.Tracks);
        });

        AddEventListener(GetTracksInfoEvent, function () {
            var tracks = GetTotalTracks();
            SendMessageToExtension(FoundTracksEvent, tracks.Tracks.length);
        });

        AddEventListener(GetProgressEvent, function () {
            SendMessageToExtension(PushProgressEvent, playlistDomChangeEvents.length);
        });

        function GetTotalTracks(needAlert) {
            var playlistName = $('input.page-playlist__title').val() ?? $('.page-playlist__title').html();
            var sortedTracks = Array.from(totalTracks.values()).sort(function (a, b) { return a.OrderId - b.OrderId });
            if (sortedTracks.length == 0) return { Tracks: [], Playlist: playlistName };

            var maxOrderId = sortedTracks[sortedTracks.length - 1].OrderId;
            if (maxOrderId > sortedTracks.length) {
                var notFoundNeighbours = [];
                var prev = sortedTracks[0];
                for (var i = 1; i <= maxOrderId; ++i) {
                    if (!totalTracks.has(i)) {
                        notFoundNeighbours.push(prev);
                    }
                    prev = totalTracks.get(i - 1) || prev;
                }
                if (needAlert) {
                    var nbrsStrs = notFoundNeighbours.map(x => x.OrderId + ' - ' + x.Artist + ' - ' + x.Song);
                    var nbrs = new Set(Array.from(nbrsStrs));
                    alert('Some tracks were not parsed. Near the tracks ' + Array.from(nbrs).join('\r\n'));
                }
            }

            return { Tracks: sortedTracks, Playlist: playlistName };
        }

        var firstListHtml = $('.page-playlist__tracks-list').find('.lightlist__cont').html();
        if (firstListHtml) {
            playlistDomChangeEvents.push(firstListHtml);
        }

        var eee = 0;
        $('.page-playlist__tracks-list').bind('DOMSubtreeModified', function (e) {
            if (e.target.firstChild && e.target.firstChild.classList && e.target.firstChild.classList.contains('d-track')) {
                var notFound = false;
                for (var i = 0; i < e.target.childNodes.length; ++i) {
                    var currentOrderId = e.target.childNodes[i].getAttribute('data-id');
                    if (currentOrderId <= 0) continue;

                    if (totalTracks.has(currentOrderId)) continue;
                    notFound = true;
                    break;
                }

                if (notFound) {
                    playlistDomChangeEvents.push(e.target.innerHTML);
                }
            }
        });

        let timerId = setInterval(function () {
            var evt = playlistDomChangeEvents.pop();
            var cnt = 1000;
            while (evt && cnt > 0) {
                var tracks = ParsePlayListYandexGetNewTracks($(evt));
                for (var j = 0; j < tracks.length; ++j) {
                    totalTracks.set(tracks[j].OrderId, tracks[j]);
                }

                --cnt;
                evt = playlistDomChangeEvents.pop();
            }
        }, 100);
    }
}, 5000);