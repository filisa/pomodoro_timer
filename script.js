const timer = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const breakBtn = document.getElementById("break-btn");
const breakPopup = document.getElementById("break-popup");
const startBreakTimerBtn = document.getElementById("start-break-timer-btn");
const stopBreakTimerBtn = document.getElementById("stop-break-timer-btn");
const timerBreak = document.getElementById("timer-break");
const tomato = document.getElementById("tomato");
const body = document.body;

let intervalTimer = null;
let currentSecond = 0;
let currentMinuteFocusTime = 25;
let currentSecondBreak = 0;
let currentMinuteBreak = 5;
let minuteBreak = 5;

// breakPopup.style.display = 'none'

//start button for focus time
startBtn.addEventListener("click", function () {
	if (intervalTimer === null) {
		document.body.style.color = "#e53c0d";
		document.body.classList.add("animation");
		updateTime(currentSecond, currentMinuteFocusTime, timer);
		renderTime(currentSecond, currentMinuteFocusTime, timer);
		tomato.classList.add("pulsating-tomato");
		//remove pause overlay
		const pauseScreen = document.querySelector("#paused-state-overlay");
		document.body.removeChild(pauseScreen);
	}
});

//pause button
pauseBtn.addEventListener("click", function () {
	if (intervalTimer != null) {
		clearInterval(intervalTimer);
		intervalTimer = null;
		timer.textContent = "PAUSED";
		const pausedOverlay = document.createElement("div");
		pausedOverlay.id = "paused-state-overlay";
		body.appendChild(pausedOverlay);
		startBtn.style.position = "relative";
		startBtn.style.zIndex = "101";
		timer.style.position = "relative";
		timer.style.zIndex = "101";
	}
});

//updates the timer every second
function updateTime(second, minute, anyTimer, timerType = "focus") {
	intervalTimer = setInterval(function () {
		if (second > 0 && second < 60) {
			second -= 1;
		} else if (minute > 0) {
			minute = minute - 1;
			second = 59;
		} else {
			stopTimer(second, minute, anyTimer);
		}
		if (timerType === "break") {
			currentSecondBreak = second;
			currentMinuteBreak = minute;
		} else {
			currentSecond = second;
			currentMinuteFocusTime = minute;
		}
		renderTime(second, minute, anyTimer);
	}, 1000);
}

//renders the timer on the page
function renderTime(second, minute, anyTimer) {
	let minuteString = minute;
	let secondString = second;
	if (secondString < 10) {
		secondString = `0${secondString}`;
	}
	if (minuteString < 10) {
		minuteString = `0${minuteString}`;
	}
	anyTimer.innerText = `${minuteString}:${secondString}`;
}
