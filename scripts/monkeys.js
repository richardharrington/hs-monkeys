;(function() {
    var $ = document.querySelector.bind(document);
    var monkeysButton;
    var monkeysText;
    var monkeysTextInterval;
    var showingMonkeys = false;

    var toggleMonkeyColor = function() {
        if (monkeysText.classList.contains("alt-color")) {
            monkeysText.classList.remove("alt-color");
            monkeysText.style.color = "#fa430b";
        }
        else {
            monkeysText.classList.add("alt-color");
            monkeysText.style.color = "#380bfa";
        }
    }

    var monkeysGo = function() {
        monkeysText.style.display = "block";
        showingMonkeys = true;
        monkeysTextInterval = setInterval(function() {
            toggleMonkeyColor();
        }, 750);
        monkeysButton.innerHTML = "Click here to stop the monkeys";
    }

    var monkeysStop = function() {
        clearInterval(monkeysTextInterval);
        showingMonkeys = false;
        monkeysText.style.display = "none";
        monkeysButton.innerHTML = "Click here to reveal monkeys";
    }

    var init = function() {

        monkeysButton = $('.monkeys-button');
        monkeysText = $('.monkeys-text');

        monkeysButton.addEventListener("click", function(event) {
            if (showingMonkeys) {
                monkeysStop();
            } else {
                monkeysGo();
            }
        }, false);
    }

    document.addEventListener('DOMContentLoaded', init, false);

})();
