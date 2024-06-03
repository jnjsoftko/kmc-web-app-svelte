// Pocketbase 클라이언트 인스턴스 생성
const pb = new PocketBase("http://127.0.0.1:8090");

// 컬렉션 생성 함수
async function createCollection() {
  try {
    const collectionData = {
      name: "your_collection_name", // 컬렉션 이름
      schema: [
        {
          name: "name",
          type: "text",
          required: true,
        },
        {
          name: "email",
          type: "email",
          required: true,
        },
      ],
    };

    const newCollection = await pb.collections.create(collectionData);
    console.log("Collection created successfully:", newCollection);
  } catch (err) {
    console.error("Error creating collection:", err);
  }
}

// 함수 호출
