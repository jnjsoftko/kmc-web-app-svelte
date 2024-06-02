export const resolvers = {
  Query: {
    // 단일 타이머 조회
    timer: (parent, args, context, info) => {
      return timers.find((timer) => timer.id === args.id);
    },
    // 모든 타이머 조회
    timers: () => timers,
  },
  Mutation: {
    // 타이머 추가
    addTimer: (parent, args, context, info) => {
      const newTimer = {
        id: uuidv4(),
        name: args.name,
        duration: args.duration,
        startTime: "",
        remaining: args.duration,
        state: "N",
        schedules: [],
      };
      timers.push(newTimer);
      return newTimer;
    },
    // 타이머 업데이트
    updateTimer: (parent, args, context, info) => {
      let timer = timers.find((timer) => timer.id === args.id);
      if (!timer) {
        throw new Error("Timer not found");
      }
      timer = {
        ...timer,
        ...args,
      };
      timers = timers.map((t) => (t.id === timer.id ? timer : t));
      return timer;
    },
    // 스케줄 추가
    addSchedule: (parent, args, context, info) => {
      let timer = timers.find((timer) => timer.id === args.timerId);
      if (!timer) {
        throw new Error("Timer not found");
      }
      const newSchedule = {
        name: args.name,
        duration: args.duration,
        state: args.state,
      };
      timer.schedules.push(newSchedule);
      return timer;
    },
    // 타이머 삭제
    deleteTimer: (parent, args, context, info) => {
      const timerIndex = timers.findIndex((timer) => timer.id === args.id);
      if (timerIndex === -1) {
        throw new Error("Timer not found");
      }
      const deletedTimer = timers.splice(timerIndex, 1);
      return deletedTimer[0];
    },
  },
};
