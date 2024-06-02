import { loadJson, saveJson } from "jnj-lib-base";
import { getEnv } from "../../utils/env.js";
import { ageSexFromRrn } from "../../utils/func.js";

// & Variable AREA
// &---------------------------------------------------------------------------
// * APP_ROOT/.env
const { KMC_APP_ROOT, JSONSERVER_ROOT, JSONSERVER_PATIENTS_NEO_FOLDER } = getEnv();
const JSON_SERVER_PATIENTS_PATH = `${KMC_APP_ROOT}/${JSONSERVER_ROOT}/${JSONSERVER_PATIENTS_NEO_FOLDER}/db.json`;

const getToday = () => {
  const today = new Date(), // 오늘 날짜를 가져옵니다.
    year = today.getFullYear(), // 연도를 가져옵니다.
    month = (today.getMonth() + 1).toString().padStart(2, "0"), // 월을 가져오고, 2자리로 포맷합니다.
    day = today.getDate().toString().padStart(2, "0"); // 일을 가져오고, 2자리로 포맷합니다.

  return `${year}-${month}-${day}`; // 문자열로 연결하여 반환합니다.
};

const loadAllPatients = () => loadJson(JSON_SERVER_PATIENTS_PATH).all;

const lastPatient = (patients) => {
  return patients.reduce((max, patient) => {
    return parseInt(max.id, 10) > parseInt(patient.id, 10) ? max : patient;
  });
};

const newPatientId = (allPatients) => {
  return (parseInt(lastPatient(allPatients).id, 10) + 1).toString().padStart(7, "0");
};

const setPatientId = (id) => {
  return id.padStart(7, "0");
};

const newPatient = (allPatients, data) => {
  let dfault = {
    name: "",
    id: "",
    rrn: "000000-1******",
    insurance: "건강보험",
    firstDate: "",
    lastDate: "",
    txCount: 1,
    zipCode: "",
    address: "",
    mobile: "",
    memo: "",
    remark: "",
  };

  data = Object.assign(dfault, data);
  data.id = data.id == "" || isNaN(data.id) ? newPatientId(allPatients) : setPatientId(data.id);
  const firstDate = getToday();
  const lastDate = getToday();
  // console.log("newPatient: ", { ...dfault, ...data, id, firstDate, lastDate });
  return { ...data, firstDate, lastDate };
};

export const resolvers = {
  // * Query
  Query: {
    allPatients: () => loadAllPatients(),
    patient: (_source, args) => {
      return loadAllPatients().find((patient) => patient.id == args.id);
    },
    patientsByKeyword: (_source, args) => {
      return loadAllPatients().filter(
        (patient) => patient.name.includes(args.keyword) || patient.rrn.includes(args.keyword) || patient.mobile.includes(args.keyword)
      );
    },
  },
  // * Mutation
  Mutation: {
    addPatientNeo(_, { input }) {
      let allPatients = loadAllPatients();
      const patient = newPatient(allPatients, input);
      allPatients.push(patient);
      saveJson(JSON_SERVER_PATIENTS_PATH, { all: allPatients });
      return patient;
    },
    updatePatientNeo(_, { input }) {
      let allPatients = loadAllPatients();
      const index = allPatients.findIndex((patient) => patient.id === setPatientId(input.id));
      console.log(`index: ${index}`);
      const patient = { ...allPatients[index], ...input };
      if (index !== -1) {
        allPatients[index] = patient;
      } else {
        console.error(`Patient with id ${updateData.id} not found`);
      }
      saveJson(JSON_SERVER_PATIENTS_PATH, { all: allPatients });
      return patient;
    },
    deletePatientNeo(_, { id }) {
      let allPatients = loadAllPatients();
      const index = allPatients.findIndex((patient) => patient.id === setPatientId(id));
      if (index !== -1) {
        allPatients.splice(index, 1);
      } else {
        console.error(`Patient with id ${id} not found`);
      }
      saveJson(JSON_SERVER_PATIENTS_PATH, { all: allPatients });
      return true;
    },
  },

  // * Patient
  Patient: {
    age({ rrn }) {
      return ageSexFromRrn(rrn)[0];
    },
    sex({ rrn }) {
      return ageSexFromRrn(rrn)[1];
    },
  },
};
