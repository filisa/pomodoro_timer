// FEEDBACK (general):
// - Split this file into small modules (timer logic, audio, UI/DOM) and load it with
//   <script type="module">. Currently everything lives in the global scope.
// - Wrap DOM lookups in one object (e.g. `const els = {...}`) or a DOMContentLoaded init().
// - Add a linter/formatter (ESLint + Prettier) and "use strict" (implicit globals below
//   would then be caught at once).
// - Add a few unit tests for the pure logic (time formatting, countdown step).

// REFACTOR: use consistent naming. `timer` is the DOM element, `intervalTimer` the id,
// `anyTimer` a parameter... e.g. `timerEl`, `intervalId`, would be clearer.
const timer = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
// BUG/CLEANUP: break-btn, break-popup, start-break-timer-btn, stop-break-timer-btn and
// timer-break do not exist in index.html, so these constants are all `null`.
// Remove them (and the unused break state below) or implement the break feature.
const breakBtn = document.getElementById("break-btn");
const breakPopup = document.getElementById("break-popup");
const startBreakTimerBtn = document.getElementById("start-break-timer-btn");
const stopBreakTimerBtn = document.getElementById("stop-break-timer-btn");
const timerBreak = document.getElementById("timer-break");
const tomato = document.getElementById("tomato");
const body = document.body;
// BEST PRACTICE: never reassigned, so use `const`.
let backgroundMusic = document.getElementById("background-music");
// TYPO: "tolltip" id/class should be "tooltip" (also in HTML and CSS).
const tooltip = document.getElementById("tolltip");
const tooltipText = document.getElementById("tooltip-text");
const mobileTooltipText = document.getElementById("mobile-tooltip-text");

// REFACTOR: replace the scattered state variables with one state object, e.g.
// const state = { mode: "focus", remainingSeconds: 25 * 60, intervalId: null };
// Storing a single `remainingSeconds` removes the minute/second juggling entirely.
// Put durations in named constants (FOCUS_MINUTES = 25, BREAK_MINUTES = 5).
// `minuteBreak`, `currentSecondBreak`, `currentMinuteBreak` are unused/duplicated.
let intervalTimer = null;
let currentSecond = 0;
let currentMinuteFocusTime = 25;
let currentSecondBreak = 0;
let currentMinuteBreak = 5;
let minuteBreak = 5;
let timeouts = [];

//music gradually gets quieter when the pause it clicked
// BUG: the first three steps all set volume to 0.7, so there is no fade. Use decreasing
//   values (e.g. 0.7, 0.4, 0.1) or, better, a loop/setInterval driven fade function:
//   fadeOutAndPause(audio, durationMs).
// NAMING: `timeout` is vague; name it `fadeOutMusic`. Use function declarations
//   instead of `let x = function` (no reason to be reassignable).
// MAGIC NUMBERS: extract delays/volumes into constants.
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
// BUG-PRONE: this calls timeout() first, which schedules NEW timeouts that are then
// immediately cleared. It works only by accident; the call should be removed so the
// function only clears. Also reset volume here instead of in the start handler.
let clearAllTimeouts = function () {
	timeout();
	timeouts.forEach((id) => clearTimeout(id));
	timeouts = [];
};
// CLEANUP: remove commented-out code (git keeps history).

//start button for focus time
// REFACTOR: this handler does too much (state, animation, overlay, audio). Split into
//   startTimer(), showPausedOverlay()/hidePausedOverlay(), playRandomTrack().
// BEST PRACTICE: toggle CSS classes (e.g. body.paused) instead of inline styles,
//   and use classList for the opacity change on the mobile tooltip.
// Starting a "restart" after finishing is not handled (no reset of the time).
startBtn.addEventListener("click", function () {
	if (intervalTimer === null) {
		mobileTooltipText.style.opacity = "100%";
		clearAllTimeouts();
		tomato.classList.add("rotating-tomato");
		// BUG: currentSecond starts at 0, so the first tick jumps 25:00 -> 24:59 (fine),
		//   but updateTime() also sets a global interval as a side effect; make it return
		//   the id or have the caller own it. Order is also odd: render first, then start.
		updateTime(currentSecond, currentMinuteFocusTime, timer);
		renderTime(currentSecond, currentMinuteFocusTime, timer);
		tomato.classList.add("pulsating-tomato");
		//remove pause overlay only if the screen was paused before
		const pauseScreen = document.querySelector("#paused-state-overlay");
		if (pauseScreen) {
			document.body.removeChild(pauseScreen);
			backgroundMusic.volume = 1;
		}
		//select a random track and turn on nice lofi music
		getRandomTrack();
		// BEST PRACTICE: play() returns a Promise that can reject (autoplay policy,
		//   missing file). Handle it: backgroundMusic.play().catch(console.error)
		backgroundMusic.play();
	}
});

//pause button
// BEST PRACTICE: use `!==` instead of `!=`. Early-return (`if (!intervalTimer) return;`)
//   reduces nesting. Setting timer.textContent = "PAUSED" destroys the displayed time;
//   it works only because state is stored in variables - consider a separate label.
// A11Y: announce state changes (aria-live on the timer, aria-pressed on buttons).
pauseBtn.addEventListener("click", function () {
	if (intervalTimer != null) {
		//pause music
		timeout();
		//stop tomato rotation
		tomato.classList.remove("rotating-tomato");
		//pause the timer
		clearInterval(intervalTimer);
		intervalTimer = null;
		timer.textContent = "PAUSED";
		// REFACTOR: put the overlay in the HTML (hidden by default) and toggle a class,
		//   rather than creating/removing DOM nodes each time. Also the start button
		//   z-index inline styles are never reset; move them to CSS.
		const pausedOverlay = document.createElement("div");
		pausedOverlay.id = "paused-state-overlay";
		body.appendChild(pausedOverlay);
		startBtn.style.position = "relative";
		startBtn.style.zIndex = "101";
		timer.style.position = "relative";
		timer.style.zIndex = "101";
		mobileTooltipText.style.opacity = "50%";
	}
});

//updates the timer every second
// BUG: `stopTimer` is not defined anywhere -> ReferenceError when the countdown ends,
//   and the interval is never cleared, so it keeps throwing every second.
// BUG: the `else` branch continues on to update/render after stopping; return instead.
// ACCURACY: setInterval drifts and is throttled in background tabs. Store an end
//   timestamp (Date.now() + remainingMs) and compute remaining time on each tick.
// SIMPLIFY: `second > 0 && second < 60` - the `< 60` check is redundant; with a single
//   `remainingSeconds` counter this whole function becomes ~5 lines.
// DESIGN: the function mixes timing, state mutation and rendering; separate them.
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
// SIMPLIFY: use String(n).padStart(2, "0"); avoid reassigning params-like locals with
//   mixed number/string types. Prefer `textContent` over `innerText` (faster, no layout).
// Also update document.title with the remaining time so it's visible in other tabs.
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
// BUG: `musicTracksArray` and `getRandomNumber` are implicit globals (no const/let).
// REFACTOR: define the track list once at module level (not on every call); express
//   the meow weighting explicitly (e.g. a { src, weight } list) instead of duplicating
//   entries. Use `tracks.length` instead of the hardcoded 14 - adding/removing a track
//   would silently break the random range. The template literal around the value is
//   unnecessary. Return the chosen src and let the caller set it.
// HTML: <source src=""> in index.html is empty and is never used since `.src` is set
//   directly on <audio>; remove the <source> or set it consistently.
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

// BEST PRACTICE: this can be pure CSS (.tooltip-div:hover .tooltip-text {display:block}),
//   which also removes JS. If kept, use mouseenter/mouseleave pairs (mouseover bubbles)
//   and support keyboard focus (focus/blur, tabindex, aria-describedby, role="tooltip").
tooltip.addEventListener("mouseover", function () {
	tooltipText.style.display = "inline";
});
tooltip.addEventListener("mouseleave", function () {
	tooltipText.style.display = "none";
});
