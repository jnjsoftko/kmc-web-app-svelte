<script lang="ts">
	// * requirements
	// pocketbase serve --dir="/Users/youchan/Dev/Jnj-soft/Projects/external/kmc-web-app-svelte/backend/db/pocketbase/sqlite" --http="localhost:8090"
	// ROOT/frontend$ npm run dev 

	import { onMount, onDestroy } from 'svelte';
	import PocketBase from 'pocketbase';

	const PB = new PocketBase('http://localhost:8090');

	// export let timerId = `timer_1`;
	let timerId = `timer_1`;
	const TIMERS_COLLECTION_NAME = 'txRoomTimers';
	// let url = `http://localhost:8090/api/collections/txRoomTimers/records?filter=(timerId="${timerId}")`;
	// let url = `http://localhost:8090/api/collections/txRoomTimers/records?filter=(timerId="timer_1")`;

	let action = 'INIT';
	let timer: any = {};
	let lastUpdateTime: any = null;
	let frameId: any = '';
	let running = false;
	let timerEnded = false;
	let beepAudio: any;

	const getTimer = async () => {
		return await PB.collection(TIMERS_COLLECTION_NAME).getFirstListItem(`timerId="${timerId}"`, {
			expand: 'id,name,duration,remaining,state,scehdules'
		});
	};

	const formatTime = (seconds: any) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
	};

	// * Timer callbacks
	const initTimer = async (timer) => {
		if (timer.schedules.length == 0) {
			timer.schedules = [
				{
					name: '테스트',
					duration: 120,
					state: 'N'
				}
			];
		}

		// * run timer
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
				// stopTimer(true);
			}
		} else {
			running = false;
			// stopTimer(false);
		}
	};

	// const startTimer = ({ duration = 900, name = '' }) => {
	// 	timerEnded = false;
	// 	lastUpdateTime = null;
	// 	remaining = duration;
	// 	running = true;
	// 	runTimer();
	// };

	const pauseTimer = () => {
		cancelAnimationFrame();
		running = false;
	};

	const restartTimer = async () => {
		timer = await getTimer();
		await initTimer(timer);
	};

	const stopTimer = (end = false) => {
		cancelAnimationFrame();
		if (end) {
			timerEnded = true;
			beepAudio.play();
		} else {
			beepAudio.pause();
			beepAudio.currentTime = 0;
		}
		running = false;
	};

	// const resetTimer = () => {
	// 	cancelAnimationFrame();
	// 	timerEnded = false;
	// 	remaining = 900; // !! [TODO] 다음 스케줄로 변경: 다음 스케쥴이 없는 경우 타이머 전체 종료 event 발생
	// 	beepAudio.pause();
	// 	beepAudio.currentTime = 0;
	// };

	// * AnimationFrame
	const cancelAnimationFrame = () => {
		if (typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function') {
			window.cancelAnimationFrame(frameId);
		}
	};

	const updateFrame = () => {
		const now = Date.now();
		lastUpdateTime = lastUpdateTime ?? now;
		const deltaTime = (now - lastUpdateTime) / 1000;
		lastUpdateTime = now;
		if (timer.remaining > 0) {
			timer.remaining -= deltaTime;
			runTimer();
		} else if (!timerEnded) {
			timer.remaining = 0;
			stopTimer(true);
			timerEnded = true;
		}
	};

	const runTimer = () => {
		frameId = requestAnimationFrame(updateFrame);
	};

	// * handlers
	// const handleTimeDisplayClick = (event: Event) => {
	// 	event.stopPropagation();
	// 	resetTimer();
	// };

	const handlePauseClick = async (event: Event) => {
		event.stopPropagation();
		const data = { remaining: timer.remaining, state: 'P' };
		await PB.collection('txRoomTimers').update(timer.id, data);
		action = 'PAUSE';
		pauseTimer();
	};

	const handleStartClick = async (event: Event) => {
		event.stopPropagation();
		const data = {
			state: 'R',
			startTime: new Date(Date.now()).toISOString(),
			duration: timer.duration,
			remaining: timer.remaining
		};
		await PB.collection('txRoomTimers').update(timer.id, data);
	};

	// * lifecycle
	onMount(async () => {
		timer = await getTimer();
		await initTimer(timer);

		PB.collection('txRoomTimers').subscribe(timer.id, async (e) => {
			// if (action == 'PAUSE') {
			// 	console.log("action == 'PAUSE'");
			// 	pauseTimer();
			// }
			//  else if (action == 'START') {
			// 	startTimer({ duration, name });
			// }
			timer = await getTimer();
			await initTimer(timer);
		});
	});

	onDestroy(async () => {
		PB.collection('txRoomTimers').unsubscribe(timer.id);
	});
</script>

<div>
	{JSON.stringify(timer)}
	<span>{formatTime(Math.ceil(timer.remaining))}</span>
	<span>[[{timer.name}]]</span>
	<span>
		<button on:click={(e) => handlePauseClick(e)}>❚❚</button>
		<button on:click={(e) => handleStartClick(e)}>▶</button>
	</span>
</div>
