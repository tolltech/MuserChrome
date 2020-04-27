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
    // <div tabindex="0" class="audio_row audio_row_with_cover _audio_row _audio_row_6612980_456239511 audio_can_add audio_has_thumb audio_row2" data-full-id="6612980_456239511" onclick="return getAudioPlayer().toggleAudio(this, event)" data-audio="[456239511,6612980,&quot;&quot;,&quot;Так и оставим&quot;,&quot;Земфира&quot;,251,0,0,&quot;&quot;,0,66,&quot;&quot;,&quot;[]&quot;,&quot;4afdcc195399843977//e679aee71260af7b66/98f7c10e124f65d13f//c3f9fff768805ebf25/f45edb59395f1a5e38&quot;,&quot;https://sun9-47.userapi.com/c837628/v837628453/7ccd0/VXNfKyL_EvQ.jpg,https://sun9-26.userapi.com/c837628/v837628453/7cccf/GMLZr6M2-ec.jpg&quot;,{&quot;duration&quot;:251,&quot;content_id&quot;:&quot;6612980_456239511&quot;,&quot;puid22&quot;:4,&quot;account_age_type&quot;:3,&quot;_SITEID&quot;:276,&quot;vk_id&quot;:6612980,&quot;ver&quot;:251116},&quot;&quot;,[{&quot;id&quot;:&quot;1398312341207781995&quot;,&quot;name&quot;:&quot;Земфира&quot;}],&quot;&quot;,[-2000732191,732191,&quot;c430b753c71e7e43e6&quot;],&quot;8f2d4f6euYYTQYQ4ueW7mAH6EAVusE-fGg&quot;,0,0,true,&quot;&quot;,false]" onmouseover="AudioUtils.onRowOver(this, event)" onmouseleave="AudioUtils.onRowLeave(this, event)">
    //     <div class="audio_row_content _audio_row_content">
    //         <button class="blind_label _audio_row__play_btn" aria-label="Play" onclick="getAudioPlayer().toggleAudio(this, event); return cancelEvent(event)"></button>

    //         <div class="audio_row__cover" style="background-image: url(https://sun9-47.userapi.com/c837628/v837628453/7ccd0/VXNfKyL_EvQ.jpg)"></div>
    //         <div class="audio_row__cover_back _audio_row__cover_back"></div>
    //         <div class="audio_row__cover_icon _audio_row__cover_icon"></div>
    //         <div class="audio_row__counter"></div>
    //         <div class="audio_row__play_btn"></div>

    //         <div class="audio_row__inner">

    //             <div class="audio_row__performer_title">

    //                 <div onmouseover="setTitle(this)" class="audio_row__performers"><a class="artist_link" href="/artist/1398312341207781995">Земфира</a></div>
    //                 <div class="audio_row__title _audio_row__title" onmouseover="setTitle(this)">
    //                     <span class="audio_row__title_inner _audio_row__title_inner">Так и оставим</span>
    //                     <span class="audio_row__title_inner_subtitle _audio_row__title_inner_subtitle"></span>
    //                 </div>
    //             </div>
    //             <div class="audio_row__info _audio_row__info"><div class="audio_row__duration audio_row__duration-s _audio_row__duration" style="visibility: visible;">4:11</div></div>
    //         </div>

    //         <div class="audio_player__place _audio_player__place"></div>
    //     </div>
    // </div>

    var tracks = $('div.audio_row');
    var trackInfos = [];

    var playlistName = $('.AudioPlaylistSnippet__title--main').html();

    for (var i = 0; i < tracks.length; ++i) {
        var track = $(tracks[i]);
        var artist = track.find('a.artist_link, .audio_row__performer_title a').html();
        var song = track.find('span.audio_row__title_inner').html();
        trackInfos.push({ Artist: artist, Song: song });
    }

    return {Tracks: trackInfos, Playlist: playlistName};
}

var tracks = ParsePlayList();
var date = new Date();

playlistName = tracks.Playlist || date.getFullYear() + '_' + (date.getMonth() + 1) + '_' + date.getDate();
DownloadJsonFile(tracks.Tracks, playlistName + '_' + window.location.host + window.location.pathname + '.json');