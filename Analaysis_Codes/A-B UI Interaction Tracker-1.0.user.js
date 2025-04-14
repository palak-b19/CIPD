// ==UserScript==
// @name         A/B UI Interaction Tracker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tracks button/link clicks on a webpage for A/B testing decision behavior
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    console.log("Tampermonkey script loaded");


    // Utility: Create a unique selector for any element
    function getUniqueSelector(el) {
        if (el.id) return `#${el.id}`;
        if (el.className) return `${el.tagName.toLowerCase()}.${el.className.split(' ').join('.')}`;
        return el.tagName.toLowerCase();
    }

    // Track clicks on interactive elements
    document.addEventListener('click', function (e) {
        let target = e.target;

        // Traverse up to find clickable element (e.g., button inside span inside div)
        while (target && !['BUTTON', 'A', 'DIV'].includes(target.tagName)) {
            target = target.parentElement;
        }

        if (target) {
            const tag = target.tagName;
            const text = target.innerText.trim().slice(0, 50); // limit to 50 chars
            const selector = getUniqueSelector(target);

            // Optionally classify as A/B if they have class A or B
            let variant = '';
            if (target.classList.contains("A")) variant = ' (Design A)';
            if (target.classList.contains("B")) variant = ' (Design B)';

            const logMsg = `[Click Track] ${tag} "${text}" clicked at ${selector}${variant}`;
            console.log(logMsg);

            // Optional: Save to localStorage
            const log = JSON.parse(localStorage.getItem('abClicks') || '[]');
            log.push({ time: Date.now(), tag, text, selector, variant });
            localStorage.setItem('abClicks', JSON.stringify(log));
        }
    });

    // Optional: Show all logs on page unload
    window.addEventListener("beforeunload", () => {
        const clicks = JSON.parse(localStorage.getItem('abClicks') || '[]');
        console.log("📊 Total Clicks Tracked:", clicks.length);
        clicks.forEach((click, i) => {
            console.log(`${i + 1}. [${new Date(click.time).toLocaleTimeString()}] ${click.text}${click.variant}`);
        });
    });
})();


