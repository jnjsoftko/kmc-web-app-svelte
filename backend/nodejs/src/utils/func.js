const ageFromBirth = (birth) => {
  // 생년월일 문자열을 날짜 객체로 변환
  const year = parseInt(birth.slice(0, 4));
  const month = parseInt(birth.slice(4, 6)) - 1; // JavaScript의 Date 객체에서 월은 0부터 시작하므로 1을 빼줍니다.
  const day = parseInt(birth.slice(6, 8));
  const birthDate = new Date(year, month, day);

  // 오늘 날짜를 구합니다.
  const today = new Date();

  // 생일이 지났는지 여부를 확인하여 나이를 계산합니다.
  let age = today.getFullYear() - birthDate.getFullYear();
  const isBirthdayPassed = today.getMonth() > birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  if (!isBirthdayPassed) {
    age--;
  }

  return age;
};

const ageSexFromRrn = (rrn) => {
  const [first, second] = rrn.split("-");
  const birth = (parseInt(second) - 1) % 4 < 2 ? `19${first}` : `20${first}`;
  const sex = parseInt(second[0]) % 2 == 1 ? "남" : "여";
  return [ageFromBirth(birth), sex];
};

export { ageSexFromRrn };
