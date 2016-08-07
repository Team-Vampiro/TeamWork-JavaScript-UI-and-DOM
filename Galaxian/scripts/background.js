var bgImg = document.getElementById("background"),
    canvasBG = document.getElementById("canvas-bg"),
    ctxBG = canvasBG.getContext("2d"),
    bgY = 0;

function bgLoop() {
    ctxBG.clearRect(0, 0, 800, 500);
    ctxBG.drawImage(bgImg, 0, -500 + bgY, 800, 500);
    ctxBG.drawImage(bgImg, 0, bgY, 800, 500);

    bgY += 3;
    if (bgY >= 500) {
        bgY = 0;
    }

    window.requestAnimationFrame(bgLoop);
}

// bgLoop();