;(function(exports) {

    var $ = document.querySelector.bind(document);
    var max = Math.max.bind(Math);
    var min = Math.min.bind(Math);

    var purposeButtonContainerEl;
    var purposeButtonEl;
    var monkeysButtonEl;
    var monkeysTextEl;

    function monkeysGo() {
        monkeysButtonEl.removeEventListener("click", monkeysGo, false);
        monkeysTextEl.style.display = "block";
        monkeysButtonEl.innerHTML = "Click here to stop the monkeys";
        monkeysButtonEl.addEventListener("click", monkeysStop, false);
    }

    function monkeysStop() {
        monkeysButtonEl.removeEventListener("click", monkeysStop, false);
        monkeysTextEl.style.display = "none";
        monkeysButtonEl.innerHTML = "Click here to reveal monkeys";
        monkeysButtonEl.addEventListener("click", monkeysGo, false);
    }

    function movePurposeButton(event) {

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

    function resetPurposeButton() {
        purposeButtonContainerEl.style.left = "0px";
        purposeButtonContainerEl.style.top = "0px";
        monkeysGo();
    }

    document.addEventListener('DOMContentLoaded', function() {
        purposeButtonContainerEl = $('.purpose-button-container');
        purposeButtonEl = $('.purpose-button');
        monkeysButtonEl = $('.monkeys-button');
        monkeysTextEl = $('.monkeys-text');

        monkeysButtonEl.addEventListener("click", monkeysGo, false);
        purposeButtonEl.addEventListener("click", resetPurposeButton, false);
        purposeButtonContainerEl.addEventListener("mousemove", movePurposeButton, false);


    }, false);


setTimeout (function() {
    exports.monkeysGo = monkeysGo;
    exports.monkeysStop = monkeysStop;
    exports.monkeysButtonEl = monkeysButtonEl;

},1000);

}(this));
