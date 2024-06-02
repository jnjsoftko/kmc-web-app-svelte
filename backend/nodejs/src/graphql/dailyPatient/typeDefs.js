import { typeDefs as patientInfoTypeDefs } from "../patientInfo/typeDefs.js";

export const typeDefs = `#graphql
  ${patientInfoTypeDefs}

  """
  일별 내원 환자
  """
  type Daily {
    """
    차트 아이디(네오보감)
    """
    id: String
    """
    치료 상태: 'S'tandby: 대기, 'T'xRoom: 치료, 'D'one: 완료
    """
    state: String
    """
    베드 번호: 0(미배정) / 1 ~ 7
    """
    bedNum: Int
    """
    비고
    """
    remark: String
    """
    From patient(네오보감 환자목록)
    """
    info: Patient
  }

  type Query {
    """
    전체 일별 내원 환자 목록 (ex) date: '20240416')
    """
    allPatientDailys(date: String!): [Daily]
    """
    일별 내원 환자 (ex) date: '20240416', id: '0001562')
    """
    patientDaily(date: String!, id: String!): Daily
  }

  input DailyInput {
    date: String
    id: String
  }

  input UpdateDailyInput {
    date: String
    id: String
    bedNum: Int
    state: String
    remark: String
  }

  type Mutation {
    """
    일별 내원 환자 추가 (ex) date: '20240416', id: '0001562')
    """
    addPatientDaily(input: DailyInput): Daily
    """
    일별 내원 환자 변경 (ex) date: '20240416', id: '0001562')
    """
    # updateDailyPatient(date: String, id: String, bedNum: Int, state: String, remark: String): Daily
    updatePatientDaily(input: UpdateDailyInput): Daily

    """
    일별 내원 환자 삭제 (ex) date: '20240416', id: '0001562')
    """
    deletePatientDaily(input: DailyInput): Daily
  }
`;
