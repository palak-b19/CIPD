// ==UserScript==
// @name         Track First 3 Decisions (Time Logger)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Logs time to first 3 clicks (decisions) and displays on screen
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const startTime = Date.now();
    const clickTimes = [];
    const maxClicks = 3;

    const loggerBox = document.createElement('div');
    loggerBox.style.position = 'fixed';
    loggerBox.style.top = '10px';
    loggerBox.style.right = '10px';
    loggerBox.style.background = 'rgba(0, 0, 0, 0.7)';
    loggerBox.style.color = '#fff';
    loggerBox.style.padding = '10px 15px';
    loggerBox.style.borderRadius = '10px';
    loggerBox.style.fontSize = '14px';
    loggerBox.style.zIndex = '9999';
    loggerBox.style.fontFamily = 'monospace';
    loggerBox.innerHTML = '🕒 Waiting for clicks...';
    document.body.appendChild(loggerBox);

    document.addEventListener('click', function (e) {
        if (clickTimes.length < maxClicks) {
            const now = Date.now();
            const elapsed = Math.round((now - startTime) / 1000);
            clickTimes.push(elapsed);

            loggerBox.innerHTML = clickTimes.map((t, i) => `✔️ Decision ${i + 1}: ${t} sec`).join('<br>');

            if (clickTimes.length === maxClicks) {
                loggerBox.innerHTML += '<br>✅ All decisions logged!';
            }
        }
    });
})();
