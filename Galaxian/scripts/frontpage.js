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
    galaxian();
}

var btn = document.createElement('button');
btn.setAttribute('id', 'playBtn');
btn.innerText = 'Play';
btn.addEventListener('click', play);

frontpage.appendChild(btn);

