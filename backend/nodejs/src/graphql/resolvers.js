import { resolvers as oldChartResolvers } from "./oldChart/resolvers.js";
import { resolvers as patientInfoResolvers } from "./patientInfo/resolvers.js";
import { resolvers as dailyPatientResolvers } from "./dailyPatient/resolvers.js";
import { resolvers as dailyTxResolvers } from "./dailyTx/resolvers.js";

// export const resolvers = [oldChartResolvers, patientInfoResolvers, dailyPatientResolvers];
export const resolvers = [oldChartResolvers, patientInfoResolvers, dailyPatientResolvers, dailyTxResolvers];
