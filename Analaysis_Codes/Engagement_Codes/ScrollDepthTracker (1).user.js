// ==UserScript==
// @name         Scroll Depth Tracker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Track scroll depth on any website
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let progressBar = document.createElement("div");
    progressBar.id = "progressBar";
    progressBar.style.position = "fixed";
    progressBar.style.top = "0";
    progressBar.style.left = "0";
    progressBar.style.width = "0%";
    progressBar.style.height = "5px";
    progressBar.style.background = "green";
    progressBar.style.zIndex = "10000";
    progressBar.style.transition = "width 0.2s ease";
    document.body.appendChild(progressBar);

    window.addEventListener("scroll", function() {
        let scrollTop = document.documentElement.scrollTop;
        let scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        let scrollPercentage = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = scrollPercentage + "%";
    });
})();
