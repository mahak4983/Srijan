function getScript(source, callback) {
    var script = document.createElement('script');
    var prior = document.getElementsByTagName('script')[0];
    script.async = 1;

    script.onload = script.onreadystatechange = function( _, isAbort ) {
        if(isAbort || !script.readyState || /loaded|complete/.test(script.readyState) ) {
            script.onload = script.onreadystatechange = null;
            script = undefined;

            if(!isAbort && callback) setTimeout(callback, 0);
        }
    };

    script.src = source;
    prior.parentNode.insertBefore(script, prior);
}
getScript("https://allevents.in/scripts/confetti.browser.min.js",function(data, textStatus, jqxhr) {
    var duration = 2000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 2000 };
    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }
    var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
        return clearInterval(interval);
        }
        var particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
});

function clueAfter10mins(clue) {
    setTimeout(function () { alert(clue); }, 600000);
}

function clueAfter15mins(clue) {
    setTimeout(function () { alert(clue); }, 900000);
}

setTimeout(() => {
    let congrats_modal = new bootstrap.Modal(document.getElementById('congrats_modal'), {});
    congrats_modal.show();
}, 0);
