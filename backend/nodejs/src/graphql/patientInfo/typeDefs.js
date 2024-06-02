// A schema is a collection of type definitions (hence "typeDefs")
export const typeDefs = `#graphql
  type Patient {
    name: String
    id: String
    rrn: String
    insurance: String
    firstDate: String
    lastDate: String
    txCount: Int
    zipCode: String
    address: String
    mobile: String
    memo: String
    remark: String
    age: Int
    sex: String
  }

  type Query {
    allPatients: [Patient]
    patient(id: String!): Patient
    patientsByKeyword(keyword: String): [Patient]
  }

  input PatientInput {
    name: String
    rrn: String
    id: String
  }

  input PatientUpdateInput {
    name: String
    id: String
    rrn: String
    insurance: String
    firstDate: String
    lastDate: String
    txCount: Int
    zipCode: String
    address: String
    mobile: String
    memo: String
    remark: String
    age: Int
    sex: String
  }

  type Mutation {
    # addPatientNeo(name: String, rrn: String): Patient
    addPatientNeo(input: PatientInput): Patient
    updatePatientNeo(input: PatientUpdateInput): Patient
    deletePatientNeo(id: String): Patient
  }
`;
