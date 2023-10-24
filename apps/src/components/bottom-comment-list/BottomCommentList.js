import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, View, Modal, Text} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet'; 
import colors from '../../libs/colors'; 
import fonts from '../../libs/fonts';   
import style from '../../libs/style';
import {screenWidth,moderateScale} from '../../libs/utils'; 
import Image from 'react-native-scalable-image';
import images from '../../libs/images';
import Ripple from 'react-native-material-ripple';  
import { color } from 'react-native-reanimated';
import {useFocusEffect} from 'react-navigation-hooks';
import ImageWrap from '../image-wrap/ImageWrap';
import Button from '../button/Button';
import { myInfo } from '../../redux/myInfo';

const BottomCommentList = ({onClose,onPress,title,type,list,selectIndex,height}) => {
  const ref = useRef();   
  const [passType, setPassType] = useState(1);
  const [passNext, setPassNext] = useState(true);
  useEffect(() => { 
  }, []);
  useFocusEffect(
    React.useCallback(() => {     
      ref.current && ref.current.open();
    }, [])
  );
 
  return ( 
        <RBSheet
          ref={ref}
          onClose={onClose}
          height={height?height:moderateScale(250)}
          customStyles={{
            container: styles.sheet,
            wrapper: {
              backgroundColor: colors.transparent1,
            },
          }}> 
          {type==1&&
          <View style={styles.content_part}>
            <View style={[styles.title_part]}>
              <Ripple onPress={onClose}>
                <Image source={images.i26} width={moderateScale(32)}/>
              </Ripple>
              
              <Text style={styles.title_txt}>{title}</Text>
              <Text>{"     "}</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}  style={styles.scroll}>
              <View style={styles.matching}>
                <View style={styles.row}>
                  <View style={styles.heart}>
                    <Image source={images.i37} width={moderateScale(26)}/>
                  </View>
                  <Text style={styles.txt1}>매칭권</Text>
                </View>
                <Text style={[styles.txt1, {fontWeight:'400'}]}>{list[0]}개</Text>
              </View>
              <View style={style.mt35}>
                <Text style={styles.txt2}>1. 약속잡기는 보통 다음날에서 몇일 후 시작합니다.</Text>
                <Text style={styles.txt2}>2. 약속은 <Text style={{fontWeight:'700'}}>여성분 희망일</Text>에 시작됩니다.</Text>
                <Text style={styles.txt2}>3. 약속은 <Text style={{fontWeight:'700'}}>'2주 이내'</Text> 까지 보장됩니다.</Text>
                <Text style={[styles.txt2, style.ml20]}>a. 2주 이내 매칭 취소 시 매칭권 <Text style={{fontWeight:'700'}}>환급 불가</Text></Text>
                <Text style={[styles.txt2, style.ml20]}>b. 본인차례 미진행시 매칭권 <Text style={{fontWeight:'700'}}>환급 불가</Text></Text>
                <Text style={styles.txt2}>4.환급이 가능한 경우</Text>
                <Text style={[styles.txt2, style.ml20]}>a. 2주 이내 약속이 시작되지 않을 시</Text>
                <Text style={[styles.txt2, style.ml20]}>b. 2주 이내 여성분이 약속 잡기 취소 시</Text>
                <Text style={styles.txt2}>5. 매력회원의 경우 매칭권이 {myInfo.getData().login_type==1?"2":'1'}개 이상 사용됩니다.</Text> 
              </View>
              {list[0]>list[1] ?
              <Text style={[style.mt20, styles.txt2,{color:'#F91C1C', textAlign:'center'}]}></Text> 
              // 매칭권 부족! 현재 매칭권이 부족합니다.
              :
              <Text style={[style.mt20, styles.txt2,{color:'#F91C1C', textAlign:'center'}]}></Text> 
              }
              <Button style={style.mt20} borderRadius={100} onPress={()=>{onPress()}}>
              동의 및 만남 수락
              </Button>
            </ScrollView>
          </View>
          } 
          {type==2&&
          <View style={styles.content_part}>
            <View style={[styles.title_part]}>
              <Ripple onPress={onClose}>
                <Image source={images.i26} width={moderateScale(32)}/>
              </Ripple>
              
              <Text style={styles.title_txt}>{title}</Text>
              <Text>{"     "}</Text>
            </View>
            {passNext ?
            <ScrollView showsVerticalScrollIndicator={false}  style={styles.scroll}>
              <View style={styles.matching}>
                <View style={styles.row}>
                  <View style={styles.heart}>
                    <Image source={images.i36} width={moderateScale(26)}/>
                  </View>
                  <Text style={styles.txt1}>패스권 차감</Text>
                </View>
                <Text style={[styles.txt1, {fontWeight:'400'}]}>{list[0]}개</Text>
              </View>  
              <View style={style.mt35}>
                <Text style={[styles.txt2,{textAlign:'center'}]}>{'보장된 만남 패스는 이 회원 말고\n만남 가능한 다른 여성분을\n찾아달라는 의미입니다.\n'}</Text> 
                <Text style={[styles.txt2,{textAlign:'center'}]}>{'만남 패스시 매칭 매니저가 회원님과 만남이\n가능한 새로운 분을 찾아드리는 수고비로\n‘패스권 1회‘를 사용합니다.\n'}</Text> 
                <Text style={[styles.txt2,{textAlign:'center'}]}>{'보장된 만남을 패스하시겠습니까?\n(패스를 해야만 새로운 분을 찾아드립니다.)'}</Text> 
              </View>
              {list[0]>list[1] ?
              <Text style={[style.mt5, styles.txt2,{color:'#F91C1C', textAlign:'center'}]}></Text> 
              // 패스권 부족! 현재 패스권이 부족합니다.
              :
              <Text style={[style.mt5, styles.txt2,{color:'#F91C1C', textAlign:'center'}]}></Text> 
              }
              <Button style={style.mt5} borderRadius={100} onPress={onClose}>다시 생각해보기</Button>
              <Ripple onPress={()=>{ list[0]>list[1] ? onPress(0) : setPassNext(false)}} style={styles.skip}>
                <Text style={styles.txt1}>만남 패스 (복구 불가)</Text>
              </Ripple>
            </ScrollView>
            :
            <ScrollView showsVerticalScrollIndicator={false}  style={styles.scroll}>
              <Text style={[styles.txt1, style.mt50]}>패스 사유를 알려주세요.</Text>
              <View style={style.mt20}>
              <Ripple style={[styles.checkBox]} onPress={()=>setPassType(1)}>
                <ImageWrap image={passType==1 ? images.i22: images.i21} style={styles.chk_img} resizeMode={'cover'}/>  
                <Text style={styles.chk_txt_on}>선호하는 외모 스타일이 아니에요.</Text> 
              </Ripple> 
              <Ripple style={[styles.checkBox]} onPress={()=>setPassType(2)}>
                <ImageWrap image={passType==2 ? images.i22: images.i21} style={styles.chk_img} resizeMode={'cover'}/>  
                <Text style={styles.chk_txt_on}>희망 나이가 안맞아요.</Text> 
              </Ripple> 
              <Ripple style={[styles.checkBox]} onPress={()=>setPassType(3)}>
                <ImageWrap image={passType==3 ? images.i22: images.i21} style={styles.chk_img} resizeMode={'cover'}/>  
                <Text style={styles.chk_txt_on}>희망 키가 안맞아요.</Text> 
              </Ripple> 
              <Ripple style={[styles.checkBox]} onPress={()=>setPassType(4)}>
                <ImageWrap image={passType==4 ? images.i22: images.i21} style={styles.chk_img} resizeMode={'cover'}/>  
                <Text style={styles.chk_txt_on}>다른 직업인 분을 원해요.</Text> 
              </Ripple> 
              <Ripple style={[styles.checkBox]} onPress={()=>setPassType(5)}>
                <ImageWrap image={passType==5 ? images.i22: images.i21} style={styles.chk_img} resizeMode={'cover'}/>  
                <Text style={styles.chk_txt_on}>제 눈높이보다 수준이 낮은것 같아요.</Text> 
              </Ripple> 
              </View>
              <View style={styles.mt37}></View>
              <Button style={style.mt50} borderRadius={100} onPress={onClose}>패스 취소</Button>
              <Ripple onPress={()=>{onPress(passType)}} style={styles.skip}>
                <Text style={styles.txt1}>만남 패스 (복구 불가)</Text>
              </Ripple>
            </ScrollView>
            }
          </View>
          }
          {type==3&&
          <View style={styles.content_part}>
            <View style={[styles.title_part]}>
              <Text>{"     "}</Text> 
              <Text style={styles.title_txt}>{title}</Text>
              <Text>{"     "}</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}  style={styles.scroll}> 
              <View style={style.mt20}> 
                <Text style={styles.txt2}>{'미작성 후기가 있습니다.\n기존 종료된 만남의 후기를 완료하여야 신규 프로필을 확인할 수 있습니다.'}</Text> 
              </View> 
              <Button style={style.mt40} borderRadius={100} onPress={onPress}>
              확인
              </Button>
            </ScrollView>
          </View>
          }
          {type==4&&
          <View style={styles.content_part}>
            <View style={[styles.title_part]}>
              <Text>{"     "}</Text> 
              <Text style={styles.title_txt}>{title}</Text>
              <Text>{"     "}</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}  style={styles.scroll}> 
              <View style={style.mt20}> 
                <Text style={styles.txt2}>‘{list}’ 로 약속일을 결정하시겠습니까? 선택 후 변경이 불가하므로 최종 확인 후 결정해주세요.</Text> 
              </View> 
              <View style={styles.rowspace}>
                <Button style={styles.btn_l} borderRadius={20} color={colors.primary} onPress={onClose}>다시 선택</Button>
                <Button style={styles.btn_r} borderRadius={20} onPress={onPress}>확실합니다.</Button>
              </View>
            </ScrollView>
          </View>
          } 
          {type==6&&
          <View style={styles.content_part}>
            <View style={[styles.title_part]}>
              <Text>{"     "}</Text> 
              <Text style={styles.title_txt}>{title}</Text>
              <Text>{"     "}</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}  style={styles.scroll}> 
              <View style={style.mt20}>
                <Text style={styles.txt2}>{'일정 변경은 최소한으로 해주세요.\n약속일 변경이슈 발생시, 상호 협의하여 결정해주시고\n채팅창에 일정 변경하였다는 메시지를 남겨주세요.'}</Text> 
              </View> 
              <View style={styles.rowspace}>
                <Button style={styles.btn_l} borderRadius={20} color={colors.primary} onPress={onClose}>취소</Button>
                <Button style={styles.btn_r} borderRadius={20} onPress={onPress}>알겠습니다.</Button>
              </View>
            </ScrollView>
          </View>
          } 
          {type==5&&
          <View style={styles.content_part}>
            <View style={[styles.title_part]}>
              <Text>{"     "}</Text> 
              <Text style={styles.title_txt}>{title}</Text>
              <Text>{"     "}</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}  style={styles.scroll}> 
              <View style={style.mt25}> 
                <Text style={[styles.txt2, {fontWeight: 'bold'}]}>‘{list}’</Text> 
              </View> 
              <View style={style.mt15}> 
                <Text style={styles.txt2}>회원님 이름을 예약을 완료해주세요. 약속 당일 여성분이 회원님 이름으로 자리를 찾게됩니다. 예약이 안 되어 있으면 상대방이 당황할 수 있어요.</Text> 
              </View> 
              <View style={styles.rowspace}>
                <Button style={styles.btn_l} borderRadius={20} color={colors.primary} onPress={onClose}>다시 선택</Button>
                <Button style={styles.btn_r} borderRadius={20} onPress={onPress}>완료했어요</Button>
              </View>
            </ScrollView>
          </View>
          } 
          {type==7&&
          <View style={styles.content_part}>
            <View style={[styles.title_part]}>
              <Text>{"     "}</Text> 
              <Text style={styles.title_txt}>{title}</Text>
              <Text>{"     "}</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}  style={styles.scroll}> 
              <View style={style.mt25}> 
                <Text style={[styles.txt2, {fontWeight: 'bold'}]}>회원 탈퇴 이후에는 재심사를 받아야 합니다.</Text> 
              </View> 
              <View style={style.mt15}>  
                <Text style={styles.txt2}>{'서비스에 불만족하신 부분이 있으신가요?\n허브클럽 고객센터에 개선점을 남겨주시면 수정하고\n서비스에 반영할 수 있도록 노력 하겠습니다.\n\n허브클럽과 함게하지 못해 아쉽지만 항상 좋은 인연이 함께하시길 진심으로 기원합니다.'}</Text> 
              </View> 
              <View style={styles.rowspace}>
                <Button style={styles.btn_l} borderRadius={20} color={colors.primary} onPress={onClose}>취소</Button>
                <Button style={styles.btn_r} borderRadius={20} onPress={onPress}>탈퇴하기</Button>
              </View>
            </ScrollView>
          </View>
          } 
          {type==8&&
          <View style={styles.content_part}>
            <View style={[styles.title_part]}>
              <Text>{"     "}</Text> 
              <Text style={styles.title_txt}>{title}</Text>
              <Text>{"     "}</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}  style={styles.scroll}> 
              <View style={style.mt20}>
                <Text style={styles.txt2}>{list}</Text> 
              </View> 
              <View style={styles.rowspace}>
                <Button style={styles.btn_l} borderRadius={20} color={colors.primary} onPress={onClose}>취소</Button>
                <Button style={styles.btn_r} borderRadius={20} onPress={onPress}>구매</Button>
              </View>
            </ScrollView>
          </View>
          } 
          {type==9&&
          <View style={styles.content_part}>
            <View style={[styles.title_part]}>
              <Text>{"     "}</Text> 
              <Text style={styles.title_txt}>{title}</Text>
              <Text>{"     "}</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}  style={styles.scroll}>
              <View style={style.mt20}>
                <Text style={styles.txt2}>{list}</Text>
              </View>
              <View style={styles.rowspace}>
                <Button style={styles.btn_l} borderRadius={20} color={colors.primary} onPress={onClose}>다시 선택</Button>
                <Button style={styles.btn_r} borderRadius={20} onPress={onPress}>완료했어요</Button>
              </View>
            </ScrollView>
          </View>
          } 
        </RBSheet>
  );
}; 
const styles = StyleSheet.create({
  scroll:{
    paddingHorizontal: moderateScale(16)
  },
  root: {
    backgroundColor: colors.transparent1, zIndex: 9
  },
  sheet: {
    width: screenWidth,
    alignSelf: 'center',    
    backgroundColor: colors.transparent,    
  },  
  content_part: {
    height: '100%',
    backgroundColor: colors.white,
    borderTopLeftRadius: moderateScale(30),
    borderTopRightRadius: moderateScale(30),  
  }, 
  row:{ 
    flexDirection:"row",
    alignItems: 'center',
  }, 
  rowspace:{ 
    flexDirection:"row",
    alignItems: 'center',
    justifyContent: 'space-between'
  }, 
  title_part: {
    flexDirection:"row",
    alignItems:"center",
    justifyContent: 'space-between',
    height: moderateScale(63),
    paddingHorizontal: moderateScale(10),
    borderBottomColor: "#D6D9E4",
    borderBottomWidth: 1, 
  },   
  txt1: {
    fontFamily: fonts.NSKRR,
    fontSize: moderateScale(16),
    color: "#17181A",
    lineHeight: moderateScale(23), 
    fontWeight: '700'
  },
  txt2: {
    fontFamily: fonts.NSKRM,
    fontSize: moderateScale(14),
    color: "#000",
    lineHeight: moderateScale(25), 
    fontWeight: '500',
    opacity: 0.7,
  },
  chk_txt_on:{
    fontFamily: fonts.NSKRM,
    fontSize: moderateScale(14),
    color: colors.primary,
    lineHeight: moderateScale(20), 
    fontWeight: '500'
  },
  camera_button: {
    flexDirection:"column",
    alignItems:"center",
    justifyContent: 'center', 
    borderRadius: moderateScale(100),
    height: moderateScale(50),
    width : "100%", 
    marginTop: 10,
    backgroundColor: '#59324E'
  },
  camera_btn_txt: {
    fontFamily: fonts.NSKRR,
    fontSize: moderateScale(16),
    color: "#fff",
    lineHeight: moderateScale(27), 
  },
  camera_button_on: {
    flexDirection:"column",
    alignItems:"center",
    justifyContent: 'center', 
    borderRadius: moderateScale(100),
    height: moderateScale(50),
    width : "100%", 
    marginTop: 10,
    backgroundColor: colors.primary
  }, 
  title_txt: {
    fontFamily: fonts.NSKRB,
    fontSize: moderateScale(18),
    color: "#000",
    lineHeight: moderateScale(27),  
    fontWeight: '700'
  }, 
  matching:{
    backgroundColor: '#F4F6F9',
    borderRadius: moderateScale(20),
    width: '100%',
    height: moderateScale(64),
    flexDirection:"row",
    alignItems:"center",
    justifyContent: 'space-between',
    marginTop: moderateScale(37),
    padding: moderateScale(12),
  },
  heart:{
    width: moderateScale(40),
    height: moderateScale(40), 
    flexDirection:"row",
    alignItems:"center",
    justifyContent:'center',
    backgroundColor: '#fff',
    borderRadius:40,
    marginRight: moderateScale(12)
  },  
  skip:{
    flexDirection:"row",
    alignItems: 'center',
    justifyContent: 'center',
    height: moderateScale(50),
     marginTop: 10
  },
  checkBox:{
    height: moderateScale(35), 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: moderateScale(10),
  }, 
  chk_img:{
    width:moderateScale(24),
    height:moderateScale(24),
    marginRight:10
  },
  mt37:{
    marginTop: moderateScale(37),
  },
  btn_l:{
    height:moderateScale(56), 
    width: screenWidth/2 - moderateScale(25), 
    backgroundColor: '#fff',
    borderWidth:1,
    borderColor: colors.primary, 
    marginTop: moderateScale(40)
  },
  btn_r:{
    height:moderateScale(56), 
    width: screenWidth/2 - moderateScale(25),
    marginTop: moderateScale(40),
    borderRadius: moderateScale(10),
  },
});

export default BottomCommentList;
