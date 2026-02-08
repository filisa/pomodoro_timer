const timer = document.getElementById('timer')
const startBtn = document.getElementById('start-btn')
const pauseBtn = document.getElementById('pause-btn')
const breakBtn = document.getElementById('break-btn')
const breakPopup = document.getElementById('break-popup')
const startBreakTimerBtn = document.getElementById('start-break-timer-btn')
const stopBreakTimerBtn = document.getElementById('stop-break-timer-btn')
const timerBreak = document.getElementById('timer-break')

//stopBtn.classList.add('hidden')
let intervalTimer = null
let second = 0
let minuteFocusTime = 25
let minuteBreak = 5

breakPopup.style.display = 'none'

//start button for focus time
startBtn.addEventListener('click', function(){
    if (intervalTimer === null) {
        document.body.classList.add('animation') 
        updateTime(second,minuteFocusTime,timer)
        renderTime(second,minuteFocusTime, timer)
        //stopTimer(second,minuteFocusTime)
    }
})

//pause button for focus time
pauseBtn.addEventListener('click', function(){
    document.body.style.background =  "#51859d"
    document.body.style.color = "#3a6f88"
    clearInterval(intervalTimer)
    intervalTimer = null
})

//break button for showing the new break overlay
breakBtn.addEventListener('click', function(){
    if (breakPopup.style.display === 'none') {
        timer.innerText = '25:00'
        stopTimer(second,minuteFocusTime)
        breakPopup.style.display = 'inline'
    } else { 
        breakPopup.style.display = 'none'
    }
}
)

//start break timer button
startBreakTimerBtn.addEventListener('click', function(){
    if (intervalTimer === null) {
        updateTime(second,minuteBreak,timerBreak)
        renderTime(second,minuteBreak,timerBreak)
    }
    }
)

stopBreakTimerBtn.addEventListener('click', function(){
    if (intervalTimer) {
        clearInterval(intervalTimer)
        intervalTimer = null
    }
    }
)

function stopTimer(second,minute) {
    clearInterval(intervalTimer)
    intervalTimer = null
    second = 0
    minute = 25
}

//updates the timer every second
function updateTime(second,minute,anyTimer) {
    intervalTimer = setInterval(function() {
        if(second > 0 && second < 60) {
            second -= 1
        } else if (minute > 0) {
            minute = minute - 1
            second = 59
        } else {
            stopTimer(second,minute,anyTimer)
        }
        renderTime(second,minute,anyTimer)
    }, 1000)
    
}

//renders the timer on the page
function renderTime(second,minute,anyTimer) {
    let minuteString = minute
    let secondString = second 
    if (secondString < 10) {
        secondString = `0${secondString}`
    } 
    if (minuteString < 10) {
        minuteString = `0${minuteString}`
    }
    anyTimer.innerText = `${minuteString}:${secondString}`
}

