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

    function movePurposeButton(event) {
        // Make sure we're not crossing the border between the 
        // purpose button container and its child button.
        if (event.relatedTarget === purposeButtonEl || event.target === purposeButtonEl) {
            return;
        }
        
        var newLeft = ((parseInt(purposeButtonContainerEl.style.left) || 0 ) + 20) + "px";
        purposeButtonContainerEl.style.left = newLeft;
        console.log();
    }

    document.addEventListener('DOMContentLoaded', function() {
        purposeButtonContainerEl = $('.purpose-button-container');
        purposeButtonEl = $('.purpose-button');
        monkeysButtonEl = $('.monkeys-button');
        monkeysTextEl = $('.monkeys-text');

        monkeysButtonEl.addEventListener("click", monkeysGo, false);
        purposeButtonContainerEl.addEventListener("mouseover", movePurposeButton, false);
    }, false);

})();
