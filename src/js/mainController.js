var socket = io();
var player;
var paused = true;
var timeInterval;

// $(window).on('load',function(){
//     $('#roomModal').modal('show');
// });

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: 'iN8zmmCRqUA',
        playerVars: {
            modestbranding: 1,
            controls: 0,
            rel: 0
        },
        events: {
            onReady: init,
            onStateChange: onPlayerStateChange
        }
    });
}

function init() {
    updateProgressBar();
    clearInterval(timeInterval);
    timeInterval = setInterval(() => {
        updateProgressBar();
    }, 200);
}

function updateProgressBar() {
    document.getElementById('progressBar').value = (player.getCurrentTime()/player.getDuration())*100;
}

function onPlayerStateChange(event) {
    switch(event.data){
        case 0:
            paused = true;
            $('#playIcon').removeClass('fas fa-pause').addClass('fas fa-play');
            socket.emit('pause video');
            break;
        case 1:
            paused = false;
            $('#playIcon').removeClass('fas fa-play').addClass('fas fa-pause');
            socket.emit('play video');
            break;
        case 2:
            paused = true;
            $('#playIcon').removeClass('fas fa-pause').addClass('fas fa-play');
            socket.emit('pause video');
            break;
    }
}

$('#changeVidSrc').on('click', () => {
    let vidID = document.getElementById('youtubeURL').value.slice(-11);
    socket.emit('change video', vidID);
});

$('#playBtn').on('click', () => {
    if (paused) {
        player.playVideo();
    }else {
        player.pauseVideo();
    }
    
});

$('#progressBar').on('mouseup touchend', (event) => {
    let time = player.getDuration() * (event.target.value/100);
    socket.emit('change time', time);
});

socket.on('change video', (id) => {
    player.cueVideoById(id);
});

socket.on('change time', (time) => {
    player.seekTo(time);
});

socket.on('pause video' , () => {
    player.pauseVideo();
});

socket.on('play video' , () => {
    player.playVideo();
});
