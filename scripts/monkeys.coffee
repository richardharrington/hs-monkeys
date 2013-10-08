$ = document.querySelector.bind document
max = Math.max.bind Math
min = Math.min.bind Math

purposeButtonContainerEl = null
purposeButtonEl = null
monkeysButtonEl = null
monkeysTextEl = null

monkeysGo = ->
    monkeysButtonEl.removeEventListener "click", monkeysGo, false
    monkeysTextEl.style.display = "block"
    monkeysButtonEl.innerHTML = "Click here to stop the monkeys"
    monkeysButtonEl.addEventListener "click", monkeysStop, false

monkeysStop = ->
    monkeysButtonEl.removeEventListener "click", monkeysStop, false
    monkeysTextEl.style.display = "none"
    monkeysButtonEl.innerHTML = "Click here to reveal monkeys"
    monkeysButtonEl.addEventListener "click", monkeysGo, false

movePurposeButton = (event) ->
    getMaxEscapeDistances = (elBounds) ->
        windowBounds =
            top: 0
            left: 0
            bottom: window.innerHeight
            right: window.innerWidth

        result = {}
        for dir, v of windowBounds
            result[dir] = v - elBounds[dir]
        return result

    getEncroachingVector = (elBounds, mousePos) ->
        center =
            x: elBounds.left + (elBounds.right - elBounds.left) / 2
            y: elBounds.top + (elBounds.bottom - elBounds.top) / 2
        
        x: if mousePos.x < center.x
               max(0, mousePos.x - elBounds.left)
           else
               min(0, mousePos.x - elBounds.right)

        y: if mousePos.y < center.y
               max(0, mousePos.y - elBounds.top)
           else
               min(0, mousePos.y - elBounds.bottom)

    getEscapeVector = (maxEscapeDistances, encroachingVector) ->
        x: if encroachingVector.x > 0
               min(maxEscapeDistances.right, encroachingVector.x)
           else
               max(maxEscapeDistances.left, encroachingVector.x)
        y: if encroachingVector.y > 0
               min(maxEscapeDistances.bottom, encroachingVector.y)
           else
               max(maxEscapeDistances.top, encroachingVector.y)

    elBounds = purposeButtonContainerEl.getBoundingClientRect()
    mousePos =
        x: event.clientX
        y: event.clientY
    escapeVector = getEscapeVector(
        (getMaxEscapeDistances elBounds),
        (getEncroachingVector elBounds, mousePos))
    oldLeft = (parseInt purposeButtonContainerEl.style.left) || 0
    newLeft = "#{oldLeft + escapeVector.x}px"
    oldTop = (parseInt purposeButtonContainerEl.style.top) || 0
    newTop = "#{oldTop + escapeVector.y}px"
    purposeButtonContainerEl.style.left = newLeft
    purposeButtonContainerEl.style.top = newTop

resetPurposeButton = ->
    purposeButtonContainerEl.style.left = "0px"
    purposeButtonContainerEl.style.top = "0px"
    monkeysGo()

document.addEventListener('DOMContentLoaded', (->
    purposeButtonContainerEl = $ '.purpose-button-container'
    purposeButtonEl = $ '.purpose-button'
    monkeysButtonEl = $ '.monkeys-button'
    monkeysTextEl = $ '.monkeys-text'

    monkeysButtonEl.addEventListener "click", monkeysGo, false
    purposeButtonEl.addEventListener "click", resetPurposeButton, false
    purposeButtonContainerEl.addEventListener "mousemove", movePurposeButton, false), 
    false)



