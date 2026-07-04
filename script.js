document.addEventListener('DOMContentLoaded', () => {

    const triggerOverlay = document.getElementById('triggerOverlay');
    const startButton = document.getElementById('startButton');
    const loadingBar = document.getElementById('loadingBar');
    const statusText = document.getElementById('statusText');
    const ambientLight = document.getElementById('ambientLight');
    const roseWrapper = document.getElementById('roseWrapper');
    const roseHead = document.getElementById('roseHead');
    const calyx = document.getElementById('calyx');
    const stem = document.getElementById('stem');
    const leafLeft = document.getElementById('leafLeft');
    const leafRight = document.getElementById('leafRight');
    const endText = document.getElementById('endText');
    const fallingPetalsEl = document.getElementById('fallingPetals');
    const bgMusic = document.getElementById("bgMusic");

    const PETAL_LAYERS = [
        { count: 4, w: 24, h: 46, curl: 78, delayBase: 0, tz: 2, cls: 'petal-bud' },
        { count: 5, w: 34, h: 58, curl: 65, delayBase: 0.25, tz: 9, cls: 'petal-core' },
        { count: 6, w: 46, h: 72, curl: 48, delayBase: 0.55, tz: 18, cls: 'petal-inner' },
        { count: 7, w: 58, h: 88, curl: 22, delayBase: 0.90, tz: 30, cls: 'petal-mid-inner' },
        { count: 8, w: 72, h: 104, curl: -5, delayBase: 1.30, tz: 44, cls: 'petal-mid' },
        { count: 9, w: 86, h: 118, curl: -25, delayBase: 1.75, tz: 60, cls: 'petal-outer' },
        { count: 10, w: 98, h: 130, curl: -48, delayBase: 2.25, tz: 76, cls: 'petal-blush' },
    ];

    const FALLING_PETAL_COLORS = [
        ['#9a001d', '#3d0008'],
        ['#850018', '#2b0005'],
        ['#ad0022', '#480008'],
        ['#bf0028', '#52000c'],
    ];

    function startCardLoader() {
        const duration = 2400;
        let startTimestamp = null;

        function animateLoader(timestamp) {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const percent = Math.floor(progress * 100);

            loadingBar.style.width = `${percent}%`;

            if (percent < 50) statusText.textContent = "Small";
            else if (percent < 60) statusText.textContent = "effort";
            else if (percent < 70) statusText.textContent = "to ";
            else statusText.textContent = "make u smile motu";

            if (progress < 1) {
                requestAnimationFrame(animateLoader);
            } else {
                startButton.removeAttribute('disabled');
            }
        }

        requestAnimationFrame(animateLoader);
    }

    function createPetals() {
        PETAL_LAYERS.forEach((layer) => {
            const angleStep = 360 / layer.count;

            for (let i = 0; i < layer.count; i++) {
                const petal = document.createElement('div');
                petal.className = `petal ${layer.cls}`;

                const angle = i * angleStep;

                petal.style.width = `${layer.w}px`;
                petal.style.height = `${layer.h}px`;
                petal.style.setProperty('--angle', `${angle}deg`);
                petal.style.setProperty('--curl', `${layer.curl}deg`);
                petal.style.setProperty('--tz', `${layer.tz}px`);

                roseHead.appendChild(petal);
            }
        });
    }

    function growStem() {
        return new Promise(resolve => {
            stem.classList.add('grow');

            setTimeout(() => leafLeft.classList.add('visible'), 700);
            setTimeout(() => leafRight.classList.add('visible'), 1000);

            setTimeout(resolve, 2000);
        });
    }

    function bloom() {
        calyx.classList.add('visible');
        ambientLight.classList.add('visible');
        roseHead.classList.add('blooming');
    }

    function spawnFallingPetal() {
        const petal = document.createElement('div');
        petal.className = 'falling-petal';

        petal.style.left = Math.random() * 100 + "vw";

        document.body.appendChild(petal);

        setTimeout(() => petal.remove(), 7000);
    }

    function startFallingPetals() {
        setInterval(spawnFallingPetal, 400);
    }

    async function startAnimationSequence() {

        await growStem();
        await new Promise(r => setTimeout(r, 100));

        bloom();

        setTimeout(() => {
            roseWrapper.classList.add('rotating');
        }, 1500);

        setTimeout(startFallingPetals, 2000);

        setTimeout(() => {
            endText.classList.add('visible');
        }, 3500);
    }

    // 🌹 MAIN CLICK (FIXED AUDIO HERE)
    startButton.addEventListener('click', async () => {

        triggerOverlay.classList.add('fade-out');

        // 🎵 AUDIO FIX
        if (bgMusic) {
            bgMusic.volume = 0.5;
            try {
                await bgMusic.play();
            } catch (e) {
                console.log("Audio blocked:", e);
            }
        }

        setTimeout(startAnimationSequence, 800);
    });

    createPetals();
    startCardLoader();

});