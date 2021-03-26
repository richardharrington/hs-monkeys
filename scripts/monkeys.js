/*
 * MONKEYS!
 */

const $ = document.querySelector.bind(document);

let purposeButtonContainerEl;
let purposeButtonEl;
let monkeysButtonEl;
let monkeysTextEl;

const PRECISION = 1;

function closeToZero(target) {
    return Math.abs(target) <= PRECISION;
}

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
        const result = {};
        for (const dir in windowBounds) {
            result[dir] = windowBounds[dir] - elBounds[dir];
        }
        return result;
    }

    function getEncroachingVector(elBounds, mousePos) {
        const center = {
            x: elBounds.left + (elBounds.right - elBounds.left) / 2,
            y: elBounds.top + (elBounds.bottom - elBounds.top) / 2
        };
        return {
            x: mousePos.x < center.x ?
                Math.max(0, mousePos.x - elBounds.left) :
                Math.min(0, mousePos.x - elBounds.right),
            y: mousePos.y < center.y ?
                Math.max(0, mousePos.y - elBounds.top) :
                Math.min(0, mousePos.y - elBounds.bottom)
        };
    }

    function getEscapeVector(elBounds, maxEscapeDistances, encroachingVector) {
        // If the person is close to the center of the button for
        // a given vector component (either because they moved the
        // mouse really fast or because they approached from one
        // side, and the other direction's vector component is close
        // to the center) then go fast, otherwise slow.

        console.log({ maxEscapeDistances})

        const elWidth = elBounds.right - elBounds.left;
        const elHeight = elBounds.bottom - elBounds.top;

        const maxXMove = window.innerWidth - elWidth;
        const maxYMove = window.innerHeight - elHeight;

        const pushingLeft = encroachingVector.x < 0;
        const pushingRight = encroachingVector.x > 0;
        const pushingUp = encroachingVector.y < 0;
        const pushingDown = encroachingVector.y > 0;

        const upperLeft = closeToZero(maxEscapeDistances.top) && closeToZero(maxEscapeDistances.left);
        if (upperLeft && pushingUp && pushingLeft) {
            return {
                x: maxXMove,
                y: maxYMove,
                suppressMouseMoveListener: true,
            };
        }
        const upperRight = closeToZero(maxEscapeDistances.top) && closeToZero(maxEscapeDistances.right);
        if (upperRight && pushingUp && pushingRight) {
            return {
                x: -maxXMove,
                y: maxYMove,
                suppressMouseMoveListener: true,
            };
        }
        const lowerRight = closeToZero(maxEscapeDistances.bottom) && closeToZero(maxEscapeDistances.right);
        if (lowerRight && pushingDown && pushingRight) {
            console.log({x:0, y:0, suppressMouseMoveListener: true})
            return {
                x: -maxXMove,
                y: -maxYMove,
                suppressMouseMoveListener: true,
            };
        }
        const lowerLeft = closeToZero(maxEscapeDistances.bottom) && closeToZero(maxEscapeDistances.left);
        if (lowerLeft && pushingDown && pushingLeft) {
            return {
                x: maxXMove,
                y: -maxYMove,
                suppressMouseMoveListener: true,
            };
        }

        const PRESSURE_COEFFICIENT = 50;

        const xPressure = PRESSURE_COEFFICIENT * encroachingVector.x / (elWidth - Math.abs(encroachingVector.x));
        const yPressure = PRESSURE_COEFFICIENT * encroachingVector.y / (elHeight - Math.abs(encroachingVector.y));
        return {
            x: encroachingVector.x > 0 ?
                Math.min(maxEscapeDistances.right, xPressure) :
                Math.max(maxEscapeDistances.left, xPressure),
            y: encroachingVector.y > 0 ?
                Math.min(maxEscapeDistances.bottom, yPressure) :
                Math.max(maxEscapeDistances.top, yPressure)
        };
    }

    const elBounds = purposeButtonContainerEl.getBoundingClientRect();
    const mousePos = {
        x: event.clientX,
        y: event.clientY
    };
    const escapeVector = getEscapeVector(
        elBounds,
        getMaxEscapeDistances(elBounds),
        getEncroachingVector(elBounds, mousePos)
    );
    const oldLeft = parseInt(purposeButtonContainerEl.style.left) || 0;
    const newLeft = (oldLeft + escapeVector.x) + "px";
    const oldTop = parseInt(purposeButtonContainerEl.style.top) || 0;
    const newTop = (oldTop + escapeVector.y) + "px";
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
