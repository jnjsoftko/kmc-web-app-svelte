<script>
	import { onMount } from 'svelte';
	import pb from '$lib/pocketbase';

	let messages = [];

	onMount(() => {
		// 'messages' 컬렉션을 구독
		pb.collection('messages').subscribe('*', (e) => {
			console.log('Received event:', e);

			// 이벤트 타입에 따라 메시지 업데이트
			if (e.action === 'create') {
				messages = [...messages, e.record];
			} else if (e.action === 'update') {
				messages = messages.map((m) => (m.id === e.record.id ? e.record : m));
			} else if (e.action === 'delete') {
				messages = messages.filter((m) => m.id !== e.record.id);
			}
		});

		// 컴포넌트가 언마운트 될 때 구독 해제
		return () => {
			pb.collection('messages').unsubscribe('*');
		};
	});
</script>

<h1>Messages Page</h1>
<ul>
	{#each messages as message}
		<li>{message.content}</li>
	{/each}
</ul>
