<?php include_once 'assets/includes/funciones.php';
if(isset($_SESSION['NombreAgent'], $_SESSION['UserAgent']) And 
        !empty($_SESSION['NombreAgent']) And !empty($_SESSION['UserAgent'])){
    switch ($_SESSION['tipoUser']){ case 1: header('Location: pubCondolencias.php'); break;
        case 2: header('Location: ManageTemplates.php'); break; case 0: header('Location: ListCondolencias.php'); break;
    }
}else{ ?>
<!DOCTYPE html>
<html lang=es>
<head>
<meta http-equiv=X-UA-Compatible content="IE=edge,chrome=1">
<meta name=viewport content="width=device-width, initial-scale=1.0">
<meta name=description content="Esquelas y Condolencias">
<meta name=author content="Sistemas AM">
<meta name=keyword content="Sistema, Esquelas, Condolencias">
<meta name=theme-color content="#2c2e49">
<title>.::Iniciar Sesion::.</title>
<meta charset="UTF-8">
<link href="assets/css/login.css" rel=stylesheet>
<link rel="shortcut icon" type="image/png" href="assets/img/favicon.ico">
</head>
<body class="disable-select">
    <div class="container">
        <div id="loginAnimate" class="card card-container animated fadeIn">
            <img id="profile-img" class="profile-img-card" src="assets/img/logoAM.png" />
            <p id="profile-name" class="profile-name-card"></p>
            <form id="frmAccess" name="lform" class="form-signin" method="POST" onsubmit="return false">
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon1"><i class="fas fa-users"></i></span>
                    </div>
                    <input type="text" id="luser" name="user" maxlength="12" class="form-control" placeholder="Usuario" required="required" autofocus autocomplete="off" aria-describedby="basic-addon1">
                </div>
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon2"><i class="fas fa-key"></i></span>
                    </div>
                    <input type="password" id="lpass" name="pass" maxlength="8" class="form-control" placeholder="Clave" required="required" autocomplete="off" aria-describedby="basic-addon2">
                </div>
                <div id="remember" class="checkbox">
                    <label>
                        <input id="lchkbox" type="checkbox" name="chkbox"> Recordarme
                    </label>
                </div>
                <button id="lsend" class="btn btn-lg btn-warning btn-block btn-signin" type="submit">Iniciar Sesión</button>
            </form><!-- /form -->
        </div><!-- /card-container -->
    </div><!-- /container -->
<div id=loadingAjax><img width=221 height=221 class=loadingAjx src="assets/img/loading/loading.gif"/></div>
<div id=notification class="animated fadeInDown">...</div>
<script async src="assets/js/ajaxJS.js" defer></script>
</body>
</html>
<?php } ?>