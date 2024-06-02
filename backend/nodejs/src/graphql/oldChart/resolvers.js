import { loadFile, loadJson, saveJson, findFiles, findFolders, findFilesRecusive } from "jnj-lib-base";
import { getEnv } from "../../utils/env.js";

// & Variable AREA
// &---------------------------------------------------------------------------
const { KMC_APP_ROOT } = process.env;
// * APP_ROOT/.env
const { OLDCHART_FOLDER, OLDCHART_IMAGES_FOLDER, OLDPRESCRIPTION_IMAGES_FOLDER, OLDPRESCRIPTION_TEXTS_FOLDER, VITE_APP_PROTOCOL, VITE_BASE_IP, VITE_APP_PORT } = getEnv();

const BASE_PATH = `${KMC_APP_ROOT}/${OLDCHART_FOLDER}`.replace(/\\/g, "/");

const urlFromPath = (path, basePath = BASE_PATH, baseUrl = `${VITE_APP_PROTOCOL}://${VITE_BASE_IP}:${VITE_APP_PORT}/_links/oldRecords`) => {
  return encodeURI(path.replace(basePath, baseUrl));
};

const findChartImages = (keyword) => {
  const folder = findFolders(`${BASE_PATH}/${OLDCHART_IMAGES_FOLDER}`).find((folder) => folder.includes(keyword));
  // const folder = findFolders(`${BASE_PATH}/${OLDCHART_IMAGES_FOLDER}`).find((folder) => folder.endsWith(keyword));
  if (!folder) return [];
  // if (!folder) return json([]);
  const data = findFiles(folder);
  return data.map((item) => urlFromPath(`${folder}/${item}`));
};

const findPrescriptionImages = (keyword) => {
  const folder = `${BASE_PATH}/${OLDPRESCRIPTION_IMAGES_FOLDER}`;
  // const data = findFiles(folder).filter((file) => file.split("_")[1] == keyword);
  const data = findFiles(folder).filter((file) => file.includes(keyword));
  return data.map((item) => urlFromPath(`${folder}/${item}`));
};

const findPrescriptionTexts = (keyword) => {
  const folder = `${BASE_PATH}/${OLDPRESCRIPTION_TEXTS_FOLDER}`;
  // let files = findFiles(folder).filter((file) => file.split("_")[1] == keyword);
  let files = findFiles(folder).filter((file) => file.includes(keyword));
  let content = "";

  for (const path of files.map((item) => `${folder}/${item}`)) {
    content += loadFile(path);
  }
  return content;
};

export const resolvers = {
  // * Query
  Query: {
    oldChart: (_source, args) => {
      const keyword = args.keyword;
      const chartImages = findChartImages(keyword);
      const prescriptionImages = findPrescriptionImages(keyword);
      const prescriptionTexts = findPrescriptionTexts(keyword);
      return { keyword, chartImages, prescriptionImages, prescriptionTexts };
    },
  },
};

// // // * 테스트
// console.log(`@@@@@@ BASE_PATH: ${BASE_PATH}`);
// console.log(`@@@@@@@ BASE_URL: ${VITE_APP_PROTOCOL}://${VITE_BASE_IP}:${VITE_APP_PORT}/_links/oldRecords`);
// // // const folder = `${BASE_PATH}/${OLDPRESCRIPTION_IMAGES_FOLDER}`;
// // // console.log(`folder: ${folder}`)

// // // console.log(`folder: ${OLDCHART_FOLDER}/${OLDCHART_IMAGES_FOLDER}`)
// // import fs from "fs";

// // const keyword = "이상만";
// // // const keyword = "1261"

// // const _findFiles = (folder) => {
// //   if (!fs.existsSync(folder)) {
// //     console.log("폴더가 존재하지 않습니다.");
// //     return [];
// //   }
// //   return fs
// //     .readdirSync(folder, { withFileTypes: true })
// //     .filter((item) => !item.isDirectory())
// //     .map((item) => item.keyword);
// // };

// // // const folder = `${BASE_PATH}/${OLDPRESCRIPTION_IMAGES_FOLDER}`;
// // // console.log(`folder: ${folder}`);
// // // // const folder = `${KMC_APP_ROOT}/${OLDCHART_FOLDER}/${OLDPRESCRIPTION_IMAGES_FOLDER}`;
// // // const data = _findFiles(folder).filter((file) => file.split("_")[1] == keyword);
// // // console.table(data);

// // const chartImages = findChartImages(keyword);
// // const prescriptionImages = findPrescriptionImages(keyword);
// // const prescriptionTexts = findPrescriptionTexts(keyword);

// // console.table(chartImages);
// // console.log("===============================");
// // console.table(prescriptionImages);
// // console.log("===============================");
// // console.table(prescriptionTexts);
