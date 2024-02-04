<?php include_once 'funciones.php';
if(isset($_POST['user'], $_POST['pass']) and !empty($_POST['user']) and !empty($_POST['pass'])){
    $stmt = SqlSrv::getInstance()->stored_proc("sp_vucye", [strval($_POST['user']), strval($_POST['pass'])]);
    $info = $stmt->fetchAll(PDO::FETCH_OBJ);
    if(count($info) > 0){
        //'Agente' => $info[0]->Nombre, 'Usuario' => $_POST['user'],'Correo' => $info[0]->Correo, 'Depto' => $info[0]->Departamento,
        $dataJSON = ['tp' => $info[0]->Tipo];
        $_SESSION['NombreAgent'] = $info[0]->Nombre;
        $_SESSION['UserAgent'] = $_POST['user'];
        $_SESSION['CorreoAgent'] = $info[0]->Correo;
        $_SESSION['CCostos'] = $info[0]->Departamento;
        $_SESSION['tipoUser'] = $info[0]->Tipo;
        //insertar el inicio de sesion
        $insLog = CRUD::stored_procedure(false, 'sp_GenLog', 3, 'sis', [strval($_SESSION['UserAgent']), 1,'']);
        header('Content-Type: application/json');
        echo json_encode($dataJSON);
    }else{
        echo '0';
    }
}