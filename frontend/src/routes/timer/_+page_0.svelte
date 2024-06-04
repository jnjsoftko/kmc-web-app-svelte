<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import PocketBase from 'pocketbase';

	const PB = new PocketBase('http://localhost:8090');

	// export let timerId = `timer_1`;
	let timerId = `timer_1`;
	let url = `http://localhost:8090/api/collections/txRoomTimers/records?filter=(timerId="timer_1")`;

	let action = 'create';
	let timer: any = {};
	let id: any = '';
	let name: any = '';
	let duration = 900;
	let remaining = 900;
	let state: any = 'N';
	let schedules = [];
	let lastUpdateTime: any;
	let frameId: any;
	let running = false;
	let timerEnded = false;
	let beepAudio: any;

	const getTimer = async () => {
		const record = await PB.collection('txRoomTimers').getFirstListItem(`timerId="${timerId}"`, {
			expand: 'id,name,duration.remaining,state,scehdules'
		});
		return record;
	};

	const formatTime = (seconds: any) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
	};

	// * Timer callbacks
	const initTimer = async (timer) => {
		// * fetch timer data from server
		id = timer.id;
		duration = timer.duration;
		schedules = timer.schedules;
		remaining = timer.remaining;
		name = timer.name;
		state = timer.state;
		if (schedules.length == 0) {
			schedules = [
				{
					name: '테스트',
					duration: 120,
					state: 'N'
				}
			];
		}

		// * run timer
		if (state === 'R') {
			const startTime = new Date(timer.startTime).getTime();
			const now = Date.now();
			const elapsed = (now - startTime) / 1000;
			remaining = Math.max(0, remaining - elapsed);
			lastUpdateTime = now;
			running = true;
			if (remaining > 0) {
				runTimer();
			} else {
				stopTimer(true);
			}
		} else {
			running = false;
			stopTimer(false);
		}
	};

	const startTimer = ({ duration = 900, name = '' }) => {
		timerEnded = false;
		lastUpdateTime = null;
		remaining = duration;
		running = true;
		runTimer();
	};

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

	const resetTimer = () => {
		cancelAnimationFrame();
		timerEnded = false;
		remaining = 900; // !! [TODO] 다음 스케줄로 변경: 다음 스케쥴이 없는 경우 타이머 전체 종료 event 발생
		beepAudio.pause();
		beepAudio.currentTime = 0;
	};

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
		if (remaining > 0) {
			remaining -= deltaTime;
			runTimer();
		} else if (!timerEnded) {
			remaining = 0;
			stopTimer(true);
			timerEnded = true;
		}
	};

	const runTimer = () => {
		frameId = requestAnimationFrame(updateFrame);
	};

	// * handlers
	const handleTimeDisplayClick = (event: Event) => {
		event.stopPropagation();
		resetTimer();
	};

	const handlePauseClick = async (event: Event) => {
		event.stopPropagation();
		const data = { remaining, state: 'P' };
		// action = 'PAUSE';
		await PB.collection('txRoomTimers').update(id, data);
		// pauseTimer();
	};

	const handleStartClick = async (event: Event) => {
		event.stopPropagation();
		const data = {
			state: 'R',
			startTime: new Date(Date.now()).toISOString(),
			duration,
			remaining
		};
		await PB.collection('txRoomTimers').update(id, data);
	};

	// * lifecycle
	onMount(async () => {
		timer = await getTimer();
		await initTimer(timer);

		PB.collection('txRoomTimers').subscribe(id, async (e) => {
			if (action == 'PAUSE') {
				pauseTimer();
			}
			//  else if (action == 'START') {
			// 	startTimer({ duration, name });
			// }
			timer = await getTimer();
			await initTimer(timer);
		});
	});

	onDestroy(async () => {
		PB.collection('txRoomTimers').unsubscribe(id);
	});
</script>

<div>
	<span on:click={(e) => handleTimeDisplayClick(e)}>{formatTime(Math.ceil(remaining))}</span>
	<span>[[{name}]]</span>
	<span>
		<button on:click={(e) => handlePauseClick(e)}>❚❚</button>
		<button on:click={(e) => handleStartClick(e)}>▶</button>
	</span>
</div>
