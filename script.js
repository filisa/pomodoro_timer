const timer = document.getElementById('timer')
const startBtn = document.getElementById('start-btn')
//const stopBtn = document.getElementById('stop-btn')
const pauseBtn = document.getElementById('pause-btn')

//stopBtn.classList.add('hidden')
let intervalTimer = null
let second = 0
let minute = 25

//start button
startBtn.addEventListener('click', function(){
    if (intervalTimer === null) {
        document.body.style.background =  "#ffffff"
        document.body.style.color = "#ffc0cb"
        //stopBtn.classList.remove('hidden')
        //startBtn.classList.add('hidden')
        updateTime()
    }
})

// stop button
// stopBtn.addEventListener('click', function(){
//     if (intervalTimer !== null) {
//         stopTimer()
//         renderTime()
//     }
// })

//pause button
pauseBtn.addEventListener('click', function(){
    document.body.style.background =  "#51859d"
    document.body.style.color = "#204556"
    clearInterval(intervalTimer)
    intervalTimer = null
})

function stopTimer() {
    clearInterval(intervalTimer)
    intervalTimer = null
    second = 0
    minute = 25
    startBtn.classList.remove('hidden')//show start button
    //stopBtn.classList.add('hidden')//hide stop button
}

//updates the timer every second
function updateTime() {
    intervalTimer = setInterval(function() {
        if(second > 0 && second < 60) {
            second -= 1
        } else if (minute > 0) {
            minute = minute - 1
            second = 59
        } else {
            stopTimer()
        }
        renderTime()
    }, 1000)
    
}

//renders the timer on the page
function renderTime() {
    let minuteString = minute
    let secondString = second 
    if (secondString < 10) {
        secondString = `0${secondString}`
    } 
    if (minuteString < 10) {
        minuteString = `0${minuteString}`
    }
    timer.innerText = `${minuteString}:${secondString}`
}

