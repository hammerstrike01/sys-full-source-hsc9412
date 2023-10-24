<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
    <meta http-equiv="X-UA-Compatible" content="ie=edge"/>

    <title><?php echo $this->config->item('title')?></title>
    <link href="<?php echo base_url();?>public/images/favicon.png" rel="icon"/>
    <link href="<?php echo base_url();?>public/css/tabler.min.css" rel="stylesheet"/>
    <link href="<?php echo base_url();?>public/css/custom.css" rel="stylesheet"/>

    <script src="<?php echo base_url();?>public/js/jquery.min.js"></script>
    <script src="<?php echo base_url();?>public/js/tabler.min.js"></script>
  </head>
  <body class="d-flex flex-column">
    <div class="page page-center">
      <div class="container container-tight py-4">
        <div class="text-center mb-4">
          <span class="navbar-brand navbar-brand-autodark"><img src="<?php echo base_url();?>public/images/logo.png" height="36" alt=""></span>
        </div>
        <div class="card card-md">
          <div class="card-body">
            <h1 class="h1 text-center mb-4">Login</h1>
            <form id="loginForm" method="post" autocomplete="off" novalidate>
              <div class="mb-3">
                <label class="form-label">아이디</label>
                <input type="email" id="m_id" name="m_id" class="form-control" placeholder="아이디 입력" autocomplete="off">
              </div>
              <div class="mb-2">
                <label class="form-label">비밀번호</label>
                <input type="password" id="m_pw" name="m_pw" class="form-control" placeholder="비밀번호 입력"  autocomplete="off">
              </div>
              <div class="form-footer">
                <button type="button" class="btn btn-primary w-100 mb-3" onclick="login()">로그인</button>
                <p class="error text-center display-none"></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <script>
      $('#m_id').keypress(function(e) {
        if (e.which == 13)
          login();
      });

      $('#m_pw').keypress(function(e) {
        if (e.which == 13)
          login();
      });

      function login() {
        var m_id = $("#m_id").val();
        var m_pw = $("#m_pw").val();

        $(".error").html("");
        $(".error").hide();

        if(m_id == "") {
          $(".error").html("아이디를 입력해주세요.");
          $(".error").show();
          return;
        }

        if(m_pw == "") {
          $(".error").html("비밀번호를 입력해주세요.");
          $(".error").show();
          return;
        }

        $.ajax({
            method: "post",
            url: '<?php echo base_url()?>login/checkLogin',
            data: {
              m_id: m_id,
              m_pw: m_pw
            },
            success: function(data) {
              if (data.trim() == 'success') {
                $("#loginForm").attr('action', '<?php echo base_url();?>login/dashboard');
                $("#loginForm").submit();
              }
              else {
                $(".error").html("아이디 또는 비밀번호가 일치하지 않습니다.");
                $(".error").show();
              }
            }
        });
      }
    </script>
  </body>
</html>