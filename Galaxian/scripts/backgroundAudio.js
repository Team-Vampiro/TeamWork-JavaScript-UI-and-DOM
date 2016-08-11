function audioPause() {
    var myAudio = document.getElementById("audio1");
    if (myAudio.paused){
        myAudio.play();
        document.getElementById("pausebutton")
                .style.background = "url(./images/speaker-icon.png)";
    }
    else{
        myAudio.pause();
        document.getElementById("pausebutton")
                .style.background = "url(./images/muted-speaker-icon.png)";
    }
}

