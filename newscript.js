const timer = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const breakBtn = document.getElementById("break-btn");
const nextBtn = document.getElementById("next-btn");
const breakPopup = document.getElementById("break-popup");
const startBreakTimerBtn = document.getElementById("start-break-timer-btn");
const stopBreakTimerBtn = document.getElementById("stop-break-timer-btn");
const timerBreak = document.getElementById("timer-break");
const tomato = document.getElementById("tomato");
const body = document.body;
let backgroundMusic = document.getElementById("background-music");
const tooltip = document.getElementById("tolltip");
const tooltipText = document.getElementById("tooltip-text");
const mobileTooltipText = document.getElementById("mobile-tooltip-text");



//states:
// idle
// focus-running
// focus-paused
// break-running
// break-paused

function render() {
	let state = "idle";
	switch (state) {
		case "idle":
			console.log();
			break;
		case "idle":
			console.log();
			break;
		default:
			console.log();
	}
}
