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
let currentSecond = 0
let currentMinuteFocusTime = 25
let currentSecondBreak = 0
let currentMinuteBreak = 5
let minuteBreak = 5

breakPopup.style.display = 'none'

//start button for focus time
startBtn.addEventListener('click', function(){
    if (intervalTimer === null) {
        startBtn.innerText = 'Start'
        pauseBtn.innerText = 'Pause'
        document.body.style.color = "#ffc0cb"
        document.body.classList.add('animation') 
        updateTime(currentSecond,currentMinuteFocusTime,timer)
        renderTime(currentSecond,currentMinuteFocusTime, timer)
    }
})

//pause button for focus time
pauseBtn.addEventListener('click', function(){
    if (intervalTimer) {
    document.body.classList.remove('animation') 
    document.body.style.background =  "#51859d"
    document.body.style.color = "#3a6f88"
    clearInterval(intervalTimer)
    intervalTimer = null
    startBtn.innerText = 'Continue'
    pauseBtn.innerText = 'Paused'
    pauseBtn.style.color = "#50585c"
    }
})

//break button for showing the new break overlay
breakBtn.addEventListener('click', function(){
    if (breakPopup.style.display === 'none') {
        breakBtn.style.display = 'none'
        timer.innerText = '25:00'
        stopTimer(currentSecond,currentMinuteFocusTime)
        breakPopup.style.display = 'inline'
    } else { 
        breakPopup.style.display = 'none'
    }
}
)

//start break timer button
startBreakTimerBtn.addEventListener('click', function(){
    if (intervalTimer === null) {
        updateTime(currentSecondBreak,currentMinuteBreak,timerBreak,'break')
        renderTime(currentSecondBreak,currentMinuteBreak,timerBreak)
    }
    }
)

stopBreakTimerBtn.addEventListener('click', function(){
        clearInterval(intervalTimer)
        intervalTimer = null
        currentSecondBreak = 0
        currentMinuteBreak = 5
        timerBreak.innerText = '05:00'
        breakPopup.style.display = 'none'
        breakBtn.style.display = 'inline'
    }
)

function stopTimer(second,minute) {
    clearInterval(intervalTimer)
    intervalTimer = null
    second = 0
    minute = 25
}

//updates the timer every second
function updateTime(second,minute,anyTimer,timerType='focus') {
    intervalTimer = setInterval(function() {
        if(second > 0 && second < 60) {
            second -= 1
        } else if (minute > 0) {
            minute = minute - 1
            second = 59
        } else {
            stopTimer(second,minute,anyTimer)
        }
        if (timerType === 'break') {
            currentSecondBreak = second
            currentMinuteBreak = minute
        } else {
            currentSecond = second
            currentMinuteFocusTime = minute
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

