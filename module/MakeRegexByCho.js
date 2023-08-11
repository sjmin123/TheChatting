const CHO_HANGUL = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ',
  'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ',
  'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];

const HANGUL_START_CHARCODE = "가".charCodeAt();

const CHO_PERIOD = Math.floor("까".charCodeAt() - "가".charCodeAt());
const JUNG_PERIOD = Math.floor("개".charCodeAt() - "가".charCodeAt());

function combine(cho, jung, jong) {
  return String.fromCharCode(
    HANGUL_START_CHARCODE + cho * CHO_PERIOD + jung * JUNG_PERIOD + jong
  );
}

// 초성검색 정규표현식 생성
function MakeRegexByCho(search = "") {
  try {
    const regex = CHO_HANGUL.reduce(
      (acc, cho, index) =>
        acc.replace(
          new RegExp(cho, "g"),
          `[${combine(index, 0, 0)}-${combine(index + 1, 0, -1)}]`
        ),
      search
    );

    return new RegExp(`(${regex})`, "g");
  } catch (error) {
    throw new ApolloError('error acurred while making regex by cho');
  }
}
export default MakeRegexByCho