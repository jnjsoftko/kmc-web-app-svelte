import PocketBase from "pocketbase";

// Initialize the PocketBase client
const pb = new PocketBase('http://localhost:8090'); // Replace with your PocketBase URL

async function deleteAllDocuments(collectionName) {
    try {
        // Authenticate as admin (or use appropriate authentication)
        await pb.admins.authWithPassword('', '');

        // Fetch all documents in the collection
        const records = await pb.collection(collectionName).getFullList();

        // Delete each document
        for (const record of records) {
            await pb.collection(collectionName).delete(record.id);
        }

        console.log(`All documents in the ${collectionName} collection have been deleted.`);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// Replace 'yourCollectionName' with the actual collection name
deleteAllDocuments('patients');