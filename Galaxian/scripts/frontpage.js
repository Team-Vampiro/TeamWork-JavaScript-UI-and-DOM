var frontpage = document.getElementById('frontpage');

function play() {
    btn.removeEventListener('click', play);
    frontpage.style.display = 'none';

    var game = document.getElementById('game');
    game.style.display = 'block';

    var cnvs = document.getElementsByTagName('canvas');
    for (let i = 0; i < cnvs.length; i += 1) {
        let ctx = cnvs[i].getContext('2d');
        ctx.clearRect(0, 0, cnvs[i].width, cnvs[i].height);
    }

    bgLoop();
    var pausebtn=document.getElementById("pausebutton");
    pausebtn.style.display="inline-block";
    var audio=document.getElementById("audio1");
    audio.autoplay=true;
    audio.load();
    galaxian();
    var svg=document.getElementById("svg");
    svg.style.display=none;
}

var btn = document.createElement('button');
btn.setAttribute('id', 'playBtn');
btn.innerText = 'Play';
btn.addEventListener('click', play);

frontpage.appendChild(btn);
