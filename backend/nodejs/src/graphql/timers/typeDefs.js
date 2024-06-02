export const typeDefs = `#graphql
  # Schedule type 정의
  type Schedule {
    name: String!
    duration: Int!
    state: String!
  }

  # Timer type 정의
  type Timer {
    id: ID!
    name: String!
    duration: Int!
    startTime: String
    remaining: Int!
    state: String!
    schedules: [Schedule!]!
  }

  # Query type 정의
  type Query {
    # 단일 타이머를 ID로 조회
    timer(id: ID!): Timer

    # 모든 타이머를 조회
    timers: [Timer!]!
  }

  # Mutation type 정의
  type Mutation {
    # 타이머를 추가
    addTimer(name: String!, duration: Int!): Timer

    # 타이머를 업데이트
    updateTimer(id: ID!, name: String, duration: Int, startTime: String, remaining: Int, state: String): Timer

    # 스케줄을 추가
    addSchedule(timerId: ID!, name: String!, duration: Int!, state: String!): Timer

    # 타이머를 삭제
    deleteTimer(id: ID!): Timer
  }
`;
