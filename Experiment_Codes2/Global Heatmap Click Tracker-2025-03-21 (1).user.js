// ==UserScript==
// @name         Global Heatmap Click Tracker
// @namespace    http://tampermonkey.net/
// @version      2025-03-21
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let style = document.createElement('style');
    style.innerHTML = `
        .heatmap {
            position: absolute;
            width: 10px;
            height: 10px;
            background: red;
            border-radius: 50%;
            opacity: 0.6;
            pointer-events: none;
            z-index: 999999;
        }
    `;
    document.head.appendChild(style);

    document.addEventListener("click", function(event) {
        let dot = document.createElement("div");
        dot.className = "heatmap";
        dot.style.left = `${event.pageX - 5}px`;
        dot.style.top = `${event.pageY - 5}px`;
        document.body.appendChild(dot);
    });
})();
