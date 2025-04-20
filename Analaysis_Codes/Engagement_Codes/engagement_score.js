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

    let hoverTime = 0;
    let clickCount = 0;
    let idleTime = 0;
    let personalizedClicks = 0;
    let lastUpdate = Date.now();
    let engagementScore = 0;
    let lastInteraction = Date.now();

    let interactiveElements = document.querySelectorAll("a, button, [data-personalized], img, [role='button']");
    interactiveElements.forEach(element => {
        let hoverStart = 0;
        element.addEventListener("mouseenter", () => {
            hoverStart = Date.now();
        });
        element.addEventListener("mouseleave", () => {
            if (hoverStart) {
                hoverTime += (Date.now() - hoverStart) / 1000; 
                hoverStart = 0;
            }
        });
    });

    document.addEventListener("click", (event) => {
        clickCount++;
        lastInteraction = Date.now();
        if (event.target.matches("[data-personalized], [data-personalized] *, .animated, [role='button']")) {
            personalizedClicks++;
        }
    });

    let lastScroll = Date.now();
    window.addEventListener("scroll", () => {
        lastScroll = Date.now();
        lastInteraction = Date.now();
    });

    
    function updateMeter() {
        let now = Date.now();
        let timeDiff = (now - lastUpdate) / 1000; 
        lastUpdate = now;

        
        let timeSinceInteraction = (now - lastInteraction) / 1000;
        if (timeSinceInteraction < 5 && now - lastScroll < 5000) {
            idleTime += timeDiff; 
        }

        
        let hoverFactor = Math.min(hoverTime / 10, 1) * 30; 
        let clickFactor = Math.min(clickCount / (timeDiff * 3), 1) * 20;
        let idleFactor = Math.min(idleTime / 30, 1) * 30; 
        let personalizedFactor = Math.min(personalizedClicks / (timeDiff * 2), 1) * 20; 
        engagementScore = Math.round(hoverFactor + clickFactor + idleFactor + personalizedFactor);


        let scoreElement = document.getElementById("engagementScore");
        scoreElement.textContent = engagementScore;

        if (engagementScore < 33) {
            meter.style.background = "blue";
        } else if (engagementScore < 66) {
            meter.style.background = "purple";
        } else {
            meter.style.background = "orange";
        }

        
        hoverTime = 0;
        clickCount = 0;
        idleTime = 0;
        personalizedClicks = 0;
    }

    
    setInterval(updateMeter, 2000);

   
    document.addEventListener("DOMContentLoaded", () => {
        document.body.appendChild(meter);
        
        interactiveElements = document.querySelectorAll("a, button, [data-personalized], img, [role='button']");
    });
})();
