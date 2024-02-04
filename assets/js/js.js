var resizables = document.querySelectorAll('.resizable'), objPpal = document.getElementById('workspace'), inis = {}, editar = '', 
    keys = {37: 1, 38: 1, 39: 1, 40: 1}, idTrg = null, moveBlock = true, datos = [], sndOra = true;

    function preventDefault(e) {
      e = e || window.event;
      if (e.preventDefault)
          e.preventDefault();
      e.returnValue = false;
    }
    
    function rgb2hex(rgb) {
        if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;
        
        rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        }
        return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    }

    function disableSelectingAll(){
     var allObjects = document.querySelectorAll("div.resizable");
      objPpal.style.userSelect = "none";
      objPpal.style.MozUserSelect = "none";
      objPpal.style.webkitUserSelect = "none";
      objPpal.style["-khtml-user-select"] = "none";
      objPpal.style["-ms-user-select"] = "none";
      objPpal.style["-o-user-select"] = "none";
      objPpal.onselectstart = function () { return false; };
      objPpal.setAttribute("unselectable", "on");
    
         for(f=0; f < allObjects.length; f++){
             var myOb = allObjects[f];
             myOb.style.userSelect = "none";
             myOb.style.MozUserSelect = "none";
             myOb.style.webkitUserSelect = "none";
             myOb.style["-khtml-user-select"] = "none";
             myOb.style["-moz-user-select"] = "-moz-none";
             myOb.style["-ms-user-select"] = "none";
             myOb.style["-o-user-select"] = "none";
             myOb.onselectstart = function () { return false; };
             myOb.setAttribute("unselectable", "on");
         }
    }

    function convertToEditable(esl){
        var myEdt = document.getElementById(esl);
        //document.querySelector('#' + esl).select();
        myEdt.style.userSelect = "";
        myEdt.style.MozUserSelect = "";
        myEdt.style.webkitUserSelect = "";
        myEdt.style["-khtml-user-select"] = "";
        myEdt.style["-moz-user-select"] = "";
        myEdt.style["-ms-user-select"] = "";
        myEdt.style["-o-user-select"] = "";
        myEdt.onselectstart = function () { return true; };
        myEdt.removeAttribute("unselectable");
        //myEdt.setAttribute("contentEditable", "true");
    }

    function disableScroll() {
        document.onkeydown  = preventDefaultForScrollKeys;
    }

    function disableAllScroll(){
        if (window.addEventListener) // older FF
          window.addEventListener('DOMMouseScroll', preventDefaultS, false);
          window.onwheel = preventDefaultS; // modern standard
          window.onmousewheel = document.onmousewheel = preventDefaultS; // older browsers, IE
          window.ontouchmove  = preventDefaultS; // mobile
          document.onkeydown  = preventDefaultForScrollKeys;      
    }

    function enableAllScroll(){
        if (window.removeEventListener)
            window.removeEventListener('DOMMouseScroll', preventDefault, false);
            window.onmousewheel = document.onmousewheel = null;
            window.onwheel = null; 
            window.ontouchmove = null;  
            document.onkeydown = null;
    }

    function enableScroll() {
        document.onkeydown = null;
    }

    function preventDefaultS(e) {
      e = e || window.event;
      if (e.preventDefault)
          e.preventDefault();
      e.returnValue = false;
    }
    
    function preventDefaultForScrollKeys(e) {
        if (keys[e.keyCode]) {
            preventDefault(e);
            return false;
        }
    }
    
    function truncateTo(n,d){
        var cad = n.toString();
        cad = cad.slice(0, (cad.indexOf(".")) + (d == 0 ? d : d+1));
        return Number(cad);
    }

    function pxToMm(j){
        //console.log('estoy recibiendo pixeles: ' , j);
        var v1 = j * 2.54, v2 = v1 / 96, v3 = v2 * 10;
        return Math.round(v3 * 100) / 100;
    }
    
    function unableTools(cls, idf){
        document.getElementById(idf).style.border = '';
        document.getElementById(idf).style.background = 'transparent';
        document.getElementById('fntColor').disabled = true;
        document.getElementById('lnHgt').disabled = true;
        document.getElementById('ltrSpc').disabled = true;
        document.getElementById("tmFont").value = "x";
        document.getElementById("fntStyle").value = "x";
        document.getElementById("fnAlign").value = "x";
        document.getElementById("fntBold").checked = false;
        document.getElementById("fntColor").value = "#000000";
        document.getElementById("lnHgt").value = 0;
        document.getElementById("ltrSpc").value = 0;

        document.getElementById('lblDms').innerHTML = '';
        var reszrs = document.getElementById(idf).getElementsByClassName("resizer");
          for(var f=0; f < reszrs.length; f++){
           reszrs[f].style.display = "none";
          }
        editar = ''; idTrg = null;
        document.getElementById('lblEdt').innerHTML = '';
        [].forEach.call(cls, function(slc){
            slc.disabled = true;
        });
        document.getElementById('lblPos').innerHTML = '';
        document.getElementsByClassName('gpdf')[0].removeAttribute('disabled');
        document.getElementById('fntBold').disabled = true;
        document.getElementById('contentSvd').disabled = true;
        document.getElementById('contentEdt').disabled = true;
    }

    function enableTools(cls, idf){
        document.getElementById('lblEdt').innerHTML = idf;
        document.getElementById('fntColor').disabled = false;
        document.getElementById('lnHgt').disabled = false;
        document.getElementById('ltrSpc').disabled = false;
        [].forEach.call(cls, function(slc){
            slc.disabled = false;
        });
        document.getElementsByClassName('gpdf')[0].disabled = true;
        document.getElementById('fntBold').disabled = false;
        document.getElementById('contentSvd').disabled = false;
        document.getElementById('contentEdt').disabled = false;
    }
    var selects = document.querySelectorAll('.controller');
    
    function mostrarPinResize(Elemn){
        var rszrs = document.getElementById(Elemn).getElementsByClassName("resizer");
         for(var q=0; q < rszrs.length; q++){
             rszrs[q].style.display = "block";
         }
    }
    
    function quitarBordesPin(Elmn){
        document.getElementById(Elmn).style.border = 'none';
        var hijos = document.getElementById(Elmn).children[0].children;
        [].forEach.call(hijos, function(nod){
            if(nod.classList.contains('resizer')){
                nod.style.display = 'none';
            }
        });
    }
    
    var redimen = function(er){
        if(editar !== '' && moveBlock){
            if(er.target.classList.contains("contentTXT") && editar != er.target.parentElement.parentNode.id){
               //dentro de contentTXT
               quitarBordesPin(editar);
            }else if(er.target.parentElement.classList.contains("contentTXT")){
               //damos click al contentTXT
               if(er.target.parentElement.parentElement.parentNode.id !== editar){
                   quitarBordesPin(editar);
               }
            }
        }
        editar = idTrg;
        if(idTrg != null){
            if(document.getElementById(idTrg)){
                if(!document.getElementById(idTrg).children[0].children[0].hasAttribute("contenteditable")){
                    enableTools(selects, editar);
                }
            }
        }
    };
       
       function selectableWS(el,vl){
            document.getElementById(el).style.userSelect = vl;
            document.getElementById(el).style.webkitUserSelect = vl;
            document.getElementById(el).style.MozUserSelect = vl;
        }
       
       function setClickRedimen(objt, action){
            [].forEach.call(objt, function(tii){
                var myElObj = tii.parentElement.id;
               if(action == 'agregar'){
                   tii.addEventListener('click', redimen, false);
                   selectableWS(myElObj,'');
               }else if(action == 'remover'){
                   tii.removeEventListener('click', redimen, false);
                   selectableWS(myElObj,'none');
               }

                //tii.addEventListener("mouseover", laFunc, false);
                //tii.addEventListener("mouseout", function(){
                    /*if(editar != ''){
                        if(myElObj != editar){
                            tii.parentElement.style.background = "transparent";
                            tii.style.border = ""; //siempre y cuando el elemento no haya sido clickeado
                            //tii.style.boxSizing = "";       
                        }
                    }else{
                        tii.parentElement.style.background = "transparent";
                        tii.style.border = ""; //siempre y cuando el elemento no haya sido clickeado
                        //tii.style.boxSizing = "";
                    }*/
            });
            //console.log('estamos editando el objeto: ', editar);
            if(editar !== ''){
                selectableWS(editar,'');
            }
       }

    function updPosGlbElm(idEl, spcWs){
        inis['workspace'][idEl].properties.ofsLft = (document.getElementById(idEl).offsetLeft - document.getElementById(spcWs).offsetLeft);
        inis['workspace'][idEl].properties.ofTop = (document.getElementById(idEl).offsetTop - document.getElementById(spcWs).offsetTop);
    }
    
    function fnObject(identifier, properties, withID){ //agregar elementos a un objeto
        if(withID) this.id = identifier;
        this.properties = properties;
    }
    
    function alternateGuia(url){
        document.getElementById("workspace").style.backgroundImage = url;
    }
    
    if(document.getElementById("actGuia")){
        document.getElementById("actGuia").addEventListener("change", function(et){
            et.preventDefault();
            var antValue = inis.workspace.propsGrls.background.replace("FONDO","GUIA"), nValue = antValue.split("/").slice(0,-1).join("/"),
                fileStr0 = antValue.split("/").pop(), extStr1 = fileStr0.split(".").pop().replace("jpg","png"),
                str = fileStr0.split(".")[0];
                str = str.replace(/Fondo([^Fondo]*)$/,'Guia' + '$1');
            var sendValue = "url('" + nValue.toString().replace("..","assets") + "/" + str + "." + extStr1 + "')",
                normalV = "url('" + inis.workspace.propsGrls.background + "')";
    //            console.log(sendValue,',',normalV);
            alternateGuia(this.checked ? (sendValue.replace("..","assets")) : (normalV.toString().replace("..","assets")));
        });
    }
    
    /******************************************Miniaturas Template****************************************/
    function deSelectMinis(){
        [].forEach.call(document.getElementsByClassName("posMini"), function (dv){
            dv.style.backgroundColor = '';
            dv.style.border = '';
        });
    }
    
    function selectOneMini(Smini){
        if(Smini){
            Smini.parentElement.style.backgroundColor = "#63b98c";
            Smini.parentElement.style.border = "rgb(140, 132, 132)";
            Smini.style.border = "rgb(140, 132, 132)";
            Smini.parentElement.scrollIntoView();
        }
    }
    /******************************************Miniaturas Template****************************************/
    
    function setPosAndValuesFromJSON(JObject){
        var psWS = document.getElementById('workspace').getBoundingClientRect(), sumScrollX = document.documentElement.scrollLeft || window.pageXOffset, sumScrollY = document.documentElement.scrollTop || window.pageYOffset;
        for(var i in JObject){
            for(var j in JObject[i]){
                if(j != 'propsGrls'){
                    //j es propiedad de ws
                    //console.log('key: ' + j, 'valor: ',emptyV[i][j]);
                    if(!JObject[i].hasOwnProperty("Oracion")){
                        delete inis.workspace.Oracion;
                        if(document.getElementById("Oracion")){
                            var oRac = document.getElementById("Oracion");
                            document.getElementById("workspace").removeChild(oRac);
                        }
                    }else{
                        if(!document.getElementById("Oracion")){
                            //se debe crear el elemento
                            var htmlData = '<div id="Oracion" class="resizable"><div class="resizers"><div class="contentTXT"></div><div class="resizer top-left"></div><div class="resizer top-right"></div><div class="resizer bottom-left"></div><div class="resizer bottom-right"></div></div></div></div>';
                            document.getElementById("workspace").innerHTML += htmlData.trim();
                            inis["workspace"]["Oracion"] = JObject.workspace.Oracion;
                            document.getElementById("Oracion").style.display = 'block';
                        }
                    }
                    
                    for(var k in JObject[i][j]){
                        //iteramos en las properties
                        for(var n in JObject[i][j][k]){
                            //console.log('viene de: '+j+' key:' + n,'valor:',emptyV[i][j][k][n]);
                            switch(n){
                                case "ofsLft":
                                    document.getElementById(j).style.left = psWS.left + JObject[i][j][k][n] + (sumScrollX) + "px";
                                    inis['workspace'][j]["properties"]["ofsLft"] = JObject[i][j][k][n];
                                    break;
                                case "ofTop":
                                    document.getElementById(j).style.top = psWS.top + JObject[i][j][k][n] + (sumScrollY) + "px";
                                    inis['workspace'][j]["properties"]["ofTop"] = JObject[i][j][k][n];
                                    break;
                                case "clW":
                                    document.getElementById(j).style.width = JObject[i][j][k][n];
                                    inis['workspace'][j]["properties"]["clW"] = JObject[i][j][k][n];
                                    break;
                                case "clH":
                                    document.getElementById(j).style.height = JObject[i][j][k][n];
                                    inis['workspace'][j]["properties"]["clH"] = JObject[i][j][k][n];
                                    break;
                                case "lineH":
                                    document.getElementById(j).style.lineHeight = JObject[i][j][k][n] + (JObject[i][j][k][n].indexOf("pt") !== -1 ? "" : "pt");
                                    inis['workspace'][j]["properties"]["lineH"] = JObject[i][j][k][n];
                                    break;
                                case "lettSpc":
                                    document.getElementById(j).style.letterSpacing = JObject[i][j][k][n] + (JObject[i][j][k][n].indexOf("pt") !== -1 ? "" : "pt");
                                    inis['workspace'][j]["properties"]["lettSpc"] = JObject[i][j][k][n];
                                    break;
                                case "fnBld":
                                    document.getElementById(j).style.fontWeight = JObject[i][j][k][n];
                                    inis['workspace'][j]["properties"]["fnBld"] = JObject[i][j][k][n];
                                    break;
                                case "txt":
                                    document.getElementById(j).children[0].children[0].innerHTML = JObject[i][j][k][n].trim();
                                    inis['workspace'][j]["properties"]["txt"] = JObject[i][j][k][n];
                                    break;
                                case "tFn":
                                    document.getElementById(j).style.fontSize = JObject[i][j][k][n];
                                    inis['workspace'][j]["properties"]["tFn"] = JObject[i][j][k][n];
                                    break;
                                case "sFn":
                                    document.getElementById(j).style.fontStyle = JObject[i][j][k][n];
                                    inis['workspace'][j]["properties"]["sFn"] = JObject[i][j][k][n];
                                    break;
                                case "fnCol":
                                    document.getElementById(j).style.color = JObject[i][j][k][n];
                                    inis['workspace'][j]["properties"]["fnCol"] = JObject[i][j][k][n];
                                    break;
                                case "alGn":
                                    document.getElementById(j).style.textAlign = JObject[i][j][k][n];
                                    inis['workspace'][j]["properties"]["alGn"] = JObject[i][j][k][n];
                                    break;
                                case "tpFuente":
                                    document.getElementById(j).style.fontFamily = JObject[i][j][k][n];
                                    inis['workspace'][j]["properties"]["tpFuente"] = JObject[i][j][k][n];
                                default:
                                    break;
                            }
                        }
                    }
                }else{
                    for(var u in JObject[i][j]){
                        inis['workspace'][j][u] = JObject[i][j][u];
                        if(u =='id'){
                            selectOneMini(document.getElementById(JObject[i][j][u]));
                        }
                    }
                }
            }
        }
    }
    /*******************************************Obtener Posiciones y Objetos*********************************************/
    var myPath = window.location.href, bckWs = '';
    /*var myBck = window.getComputedStyle(objPpal, null).getPropertyValue("background").split("\"")[1].split(myPath)[1];*/
    if(document.getElementById('fntColor')){
        document.getElementById('fntColor').value = "#000000"; //temporalmente se asigna este valor, posteriormente se traera de db;
        document.getElementById('ltrSpc').value = 0;
        document.getElementById('lnHgt').value = 0;
        //   alert(isIE());
    }
    bckWs = window.getComputedStyle(objPpal, null).getPropertyValue("background-image").split(myPath)[1] !== undefined ?  window.getComputedStyle(objPpal, null).getPropertyValue("background-image").split(myPath)[1].slice(0,this.length - 1).replace('"','') : '';
    //console.log(window.getComputedStyle(objPpal, null).getPropertyValue("background-image").split(myPath)[1].slice(0,this.length - 1).replace('"',''));
    inis['workspace'] = { "propsGrls" : { "ancho" : pxToMm(parseFloat(window.getComputedStyle(objPpal).width)), "alto" : pxToMm(parseFloat(window.getComputedStyle(objPpal).height)), "background" : bckWs } };
        as.consumerAjax('notification', 'assets/includes/getVInis.php','POST', true, [{}], true, false, true, function(lJson){
          setPosAndValuesFromJSON(JSON.parse(lJson));
        });
        for(var a = 0; a < resizables.length; a++){
            var mObject = resizables[a].getAttribute('id'), posWs = document.getElementById('workspace').getBoundingClientRect();
            //getValues mm
            /*switch(mObject){
                case "Mensaje":
                    resizables[a].style.left = posWs.left + mmToPx(34.4) + (sumScrollX) + "px";
                    resizables[a].style.top = posWs.top + mmToPx(168.8) + (sumScrollY) + "px";
                    break;
                case "QuienPaga":
                    resizables[a].style.left = posWs.left + mmToPx(40.48) + (sumScrollX) + "px";
                    resizables[a].style.top = posWs.top + mmToPx(205.85) + (sumScrollY) + "px";
                    //console.log("PosWlft: ",posWs.left," ,PosWTop: ",posWs.top," ,",mObject," X: ",mmToPx(53.45),", Y:",mmToPx(210.87));
                    break;
                case "Fallecido":
                    resizables[a].style.left = posWs.left + mmToPx(24.87) + (sumScrollX) + "px"; 
                    resizables[a].style.top = posWs.top + mmToPx(98.69) + (sumScrollY) + "px";
                    //console.log("PosWlft: ",posWs.left," ,PosWTop: ",posWs.top," ,",mObject," X: ",mmToPx(47.36),", Y:",mmToPx(103.98));
                    break;
                case "Oracion":
                    resizables[a].style.left = posWs.left + mmToPx(57.15) + (sumScrollX) + "px";
                    resizables[a].style.top = posWs.top + mmToPx(16.14) + (sumScrollY) + "px";
                    //console.log("PosWlft: ",posWs.left," ,PosWTop: ",posWs.top," ,",mObject," X: ",mmToPx(64.56),", Y:",mmToPx(9));
                    break;
                case "Fecha":
                    resizables[a].style.left = posWs.left + mmToPx(30.96) + (sumScrollX) + "px";
                    resizables[a].style.top = posWs.top + mmToPx(230.45) + (sumScrollY) + "px";
                    break;
                case "Condolencia":
                    resizables[a].style.left = posWs.left + mmToPx(17.73) + (sumScrollX) + "px";
                    resizables[a].style.top = posWs.top + mmToPx(34.66) + (sumScrollY) + "px";
                    break;
                default:
                    break;
            }*/
            
            var myLft = document.getElementById(mObject).offsetLeft - objPpal.offsetLeft,
                myTop = document.getElementById(mObject).offsetTop - objPpal.offsetTop, myWth = document.getElementById(mObject).clientWidth, myHth = document.getElementById(mObject).clientHeight,
                fntSz = window.getComputedStyle(document.getElementById(mObject), null).getPropertyValue('font-size'),
                tAlgn = window.getComputedStyle(document.getElementById(mObject), null).getPropertyValue('text-align'),
                myFnBld = window.getComputedStyle(document.getElementById(mObject), null).getPropertyValue('font-weight'),
                fntSt = window.getComputedStyle(document.getElementById(mObject), null).getPropertyValue('font-style');
                inis['workspace'][mObject] = new fnObject(mObject, {"txt": document.getElementById(mObject).childNodes[1].firstElementChild.innerHTML.trim(),
                                                       "tFn" : fntSz,
                                                       "tpFuente": "palatino",
                                                       "sFn" : fntSt,
                                                       "alGn": tAlgn,
                                                       "fnBld" : myFnBld}, false);
        }

    /*******************************************Obtener Posiciones y Objetos*********************************************/
//console.log(document.getElementById('Condolencia').childNodes[1].firstElementChild.innerHTML.trim());
//console.log(parseFloat(window.getComputedStyle(objPpal).width));
//console.log(JSON.stringify(inis));

window.onload = function(){
    /******************************************Variables Globales**************************************************/
    var pEspacio  = document.getElementById('workspace').getBoundingClientRect(), active = false;
    var objetos = document.querySelectorAll('.resizers:not(.resizer)');
    /******************************************Variables Globales**************************************************/

    /******************************************Funciones Simples***************************************************/
        Object.size = function(obj) { //obtener el tamaño de un objeto
          var size = 0, key;
          for (key in obj) {
              if (obj.hasOwnProperty(key)) size++;
          }
          return size;
        };
        
        //disableSelectingAll();
    
        function acomodalos(){ //acomodar los elementos despues de haberlos arrastrado al redimensionar ventana
          var size = Object.size(datos);
          if(size > 0){
            for(key in datos) {
              if(datos.hasOwnProperty(key)) {
                for(indx in datos[key]){
                  var value = datos[key][indx];
                  if(indx == 'dLeft'){
                    document.getElementById(key).style.left = ((pEspacio.left + 2) + value) + 'px';
                  }
                }
              }
            }
          }
        }
    /******************************************Funciones Simples***************************************************/
    
    /******************************************Handler Generate PDF************************************************/
    
    /******************************************Handlers Globales**************************************************/
    
    /*****************************************Crear Nueva Plantilla***********************************************/
    var nodes = document.querySelectorAll("#formNwTemplate input[type=text], #formNwTemplate select");
    
    function hideNwTemplate(trgt){
        var elPpal = document.getElementById(trgt), frmRst = elPpal.childNodes[1].querySelector('form').id,
            cntElement = elPpal.childNodes[1].id;
        //console.log(document.getElementById(trgt).childNodes[1].querySelector('form').id);
        var objForm = document.getElementById(cntElement);
        objForm.classList.remove("animated","fadeInDown");
        objForm.classList.add("animated","fadeOutUp");
        myCallback(function(){
            document.getElementById(trgt).classList.remove("animated", "fadeIn");
            document.getElementById(trgt).classList.add("animated", "fadeOut");
        }, 280).then(function(){
            document.getElementById(trgt).style.display = "none";
            objForm.classList.remove("animated","fadeOutUp");
            objForm.classList.add("animated","fadeInDown");
            document.getElementById(trgt).classList.add("animated", "fadeIn");
            document.getElementById(trgt).classList.remove("animated", "fadeOut");
        });
        //enableAllScroll();
        document.body.style.overflow = 'scroll';
        document.getElementById(frmRst).reset();
    }
    
    function showModal(objetivo){
        
       document.getElementById(objetivo).style.display = "block";
       document.getElementById(objetivo).childNodes[1].querySelector('form')[0].focus();
       //disableAllScroll();
       document.body.style.overflow = 'hidden';
    }
    
    function listener(ele, ind, evt){
        if((evt.which == 13 || evt.keyCode == 13)){
            if(nodes[ele].value.trim() != ''){
                if(nodes[ele].tagName == 'SELECT' && this.options[this.selectedIndex].value != 'X'){
                    if(nodes[ele + 1] !== undefined) nodes[ele + 1].focus();
                }else if(nodes[ele].tagName == 'INPUT'){
                    if(nodes[ele + 1] !== undefined) nodes[ele + 1].focus();
                }
            }
            evt.preventDefault();
            return false;
        }
    }
    
    for(i=0; i < nodes.length; i++){
        nodes[i].addEventListener("keydown", listener.bind(nodes[i], i, Event));
    }
    
    /******************************************Resizable**************************************************/
    function makeResizableDiv(div) {
        var resz = document.querySelectorAll(div + ' .resizer');
        
      [].forEach.call(resz, function(elm) {
        var idPadre = elm.parentElement.parentNode.id;
          //console.log(elm.parentElement.parentNode.id);
        elm.addEventListener('mousedown', function (e) {
            //console.log(idPadre);
          var objPadre = document.getElementById(idPadre), anchObjectR = pxToMm(objPadre.getBoundingClientRect().width), altObjectR = pxToMm(objPadre.getBoundingClientRect().height); objPpal = idPadre;
          puntoUsado = elm.className.split(" ").pop().toString();
          original_width = parseFloat(getComputedStyle(objPadre, null).getPropertyValue('width').replace('px', ''));
          document.getElementById(objPpal).style.background = "rgba(255,0,0,0.2)"; /*esto se quita por los eventos click y over*/
          original_height = parseFloat(getComputedStyle(objPadre, null).getPropertyValue('height').replace('px', ''));
          original_x = objPadre.getBoundingClientRect().left;
          original_y = objPadre.getBoundingClientRect().top;
          original_mouse_x = e.pageX;
          original_mouse_y = e.pageY;
            
          document.getElementById('lblDms').innerHTML = "W:" + anchObjectR + "mm|H:" + altObjectR + "mm";
          //var myJSON = JSON.parse(inis);
          //console.log(inis);
            
          window.addEventListener('mousemove', resize);
          window.addEventListener('mouseup', stopResize);
        });
      });
    }
    /******************************************Resizable**************************************************/
    
    function setTemplateByJSON(oJSON){
        as.consumerAjax("notification", oJSON, "POST", true, [{}], true, false, true, function(nJson){
            myCallback(function(){
                document.getElementById("workspace").classList.remove("animated","fadeIn");
                document.getElementById("workspace").classList.add("animated","fadeOut");
                document.getElementById("actGuia").checked = false;
                if(editar != null && editar != ''){
                    unableTools(document.querySelectorAll('.controller'), editar);
                }
            }, 180).then(function(){
                document.getElementById("workspace").style.backgroundImage = "url('" + nJson.workspace.propsGrls.background + "')";
                document.getElementById("workspace").style.width = nJson.workspace.propsGrls.ancho + "mm";
                document.getElementById("workspace").style.height = nJson.workspace.propsGrls.alto + "mm";
                document.getElementById("workspace").style.backgroundSize = nJson.workspace.propsGrls.ancho + "mm " + nJson.workspace.propsGrls.alto + "mm";
                setPosAndValuesFromJSON(nJson);
                document.getElementById("workspace").classList.remove("animated","fadeOut");
                document.getElementById("workspace").classList.add("animated","fadeIn");
                makeResizableDiv('.resizable');
                setHandlersWS();
            });
        });
    }
    
    if (!Element.prototype.matches) {
        Element.prototype.matches = 
        Element.prototype.matchesSelector || 
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector || 
        Element.prototype.oMatchesSelector || 
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;            
        };
    }
    
    function toggleDone(event){
        if (!event.target.matches('img')) return;
        setTemplateByJSON(event.target.getAttribute("alt"));
        deSelectMinis();
        selectOneMini(event.target);
    }
    
    function setEventClickMinis(){
      var minis = document.querySelector("#myTemplates");
      minis.addEventListener('click', toggleDone);
    }
    
    setEventClickMinis();
    
    document.getElementById("actOra").addEventListener("change", function(wf){
        wf.preventDefault();
        var elO = document.getElementById("orTemplate");
        elO.disabled = !this.checked;
        sndOra = !this.checked;
        if(this.checked){
            elO.value = "X";
        }
    });
    
    document.getElementById("sendNwTemplate").addEventListener("click", function(et){
        var myDats = document.getElementsByClassName("formInputs"), cadena = '', selOr = document.getElementById('orTemplate'),
            elNm = document.getElementById('nmTemplate'), elPg = document.getElementById('pgTemplate'), elMn = document.getElementById('mnTemplate'), 
            elFa = document.getElementById('fllTemplate'), laCon = document.getElementById('cndTemplate'), laFc = document.getElementById('fchTemplate'),
            elFon = document.getElementById('bgTemplate'),
            lGuia = document.getElementById('gaTemplate'),
            lsMed = document.getElementById('mdTemplate'), elTps = document.getElementById('tpTemplate'), swth = true;
            if(document.getElementById("actOra").checked && selOr.options[selOr.selectedIndex].value == 'X'){
                swth = false;
            }
        if(swth && elNm.value.trim() != '' && lsMed.options[lsMed.selectedIndex].value != 'X' && elPg.value.trim() != '' &&
            elMn.options[elMn.selectedIndex].value != 'X' && elFa.value.trim() != '' && laCon.value.trim() != '' && laFc.value.trim() != '' &&
            elFon.value != '' && lGuia.value != '' &&  elTps.options[elTps.selectedIndex].value != 'X'){
            
            var formElement = document.getElementById("formNwTemplate"), oData = new FormData(formElement);
            
            if(!document.getElementById("actOra").checked){
                //oData.delete('oracionTemp');
            }
                oData.append('MedText', lsMed.options[lsMed.selectedIndex].text);
                as.consumerAjax('notification', 'assets/includes/createNewTemplate.php','POST', true, oData, true, true, true, function(data){
                    if(data != 0){
                        var mJson = data;
                        //almacenar valores en el json
                        mJson.plantilla.nombre = elNm.value.trim().replace(" ","");
                        mJson.plantilla.tipoPlan = elTps.options[elTps.selectedIndex].innerHTML;
                        mJson.plantilla.paga = elPg.value.trim();
                        if(selOr.value != 'X'){
                            mJson.plantilla.oracion = selOr.options[selOr.selectedIndex].innerHTML;
                        }
                        
                        mJson.plantilla.mensaje = elMn.options[elMn.selectedIndex].innerHTML;
                        mJson.plantilla.fallecido = elFa.value.trim();
                        mJson.plantilla.condolencia = laCon.value.trim();
                        mJson.plantilla.fecha = laFc.value.trim();
                        mJson.plantilla.ancho = data.plantilla.ancho;
                        mJson.plantilla.alto = data.plantilla.alto;
                        //establecer valores de construccion del pdf
                        inis.workspace.propsGrls.ancho = data.plantilla.ancho;
                        inis.workspace.propsGrls.alto = data.plantilla.alto;
                        inis.workspace.propsGrls.id = mJson.plantilla.id;
                        inis.workspace.propsGrls.name = mJson.plantilla.nombre;
                        inis.workspace.propsGrls.tipo = mJson.plantilla.tipoPlan;
                        inis.workspace.QuienPaga.properties.txt = mJson.plantilla.paga;
                        if(selOr.options[selOr.selectedIndex].value != "X"){
                            if(!inis.workspace.Oracion){
                                inis["workspace"]["Oracion"] = {properties:{txt:mJson.plantilla.oracion, tpFuente:"palatino", fnCol: "#000000"}};
                            }else{
                                inis.workspace.Oracion.properties.txt = mJson.plantilla.oracion;
                            }
                            //console.log(inis);
                        }
                        inis.workspace.Fallecido.properties.txt = mJson.plantilla.fallecido;
                        inis.workspace.Mensaje.properties.txt = mJson.plantilla.mensaje;
                        inis.workspace.Fecha.properties.txt = mJson.plantilla.fecha;
                        inis.workspace.Condolencia.properties.txt = mJson.plantilla.condolencia;
                        inis.workspace.propsGrls.id = mJson.plantilla.id;
                        inis.workspace.propsGrls.background = mJson.plantilla.rutaFondo.replace("..","assets");
                        //establecer los valores a los contenedores
                        document.getElementById("workspace").style.backgroundImage = "url('" + mJson.plantilla.rutaGuia + "')";
                        document.getElementById("workspace").style.backgroundSize = mJson.plantilla.ancho + "mm " + mJson.plantilla.alto + "mm";
                        document.getElementById("workspace").style.width = mJson.plantilla.ancho + "mm";
                        document.getElementById("workspace").style.height = mJson.plantilla.alto + "mm";
                        document.getElementById("Condolencia").children[0].children[0].innerHTML = mJson.plantilla.condolencia;
                        document.getElementById("Fecha").children[0].children[0].innerHTML = mJson.plantilla.fecha;
                        document.getElementById("Mensaje").children[0].children[0].innerHTML = mJson.plantilla.mensaje;
                        document.getElementById("Fallecido").children[0].children[0].innerHTML = mJson.plantilla.fallecido;
                         
                       if(selOr.value != 'X' && document.getElementById("actOra").checked){
                           if(!document.getElementById("Oracion")){
                               var htmlDOracion = '<div id="Oracion" class="resizable"><div class="resizers"><div class="contentTXT"></div><div class="resizer top-left"></div><div class="resizer top-right"></div><div class="resizer bottom-left"></div><div class="resizer bottom-right"></div></div></div></div>';
                                document.getElementById("workspace").innerHTML += htmlDOracion.trim();
                           }
                           document.getElementById("Oracion").style.display = 'block';
                           document.getElementById("Oracion").children[0].children[0].innerHTML = mJson.plantilla.oracion;
                       }else{
                           if(document.getElementById("Oracion")){
                                document.getElementById("Oracion").children[0].children[0].innerHTML = "";
                                document.getElementById("Oracion").style.display = '';
                                delete inis["workspace"]["Oracion"];
                           }
                       }
                        document.getElementById("QuienPaga").children[0].children[0].innerHTML = mJson.plantilla.paga;
                        
                        mostrarNotificacion("Plantilla de " + mJson.plantilla.tipoPlan + " creada con exito!", 'notification', 'success');
                        //debemos cargar el nuevo template para su edicion
                        
                        hideNwTemplate("nwTemplate");
                        //console.log(mJson.plantilla.rutaFondo);
                        //console.log(JSON.stringify(inis));
                        setHandlersWS();
                        makeResizableDiv('.resizable');
                        
                        //cargarNwTemplate(elNm.value.trim(), elPg.value.trim());
                    }else{
                        mostrarNotificacion('Hubo un error al enviar los datos, intentalo nuevamente!!', 'notification', 'danger');
                    }
                });
        }else{
            mostrarNotificacion('Todos los campos son requeridos', 'notification', 'danger');
        }
    });
/******************************Control de Ventanas Modal*********************************************/    
    [].forEach.call(document.getElementsByClassName("cancelBtn"), function(v){
        v.addEventListener("click", function(ev){
            ev.preventDefault();
            hideNwTemplate(this.getAttribute("data-target"));
        });
    });
    
    [].forEach.call(document.getElementsByClassName("openModal"), function(g){
        g.addEventListener("click", function(eg){
           eg.preventDefault();
           showModal(this.getAttribute("data-target"));
        });
    });
/******************************Control de Ventanas Modal*********************************************/     
    /*document.getElementById("addTemplate").addEventListener("click", function(ev){
        ev.preventDefault();
        //objective element of functions document.getElementById(this.getAttribute("data-target")
        //console.log(document.getElementById(this.getAttribute("data-target")).childNodes[1].querySelector('form').id);
        //console.log(document.getElementById(this.getAttribute("data-target")).childNodes[1].id);
        showModal(this.getAttribute("data-target"));
    });*/
    
    /*****************************************Crear Nueva Plantilla***********************************************/
    window.addEventListener("resize", function(){
        for(var z in inis['workspace']){
            if(z != 'propsGrls'){
                document.getElementById(z).style.left = (document.getElementById('workspace').offsetLeft + inis['workspace'][z].properties.ofsLft) + (window.pageXOffset || document.documentElement.scrollLeft) + "px";
                document.getElementById(z).style.top = (document.getElementById('workspace').offsetTop + inis['workspace'][z].properties.ofTop) + (window.pageXOffset || document.documentElement.scrollLeft) + "px";   
            }
        }
        /*pEspacio = document.getElementById('workspace').getBoundingClientRect();
          if(idTrg != null){
            var coorFinales = document.getElementById('workspace').getBoundingClientRect();
              if(datos[idTrg] != undefined){
                if(datos[idTrg].hasOwnProperty('dLeft')){
                    datos[idTrg]['initialX'] = ((coorFinales.left + 2) + datos[idTrg]['dLeft']);
                  }   
              }
              acomodalos();
          }*/
    });
    
    var associateKeys = function(ez){
        if(moveBlock){
            
            if(ez.keyCode == 113){ //crear nueva plantilla
                showModal("nwTemplate");
            }
        
            if(document.getElementById('lblEdt').innerHTML != ''){
                pEspacio = document.getElementById('workspace').getBoundingClientRect();
                var myValor = document.getElementById('lblEdt').innerHTML, myElm = document.getElementById(myValor), coordsElm = myElm.getBoundingClientRect(), cLI= document.getElementById(myValor).getBoundingClientRect().left,
                    calcX = pxToMm(Number(myElm.offsetLeft - document.getElementById('workspace').offsetLeft)),
                    calcY = pxToMm(Number(myElm.offsetTop - document.getElementById('workspace').offsetTop)),
                    sclIzq = (document.documentElement.scrollLeft || window.pageXOffset);
                switch(ez.keyCode){
                    case 27:
                        /*si editar es diferente a nada entonces debemos deshabilitar los select y devolverlos a su estado original
                            asi como tambien ocultar las etiquetas de posicionamiento y edicion*/
                        document.getElementById(editar).children[0].children[0].removeAttribute("contenteditable");
                        document.getElementById(editar).children[0].children[0].display = '';
                //seleccionar el texto a editar
                        //deSeleccionarText(editar);
                        unableTools(document.querySelectorAll('.controller'), editar);
                        break;
                    case 39:
                        if(coordsElm.right <  pEspacio.right - 2){
                            myElm.style.left = (cLI + sclIzq + 1) + 'px';
                            updPosGlbElm(myValor, 'workspace');
                            document.getElementById('lblPos').innerHTML = "X:" + calcX + "mm|Y:" + calcY + "mm";
                        }
                        break;
                    case 37:
                        if(coordsElm.left >  pEspacio.left + 2){
                             myElm.style.left = ((cLI + sclIzq) - 1) + 'px';
                             updPosGlbElm(myValor, 'workspace');
                             document.getElementById('lblPos').innerHTML = "X:" + calcX + "mm|Y:" + calcY + "mm";
                        }
                        break;
                    case 40:
                        if(coordsElm.bottom < pEspacio.bottom - 2){
                            myElm.style.top = ((document.getElementById(myValor).getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop)) + 1) + 'px';
                            updPosGlbElm(myValor, 'workspace');
                            document.getElementById('lblPos').innerHTML = "X:" + calcX + "mm|Y:" + calcY + "mm";
                        }
                        break;
                    case 38:
                        if(coordsElm.top > pEspacio.top + 2){
                            myElm.style.top = ((document.getElementById(myValor).getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop)) - 1) + 'px';
                            updPosGlbElm(myValor, 'workspace');
                            document.getElementById('lblPos').innerHTML = "X:" + calcX + "mm|Y:" + calcY + "mm";
                        }
                        break;
                    default:
                        return true;
                        break;
                }
            }
        }else{
            return true;
        }
    };

    //window.document.addEventListener('keydown', associateKeys);
        var laFunc = function(ea){
                ea.target.parentElement.style.cursor = "move";
                /*if(editar != ''){
                    if(myElObj != editar){
                        tii.parentElement.style.background = "rgba(255,255,255,0.40)";
                        tii.parentElement.style.cursor = "move";
                        tii.style.border = "1px #4286f4 dotted";
                        //tii.style.boxSizing = "border-box";
                    }   
                }else{
                    tii.parentElement.style.background = "rgba(255,255,255,0.40)";
                    tii.parentElement.style.cursor = "move";
                    tii.style.border = "1px #4286f4 dotted";
                }*/
            };
       
       //setClickRedimen(objetos, 'agregar');
    /******************************************Handlers Globales**************************************************/
    
    /******************************************Handlers Tools**************************************************/
        document.getElementById('tmFont').addEventListener('change', function(ex){
            ex.preventDefault();
            var myId = document.getElementById('lblEdt').innerHTML;
            //alert(myId);
            document.getElementById(myId).style.fontSize = this.options[this.selectedIndex].value + 'pt';
            inis['workspace'][myId]['properties']['tFn'] = this.options[this.selectedIndex].value + 'pt';
        });
        
        function updLineHgt(valor){
            document.getElementById(editar).style.lineHeight = valor + 'pt';
            inis['workspace'][editar]['properties']['lineH'] = valor + 'pt';
        }
        
        function updLetterSpc(vlr){
            document.getElementById(editar).style.letterSpacing = vlr + 'pt';
            inis['workspace'][editar]['properties']['lettSpc'] = vlr + 'pt';
        }
    
        document.getElementById('lnHgt').addEventListener("change", function(ef){
            ef.preventDefault();
            updLineHgt(this.value);
        });
        
        document.getElementById('lnHgt').addEventListener("input", function(ef){
            ef.preventDefault();
            updLineHgt(this.value);
        });
        
        document.getElementById('ltrSpc').addEventListener("change", function(ef){
            ef.preventDefault();
            updLetterSpc(this.value);
        });
        
        document.getElementById('ltrSpc').addEventListener("input", function(ef){
            ef.preventDefault();
            updLetterSpc(this.value);
        });
    
        document.getElementById('fnAlign').addEventListener('change', function(ex){
            ex.preventDefault();
            document.getElementById(document.getElementById('lblEdt').innerHTML).style.textAlign = this.options[this.selectedIndex].value;
            inis['workspace'][editar]['properties']['alGn'] = this.options[this.selectedIndex].value;
        });
    
        document.getElementById('fntStyle').addEventListener('change', function(ex){
            ex.preventDefault();
            document.getElementById(document.getElementById('lblEdt').innerHTML).style.fontStyle = this.options[this.selectedIndex].value;
            inis['workspace'][editar]['properties']['sFn'] = this.options[this.selectedIndex].value;
        });
        
        document.getElementById('fntBold').addEventListener('change', function(ew){
            ew.preventDefault();
            document.getElementById(document.getElementById('lblEdt').innerHTML).style.fontWeight = this.checked ? 'bold' : 'normal';
            inis['workspace'][editar]['properties']['fnBld'] = this.checked ? 'bold' : 'normal';
        });
    
        document.getElementById('fntColor').addEventListener("change", function(er){
            er.preventDefault();
            if(editar != ''){
                document.getElementById(editar).style.color = this.value;
                inis['workspace'][editar]['properties']['fnCol'] = this.value;
            }
        });
    
        /******************************************Handler Generate PDF************************************************/
    
        /*******************************************seleccionar texto a editar*********************************************/
        function seleccionarText(obid){
            deSeleccionarText();
            if(document.selection){
                var range = document.body.createTextRange();
                range.moveToElementText(document.getElementById(obid));
                range.select();
            }else if(window.getSelection){
                var range = document.createRange();
                range.selectNode(document.getElementById(obid));
                window.getSelection().addRange(range);
            }
        }
    
        function deSeleccionarText(){
            if(document.selection){
                document.selection.empty();
            }else if(window.getSelection){
                window.getSelection().removeAllRanges();
            }
        }
    
        function deshabilitaDragger(obij){
            //window.removeEventListener('mousemove', resize);
            document.getElementById('workspace').removeEventListener("mousemove", drag, false);
            document.getElementById(obij).removeEventListener("mousedown", dragStart);
            window.document.removeEventListener("mouseup", dragEnd);
            //document.getElementById(editar).removeEventListener("mouseover", laFunc, false);
            //document.getElementById(editar).removeEventListener('click', redimen, false);
            //window.document.removeEventListener('keydown', associateKeys);
            selectableWS(obij,'');
            //console.log('se deshabilita dragger: ', obij);
            setClickRedimen(document.querySelectorAll('.resizers:not(.resizer)'),'remover');
            moveBlock = false;
        }

        var original_width = 0, original_height = 0, original_x = 0, original_y = 0, original_mouse_x = 0;
        var original_mouse_y = 0, objPpal = '', puntoUsado = '', altAnt = 0, topAnt = 0, leftAnt = 0;
    
        function stopResize() {
          document.getElementById(objPpal).style.background = "transparent";
          window.removeEventListener('mousemove', resize);
        }

        function resize(e) {
          var myObj = document.getElementById(objPpal), pObjA = myObj.getBoundingClientRect(), dFLeft = myObj.offsetLeft, dFTop = myObj.offsetTop, anchObjectR = pxToMm(myObj.getBoundingClientRect().width), altObjectR = pxToMm(myObj.getBoundingClientRect().height);
          var eTrabajo = document.getElementById('workspace'), dRectWs = eTrabajo.getBoundingClientRect(), wsOL = eTrabajo.offsetLeft, wsOT = eTrabajo.offsetTop, nPsX = pxToMm(myObj.offsetLeft - eTrabajo.offsetLeft), nPsY = pxToMm(myObj.offsetTop - eTrabajo.offsetTop);
          var difObjs = dFLeft - wsOL, mWLet = dRectWs.width - difObjs, difObjsH = dFTop - wsOT, mHLet = dRectWs.height - difObjsH,
              mLfLet = dRectWs.left + 2, difObjsR = (dRectWs.right - pObjA.right), nAnch = (original_width + (e.pageX - original_mouse_x)), nWidth = original_width - (e.pageX - original_mouse_x), 
              nHeight = original_height - (e.pageY - original_mouse_y), nAlt = (original_height + (e.pageY - original_mouse_y)), 
              nLeft = original_x + (e.pageX - original_mouse_x), nTop =  original_y + (e.pageY - original_mouse_y), minW = 50, minH = 30, myNWth = (((nAnch) > (mWLet)) ? (mWLet - 2) : (nAnch)), myNHth = (((nAlt) > (mHLet)) ? (mHLet - 2) : (nAlt));
          if(puntoUsado == 'bottom-right'){
              myObj.style.width = (myNWth < minW ? minW : myNWth) + 'px';
              myObj.style.height = (myNHth < minH ? minH : myNHth) + 'px';
              inis['workspace'][objPpal]['properties']['clW'] = myObj.style.width;
              inis['workspace'][objPpal]['properties']['clH'] = myObj.style.height;
          }else if(puntoUsado == 'bottom-left'){
              myObj.style.width =  (nLeft <= mLfLet ? myObj.style.width : (nWidth <= minW ? myObj.style.width : nWidth)) + 'px';
              myObj.style.height = (myNHth < minH ? minH : myNHth) + 'px';
              myObj.style.left = (nLeft <= mLfLet ? mLfLet : (nWidth <= minW ? myObj.style.left : nLeft)) + 'px';
              inis['workspace'][objPpal]['properties']['clW'] = myObj.style.width;
              inis['workspace'][objPpal]['properties']['clH'] = myObj.style.height;
              inis['workspace'][objPpal]['properties']['ofsLft'] = (myObj.offsetLeft - document.getElementById('workspace').offsetLeft);
          }else if(puntoUsado == 'top-right'){
              altAnt = myObj.style.height; topAnt = myObj.style.top;
              myObj.style.width = (myNWth < minW ? minW : myNWth) + 'px';
              myObj.style.height = nTop <= dRectWs.top + 2 ? altAnt : (nHeight < minH ? minH : nHeight) + 'px';
              myObj.style.top = (nTop <= dRectWs.top + 2 ? dRectWs.top + 2 : (myObj.style.height == altAnt ? topAnt  : nTop)) + 'px';
              inis['workspace'][objPpal]['properties']['clW'] = myObj.style.width;
              inis['workspace'][objPpal]['properties']['clH'] = myObj.style.height;
              inis['workspace'][objPpal]['properties']['ofTop'] = (myObj.offsetTop - document.getElementById('workspace').offsetTop);
          }else if(puntoUsado == 'top-left'){
              altAnt = myObj.style.height; topAnt = myObj.style.top;
              myObj.style.width = (nLeft <= mLfLet ? myObj.style.width : (nWidth <= minW ? myObj.style.width : nWidth)) + 'px';
              myObj.style.left = (nLeft <= mLfLet ? mLfLet : (nWidth <= minW ? myObj.style.left : nLeft)) + 'px';
              myObj.style.height = nTop <= dRectWs.top + 2 ? altAnt : (nHeight < minH ? minH : nHeight) + 'px';
              myObj.style.top = nTop <= dRectWs.top + 2 ? dRectWs.top + 2 : (myObj.style.height == altAnt ? topAnt : (nTop)) + 'px';
              inis['workspace'][objPpal]['properties']['clW'] = myObj.style.width;
              inis['workspace'][objPpal]['properties']['clH'] = myObj.style.height;
              inis['workspace'][objPpal]['properties']['ofsLft'] = (myObj.offsetLeft - document.getElementById('workspace').offsetLeft);
              inis['workspace'][objPpal]['properties']['ofTop'] = (myObj.offsetTop - document.getElementById('workspace').offsetTop);
          }
            document.getElementById('lblPos').innerHTML = "X:" + nPsX + "mm|Y:" + nPsY + "mm";
            document.getElementById('lblDms').innerHTML = "W:" + anchObjectR + "mm|H:" + altObjectR + "mm";
        }
    
        function rehabilitaDragger(obis){
            //document.getElementById(obis).addEventListener("mousedown", dragStart);
            //window.document.addEventListener("mouseup", dragEnd);
            //document.getElementById('workspace').removeEventListener("mousemove", drag, false);
            //console.log('se rehabilita dragger: ', obis);
            moveBlock = true;
            setHandlersWS();
            selectableWS(obis,'none');
            //window.document.addEventListener('keydown', associateKeys);
        }
    /*******************************************seleccionar texto a editar*********************************************/
        document.getElementById('contentPDF').addEventListener("click", function(ea){
            ea.preventDefault();
            var myData = JSON.stringify(inis), data = { "djson" : myData }, dats = {"tdesign" : inis.workspace.propsGrls.tipo};
            
          as.consumerAjax('notification', 'assets/includes/generatePDF.php','POST', true, data, false, false, true, function(data){
              var pathActual = window.location.href.split("/").pop();
              myCallback(function(){
                openNewTab(data);
              }, 780).then(function(){
                 as.consumerAjax('notification', 'assets/includes/getMiniaturas.php','POST', true, dats, false, false, true, function(data){
                    document.getElementById("myTemplates").innerHTML = data.trim();
                    var imagenes = document.querySelectorAll("#myTemplates.posMini > img");
                    
                    [].forEach.call(imagenes, function(nimg){
                        var antSrc = nimg.src.split("?")[0].trim();
                        nimg.src = antSrc + "?ni=" + new Date().now().toString();
                    });
                    selectOneMini(document.getElementById(inis.workspace.propsGrls.id));
                  });
              });
              /*document.getElementById("workspace").style.backgroundImage = inis.workspace.propsGrls.background;
              document.getElementById("workspace").style.backgroundSize = inis.workspace.propsGrls.ancho + "mm " + inis.workspace.propsGrls.alto + "mm";
              document.getElementById("workspace").style.width = inis.workspace.propsGrls.ancho + "mm";
              document.getElementById("workspace").style.height = inis.workspace.propsGrls.alto + "mm";*/
          });
        });
    
        document.getElementById('contentEdt').addEventListener('click', function(et){
            et.preventDefault();
            document.getElementById(editar).style.cursor = "";
            document.getElementById("contentSvd").disabled = true;
            document.getElementById(editar).children[0].children[0].setAttribute("contenteditable","true");
            if(isIE()){
                //console.log('array ppal' + inis);
                document.execCommand("DefaultParagraphSeparator", false, "div");
                document.getElementById(editar).children[0].children[0].style.wordWrap = "break-word";
            }else{
//                alert('revisalo');
                document.execCommand("defaultparagraphseparator", false, "br");
                //document.getElementById(editar).children[0].children[0].style.whiteSpace = "pre-wrap";
            }
            document.getElementById(editar).children[0].children[0].style.display = 'inline-block';
            //seleccionar el texto a editar
            seleccionarText(editar);
            //necesitamos deshabilitar los elementos del dragger
            /*convertToEditable(editar);
            convertToEditable("workspace");*/
            deshabilitaDragger(editar);
            
            if(this.classList.contains("editObj")){
                this.classList.remove("editObj");
                this.classList.add("refreshObj");
                
            }else if(this.classList.contains("refreshObj")){
                this.classList.remove("refreshObj");
                this.classList.add("editObj");
               //disableSelectingAll();
               document.getElementById("contentSvd").disabled = false;
                document.getElementById(editar).style.cursor = "move";
                document.getElementById(editar).children[0].children[0].removeAttribute("contenteditable");
                document.getElementById(editar).children[0].children[0].style.display = '';
                //aqui debemos reactivar los eventos y deseleccionar el texto
                inis["workspace"][editar]["properties"]["txt"] = document.getElementById(editar).children[0].children[0].innerHTML.trim();
                deSeleccionarText();
                rehabilitaDragger(editar);
            }
        });

        document.getElementById('contentSvd').addEventListener('click', function(ef){
           ef.preventDefault();
            //console.log(JSON.stringify(inis));
            unableTools(document.querySelectorAll('.controller'), editar);
        });
    /******************************************Handlers Tools**************************************************/
    
   /******************************************Draggable**************************************************/
        function dragStart(e) {
          if(e.type === "mousedown" && !(e.target.classList.contains("resizer")) && !(e.target.hasAttribute("contenteditable"))){
                idTrg = e.target.classList.contains("resizers") ? e.target.parentElement.id : (e.target.parentElement.classList.contains("contentTXT") ? e.target.parentElement.parentElement.parentElement.id : e.target.parentElement.parentNode.id);
              if(idTrg != "" && moveBlock){
                var myObject = document.getElementById(idTrg), anchObject = pxToMm(myObject.getBoundingClientRect().width), altObject = pxToMm(myObject.getBoundingClientRect().height);

                var miPos = myObject.getBoundingClientRect(), myDifXIn = pxToMm(myObject.offsetLeft - document.getElementById('workspace').offsetLeft), myDifYIn = pxToMm(myObject.offsetTop - document.getElementById('workspace').offsetTop);
                myObject.style.background = "rgba(255,0,0,0.2)";
                myObject.style.border = "1px #4286f4 dotted";
                
                myObject.classList.add("all-scroll");
                  if(datos[idTrg]['initialX'] != undefined){
                    datos[idTrg]['initialX'] = e.clientX + window.pageXOffset - myObject.offsetLeft;
                  }
                  if(datos[idTrg]['initialY'] != undefined){
                    datos[idTrg]['initialY'] = e.clientY + window.pageYOffset - myObject.offsetTop;   
                  }
                document.getElementById('lblEdt').innerHTML = idTrg;
                document.getElementById('lblPos').innerHTML = "X:" + (myDifXIn <= 0 ? 0 : myDifXIn) + "mm|Y:" + (myDifYIn <= 0 ? 0 : myDifYIn) + "mm";
                document.getElementsByClassName('gpdf')[0].setAttribute('disabled', 'disabled');
                document.getElementById('lblDms').innerHTML = "W:" + anchObject + "mm|H:" + altObject + "mm";
              active = true;
            }
          }
        }

        function dragEnd(e) {
          if(idTrg != null && active && moveBlock && !(e.target.hasAttribute("contenteditable"))){
//              console.log('drag finalizado, objetivo: ', e.target);
              //JALAR LOS VALORES PARA CADA ELEMENTO
              if(e.target.parentElement.classList.contains("contentTXT")){
                document.getElementById("tmFont").value = e.target.parentElement.parentNode.parentElement.style.fontSize.split("pt")[0];
                document.getElementById("fntStyle").value = e.target.parentElement.parentNode.parentElement.style.fontStyle;
                document.getElementById("fnAlign").value = e.target.parentElement.parentNode.parentElement.style.textAlign;
                document.getElementById("fntBold").checked = e.target.parentElement.parentNode.parentElement.style.fontWeight === 'bold' ? true : false;
                document.getElementById("fntColor").value = rgb2hex(e.target.parentElement.parentNode.parentElement.style.color);
                document.getElementById("lnHgt").value = e.target.parentElement.parentNode.parentElement.style.lineHeight.split("pt")[0];
                document.getElementById("ltrSpc").value = e.target.parentElement.parentNode.parentElement.style.letterSpacing.split("pt")[0];  
              }else{
                document.getElementById("tmFont").value = e.target.parentNode.parentElement.style.fontSize.split("pt")[0];
                document.getElementById("fntStyle").value = e.target.parentNode.parentElement.style.fontStyle;
                document.getElementById("fnAlign").value = e.target.parentNode.parentElement.style.textAlign;
                document.getElementById("fntBold").checked = e.target.parentNode.parentElement.style.fontWeight === 'bold' ? true : false;
                document.getElementById("fntColor").value = rgb2hex(e.target.parentNode.parentElement.style.color);
                document.getElementById("lnHgt").value = e.target.parentNode.parentElement.style.lineHeight.split("pt")[0];
                document.getElementById("ltrSpc").value = e.target.parentNode.parentElement.style.letterSpacing.split("pt")[0];
              }
              
            datos[idTrg]['initialX'] = datos[idTrg]['currentX'];
            datos[idTrg]['initialY'] = datos[idTrg]['currentY'];
            updPosGlbElm(idTrg, 'workspace');
            document.getElementById(idTrg).style.background = "transparent";
            document.getElementById(idTrg).classList.remove("all-scroll");
            mostrarPinResize(idTrg);
            datos[idTrg]['dLeft'] = (document.getElementById(idTrg).offsetLeft - document.getElementById('workspace').offsetLeft);
            active = false;
          }
        }

        function drag(e) {
          e.preventDefault();
          if (active) {
            if(idTrg != null && moveBlock && !(e.target.hasAttribute("contenteditable"))){
              if (e.type === "mousemove" && !(e.target.classList.contains("resizer"))) {
//                  console.log('drag en proceso, objetivo: ', e.target);
                  //console.log(e.target.classList);
                //datos[idTrg]['currentX'] = (e.clientX - (document.getElementById(idTrg).getBoundingClientRect().width / 2));
                //datos[idTrg]['currentY'] = (e.clientY - (document.getElementById(idTrg).getBoundingClientRect().height / 2) + window.pageYOffset);
                datos[idTrg]['currentX'] = e.clientX - datos[idTrg]['initialX'];
                datos[idTrg]['currentY'] = e.clientY - datos[idTrg]['initialY'];

                datos[idTrg]['xOffset'] = Number(datos[idTrg]['currentX']);
                datos[idTrg]['yOffset'] = Number(datos[idTrg]['currentY']);

                setTranslate(Number(datos[idTrg]['currentX']), Number(datos[idTrg]['currentY']), document.getElementById(idTrg));
              }
            }
          }
        }

        function setTranslate(xPos, yPos, el) {
          if (xPos > document.getElementById('workspace').getBoundingClientRect().left + 2 && xPos < (document.getElementById('workspace').getBoundingClientRect().right - 2) - el.getBoundingClientRect().width) {
            el.style.left = xPos + "px";
          }

          if (yPos > document.getElementById('workspace').getBoundingClientRect().top + 1 && yPos < (document.getElementById('workspace').getBoundingClientRect().bottom - 2) - el.getBoundingClientRect().height) {
            el.style.top = yPos + (document.documentElement.scrollTop || window.pageYOffset) + "px";
          }
            var myDifX = pxToMm(el.offsetLeft - document.getElementById('workspace').offsetLeft), myDifY = pxToMm(el.offsetTop - document.getElementById('workspace').offsetTop), anchObjectM = pxToMm(el.getBoundingClientRect().width), altObjectM = pxToMm(el.getBoundingClientRect().height);
            
            document.getElementById('lblPos').innerHTML = "X:" + (myDifX <= 0 ? 0 : myDifX) + "mm|Y:" + (myDifY <= 0 ? 0 : myDifY) + "mm";
            
            document.getElementById('lblDms').innerHTML = "W:" + anchObjectM + "mm|H:" + altObjectM + "mm";
        }
    
    function setHandlersWS(){
        var objes = document.querySelectorAll('.resizers:not(.resizer)');
        window.document.addEventListener("mouseup", dragEnd);
        document.getElementById('workspace').addEventListener("mousemove", drag, false);

        var dragItem = document.querySelectorAll("div.resizable");
        for(w = 0; w < dragItem.length; w++){
          var acEl = dragItem[w];
          
          var coords = acEl.getBoundingClientRect();
        
          datos[acEl.id] = {'currentX': 0,'currentY': 0, 'initialX': 0, 'initialY': 0, 'xOffset': coords.left, 'yOffset': coords.top};

          document.getElementById(acEl.id).addEventListener("mousedown", dragStart);
          document.getElementById(acEl.id).style.cursor = "move";
        }
        setClickRedimen(objes, 'agregar');
    }
    setHandlersWS();
    /******************************************Draggable**************************************************/
        makeResizableDiv('.resizable');
}