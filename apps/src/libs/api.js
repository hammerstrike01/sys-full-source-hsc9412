export default {
  checkEmail: '/checkEmail',                        // 이메일 체크하기
  checkNickname: '/checkNickname',                  // 닉네임 체크하기
  getAddressSidoList: '/getAddressSidoList',        // 시/도
  getAddressGugun: '/getAddressGugun',              // 구/군
  insertTempBadge: '/insertTempBadge',              // 뱃지
  getTempBadge: '/getTempBadge',                    // 뱃지
  getTempBadgeCnt: '/getTempBadgeCnt',              // 뱃지현황얻기
  creatAccount: '/creatAccount',                    // 계정생성하기
  insertBadge: '/insertBadge',                      // 유저 뱃지등록하기
  login: '/login',                                  // 로그인
  updatePushId: '/updatePushId',                    // 푸쉬등록하기
  updateProfileAge: '/updateProfileAge',            // 선호나이 수정
  insertPhoneList: '/insertPhoneList',              // 차단 목록 등록하기
  sendCode:'/sendCode',                             // 인증번호발송하기
  updatePassword: '/updatePassword',                // 비밀번호 변경하기
  checkPhone: '/checkPhone',                        // 휴대폰 번호 체크하기
  sendSms:'/sendSms',                               // sms 인증번호 발송하기
  getEmailByPhone: '/getEmailByPhone',              // sms로 이메일 발송하기
  getUserData: '/getUserData',                      // 회원정보불러오기
  updateUserData: '/updateUserData',                // 프로필 변경하기
  getUserProfile: '/getUserProfile',                // 프로필 조회
  updateUserStatus: '/updateUserStatus',            // 회원탈퇴하기
  logout: '/logout',                                // 로그아웃
  getIntorStatus: '/getIntorStatus',                // 소개중단 조회
  updateIntorStatus: '/updateIntorStatus',          // 소개중단 변경
  getPaymentList: '/getPaymentList',                // 매칭권 스토어
  insertPayment: '/insertPayment',                  // 결제정보 등록하기
  getMyIdealType: '/getMyIdealType',                // 이상형 조회
  updateProfile: '/updateProfile',                  // 이상형 변경
  getMyStatus: '/getMyStatus',                      // 매칭상태정보 조회
  getProfileById: '/getProfileById',                // 프로필 정보조회
  getBadbeInfo: '/getBadbeInfo',                    // 프로필 뱃지
  getMyCards: '/getMyCards',                        // 매칭권/패스권 현황
  updateMatchingStatus: '/updateMatchingStatus',    // 매칭상태 변경
  getMyMatchingList: '/getMyMatchingList',          // 매칭목록 조회
  getMatchingMeetDate: '/getMatchingMeetDate',      // 매칭 약속일 조회
  updateMachingDate: '/updateMachingDate',          // 매칭 약속일 수정
  exitMatching: '/exitMatching',                    // 매칭 종료 
  updateMatchingFavor: '/updateMatchingFavor',      // 매칭 선호 사항 수정
  checkAfter: '/checkAfter',                        // 미작성 후기 존재여부 조회
  insertAfter: '/insertAfter',                      // 후기등록
  getAfter: '/getAfter',                            // 후기조회
  updateMeetingDate: '/updateMeetingDate',          // 미팅일정 변경
  sendFcm: '/sendFcm',                              // fcm 보내기
  tempSendFcm: '/tempSendFcm',                      // 예약발송하기
  checkplus_main: '/checkplus_main',                // nice인증 토큰값 얻기
  getAlarmList: '/getAlarmList',                    // 알림목록 조회
  deleteAlarmById: '/deleteAlarmById',              // 알림삭제
  deleteAlarmAll: '/deleteAlarmAll',                // 알림전체삭제
  getPushCnt: '/getPushCnt',                        // 읽지않은 알림상태 확인하기
  updateBadge: '/updateBadge',                      // 프로필뱃지수정
  getVersion: '/getVersion',                        // 현재 버전
}; 
  