var frontpage = document.getElementById('frontpage');

function play() {
    btn.removeEventListener('click', play);
    frontpage.style.display = 'none';

    var cnvs = document.getElementsByTagName('canvas');
    for (let c of cnvs) {
        c.style.display = 'block';
    }

    bgLoop();
    galaxian();  
}

var btn = document.createElement('button');
btn.setAttribute('id', 'playBtn');
btn.innerText = 'Play';
btn.addEventListener('click', play);

frontpage.appendChild(btn);

