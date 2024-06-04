export const ssr = false;

export const actions = {
	thumbup: async ({ locals, request }) => {
		const form = await request.formData();
		console.log(`thumbup form: ${JSON.stringify(Object.fromEntries(form.entries()))}`);

		const likes = form.get('likes') ?? '';
		const id = form.get('id') ?? '';

		if (!id || !likes) {
			throw new Error('ID or likes not provided');
		}

		const data = {
			likes: parseInt(likes) + 1
		};
		await locals.pb.collection('posts').update(id, data);
	},
	thumbdown: async ({ locals, request }) => {
		const form = await request.formData();
		console.log(`thumbdown form: ${JSON.stringify(Object.fromEntries(form.entries()))}`);

		const dislikes = form.get('dislikes') ?? '';
		const id = form.get('id') ?? '';

		if (!id || !dislikes) {
			throw new Error('ID or dislikes not provided');
		}

		const data = {
			dislikes: parseInt(dislikes) + 1
		};
		await locals.pb.collection('posts').update(id, data);
	}
};
