;(function() {
    var $ = document.querySelector.bind(document);

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

    function monkeysGo() {
        monkeysTextEl.style.display = "block";
        monkeysTextInterval = setInterval(function() {
            toggleMonkeysTextColor();
        }, 750);
        monkeysButtonEl.innerHTML = "Click here to stop the monkeys";
        monkeysButtonEl.removeEventListener("click", monkeysGo, false);
        monkeysButtonEl.addEventListener("click", monkeysStop, false);
    }

    function monkeysStop() {
        clearInterval(monkeysTextInterval);
        monkeysTextEl.style.display = "none";
        monkeysButtonEl.innerHTML = "Click here to reveal monkeys";
        monkeysButtonEl.removeEventListener("click", monkeysStop, false);
        monkeysButtonEl.addEventListener("click", monkeysGo, false);
    }

    function movePurposeButton() {

    }

    document.addEventListener('DOMContentLoaded', function() {
        purposeButtonContainerEl = $('.monkeys-button-container');
        monkeysButtonEl = $('.monkeys-button');
        monkeysTextEl = $('.monkeys-text');

        monkeysButtonEl.addEventListener("click", monkeysGo, false);
        purposeButtonContainerEl.addEventListener("mouseover", movePurposeButton, false);
    }, false);

})();
