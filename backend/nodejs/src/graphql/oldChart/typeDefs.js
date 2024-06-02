export const typeDefs = `#graphql
  type OldChart {
    keyword: String
    chartImages: [String]
    prescriptionImages: [String]
    prescriptionTexts: String
  }

  type Query {
    oldCharts: [OldChart]
  """
  keyword: 이름(ex: 이상만), 차트번호(ex: 0202)
  """
    oldChart(keyword: String!): OldChart
  }
`;
