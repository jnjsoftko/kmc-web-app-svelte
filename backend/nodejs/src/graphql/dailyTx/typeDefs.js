export const typeDefs = `#graphql
  scalar JSON

  type TxItem {
    name: String
    start: String
    duration: Int
    color: String
    memo: String
    state: String
  }

  type Txs {
    id: String
    txs: [TxItem]
  }

  type Query {
    allTxsByDate(date: String!): [Txs]
    allTxsByChartId(id: String!): [Txs]
    txsByDateAndChartId(date: String!, id: String!): [TxItem]
    lastTxsById(id: String!): [TxItem]
  }

  input DailyTxItemInput {
    name: String
    start: String
    duration: Int
    color: String
    memo: String
    state: String
  }


  # input DailyTxsInput {
  #   date: String
  #   id: String
  #   txs: [TxItem]
  # }

  type Mutation {
    """
    일별 치료 내용 추가 (ex) date: '20240416', id: '0001562')
    """
    addDailyTxItem(date: String, id: String, tx: DailyTxItemInput): TxItem
    """
    일별 치료 내용 추가 (ex) date: '20240416', id: '0001562')
    """
    addDailyTxs(date: String, id: String, txs: [DailyTxItemInput!]!): [TxItem]
    """
    일별 치료 내용 변경 (ex) date: '20240416', id: '0001562')
    """
    # updateDailyPatient(date: String, id: String, bedNum: Int, state: String, remark: String): Daily
    updateDailyTxItem(date: String, id: String, tx: DailyTxItemInput): TxItem
    """
    일별 치료 내용 변경 (ex) date: '20240416', id: '0001562')
    """
    # updateDailyPatient(date: String, id: String, bedNum: Int, state: String, remark: String): Daily
    updateDailyTxs(date: String, id: String, txs: [DailyTxItemInput!]!): [TxItem]
    # """
    # 일별 치료 내용 삭제 (ex) date: '20240416', id: '0001562')
    # """
    # deleteDailyTxs({date: String, id: String}): Txs
    # # deleteDailyTxItem({date: String, id: String, name: String}): TxItem
  }
`;
