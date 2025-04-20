// ==UserScript==
// @name         Decision Confidence Meter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a visual meter to track user decision-making confidence based on interactions
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let meter = document.createElement("div");
    meter.id = "decisionConfidenceMeter";
    meter.style.position = "fixed";
    meter.style.top = "10px";
    meter.style.right = "10px";
    meter.style.width = "220px";
    meter.style.padding = "10px";
    meter.style.background = "green";
    meter.style.color = "white";
    meter.style.borderRadius = "5px";
    meter.style.zIndex = "10000";
    meter.style.fontFamily = "Arial, sans-serif";
    meter.style.fontSize = "14px";
    meter.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
    meter.innerHTML = "Decision Confidence: <span id='confidenceScore'>0</span>";
    document.body.appendChild(meter);

    let hesitationTime = 0; 
    let decisionClicks = 0; 
    let backtrackCount = 0; 
    let aidInteractions = 0;
    let lastUpdate = Date.now();
    let confidenceScore = 0;
    let lastClickedElement = null;
    let clickTimestamps = [];

    let decisionElements = document.querySelectorAll("a, button, input, select, [data-personalized], [role='button'], [title], [aria-label='help']");
    decisionElements.forEach(element => {
        let hoverStart = 0;
        element.addEventListener("mouseenter", () => {
            hoverStart = Date.now();
        });
        element.addEventListener("mouseleave", () => {
            if (hoverStart) {
                hesitationTime += (Date.now() - hoverStart) / 1000;
                hoverStart = 0;
            }
        });
    });

    document.addEventListener("click", (event) => {
        let target = event.target.closest("a, button, input, select, [data-personalized], [role='button'], [title], [aria-label='help']");
        if (target) {
            decisionClicks++;
            clickTimestamps.push({ element: target, time: Date.now() });

            if (lastClickedElement && (target === lastClickedElement || target.tagName === lastClickedElement.tagName)) {
                if ((Date.now() - clickTimestamps[clickTimestamps.length - 2].time) < 5000) {
                    backtrackCount++;
                }
            }
            lastClickedElement = target;

            if (target.matches("[title], [aria-label='help'], [data-tooltip]")) {
                aidInteractions++;
            }
        }
    });

    function updateMeter() {
        let now = Date.now();
        let timeDiff = (now - lastUpdate) / 1000;
        lastUpdate = now;

        let hesitationFactor = Math.min(hesitationTime / (decisionClicks || 1), 5) / 5; 
        let backtrackFactor = Math.min(backtrackCount / (decisionClicks || 1), 1); 
        let aidFactor = Math.min(aidInteractions / (decisionClicks || 1), 1); 
        let clickFrequency = Math.min(decisionClicks / (timeDiff * 2), 1); 
        confidenceScore = Math.round(
            (1 - hesitationFactor) * 40 + 
            (1 - backtrackFactor) * 30 + 
            (1 - aidFactor) * 20 + 
            clickFrequency * 10 
        );

        let scoreElement = document.getElementById("confidenceScore");
        scoreElement.textContent = confidenceScore;

        if (confidenceScore >= 66) {
            meter.style.background = "green";
        } else if (confidenceScore >= 33) {
            meter.style.background = "yellow";
            meter.style.color = "black";
        } else {
            meter.style.background = "red";
        }

        hesitationTime = 0;
        decisionClicks = 0;
        backtrackCount = 0;
        aidInteractions = 0;
        clickTimestamps = clickTimestamps.filter(ts => now - ts.time < 5000);
    }

    setInterval(updateMeter, 2000);

    document.addEventListener("DOMContentLoaded", () => {
        document.body.appendChild(meter);
        decisionElements = document.querySelectorAll("a, button, input, select, [data-personalized], [role='button'], [title], [aria-label='help']");
    });
})();
