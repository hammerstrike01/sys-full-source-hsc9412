 
<div class="page-header d-print-none">
  <div class="container-xl">
    <div class="row g-2 align-items-center">
      <div class="col d-flex align-items-center justify-content-between">
        <h2 class="page-title">회원관리 수정</h2>
        <div>
          <?php if($info->user_status==3){ ?>
          <a href="#" class="btn w100" data-bs-toggle="modal" data-bs-target="#modal-repair">복원하기</a>
          <?php } ?>
          <a href="#" class="btn w100" data-bs-toggle="modal" data-bs-target="#modal-delete">삭제</a>
          <a href="#" class="btn btn-primary w100" data-bs-toggle="modal" data-bs-target="#modal-confirm-save">저장</a>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- Page body -->
<div class="page-body">
  <div class="container-xl">
    <ul class="nav nav-bordered mb-3">
      <li class="nav-item">
        <a class="nav-link active" href="javascript:changeType(1)">회원정보</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="javascript:changeType(2)">프로필정보</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="javascript:changeType(3)">매칭권</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="javascript:changeType(4)">리뷰</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="javascript:changeType(5)">인증정보</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="javascript:changeType(6)">매칭내역</a>
      </li>
    </ul>
    <div class="row row-deck row-cards">
      <div class="col-12">
        <div id="tab1" class="tab card"> 
          <div class="card-body border-bottom py-3">
            <div class="col-12 d-flex align-items-center">
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-1">
                  계정상태
                </div>
                <div class="col-9">
                  <select class="form-select" name="user_status" id="user_status">
                    <option value="1">활성</option>
                    <option value="2">중단</option>
                    <option value="3">탈퇴</option>
                  </select>
                </div>
              </div>
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-4">
                  생성일
                </div>
                <div class="col-9">
                  <input type="text" disabled="true" class="form-control" name="" value="<?php echo $info->reg_date?>">
                </div>
              </div>
            </div>
            <div class="col-12 d-flex align-items-center mt-3">
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-1">
                  닉네임
                </div>
                <div class="col-9">
                  <input type="text" disabled="true" class="form-control" name="" value="<?php echo $info->nick_name?>">
                </div>
              </div>
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-4">
                  휴대폰번호
                </div>
                <div class="col-9">
                  <input type="text" disabled="true" class="form-control" name="" value="<?php echo preg_replace("/([0-9]{3})([0-9]{4})([0-9]{4})/", "$1-$2-$3", $info->phone); ;?>">
                </div>
              </div>
            </div>
            <div class="col-12 d-flex align-items-center mt-3">
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-1">
                  성별
                </div>
                <div class="col-9">
                  <input type="text" disabled="true" class="form-control" name="" value="<?php if($info->gender==1)echo "남성"; else echo "여성";?>">
                </div>
              </div>
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-4">
                  만나이
                </div>
                <div class="col-9">
                  <input type="text" disabled="true" class="form-control" name="" value="<?php 
                            $today       = date('Ymd');
                            $birthday = date('Ymd' , strtotime( $info->born));
                            $age     = floor(($today - $birthday) / 10000);
                            echo $age;
                          ?>세">
                </div>
              </div>
            </div>
            <div class="col-12 d-flex align-items-center mt-3">
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-1">
                  생년월일
                </div>
                <div class="col-9">
                  <input type="text" disabled="true" class="form-control" name="" value="<?php echo $info->born?>">
                </div>
              </div>
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-4">
                  이메일
                </div>
                <div class="col-9">
                  <input type="text" disabled="true" class="form-control" name="" value="<?php echo $info->email?>">
                </div>
              </div>
            </div>
            <div class="col-12 d-flex align-items-center mt-3">
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-1">
                  내 초대번호
                </div>
                <div class="col-9">
                  <input type="text" disabled="true" class="form-control" name="" value="<?php echo $info->invite_code?>">
                </div>
              </div>
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-4">
                  가입 초대번호
                </div>
                <div class="col-9">
                  <input type="text" disabled="true" class="form-control" name="" value="<?php echo $info->reg_code?>">
                </div>
              </div>
            </div>
            <div class="col-12 d-flex align-items-start mt-3">
              <div class="w100 ms-1">
                관리자 메모장
              </div>
              <div class="col-9">
                <textarea class="form-control" rows="5" name="memo" id="memo"><?php echo $info->memo?></textarea>
              </div>
            </div>
          </div>
        </div>
        <div id="tab2" class="tab card d-none"> 
          <div class="card-body border-bottom py-3">
            <div class="col-12 d-flex align-items-center">
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-1">
                  심사 프로필
                </div>
                <div class="col-9  d-flex align-items-center">
                  <?php
                  $cnt=[];
                  if($info->profile)
                  $cnt =  explode(",", $info->profile);
                    for($i=0; $i< count($cnt); $i++){
                  ?>
                    <div class="col-2  ms-1">
                      <a data-fslightbox="gallery" href="<?php echo $this->config->item("img_url").$cnt[$i]?>">
                        <div class="img-responsive img-responsive-1x1 rounded-3 border " style="background-image: url('<?php echo $this->config->item("img_url").$cnt[$i]?>')"></div>
                      </a>
                    </div>
                  <?php } ?>
                </div>
              </div>
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-4">
                  선택 프로필
                </div>
                <div class="col-9 d-flex align-items-center img">
                 
                  <div class="avatar avatar-upload rounded ms-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 5l0 14"></path><path d="M5 12l14 0"></path></svg>
                    <span class="avatar-upload-text fs-4">사진</span>
                    
                    <input type="file" id="img" class="w-100 h100">
                  </div>
                  <?php 
                  $sel_profile=[];
                  if($info->sel_profile)
                    $sel_profile =  explode(",", $info->sel_profile);
                    for($si=0; $si< count($sel_profile); $si++){
                  ?>
                    <div class="col-2  ms-1">
                      <a data-fslightbox="gallery1" href="<?php echo $this->config->item("img_url").$sel_profile[$si]?>">  
                        <div class="img-responsive img-responsive-1x1 rounded-3 border " style="background-image: url('<?php echo $this->config->item("img_url").$sel_profile[$si]?>')"></div>
                      </a>
                    </div>
                  <?php } ?>
                  
                </div>
              </div>
            </div>
            <div class="col-12 d-flex align-items-center mt-3">
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-1">
                  직업 인증
                </div>
                <div class="col-9  d-flex align-items-center">
                  <div class="col-2 ms-1">
                    <a data-fslightbox="gallery2" href="<?php echo $this->config->item("img_url").$info->job_profile?>">
                      <div class="img-responsive img-responsive-1x1 rounded-3 border " style="background-image: url(<?php echo $this->config->item("img_url").$info->job_profile?>)"></div>
                    </a>
                  </div> 
                </div>
              </div>
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-4">
                  매칭되면
                </div>
                <div class="col-9">
                  <input type="text" disabled="true" class="form-control" name="" value="<?php echo $info->message?>">
                </div>
              </div>
            </div>
            <div class="col-12 d-flex align-items-center mt-3">
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-1">
                  자기소개
                </div>
                <div class="col-9">
                  <textarea class="form-control" rows="4"  disabled="true"><?php echo $info->my_intro?></textarea>
                </div>
              </div>
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-4">
                  본인자랑
                </div>
                <div class="col-9">
                  <textarea class="form-control" rows="4" disabled="true"><?php echo $info->intro1?></textarea>
                </div>
              </div>
            </div>
            <div class="col-12 d-flex align-items-center mt-3">
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-1">
                  키
                </div>
                <div class="col-9">
                  <input type="text" disabled="true" class="form-control" name="" value="<?php echo $info->ht?>">
                </div>
              </div>
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-4">
                  직업
                </div>
                <div class="col-9">
                  <input type="text" disabled="true" class="form-control" name="" value="<?php echo $info->job?>"> 
                </div>
              </div>
            </div>
            <div class="col-12 d-flex align-items-center mt-3">
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-1">
                  주요활동지역
                </div>
                <div class="d-flex col-9">
                  <select class="form-select" id="active_sido" onchange="getAddressGugun()">
                    <?php 
                    if(isset($address) && is_array($address)){ 
                        foreach ($address as $key=>$address_info):?>
                         <option value="<?php echo $address_info->id?>"><?php echo $address_info->short_name?></option>
                      <?php endforeach;   ?> 
                    <?php } ?> 
                  </select>
                  <select class="form-select ms-1" id="active_gugun">
                    
                  </select>
                  <!-- <input type="text" disabled="true" class="form-control" name="" value="수도권"> -->
                </div>
              </div>
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-4">
                  거주지역
                </div>
                <div class="d-flex col-9">
                  <select class="form-select" id="address_sido" onchange="getAddressGugun1()">
                    <?php 
                    if(isset($address) && is_array($address)){ 
                        foreach ($address as $key=>$address_info1):?>
                         <option value="<?php echo $address_info1->id?>"><?php echo $address_info1->short_name?></option>
                      <?php endforeach;   ?> 
                    <?php } ?> 
                  </select>
                  <select class="form-select ms-1" id="address_gugun">
                    
                  </select>
                  <!-- <input type="text" disabled="true" class="form-control" name="" value="서울/강남구"> -->
                </div>
              </div>
            </div>
            <div class="col-12 d-flex align-items-center mt-3">
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-1">
                  학력
                </div>
                <div class="col-9">
                  <input type="text" disabled="true" class="form-control" name="" value="<?php echo $info->collage?>">
                </div>
              </div>
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-4">
                  졸업여부
                </div>
                <div class="col-9">
                  <input type="text" disabled="true" class="form-control" name="" value="<?php echo $info->collage_exit?>">
                </div>
              </div>
            </div>
            <div class="col-12 d-flex align-items-center mt-3">
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-1">
                  종교
                </div>
                <div class="col-9">
                  <input type="text" disabled="true" class="form-control" name="" value="<?php if($info->religion==1)echo "기독교"; else if($info->religion==2)echo "천주교"; else if($info->religion==3)echo "불교"; else echo "기타"?>
                  ">
                </div>
              </div>
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-4">
                  흡연
                </div>
                <div class="col-9">
                  <input type="text" disabled="true" class="form-control" name="" value="<?php if($info->smoking==1)echo "흡연 안 함"; else echo "흡연 함"?>">
                </div>
              </div>
            </div>
            <div class="col-12 d-flex align-items-center mt-3">
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-1">
                  타투
                </div>
                <div class="col-9">
                  <input type="text" disabled="true" class="form-control" name="" value="<?php if($info->tatu==1)echo "타투 없음"; else echo "타투 있음"?>">
                </div>
              </div>
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-4">
                  돌싱
                </div>
                <div class="col-9">
                  <input type="text" disabled="true" class="form-control" name="" value="<?php if($info->single==1)echo "돌싱 아님"; else echo "돌싱임"?>">
                </div>
              </div>
            </div>
            <div class="col-12 d-flex align-items-center mt-3">
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-1">
                  타입
                </div>
                <div class="col-9">
                  <input type="text" disabled="true" class="form-control" name="" value="<?php echo $info->like_type?>">
                </div>
              </div>
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-4">
                  소개
                </div>
                <div class="col-9">
                  <input type="text" disabled="true" class="form-control" name="" value="<?php echo $info->intro?>">
                </div>
              </div>
            </div>
            <div class="col-12 d-flex align-items-center mt-3">
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-1">
                  선호나이
                </div>
                <div class="col-9">
          
                  <input type="text" disabled="true" class="form-control" id="favor_age">
                  <input type="hidden" id="age_st" value="<?php echo $info->favor_age_st?>">
                  <input type="hidden" id="age_ed" value="<?php echo $info->favor_age_ed?>">
                  <input type="hidden" id="ht_st" value="<?php echo $info->favor_ht_st?>">
                  <input type="hidden" id="ht_ed" value="<?php echo $info->favor_ht_ed?>">
                </div>
              </div>
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-4">
                  선호키
                </div>
                <div class="col-9">
                  <input type="text" disabled="true" class="form-control" id="favor_ht">
                </div>
              </div>
            </div>
            <div class="col-12 d-flex align-items-center mt-3">
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-1">
                  만남지역
                </div>
                <div class="col-9">
                  <input type="text" disabled="true" class="form-control" name="" value="<?php echo $info->meet_area?>">
                </div>
              </div>
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-4">
                  최종학력
                </div>
                <div class="col-9">
                  <input type="text" disabled="true" class="form-control" name="" value="<?php echo $info->result_collage?>">
                </div>
              </div>
            </div>
            <div class="col-12 d-flex align-items-center mt-3">
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-1">
                  흡연
                </div>
                <div class="col-9">
                  <input type="text" disabled="true" class="form-control" name="" value="<?php if($info->favor_smoking==1)echo "상관 없음"; if($info->favor_smoking==2) echo "절대 안됨"?>">
                </div>
              </div>
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-4">
                  타투
                </div>
                <div class="col-9">
                  <input type="text" disabled="true" class="form-control" name="" value="<?php if($info->favor_tatu==1)echo "상관 없음"; if($info->favor_tatu==2) echo "절대 안됨"?>">
                </div>
              </div>
            </div>
            <div class="col-12 d-flex align-items-center mt-3">
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-1">
                  돌싱
                </div>
                <div class="col-9">
                  <input type="text" disabled="true" class="form-control" name="" value="<?php if($info->favor_single==1)echo "상관 없음"; if($info->favor_single==2) echo "절대 안됨"?>">
                </div>
              </div>
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-4">
                  직업
                </div>
                <div class="col-9">
                  <textarea disabled="true" rows="2" class="form-control"><?php echo $info->favor_job?></textarea>
                </div>
              </div>
            </div>
            <div class="col-12 d-flex align-items-center mt-3">
              <div class="col-5 d-flex align-items-center">
                <div class="w100 ms-1">
                  종교
                </div>
                <div class="col-9">
                  <input type="text" disabled="true" class="form-control" name="" value="<?php if($info->favor_religion==1)echo "무관"; if($info->favor_religion==2) echo "같은 종교만"; if($info->favor_religion==0) echo "-"?>">
                </div>
              </div> 
            </div>
            <div class="col-12 d-flex align-items-start mt-3">
              <div class="w100 ms-1">
                한 줄 소개
              </div>
              <div class="col-9">
                <textarea class="form-control" rows="5" id="admin_intro"><?php echo $info->admin_intro?></textarea>
              </div>
            </div>
            <div class="col-12 d-flex align-items-start mt-3">
              <div class="w100 ms-1">
                매니저 의견
              </div>
              <div class="col-9">
                <textarea class="form-control" rows="5" id="admin_memo"><?php echo $info->admin_memo?></textarea>
              </div>
            </div>
          </div>
        </div>
        <div id="tab3" class="tab d-none w-100">
          <div class="col-12 w-100 mt-4 d-flex justify-content-center align-items-center">
              <p class="fs-3 fw-bolder text-center">보유 매칭권:</p>
              <p class="fs-5 text-center ms-1"><?php echo number_format($info->matching_card) ?>개</p>
              <p class="fs-3 fw-bolder text-center ms-5">보유 패스권:</p>
              <p class="fs-5 text-center ms-1"><?php echo number_format($info->pass_card) ?>개</p>
            </div>
          <div class="card w-100"> 
            <div class="card-body border-bottom py-3">
              <div class="d-flex">
                <div class="text-muted">
                  Show
                  <div class="mx-2 d-inline-block">
                    <input type="text" class="form-control form-control-sm" value="15" size="3" aria-label="Invoices count" disabled>
                  </div>
                  entries
                </div>
              </div>
            </div>
            <div class="table-responsive">
              <table class="table card-table table-vcenter text-nowrap datatable">
                <thead>
                  <tr>
                    <th class="w-5">no</th>
                    <th class="w-18">발생일자</th>
                    <th class="w-18">상태</th>
                    <th class="w-18">상품번호</th>
                    <th class="w-33">상품명</th>
                    <th class="w-18">결제액</th>
                  </tr>
                </thead>
                <tbody>
                  <?php 
                  if(isset($payment) && is_array($payment)){  $index=0;
                      foreach ($payment as $key=>$payment_info):?>
                       <tr>
                        <td><?php echo count($payment) - $index ?></td>
                        <td><?php echo $payment_info->reg_time?></td>
                        <td><?php if($payment_info->status==1)echo "결제";  if($payment_info->status==2)echo "지급";  if($payment_info->status==3)echo "차감"; ?></td>
                        <td><?php echo $payment_info->pay_info?></td>
                        <td><?php echo $payment_info->pay_type?></td>
                        <td><?php echo number_format($payment_info->amount)?>원</td>
                      </tr> 
                    <?php  $index++; endforeach;   ?> 
                  <?php } ?>  
                </tbody>
              </table>
            </div>
            <div class="card-footer d-flex align-items-center">
              <p class="m-0 text-muted">Showing <span>1</span> to <span><?php echo count($payment)?></span> of <span><?php echo count($payment)?></span> entries</p>
              
            </div>
          </div>
        </div>
        <div id="tab4" class="tab d-none w-100">
          <div class="col-12 mt-4 d-flex align-items-center">
              <p class="fs-3 fw-bolder text-center">평가받은 리뷰:</p>
              <p class="fs-5 text-center ms-1"><?php echo count($review)?>개</p>
            </div>
          <div class="card w-100"> 
            <div class="card-body border-bottom py-3">
              <div class="d-flex">
                <div class="text-muted">
                  Show
                  <div class="mx-2 d-inline-block">
                    <input type="text" class="form-control form-control-sm" value="15" size="3" aria-label="Invoices count" disabled>
                  </div>
                  entries
                </div>
              </div>
            </div>
            <div class="table-responsive">
              <table class="table card-table table-vcenter text-nowrap datatable">
                <thead>
                  <tr>
                    <th class="w-5">no</th>
                    <th class="w-10">발생일자</th>
                    <th class="w-10">작성자</th>
                    <th class="w-10">리뷰내용</th>
                    <th class="w-10">Q.제시간 도착</th>
                    <th class="w-10">Q.상대방 외모</th>
                    <th class="w-10">Q.상대방 매너</th>
                    <th class="w-10">Q.만남 만족도</th>
                    <th class="w-10">Q.취소 귀책자</th>
                    <th class="w-10">Q.취소 사유</th>
                  </tr>
                </thead>
                <tbody>
                  <?php 
                  if(isset($review) && is_array($review)){  $indexs=0;
                      foreach ($review as $key=>$review_info):?>
                       <tr>
                        <td><?php echo count($review) - $indexs ?></td>
                        <td><?php echo $review_info->crt_date?></td>
                        <td class="text-decoration-underline fw-bolder" >
                          <a href="javascript:detail(<?php echo $review_info->user_id?>)"><?php echo $review_info->nick_name?><br/><?php echo $review_info->email?></a>
                        </td>
                        <td><div class="memo_line"><?php echo $review_info->memo;?></div></td> 
                        <td><?php echo $review_info->times?></td>
                        <td><?php echo $review_info->face?></td>
                        <td><?php echo $review_info->maner?></td>
                        <td><?php echo $review_info->likes?></td>
                        <td><?php if($review_info->cancel_txt) if($info->id = $review_info->send_id) echo "본인"; else echo "상대방"; else echo "-"?></td>
                        <td><?php if($review_info->cancel_txt)echo $review_info->cancel_txt; else echo"-"?></td>
                      </tr> 
                    <?php $indexs++; endforeach;   ?> 
                  <?php } ?>
                </tbody>
              </table>
            </div>
            <div class="card-footer d-flex align-items-center">
              <p class="m-0 text-muted">Showing <span>1</span> to <span><?php echo count($review)?></span> of <span><?php echo count($review)?></span> entries</p>
            </div>
          </div>
        </div>
        <div id="tab5" class="tab card d-none">
          <div class="card-body border-bottom py-3">
            <div class="nav-bordered">
              <div class="col-12 d-flex align-items-center">
                <div class="col-4 d-flex align-items-center">
                  <div class="col-3 ms-1">
                    프로필 심사합격 
                  </div> 
                  <div class="col-8">
                    <select class="form-select" <?php if(isset($badge->badge1)&&$badge->badge1)echo ""; ?> id="badge1" >
                      <option value="0">미승인</option>
                      <option value="1">승인</option>
                    </select>
                  </div>
                </div>
                <div class="col-4 d-flex align-items-center">
                  <div class="col-2 ms-4">
                    인풀루언서
                  </div>
                  <div class="col-8">
                    <select class="form-select" <?php if(isset($badge->badge2)&&$badge->badge2)echo ""; ?> id="badge2">
                      <option value="0">미승인</option>
                      <option value="1">승인</option>
                    </select>
                  </div>
                </div>
              </div> 
              <div class="col-12 d-flex align-items-center mt-3 mb-3">
                <div class="col-4 d-flex align-items-center">
                  <div class="col-3 ms-1">
                    셀럽
                  </div>
                  <div class="col-8">
                    <select class="form-select" <?php if(isset($badge->badge3)&&$badge->badge3)echo ""; ?> id="badge3">
                      <option value="0">미승인</option>
                      <option value="1">승인</option>
                    </select>
                  </div>
                </div> 
              </div>
            </div>
            <div class="nav-bordered">
              <div class="col-12 d-flex align-items-center mt-3 mb-3">
                <div class="col-4 d-flex align-items-center">
                  <div class="col-3 ms-1">
                    억대차량
                  </div>
                  <div class="col-8">
                    <select class="form-select" <?php if(isset($badge->badge4)&&$badge->badge4)echo ""; ?> id="badge4">
                      <option value="0">미승인</option>
                      <option value="1">승인</option>
                    </select>
                  </div>
                </div>
                <div class="col-4 d-flex align-items-center">
                  <div class="col-2 ms-4">
                    슈퍼카
                  </div>
                  <div class="col-8">
                    <select class="form-select" <?php if(isset($badge->badge5)&&$badge->badge5)echo ""; ?> id="badge5">
                      <option value="0">미승인</option>
                      <option value="1">승인</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="nav-bordered">
              <div class="col-12 d-flex align-items-center mt-3">
                <div class="col-4 d-flex align-items-center">
                  <div class="col-3 ms-1">
                    고소득
                  </div>
                  <div class="col-8">
                    <select class="form-select" <?php if(isset($badge->badge6)&&$badge->badge6)echo ""; ?> id="badge6">
                      <option value="0">미승인</option>
                      <option value="1">승인</option>
                    </select>
                  </div>
                </div>
                <div class="col-4 d-flex align-items-center">
                  <div class="col-2 ms-4">
                    억대연봉
                  </div>
                  <div class="col-8">
                    <select class="form-select" <?php if(isset($badge->badge7)&&$badge->badge7)echo ""; ?> id="badge7">
                      <option value="0">미승인</option>
                      <option value="1">승인</option>
                    </select>
                  </div>
                </div> 
              </div>
              <div class="col-12 d-flex align-items-center mt-3 mb-3">
                <div class="col-4 d-flex align-items-center">
                  <div class="col-3 ms-1">
                    억대연봉+
                  </div>
                  <div class="col-8">
                    <select class="form-select" <?php if(isset($badge->badge8)&&$badge->badge8)echo ""; ?> id="badge8">
                      <option value="0">미승인</option>
                      <option value="1">승인</option>
                    </select>
                  </div>
                </div> 
              </div>
            </div>
             <div class="nav-bordered">
              <div class="col-12 d-flex align-items-center mt-3">
                <div class="col-4 d-flex align-items-center">
                  <div class="col-3 ms-1">
                    명문대
                  </div>
                  <div class="col-8">
                   <select class="form-select" <?php if(isset($badge->badge10)&&$badge->badge10)echo ""; ?> id="badge10">
                      <option value="0">미승인</option>
                      <option value="1">승인</option>
                    </select>
                  </div>
                </div>
                <div class="col-4 d-flex align-items-center">
                  <div class="col-2 ms-4">
                    전문직
                  </div>
                  <div class="col-8">
                     <select class="form-select" <?php if(isset($badge->badge9)&&$badge->badge9)echo ""; ?> id="badge9">
                      <option value="0">미승인</option>
                      <option value="1">승인</option>
                    </select>
                    
                  </div>
                </div>
              </div>
              <div class="col-12 d-flex align-items-center mt-3 mb-3">
                <div class="col-4 d-flex align-items-center">
                  <div class="col-3 ms-1">
                    사업가
                  </div>
                  <div class="col-8">
                    <select class="form-select" <?php if(isset($badge->badge11)&&$badge->badge11)echo ""; ?> id="badge11">
                      <option value="0">미승인</option>
                      <option value="1">승인</option>
                    </select>
                  </div>
                </div> 
              </div>
            </div>
            <div class="nav-bordered">
              <div class="col-12 d-flex align-items-center mt-3">
                <div class="col-4 d-flex align-items-center">
                  <div class="col-3 ms-1">
                    고액자산
                  </div>
                  <div class="col-8">
                    <select class="form-select" <?php if(isset($badge->badge12)&&$badge->badge12)echo ""; ?> id="badge12">
                      <option value="0">미승인</option>
                      <option value="1">승인</option>
                    </select>
                  </div>
                </div>
                <div class="col-4 d-flex align-items-center">
                  <div class="col-2 ms-4">
                    초고액자산
                  </div>
                  <div class="col-8">
                    <select class="form-select" <?php if(isset($badge->badge13)&&$badge->badge13)echo ""; ?> id="badge13">
                      <option value="0">미승인</option>
                      <option value="1">승인</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="col-12 d-flex align-items-center mt-3 mb-3">
                <div class="col-4 d-flex align-items-center">
                  <div class="col-3 ms-1">
                    초고액자산+
                  </div>
                  <div class="col-8">
                    <select class="form-select" <?php if(isset($badge->badge14)&&$badge->badge14)echo ""; ?> id="badge14">
                      <option value="0">미승인</option>
                      <option value="1">승인</option>
                    </select>
                  </div>
                </div> 
              </div>
            </div>
             
            <div class="nav-bordered">
              <div class="col-12 d-flex align-items-center mt-3 mb-3">
                <div class="col-4 d-flex align-items-center">
                  <div class="col-3 ms-1">
                    엘리트집안
                  </div>
                  <div class="col-8">
                    <select class="form-select" <?php if(isset($badge->badge15)&&$badge->badge15)echo ""; ?> id="badge15">
                      <option value="0">미승인</option>
                      <option value="1">승인</option>
                    </select>
                  </div>
                </div>
                <div class="col-4 d-flex align-items-center">
                  <div class="col-2 ms-4">
                    금수저집안
                  </div>
                  <div class="col-8">
                    <select class="form-select" <?php if(isset($badge->badge16)&&$badge->badge16)echo ""; ?> id="badge16">
                      <option value="0">미승인</option>
                      <option value="1">승인</option>
                    </select>
                  </div>
                </div>
              </div> 
              <div class="col-12 d-flex align-items-center mt-3 mb-3">
                <div class="col-4 d-flex align-items-center">
                  <div class="col-3 ms-1">
                    다아아집안
                  </div>
                  <div class="col-8">
                    <select class="form-select" <?php if(isset($badge->badge17)&&$badge->badge17)echo ""; ?> id="badge17">
                      <option value="0">미승인</option>
                      <option value="1">승인</option>
                    </select>
                  </div>
                </div> 
              </div>
            </div>
            <div class="">
              <div class="col-12 d-flex align-items-center mt-3 mb-3">
                <div class="col-4 d-flex align-items-center">
                  <div class="col-3 ms-1">
                    키 170+
                  </div>
                  <div class="col-8">
                    <select class="form-select" <?php if(isset($badge->badge18)&&$badge->badge18)echo ""; ?> id="badge18">
                      <option value="0">미승인</option>
                      <option value="1">승인</option>
                    </select>
                  </div>
                </div>
                <div class="col-4 d-flex align-items-center">
                  <div class="col-2 ms-4">
                    키 180+
                  </div>
                  <div class="col-8">
                    <select class="form-select" <?php if(isset($badge->badge19)&&$badge->badge19)echo ""; ?> id="badge19">
                      <option value="0">미승인</option>
                      <option value="1">승인</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="tab6" class="tab d-none w-100">
          <div class="col-12 mt-4 d-flex align-items-center">
              <p class="fs-3 fw-bolder text-center">매칭 내역:</p>
              <p class="fs-5 text-center ms-1"><?php echo count($matching)?>개</p>
            </div>
          <div class="card w-100"> 
            <div class="card-body border-bottom py-3">
              <div class="d-flex">
                <div class="text-muted">
                  Show
                  <div class="mx-2 d-inline-block">
                    <input type="text" class="form-control form-control-sm" value="15" size="3" aria-label="Invoices count" disabled>
                  </div>
                  entries
                </div>
              </div>
            </div>
            <div class="table-responsive">
              <table class="table card-table table-vcenter text-nowrap datatable">
                <thead>
                  <tr>
                    <th class="w-5">no</th>
                    <th class="w-18">발생일자</th>
                    <th class="w-18">매칭상태</th>
                    <th class="w-18">매칭번호</th>
                    <th class="w-18">상대 프로필</th>
                    <th class="w-18">상대 닉네임</th>
                    <th class="w-18">매칭권</th>
                  </tr>
                </thead>
                <tbody>
                  <?php 
                  if(isset($matching) && is_array($matching)){  $indexs=0;
                      foreach ($matching as $key=>$matching_info):?>
                       <tr>
                        <td><?php echo count($matching) - $indexs ?></td>
                        <td><?php echo $matching_info->reg_time?></td>
                        <td><?php 
                          if($matching_info->status==1)echo "전달"; 
                          if($matching_info->status==2)echo "패스"; 
                          if($matching_info->status==3)echo "제안"; 
                          if($matching_info->status==4)echo "선택"; 
                          if($matching_info->status==5)echo "역제안"; 
                          if($matching_info->status==6)echo "확정"; 
                          if($matching_info->status==7)echo "종료"; 
                          if($matching_info->status==8)echo "취소"; 
                        ?></td>
                        <td><a href="javascript:goMdetail(<?php echo $matching_info->id?>)" class="text-decoration-underline fw-bolder"><?php echo $matching_info->m_number?></a></td>
                        <td class="d-flex align-items-center justify-content-center" > 
                            <span class="avatar me-3 rounded-circle" style="background-image: url(<?php 
                              $pro = explode(",", $matching_info->m_profile); 
                              echo $this->config->item("img_url").$pro[0]
                              ?>)"></span> 
                            <?php echo $matching_info->user_name?>
                            (만
                            <?php 
                              $today       = date('Ymd');
                              $birthday = date('Ymd' , strtotime( $matching_info->born));
                              $age     = floor(($today - $birthday) / 10000);
                              echo $age;
                            ?>세) 
                        </td>
                        <td class="text-decoration-underline fw-bolder" >
                          <a href="javascript:detail(<?php echo $matching_info->user_id?>)"><?php echo $matching_info->nick_name?><br/><?php echo $matching_info->email?></a>
                        </td> 
                        <td>매칭권 <?php if($info->gender==1) echo $matching_info->m_card1; else echo $matching_info->m_card2; ?>장</td>
                      </tr> 
                    <?php $indexs++; endforeach;   ?> 
                  <?php } ?> 
                 
                </tbody>
              </table>
            </div>
            <div class="card-footer d-flex align-items-center">
              <p class="m-0 text-muted">Showing <span>1</span> to <span><?php echo count($matching)?></span> of <span><?php echo count($matching)?></span> entries</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div> 
<div class="modal modal-blur fade" id="modal-repair1" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">휴먼계정</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
         <label class="mt-3 form-label text-center">휴먼처리 하시겠습니까?</label> 
      </div>
      <div class="modal-footer justify-content-center">
        <div class="btn-list">
          <a href="#" class="btn" data-bs-dismiss="modal">아니오</a>
          <a href="#" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal-confirm-repair1">네</a>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="modal modal-blur fade" id="modal-repair" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">복원하기</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
         <label class="mt-3 form-label text-center">복원하시겠습니까?</label>
         <label class="mt-3 form-label text-center">복원하면 회원이 다시 로그인할 수 있습니다.</label>
      </div>
      <div class="modal-footer justify-content-center">
        <div class="btn-list">
          <a href="#" class="btn" data-bs-dismiss="modal">아니오</a>
          <a href="javascript:resetUser()" class="btn btn-primary">네</a>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="modal modal-blur fade" id="modal-confirm-repair" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-body">
        <label class="mt-3 form-label text-center">계정상태가 활성상태로 변경되었습니다.</label>
      </div>
      <div class="modal-footer justify-content-center">
        <div class="btn-list">
          <a href="#" class="btn me-auto" data-bs-dismiss="modal">닫기</a>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="modal modal-blur fade" id="modal-delete" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">삭제하기</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
         <label class="mt-3 form-label text-center">삭제하시겠습니까?</label>
      </div>
      <div class="modal-footer justify-content-center">
        <div class="btn-list">
          <a href="#" class="btn" data-bs-dismiss="modal">아니오</a>
          <a href="javascript:deleteUser()" class="btn btn-primary">네</a>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="modal modal-blur fade" id="modal-confirm-delete" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-body">
        <label class="mt-3 form-label text-center">삭제되었습니다.</label>
      </div>
      <div class="modal-footer justify-content-center">
        <div class="btn-list">
          <a href="<?php echo base_url()?>member/users" class="btn me-auto">닫기</a>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="modal modal-blur fade" id="modal-password" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">비밀번호 변경</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <label class="form-label">변경할 비밀번호를 입력하세요.</label>
        <input type="text" class="form-control mb-2" placeholder="비밀번호 입력">
        <input type="text" class="form-control" placeholder="비밀번호 재입력">
        <label class="error mt-2 fs-5">비밀번호가 일치하지 않습니다.</label>
      </div>
      <div class="modal-footer justify-content-center">
        <div class="btn-list">
          <a href="#" class="btn" data-bs-dismiss="modal">닫기</a>
          <a href="#" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal-save">저장</a>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="modal modal-blur fade" id="modal-confirm-save" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-body">
        <label class="mt-3 form-label text-center">저장하시겠습니까?</label>
      </div>
      <div class="modal-footer justify-content-center">
        <div class="btn-list">
          <a href="#" class="btn" data-bs-dismiss="modal">아니오</a>
          <a href="javascript:save()" class="btn btn-primary">네</a>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="modal modal-blur fade" id="modal-save" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-body">
        <label class="mt-3 form-label text-center">저장되었습니다.</label>
      </div>
      <div class="modal-footer justify-content-center">
        <div class="btn-list">
          <a href="javascript:void()" class="btn me-auto" data-bs-dismiss="modal">닫기</a>
        </div>
      </div>
    </div>
  </div>
</div>
<script src="<?php echo base_url();?>public/js/photogrid.js"></script>
<script>
   function changeAge(age){
    var txt1 = Math.floor(age/10);
    var txt = age%10;
    if(txt<4){
      txt = txt1+"0대 " + "초반"
    }
    else if(txt>3&& txt<7)
      txt = txt1+"0대 " + "중반"
    else
      txt = txt1+"0대 " + "후반"
      return txt
  }
  function changeAge1(age){
    var txt1 = Math.floor(age/10);
    var txt = age%10;
    if(txt<4){
      txt = txt1+"0cm " + "초반"
    }
    else if(txt>3&& txt<7)
      txt = txt1+"0cm " + "중반"
    else
      txt = txt1+"0cm " + "후반"
      return txt
  }
  $(document).ready(function(){
    
    if($("#age_st").val()){
      var favor_age = changeAge($("#age_st").val()) + " ~ " + changeAge($("#age_ed").val())
      $("#favor_age").val(favor_age)
    }
    if($("#ht_st").val()){
      var favor_ht = changeAge1($("#ht_st").val()) + " ~ " + changeAge1($("#ht_ed").val())
      $("#favor_ht").val(favor_ht)
    }
    


    var sido_id= "<?php echo $info->active_sido?>";
    var user_status= "<?php echo $info->user_status?>";
    document.getElementById("user_status").value=user_status;
    

    document.getElementById("active_sido").value=sido_id;
    document.getElementById("address_sido").value="<?php echo $info->address_sido?>";  
    setTimeout(function(){
      getAddressGugun();
      getAddressGugun1();
      setTimeout(function(){
        document.getElementById("address_gugun").value="<?php echo $info->address_gugun?>";  
        document.getElementById("active_gugun").value="<?php echo $info->active_gugun?>";   
      },200) 
    },200)  
     
      document.getElementById("badge1").value=<?php if(isset($badge->b_status1)) echo $badge->b_status1; else echo "0";?>;
      document.getElementById("badge2").value=<?php if(isset($badge->b_status2)) echo $badge->b_status2; else echo "0";?>;
      document.getElementById("badge3").value=<?php if(isset($badge->b_status3)) echo $badge->b_status3; else echo "0";?>;
      document.getElementById("badge4").value=<?php if(isset($badge->b_status4)) echo $badge->b_status4; else echo "0";?>;
      document.getElementById("badge5").value=<?php if(isset($badge->b_status5)) echo $badge->b_status5; else echo "0";?>;
      document.getElementById("badge6").value=<?php if(isset($badge->b_status6)) echo $badge->b_status6; else echo "0";?>;
      document.getElementById("badge7").value=<?php if(isset($badge->b_status7)) echo $badge->b_status7; else echo "0";?>;
      document.getElementById("badge8").value=<?php if(isset($badge->b_status8)) echo $badge->b_status8; else echo "0";?>;
      document.getElementById("badge9").value=<?php if(isset($badge->b_status9)) echo $badge->b_status9; else echo "0";?>;
      document.getElementById("badge10").value=<?php if(isset($badge->b_status10)) echo $badge->b_status10; else echo "0";?>;
      document.getElementById("badge11").value=<?php if(isset($badge->b_status11)) echo $badge->b_status11; else echo "0";?>;
      document.getElementById("badge12").value=<?php if(isset($badge->b_status12)) echo $badge->b_status12; else echo "0";?>;
      document.getElementById("badge13").value=<?php if(isset($badge->b_status13)) echo $badge->b_status13; else echo "0";?>;
      document.getElementById("badge14").value=<?php if(isset($badge->b_status14)) echo $badge->b_status14; else echo "0";?>;
      document.getElementById("badge15").value=<?php if(isset($badge->b_status15)) echo $badge->b_status15; else echo "0";?>;
      document.getElementById("badge16").value=<?php if(isset($badge->b_status16)) echo $badge->b_status16; else echo "0";?>;
      document.getElementById("badge17").value=<?php if(isset($badge->b_status17)) echo $badge->b_status17; else echo "0";?>;
      document.getElementById("badge18").value=<?php if(isset($badge->b_status18)) echo $badge->b_status18; else echo "0";?>;
      document.getElementById("badge19").value=<?php if(isset($badge->b_status19)) echo $badge->b_status19; else echo "0";?>;
  })
  var t = 1;
  var img = {}; 
  function changeType(idx) {
    t = idx ;
    $(".tab").addClass('d-none');
    $("#tab"+idx).removeClass('d-none');
    $(".nav-bordered .nav-item .nav-link").removeClass('active');
    $(".nav-bordered .nav-item:nth-child("+idx+") .nav-link").addClass('active');
  }
  function detail(id){
    window.open('<?php echo base_url()?>member/userDetail?id='+id, "_blank")
  }
  function save(){
    var cnt = 0; 
      for(var i=1;i<20; i++){
        if($("#badge"+i).val()=="1"){
          cnt++;
        }
      }

    if(t==1){
      $.ajax({
        method: "post",
        url: '<?php echo base_url()?>member/updateDate',
        data: {
          id: "<?php echo $info->uid?>",
          memo:$("#memo").val(),
          user_status:$("#user_status").val(),
          cnt:cnt
        },
        success: function(data) {
          $("#modal-confirm-save").modal("hide"); 
          $('#modal-save').modal({backdrop: 'static', keyboard: false}) 
          $("#modal-save").modal("show");
        }
      });
    }
    else if(t==2){
      $.ajax({
        method: "post",
        url: '<?php echo base_url()?>member/updateProfile',
        data: {
          id: "<?php echo $info->pid?>",
          admin_intro:$("#admin_intro").val(),
          admin_memo:$("#admin_memo").val(),
          
          address_sido:$("#address_sido").val(),
          address_gugun:$("#address_gugun").val(),
          active_sido:$("#active_sido").val(),
          active_gugun:$("#active_gugun").val(),
          cnt:cnt
        },
        success: function(data) {
          $("#modal-confirm-save").modal("hide"); 
          $('#modal-save').modal({backdrop: 'static', keyboard: false}) 
          $("#modal-save").modal("show");
        }
      });
    }
    else if(t==5){

      var id = "<?php if(isset($badge->id)) echo $badge->id; else echo "0";?>"

      if(id){
        $.ajax({
          method: "post",
          url: '<?php echo base_url()?>member/updateBadgeCert',
          data: {
            id: id,
            u_id: "<?php echo $info->uid?>",
            b_status1:$("#badge1").val(),
            b_status2:$("#badge2").val(),
            b_status3:$("#badge3").val(),
            b_status4:$("#badge4").val(),
            b_status5:$("#badge5").val(),
            b_status6:$("#badge6").val(),
            b_status7:$("#badge7").val(),
            b_status8:$("#badge8").val(),
            b_status9:$("#badge9").val(),
            b_status10:$("#badge10").val(),
            b_status11:$("#badge11").val(),
            b_status12:$("#badge12").val(),
            b_status13:$("#badge13").val(),
            b_status14:$("#badge14").val(),
            b_status15:$("#badge15").val(),
            b_status16:$("#badge16").val(),
            b_status17:$("#badge17").val(),
            b_status18:$("#badge18").val(),
            b_status19:$("#badge19").val(),
            cnt:cnt,
          },
          success: function(data) { 
            $("#modal-confirm-save").modal("hide"); 
            $('#modal-save').modal({backdrop: 'static', keyboard: false}) 
            $("#modal-save").modal("show");
          }
        });
      }else{
        // $("#modal-alert .txt").html("변경할 정보가 없습니다.");
        // $("#modal-alert").modal("show");
        return
      }
    }
    else{
      $("#modal-confirm-save").modal("hide"); 
      $('#modal-save').modal({backdrop: 'static', keyboard: false}) 
      $("#modal-save").modal("show");
    }
  }
  $("#img").change(function(e) { 
    var f = e.target.files[0];
    if (!f.type.match("image.*")) {
      $("#modal-alert .txt").html("이미지 확장자만 가능합니다");
      $("#modal-alert").modal("show");
      return;
    } 
    img = f;

    var reader = new FileReader();
    reader.onload = function(e) {

      let data = new FormData();
      data.append("id", <?php echo $info->pid?>);
      data.append("img", img);
      data.append("oldImg", "<?php echo $info->sel_profile?>");
      let xhr = new XMLHttpRequest();
      xhr.addEventListener("load", completeHandler, false);
      xhr.open("POST", "<?php echo base_url()?>member/addProfile");
      xhr.onload = function(e) {
        if (this.status == 200) { 
          
           // 등록된 이미지 
        }
      }
      xhr.send(data);
      // $(".img").css('background-image', 'url("'+e.target.result+'")');
      // 바로 등록하고 리로드추가하기
    }
    reader.readAsDataURL(f);
  });
  function completeHandler(event){ 
    var file = event.currentTarget.response;
    var html = '' ; 
    html += '<div class="col-2 ms-1">';
    html += '<a data-fslightbox="gallery2" href="<?php echo $this->config->item("img_url")?>'+file+'">'
    html += '<div class="img-responsive img-responsive-1x1 rounded-3 border " style="background-image: url(<?php echo $this->config->item("img_url")?>'+file+')"></div></a></div>'
    $(".img").append(html)
  }
  function getAddressGugun(){
    var sido = $("#active_sido").val();
    $.ajax({
      method: "post",
      url: '<?php echo base_url()?>member/getAddressGugun',
      data: {
        id: sido,
      },
      success: function(data) {
        var r_data = JSON.parse(data);
        $("#active_gugun").empty()
        var html =''
        for(var i = 0; i<r_data.length;i++){
          html += '<option value="'+r_data[i].id+'">'+r_data[i].name+'</option>'
        }
        $("#active_gugun").append(html)
      }
    }); 
  }
  function getAddressGugun1(){
    var sido = $("#address_sido").val();
    $.ajax({
      method: "post",
      url: '<?php echo base_url()?>member/getAddressGugun',
      data: {
        id: sido,
      },
      success: function(data) {
        var r_data = JSON.parse(data);
        $("#address_gugun").empty()
        var html =''
        for(var i = 0; i<r_data.length;i++){
          html += '<option value="'+r_data[i].id+'">'+r_data[i].name+'</option>'
        }
        $("#address_gugun").append(html)
      }
    }); 
  }
  function deleteUser(){
    $.ajax({
        method: "post",
        url: '<?php echo base_url()?>member/deleteUser',
        data: {
          id: "<?php echo $info->uid?>",
        },
        success: function(data) {
           console.log(data);
          $("#modal-delete").modal("hide");  
          $("#modal-confirm-delete").modal("show");
        }
      });
  }
  function resetUser(){
    $.ajax({
      method: "post",
      url: '<?php echo base_url()?>member/resetUser',
      data: {
        id: "<?php echo $info->uid?>",
      },
      success: function(data) {
        $("#modal-repair").modal("hide");  
        $("#modal-save").modal("show");
      }
    });
  }
  function goMdetail(id){
    window.open("<?php echo base_url()?>matching/matchingDetail?id="+id,"_blank")
  }
</script> 
<style type="text/css"> 
  .send-img {
    width: 100%;
    max-height: 50px;
    object-fit: contain;
  }
  .memo_line{ 
    display: inline-block;
    width: 350px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    line-height: 1.2;
    min-height: 2.6em;
    text-align: left;
    word-wrap: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 30;
    -webkit-box-orient: vertical;
  } 
</style>