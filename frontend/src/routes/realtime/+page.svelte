<script>
	import { onMount, onDestroy } from 'svelte';
	import PocketBase from 'pocketbase';

	const PB = new PocketBase('http://localhost:8090');

	let builtRecords = [];

	async function getRecords() {
		const records = await PB.collection('posts').getFullList(200, { sort: '-created' });

		const results = records.map((record) => {
			return {
				title: record.title,
				contents: record.contents,
				likes: record.likes,
				dislikes: record.dislikes,
				id: record.id
			};
		});

		return results;
	}

	PB.collection('posts').subscribe('*', async (e) => {
		builtRecords = await getRecords();
	});

	onMount(async () => {
		builtRecords = await getRecords();
	});

	onDestroy(() => {
		PB.collection('posts').unsubscribe('*');
	});

	async function handleThumbUp(event, record) {
		event.preventDefault();
		const formData = new FormData();
		formData.append('id', record.id);
		formData.append('likes', record.likes);

		await fetch('?/thumbup', {
			method: 'POST',
			body: formData
		});
	}

	async function handleThumbDown(event, record) {
		event.preventDefault();
		const formData = new FormData();
		formData.append('id', record.id);
		formData.append('dislikes', record.dislikes);

		await fetch('?/thumbdown', {
			method: 'POST',
			body: formData
		});
	}
</script>

<h1>Realtime</h1>

<div class="wrapper">
	{#each builtRecords ?? [] as record}
		<div class="post">
			<div class="post-header">
				<h3>{record.title}</h3>
			</div>
			<div class="post-content">
				<p>{record.contents}</p>
			</div>
			<div class="post-actions">
				<span>{record.likes}</span>
				<form on:submit|preventDefault={(event) => handleThumbUp(event, record)}>
					<button type="submit" class="btn-thumb">
						<span class="material-symbols-outlined"> thumb_up </span>
					</button>
				</form>
				<form on:submit|preventDefault={(event) => handleThumbDown(event, record)}>
					<button type="submit" class="btn-thumb">
						<span class="material-symbols-outlined"> thumb_down </span>
					</button>
				</form>
				<span>{record.dislikes}</span>
			</div>
		</div>
	{/each}
</div>

<style>
	h3 {
		text-align: center;
	}
	.wrapper {
		display: grid;
		grid-template-columns: auto auto auto;
	}
	.post {
		margin: 1em;
		max-width: 10em;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border: 1px solid #242424;
	}
	.post-header {
		text-align: center;
		width: 100%;
		background-color: grey;
	}
	.post-content {
		text-align: center;
	}
	.post-actions {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		border-top: 1px solid #242424;
	}
	.btn-thumb {
		margin-top: 0.5em;
		background-color: rgba(0, 0, 0, 0);
		border: 0;
	}
	.btn-thumb:hover {
		cursor: pointer;
	}
</style>
