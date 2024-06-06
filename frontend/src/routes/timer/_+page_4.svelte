<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import PocketBase from 'pocketbase';

	const PB = new PocketBase('http://localhost:8090');

	let timerId = `timer_1`;
	let action = 'INIT';
	const TIMERS_COLLECTION_NAME = 'txRoomTimers';

	let timer: any = {};
	let lastUpdateTime: any = null;
	let intervalId: any = null;
	let running = false;
	let timerEnded = false;
	let beepAudio: any;

	const fetchTimer = async () => {
		return await PB.collection(TIMERS_COLLECTION_NAME).getFirstListItem(`timerId="${timerId}"`, {
			expand: 'id,name,duration,remaining,state,scehdules'
		});
	};

	const formatTime = (seconds: any) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
	};

	const initTimer = async (schedules) => {
		schedules = [
				{
					name: '치료1',
					duration: 120,
					state: 'N'
				},
				{
					name: '치료2',
					duration: 120,
					state: 'N'
				},
			]
		const data = {
			...schedules[0], 
			remaining: schedules[0].duration,
			schedules
		}
		await PB.collection('txRoomTimers').update(timer.id, data);
	};

	const drawTimer = async (timer) => {
		if (timer.state === 'R') {
			const startTime = new Date(timer.startTime).getTime();
			const now = Date.now();
			const elapsed = (now - startTime) / 1000;
			timer.remaining = Math.max(0, timer.remaining - elapsed);
			lastUpdateTime = now;
			running = true;
			if (timer.remaining > 0) {
				runTimer();
			} else {
				stopTimer(true);
			}
		} else {
			running = false;
			stopTimer(false);
		}
	};

	const pauseTimer = async () => {
		const data = { remaining: timer.remaining, state: 'P' };
		await PB.collection('txRoomTimers').update(timer.id, data);
		action = 'PAUSE'
	};

	const startTimer = async () => {
		timer = await fetchTimer();
		const data = {
			state: 'R',
			startTime: new Date(Date.now()).toISOString(),
			duration: timer.duration,
			remaining: timer.remaining
		};
		await PB.collection('txRoomTimers').update(timer.id, data);
	};

	const stopTimer = (end = false) => {
		clearInterval(intervalId);
		if (end) {
			timerEnded = true;
			// beepAudio.play();
		} else {
			beepAudio.pause();
			beepAudio.currentTime = 0;
		}
		running = false;
	};

	const nextTimer = async () => {
		clearInterval(intervalId);

		const nextIndex = timer.schedules.findIndex((s) => s.name === timer.name) + 1;
		if (nextIndex < timer.schedules.length) {
			action = 'END';
			timer.name = timer.schedules[nextIndex].name;
			timer.duration = timer.schedules[nextIndex].duration;
			timer.remaining = timer.schedules[nextIndex].duration;
			timer.state = 'N';
			await PB.collection('txRoomTimers').update(timer.id, timer);
		} else {
			action = 'COMPLETED';
			const data = {
				name: '치료종료',
				state: 'N',
				startTime: null,
				duration: 900,
				remaining: 900,
				schedules: []
			};
			await PB.collection('txRoomTimers').update(timer.id, data);
			timerEnded = true;
			beepAudio.pause();
			beepAudio.currentTime = 0;
		}
	};

	const updateFrame = () => {
		const now = Date.now();
		lastUpdateTime = lastUpdateTime ?? now;
		const deltaTime = (now - lastUpdateTime) / 1000;
		lastUpdateTime = now;
		if (timer.remaining > 0) {
			timer.remaining -= deltaTime;
			if (timer.remaining < 0) timer.remaining = 0;
		} else if (!timerEnded) {
			timer.remaining = 0;
			stopTimer(true);
			timerEnded = true;
		}
	};

	const runTimer = () => {
		intervalId = setInterval(updateFrame, 1000); // 1초 간격으로 실행
	};

	const handleTimeDisplayClick = async (event: Event) => {
		event.stopPropagation();
		await nextTimer();
	};

	const handleInitClick = async (event: Event) => {
		event.stopPropagation();
		await initTimer({})
	};

	const handleStartClick = async (event: Event) => {
		event.stopPropagation();
		await startTimer()
	};

	const handlePauseClick = async (event: Event) => {
		event.stopPropagation();
		await pauseTimer();
	};

	const handleNextClick = async (event: Event) => {
		event.stopPropagation();
		await nextTimer();
	};

	onMount(async () => {
		beepAudio = new Audio('/beep.wav');
		beepAudio.loop = true;
		timer = await fetchTimer();
		await drawTimer(timer);

		PB.collection('txRoomTimers').subscribe(timer.id, async (e) => {
			if (action == 'PAUSE') {
				clearInterval(intervalId);
				running = false;
			} else if (action == 'END' || action == 'COMPLETED') {
				timerEnded = false;
				beepAudio.pause();
				beepAudio.currentTime = 0;
			}
			timer = await fetchTimer();
			await drawTimer(timer);
			console.log("timer updated", timer);
		});
	});

	onDestroy(async () => {
		PB.collection('txRoomTimers').unsubscribe(timer.id);
		clearInterval(intervalId);
	});
</script>

<div>
	{JSON.stringify(timer)}
	<div>----------------------</div>
	<div class:complete={timerEnded}>
		<span on:click={(e) => handleTimeDisplayClick(e)}>{formatTime(Math.ceil(timer.remaining))}</span>
		<span>[[{timer.name}]]</span>
		<span>
			<button on:click={(e) => handleInitClick(e)}>I</button>
			{#if running}
				<button on:click={(e) => handlePauseClick(e)}>❚❚</button>
			{:else}
				<button on:click={(e) => handleStartClick(e)}>▶</button>
			{/if}
			<button on:click={(e) => handleNextClick(e)}>N</button>
		</span>
	</div>
</div>

<style>
	.complete {
		animation: blink 0.5s infinite;
	}

	@keyframes blink {
		0% {
			background-color: red;
		}
		50% {
			background-color: pink;
		}
		100% {
			background-color: red;
		}
	}
	.active {
		background-color: #4f46e5;
		color: white;
	}
</style>
