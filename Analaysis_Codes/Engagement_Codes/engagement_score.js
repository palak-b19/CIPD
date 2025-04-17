// ==UserScript==
// @name         Engagement Flow Indicator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a visual meter to track user engagement and potential flow state based on micro-interactions
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Create the floating engagement meter
    let meter = document.createElement("div");
    meter.id = "engagementMeter";
    meter.style.position = "fixed";
    meter.style.bottom = "10px";
    meter.style.left = "10px";
    meter.style.width = "200px";
    meter.style.padding = "10px";
    meter.style.background = "blue";
    meter.style.color = "white";
    meter.style.borderRadius = "5px";
    meter.style.zIndex = "10000";
    meter.style.fontFamily = "Arial, sans-serif";
    meter.style.fontSize = "14px";
    meter.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
    meter.innerHTML = "Engagement Score: <span id='engagementScore'>0</span>";
    document.body.appendChild(meter);

    // Variables to track engagement
    let hoverTime = 0;
    let clickCount = 0;
    let idleTime = 0;
    let personalizedClicks = 0;
    let lastUpdate = Date.now();
    let engagementScore = 0;
    let lastInteraction = Date.now();

    // Track hover duration on interactive elements
    let interactiveElements = document.querySelectorAll("a, button, [data-personalized], img, [role='button']");
    interactiveElements.forEach(element => {
        let hoverStart = 0;
        element.addEventListener("mouseenter", () => {
            hoverStart = Date.now();
        });
        element.addEventListener("mouseleave", () => {
            if (hoverStart) {
                hoverTime += (Date.now() - hoverStart) / 1000; // Time in seconds
                hoverStart = 0;
            }
        });
    });

    // Track clicks, especially on dynamic or personalized elements
    document.addEventListener("click", (event) => {
        clickCount++;
        lastInteraction = Date.now();
        if (event.target.matches("[data-personalized], [data-personalized] *, .animated, [role='button']")) {
            personalizedClicks++;
        }
    });

    // Track idle time (no scrolling or interaction)
    let lastScroll = Date.now();
    window.addEventListener("scroll", () => {
        lastScroll = Date.now();
        lastInteraction = Date.now();
    });

    // Update the meter every 2 seconds
    function updateMeter() {
        let now = Date.now();
        let timeDiff = (now - lastUpdate) / 1000; // Time in seconds
        lastUpdate = now;

        // Check idle time (no scroll or interaction)
        let timeSinceInteraction = (now - lastInteraction) / 1000;
        if (timeSinceInteraction < 5 && now - lastScroll < 5000) {
            idleTime += timeDiff; // Count as engaged if recent interaction or scroll
        }

        // Calculate engagement score (heuristic)
        let hoverFactor = Math.min(hoverTime / 10, 1) * 30; // Max 30 points for long hovers
        let clickFactor = Math.min(clickCount / (timeDiff * 3), 1) * 20; // Max 20 points for frequent clicks
        let idleFactor = Math.min(idleTime / 30, 1) * 30; // Max 30 points for sustained presence
        let personalizedFactor = Math.min(personalizedClicks / (timeDiff * 2), 1) * 20; // Max 20 points for personalized interactions
        engagementScore = Math.round(hoverFactor + clickFactor + idleFactor + personalizedFactor);

        // Update meter text and color
        let scoreElement = document.getElementById("engagementScore");
        scoreElement.textContent = engagementScore;

        if (engagementScore < 33) {
            meter.style.background = "blue";
        } else if (engagementScore < 66) {
            meter.style.background = "purple";
        } else {
            meter.style.background = "orange";
        }

        // Reset counters
        hoverTime = 0;
        clickCount = 0;
        idleTime = 0;
        personalizedClicks = 0;
    }

    // Update the meter every 2 seconds
    setInterval(updateMeter, 2000);

    // Ensure meter is added after DOM is loaded
    document.addEventListener("DOMContentLoaded", () => {
        document.body.appendChild(meter);
        // Re-query interactive elements in case DOM changes
        interactiveElements = document.querySelectorAll("a, button, [data-personalized], img, [role='button']");
    });
})();
