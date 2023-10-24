

<!-- Page header -->
<div class="page-header d-print-none">
  <div class="container-xl">
    <div class="row g-2 align-items-center">
      <div class="col">
        <h2 class="page-title">회원관리</h2>
      </div>
    </div>
  </div>
</div>
<!-- Page body -->

<div class="page-body">
  <div class="container-xl">
    <div class="row row-deck row-cards">
      <div class="col-12">
        <div id="tab1" class="tab card">
          <form name="fsearch" id="fsearch" method="get" action="<?php echo base_url()?>member/users" autocomplete="off">
            <input type="hidden" id="cur_page_num" name="cur_page_num" value="<?php echo $cur_page?>">
            <div class="card-header">
              <div class="w-100 d-md-flex align-items-center text-muted">
                <div class="d-sm-flex align-items-center">
                  <div class="d-flex align-items-center">
                    <span class="fs-4 fw-bold w-5">기간</span>
                  </div>
                  <div class="d-flex align-items-center ms-sm-2 flex1">
                    <div class="input-icon w150">
                      <input class="form-control" id="st_date" name="st_date" value="<?php echo $st_date;?>" autocomplete="off">
                      <span class="input-icon-addon">
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 5m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M16 3l0 4"></path><path d="M8 3l0 4"></path><path d="M4 11l16 0"></path><path d="M11 15l1 0"></path><path d="M12 15l0 3"></path></svg>
                      </span>
                    </div>
                    <span class="fs-2 ms-1">~</span>
                    <div class="input-icon w150 ms-1">
                      <input class="form-control" id="ed_date" name="ed_date" value="<?php echo $ed_date;?>" autocomplete="off">
                      <span class="input-icon-addon">
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 5m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M16 3l0 4"></path><path d="M8 3l0 4"></path><path d="M4 11l16 0"></path><path d="M11 15l1 0"></path><path d="M12 15l0 3"></path></svg>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="ms-md-2 flex1">
                  <input type="text" class="form-control w-50" name="search_info" id="search_info" placeholder="초대번호, 닉네임, 실명, 이메일, 휴대폰번호 입력" value="<?php echo $search_info;?>">
                </div>
              </div>
              <div class="w-100 mt-3 d-flex align-items-center text-muted">
                <span class="fs-4 fw-bold w-5">상태</span>
                <div>
                  <label class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="status" value="4" <?php if($status==4) echo "checked";?>>
                    <span class="form-check-label">전체</span>
                  </label>
                  <label class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="status" value="1" <?php if($status==1) echo "checked";?>>
                    <span class="form-check-label">활성</span>
                  </label>
                  <label class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="status" value="3" <?php if($status==3) echo "checked";?>>
                    <span class="form-check-label">탈퇴</span>
                  </label>
                  <label class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="status" value="2" <?php if($status==2) echo "checked";?>>
                    <span class="form-check-label">중단</span>
                  </label>
                </div>
              </div>
              <div class="w-100 d-flex justify-content-center mt-3">
                <div class="btn-list">
                  <a href="<?php echo base_url()?>member/users" class="btn btn-secondary">초기화</a>
                  <a href="javascript:search()" class="btn btn-primary">검색</a>
                </div>
              </div>
            </div>
            <div class="card-body border-bottom py-3">
              <div class="d-flex">
                <div class="text-muted">
                  Show
                  <div class="mx-2 d-inline-block">
                    <input type="text" disabled class="form-control form-control-sm"  value="<?php echo $records_per_page;?>" size="3" aria-label="Invoices count">
                  </div>
                  entries
                </div>
              </div>
            </div>
          </form>
          <div class="table-responsive">
            <table class="table card-table table-vcenter text-nowrap datatable">
              <thead>
                <tr>
                  <th class="w-5">no</th>
                  <th class="w-15">계정상태</th>
                  <th class="w-15">초대번호</th>
                  <th>닉네임</th>
                  <th class="w-15">실명</th>
                  <th class="w-15">휴대폰 번호</th>
                  <th class="w-15">성별</th>
                  <th class="w-15">만나이</th>
                  <th class="w-15">생년월일</th>
                  <th class="w-15">이메일</th>
                  <th class="w-15">생성일</th>
                </tr>
              </thead>
              <tbody>
                <?php 
                if(isset($list) && is_array($list)){
                  if(count($list) > 0) {
                    foreach ($list as $key=>$info):?>
                      <tr>
                        <td><?php echo $total_cnt - ($cur_page - 1) * (int)$records_per_page - $key?></td>
                        <td><?php if($info->user_status==1)echo "활성"; else if ($info->user_status==2)echo "중단"; else echo "탈퇴";?></td>
                        <td><?php echo $info->invite_code;?></td>
                        <td><a href="<?php echo base_url()?>member/userDetail?id=<?php echo $info->id;?>" class="fw-bold text-decoration-underline"><?php echo $info->nick_name;?></a></td>
                        <td><?php echo $info->user_name;?></td>
                        <td><?php echo preg_replace("/([0-9]{3})([0-9]{4})([0-9]{4})/", "$1-$2-$3", $info->phone); ;?></td>
                        <td><?php if($info->gender==1)echo "남성"; else echo "여성";?></td>
                        <td>
                          <?php 
                            $today       = date('Ymd');
                            $birthday = date('Ymd' , strtotime( $info->born));
                            $age     = floor(($today - $birthday) / 10000);
                            echo $age;
                          ?>세
                        </td>
                        <td><?php echo $info->born;?></td>
                        <td><a href="javascript:copyTxt('<?php echo $info->email;?>')"  class="fw-bold text-decoration-underline"><?php echo $info->email;?></a>
                          
                        </td> 
                        <td><?php echo substr($info->reg_date, 0, -3);?></td>
                      </tr>
                  <?php endforeach; } else { ?>
                    <tr><td colspan="6">데이터가 없습니다</td></tr>
                <?php } }?>
              </tbody>
            </table>
          </div>
          <?php $pagination->render($cur_page, $records_per_page, $total_cnt, $total_page_cnt, 0); ?>
        </div> 
      </div>
    </div>
  </div>
</div> 
<link href="<?php echo base_url();?>public/css/tabler-vendors.min.css" rel="stylesheet"/>
<script src="<?php echo base_url();?>public/js/litepicker.js"></script>
<script>
   
  document.addEventListener("DOMContentLoaded", function () {
    window.Litepicker && (new Litepicker({
      element: document.getElementById('st_date'),
      buttonText: {
        previousMonth: `<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 6l-6 6l6 6" /></svg>`,
        nextMonth: `<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l6 6l-6 6" /></svg>`,
      },
    }));
    window.Litepicker && (new Litepicker({
      element: document.getElementById('ed_date'),
      buttonText: {
        previousMonth: `<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 6l-6 6l6 6" /></svg>`,
        nextMonth: `<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l6 6l-6 6" /></svg>`,
      },
    }));
  });

  function changeType(idx) {
    $(".tab").addClass('d-none');
    $("#tab"+idx).removeClass('d-none');
    $(".nav-bordered .nav-item .nav-link").removeClass('active');
    $(".nav-bordered .nav-item:nth-child("+idx+") .nav-link").addClass('active');
  }
  function search() {
    $("#cur_page_num").val(1);
    $("#fsearch").submit();
  }
  $("#search_info").keyup(function(event) {
    if (event.keyCode === 13) {
      search()
    }
  });
  function copyTxt(text){
    // var copyText = document.getElementById("copy"+idx);
   // const myDiv = document.getElementById("copy"+idx);

    // button 클릭 이벤트
    document.getElementById("myButton").onclick = () => {
      // div의 내용(textContent)을 복사한다.
      window.navigator.clipboard.writeText(text).then(() => {
        // 복사가 완료되면 호출된다.
        alert("복사완료");
      });
    };
    
  }
</script>