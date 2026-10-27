const timer = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const tomato = document.getElementById("tomato");
const body = document.body;
let backgroundMusic = document.getElementById("background-music");
const tooltip = document.getElementById("tolltip");
const tooltipText = document.getElementById("tooltip-text");
const mobileTooltipText = document.getElementById("mobile-tooltip-text");

let intervalTimer = null;
let currentSecond = 10;
let currentMinuteFocusTime = 0;
let currentSecondBreak = 0;
let currentMinuteBreak = 5;
let minuteBreak = 5;
let timeouts = [];
let isBreak = false;

//music gradually gets quieter when the pause it clicked
let timeout = function () {
	timeouts.push(
		setTimeout(() => {
			backgroundMusic.volume = 0.7;
		}, 200)
	);
	timeouts.push(
		setTimeout(() => {
			backgroundMusic.volume = 0.7;
		}, 500)
	);
	timeouts.push(
		setTimeout(() => {
			backgroundMusic.volume = 0.7;
		}, 800)
	);
	timeouts.push(
		setTimeout(() => {
			backgroundMusic.pause();
		}, 1100)
	);
};

//clear timeouts when you start the music again
let clearAllTimeouts = function () {
	timeout();
	timeouts.forEach((id) => clearTimeout(id));
	timeouts = [];
};
// breakPopup.style.display = 'none'

//start button for focus time
startBtn.addEventListener("click", function () {
	if (intervalTimer === null) {
		mobileTooltipText.style.opacity = "100%";
		clearAllTimeouts();
		tomato.classList.add("rotating-tomato");
		updateTime(currentSecond, currentMinuteFocusTime, timer);
		renderTime(currentSecond, currentMinuteFocusTime, timer);
		//remove pause overlay only if the screen was paused before
		const pauseScreen = document.querySelector("#paused-state-overlay");
		if (pauseScreen) {
			document.body.removeChild(pauseScreen);
			backgroundMusic.volume = 1;
		}
		//select a random track and turn on nice lofi music
		getRandomTrack();
		backgroundMusic.play();
	}
});

//pause button
pauseBtn.addEventListener("click", function () {
	if (intervalTimer != null && isBreak === false) {
		//pause music
		timeout();
		//stop tomato rotation
		tomato.classList.remove("rotating-tomato");
		//pause the timer
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
		breakBtn.style.position = "relative";
		breakBtn.style.zIndex = "101";
		mobileTooltipText.style.opacity = "50%";
	} else {
		//pause music
		timeout();
		//stop tomato rotation
		tomato.classList.remove("rotating-tomato");
		//pause the timer
		clearInterval(intervalTimer);
		intervalTimer = null;
		timer.textContent = "PAUSED";
	}
});

nextBtn.addEventListener("click", function () {
	if (isBreak === false) {
		isBreak = true;
		//pause music
		timeout();
		//stop tomato rotation
		tomato.classList.remove("rotating-tomato");
		//pause the timer
		clearInterval(intervalTimer);
		intervalTimer = null;
		setTimeout(() => {
			timer.textContent = "BREAK 5 MIN";
		}, 700);
		setTimeout(() => {
			updateTime(currentSecond, currentMinuteBreak, timer);
			renderTime(currentSecond, currentMinuteBreak, timer);
			const pausedOverlay = document.createElement("div");
			pausedOverlay.id = "paused-state-overlay";
			body.appendChild(pausedOverlay);
			startBtn.style.position = "relative";
			startBtn.style.zIndex = "101";
			timer.style.position = "relative";
			timer.style.zIndex = "101";
			mobileTooltipText.style.opacity = "50%";
		}, 1300);
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
		} else if (second === 0 && minute === 0) {
			console.log("break starts now");
			updateTime(currentSecond, currentMinuteBreak, timer);
			renderTime(currentSecond, currentMinuteBreak, timer);
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

//get the random track, but meow track has a higher chance of getting picked :D
function getRandomTrack() {
	musicTracksArray = [
		"music/lofi-02-sunday-window.mp3",
		"music/lofi-03-rainy-platform.mp3",
		"music/lofi-04-late-library.mp3",
		"music/lofi-05-peach-sky.mp3",
		"music/lofi-06-blue-hour.mp3",
		"music/lofi-07-soft-focus.mp3",
		"music/lofi-08-paper-moons.mp3",
		"music/lofi-09-coffee-break.mp3",
		"music/lofi-10-night-notes.mp3",
		"music/lofi-focus.mp3",
		"music/meow.mp3",
		"music/meow.mp3",
		"music/meow.mp3",
		"music/meow.mp3"
	];
	getRandomNumber = Math.floor(Math.random() * 14);
	backgroundMusic.src = `${musicTracksArray[getRandomNumber]}`;
}

tooltip.addEventListener("mouseover", function () {
	tooltipText.style.display = "inline";
});
tooltip.addEventListener("mouseleave", function () {
	tooltipText.style.display = "none";
});


const thisVar = theLocalStor ?? []