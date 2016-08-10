function audioPause() {
    var myAudio = document.getElementById("audio1");
    if (myAudio.paused){
        myAudio.play();
    }
    else{
        myAudio.pause();
    }
}

