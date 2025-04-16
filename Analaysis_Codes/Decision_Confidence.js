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

    // Create the floating decision confidence meter
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

    // Variables to track decision-making
    let hesitationTime = 0; // Total hover time before clicks
    let decisionClicks = 0; // Clicks on decision elements
    let backtrackCount = 0; // Repeated clicks on similar elements
    let aidInteractions = 0; // Interactions with help/tooltips
    let lastUpdate = Date.now();
    let confidenceScore = 0;
    let lastClickedElement = null;
    let clickTimestamps = [];

    // Track hesitation (hover time before clicking)
    let decisionElements = document.querySelectorAll("a, button, input, select, [data-personalized], [role='button'], [title], [aria-label='help']");
    decisionElements.forEach(element => {
        let hoverStart = 0;
        element.addEventListener("mouseenter", () => {
            hoverStart = Date.now();
        });
        element.addEventListener("mouseleave", () => {
            if (hoverStart) {
                hesitationTime += (Date.now() - hoverStart) / 1000; // Time in seconds
                hoverStart = 0;
            }
        });
    });

    // Track decision clicks and backtracking
    document.addEventListener("click", (event) => {
        let target = event.target.closest("a, button, input, select, [data-personalized], [role='button'], [title], [aria-label='help']");
        if (target) {
            decisionClicks++;
            clickTimestamps.push({ element: target, time: Date.now() });

            // Check for backtracking (clicking same/similar element within 5 seconds)
            if (lastClickedElement && (target === lastClickedElement || target.tagName === lastClickedElement.tagName)) {
                if ((Date.now() - clickTimestamps[clickTimestamps.length - 2].time) < 5000) {
                    backtrackCount++;
                }
            }
            lastClickedElement = target;

            // Check for decision aid interactions (tooltips, help)
            if (target.matches("[title], [aria-label='help'], [data-tooltip]")) {
                aidInteractions++;
            }
        }
    });

    // Update the meter every 2 seconds
    function updateMeter() {
        let now = Date.now();
        let timeDiff = (now - lastUpdate) / 1000; // Time in seconds
        lastUpdate = now;

        // Calculate decision confidence score (heuristic)
        let hesitationFactor = Math.min(hesitationTime / (decisionClicks || 1), 5) / 5; // High hesitation lowers confidence
        let backtrackFactor = Math.min(backtrackCount / (decisionClicks || 1), 1); // High backtracking lowers confidence
        let aidFactor = Math.min(aidInteractions / (decisionClicks || 1), 1); // High aid use lowers confidence
        let clickFrequency = Math.min(decisionClicks / (timeDiff * 2), 1); // Frequent clicks increase confidence
        confidenceScore = Math.round(
            (1 - hesitationFactor) * 40 + // Hesitation reduces up to 40 points
            (1 - backtrackFactor) * 30 + // Backtracking reduces up to 30 points
            (1 - aidFactor) * 20 + // Aid use reduces up to 20 points
            clickFrequency * 10 // Frequent clicks add up to 10 points
        );

        // Update meter text and color
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

        // Reset counters
        hesitationTime = 0;
        decisionClicks = 0;
        backtrackCount = 0;
        aidInteractions = 0;
        clickTimestamps = clickTimestamps.filter(ts => now - ts.time < 5000); // Keep recent clicks
    }

    // Update the meter every 2 seconds
    setInterval(updateMeter, 2000);

    // Ensure meter is added after DOM is loaded
    document.addEventListener("DOMContentLoaded", () => {
        document.body.appendChild(meter);
        // Re-query decision elements in case DOM changes
        decisionElements = document.querySelectorAll("a, button, input, select, [data-personalized], [role='button'], [title], [aria-label='help']");
    });
})();
