;(function() {
    var $ = document.querySelector.bind(document);

    var purposeButtonContainerEl;
    var purposeButtonEl;
    var monkeysButtonEl;
    var monkeysTextEl;
    var monkeysTextInterval;

    function toggleMonkeysTextColor() {
        if (monkeysTextEl.classList.contains("alt-color")) {
            monkeysTextEl.classList.remove("alt-color");
            monkeysTextEl.style.color = "#fa430b";
        }
        else {
            monkeysTextEl.classList.add("alt-color");
            monkeysTextEl.style.color = "#380bfa";
        }
    }

    function monkeysCleanUp() {
        monkeysButtonEl.removeEventListener("click");
    }

    function monkeysGo() {
        monkeysCleanUp();
        monkeysTextEl.style.display = "block";
        monkeysTextInterval = setInterval(function() {
            toggleMonkeysTextColor();
        }, 750);
        monkeysButtonEl.innerHTML = "Click here to stop the monkeys";
        monkeysButtonEl.addEventListener("click", monkeysStop, false);
    }

    function monkeysStop() {
        monkeysCleanUp();
        clearInterval(monkeysTextInterval);
        monkeysTextEl.style.display = "none";
        monkeysButtonEl.innerHTML = "Click here to reveal monkeys";
        monkeysButtonEl.addEventListener("click", monkeysGo, false);
    }

    function getMaxEscapeDistances(elBounds) {
        var windowBounds = {
            top:    0,
            left:   0,
            bottom: window.innerHeight,
            right:  window.innerWidth
        };
        var result = {};
        for (var dir in windowBounds) {
            result[dir] = windowBounds[dir] - elBounds[dir];
        }
        // console.log("getMaxEscapeDistances:");
        // console.log(result);
        return result;
    }

    function getEncroachingVector(elBounds, mousePos) {
        console.log("elBounds:");
        console.log(elBounds);
        console.log("mousePos:");
        console.log(mousePos);

        var center = {
            x: elBounds.left + (elBounds.right - elBounds.left) / 2,
            y: elBounds.top + (elBounds.bottom - elBounds.top) / 2
        };
        console.log("center:");
        console.log(center);
        var result = {
            x: mousePos.x < center.x ? 
                    mousePos.x - elBounds.left :
                    elBounds.right - mousePos.x,
            y: mousePos.y < center.y ?
                    mousePos.y - elBounds.top :
                    elBounds.bottom - mousePos.y
        };

        console.log("getEncroachingVector:");
        console.log(result);
        console.log("\n");
        return  result;
    }

    function getEscapeVector(maxEscapeDistances, encroachingVector) {
        var result = {
            x: encroachingVector.x > 0 ?
                    Math.min(maxEscapeDistances.right, encroachingVector.x) :
                    Math.max(maxEscapeDistances.left, encroachingVector.x),
            y: encroachingVector.y > 0 ?
                    Math.min(maxEscapeDistances.bottom, encroachingVector.y) :
                    Math.max(maxEscapeDistances.top, encroachingVector.y)
        };
        // console.log("getEscapeVector:");
        // console.log(result);
        return result;
    }

    function movePurposeButton(event) {
        // Make sure we're not crossing the border between the 
        // purpose button container and its child button.
        // if (event.relatedTarget === purposeButtonEl || event.target === purposeButtonEl) {
        //     return;
        // }

        var elBounds = purposeButtonContainerEl.getBoundingClientRect();
        var mousePos = {
            x: event.clientX,
            y: event.clientY
        };
        var escapeVector = getEscapeVector(
                                getMaxEscapeDistances(elBounds), 
                                getEncroachingVector(elBounds, mousePos));
        var oldLeft = parseInt(purposeButtonContainerEl.style.left) || 0;
        var newLeft = (oldLeft + escapeVector.x) + "px";
        var oldRight = parseInt(purposeButtonContainerEl.style.top) || 0;
        var newRight = (oldRight + escapeVector.y) + "px";
        purposeButtonContainerEl.style.left = newLeft;
        purposeButtonContainerEl.style.right = newRight;
    }

    document.addEventListener('DOMContentLoaded', function() {
        purposeButtonContainerEl = $('.purpose-button-container');
        purposeButtonEl = $('.purpose-button');
        monkeysButtonEl = $('.monkeys-button');
        monkeysTextEl = $('.monkeys-text');

        monkeysButtonEl.addEventListener("click", monkeysGo, false);
        purposeButtonContainerEl.addEventListener("mousemove", movePurposeButton, false);
    }, false);

})();
