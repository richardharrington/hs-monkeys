;(function() {
    var $ = document.querySelector.bind(document);
    var max = Math.max.bind(Math);
    var min = Math.min.bind(Math);

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
        return result;
    }

    function getEncroachingVector(elBounds, mousePos) {
        var center = {
            x: elBounds.left + (elBounds.right - elBounds.left) / 2,
            y: elBounds.top + (elBounds.bottom - elBounds.top) / 2
        };
        var result = {
            x: mousePos.x < center.x ? 
                    max(0, mousePos.x - elBounds.left) :
                    min(0, mousePos.x - elBounds.right),
            y: mousePos.y < center.y ?
                    max(0, mousePos.y - elBounds.top) :
                    min(0, mousePos.y - elBounds.bottom)
        };
        return  result;
    }

    function getEscapeVector(maxEscapeDistances, encroachingVector) {
        var result = {
            x: encroachingVector.x > 0 ?
                    min(maxEscapeDistances.right, encroachingVector.x) :
                    max(maxEscapeDistances.left, encroachingVector.x),
            y: encroachingVector.y > 0 ?
                    min(maxEscapeDistances.bottom, encroachingVector.y) :
                    max(maxEscapeDistances.top, encroachingVector.y)
        };
        return result;
    }

    function movePurposeButton(event) {
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
        var oldTop = parseInt(purposeButtonContainerEl.style.top) || 0;
        var newTop = (oldTop + escapeVector.y) + "px";
        purposeButtonContainerEl.style.left = newLeft;
        purposeButtonContainerEl.style.top = newTop;
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
