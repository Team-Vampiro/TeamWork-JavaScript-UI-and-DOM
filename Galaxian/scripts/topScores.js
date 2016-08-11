function getRandomScores(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function getHardCoded() {
    var arr = [],score,min;
    min=5000;
    for (var i = 10000; i > 0; i -= 1000) {
      min=min-500;
      score=getRandomScores(min,i/2);
        arr.push({
            name: 'I`m better than you',
            score: score
        });
    }

    return arr;
}

function showTopScores(tops) {
    var game = document.getElementById('game'),
        frontpage = document.getElementById('frontpage'),
        frag = document.createDocumentFragment(),
        ul = document.createElement('ul'),
        ol = document.createElement('ol'),
        li = document.createElement('li'),
        btn = document.createElement('button'),
        h1 = document.createElement('h1'),
        br = document.createElement('br');

    frontpage.innerHTML = '';

    h1.innerText = "Top Scores";

    btn.setAttribute('id', 'playBtn');
    btn.innerText = 'Play Again';
    btn.addEventListener('click', play);

    frag.appendChild(h1);
    frag.appendChild(ol);
    frag.appendChild(ul);
    frag.appendChild(br);
    frag.appendChild(btn);

    for (var i = 0; i < 10; i += 1) {
        var current = li.cloneNode(true);
        current.innerHTML = tops[i].name;
        ol.appendChild(current);

        current = li.cloneNode(true);
        current.innerHTML = tops[i].score;
        ul.appendChild(current);
    }

    game.style.display = 'none';
    frontpage.appendChild(frag);
    frontpage.style.display = 'block';
}

function checkTopScores(name, score) {
    var tops = [],
        result = {
            name: name,
            score: score
        },
        haveStorage = false;

    if (typeof (Storage) !== 'undefined') {
        haveStorage = true;
    }

    if (haveStorage) {
        tops = JSON.parse(localStorage.getItem('GalaxianTopScore'));
    }

    if (!tops || !tops.length) {
        tops = getHardCoded();
    }

    for (var i = 0, len = tops.length; i < len; i += 1) {
        if (tops[i].score < score) {
            tops.splice(i, 0, result);
            tops.pop();
            if (haveStorage) {
                localStorage.setItem('GalaxianTopScore', JSON.stringify(tops));
            }
            break;
        }
    }

    showTopScores(tops);
}
