Element.prototype.appendAfter = function(element){
    element.parentNode.insertBefore(this, element.nextSibling);
}, false;

var elPpal = document.getElementById("slPlan"), trjPpal = document.getElementById("cdPpal"), xJson = {}, objSels = {},
        trjDatos = document.getElementById("sgPart");

[].forEach.call(document.querySelectorAll("#slPlan"), function(oM){
    oM.addEventListener('click', function(e){
        e.preventDefault();
        //console.log(e.target);
        if(e.target.tagName === 'IMG' || e.target.classList.contains("posMini")){
            objSels["templateJ"] = e.target.tagName === 'IMG' ? e.target.getAttribute("alt") : e.target.childNodes[4].getAttribute("alt"); 
            //setear a todos los elementos en color transparente
            var allMinis = document.querySelectorAll(".posMini");
            for(var i=0; i < allMinis.length; i++){
                allMinis[i].style.backgroundColor = '';
                allMinis[i].style.color = '';
            }
            (e.target.tagName === 'IMG') ? (e.target.parentElement.style.backgroundColor = 'blue', e.target.parentElement.style.color = 'white') : (e.target.style.backgroundColor = 'blue', e.target.style.color = 'white');
            //alert("has dado click en la plantilla: " + e.target.getAttribute("alt"));
            
            as.consumerAjax("notification", objSels.templateJ, "POST", true, [{}], false, false, false, function(data){
                xJson = JSON.parse(data);
            });

            if(!document.getElementById("btnNextSl")){
                var nwElement = document.createElement("div");
                nwElement.id = 'btnNextSl';
                nwElement.classList.add("btnNext", "animated", "fadeIn");
                nwElement.appendAfter(elPpal);
                var twElement = document.createElement("button");
                twElement.setAttribute("id","btnN");
                twElement.innerHTML = '<em>Siguiente</em>';
                nwElement.appendChild(twElement);
                twElement.addEventListener("click", function(eu){
                    eu.preventDefault();
                    myCallback(function(){
                        var spnBFll = document.getElementById('spnFll'), tF = xJson.workspace.Fallecido.properties.tFn.toString().split('px')[0],
                           ptsFll = PxToPt(parseFloat(tF));
                        spnBFll.setAttribute('readonly','true');
                        spnBFll.setAttribute('step','1');
                        spnBFll.setAttribute('min', parseInt(ptsFll) - 5);
                        spnBFll.setAttribute('max', parseInt(ptsFll) + 5);
                        spnBFll.value = String(Number(String(ptsFll)).toPrecision(2));
                        document.getElementById('vFOrT').value = xJson.workspace.Fallecido.properties.tFn.toString().split('px')[0];
                        //desaparecer los elementos
                        trjPpal.classList.remove("animated","fadeInDown");
                        trjPpal.classList.add("animated","fadeOutUp");
                    }, 400).then(function(){
                        //aparecer el nuevo elemento
                        trjPpal.style.display = 'none';
                        trjDatos.style.display = "block";
                        trjPpal.classList.remove("animated","fadeOutUp");
                        trjPpal.classList.add("animated","fadeInDown");
                        //xJson = JSON.parse(xJson);
                        //console.log(xJson);
                        if(document.getElementById("shOra")){
                            document.getElementById("shOra").style.display = (xJson.workspace.Oracion) ? 'block' : 'none';
                        }
                    });

                });
            }
        } 
    });
});

function showPpal(){
  trjPpal.classList.remove("animated","fadeOutUp");
  trjPpal.classList.add("animated","fadeInDown");
  trjPpal.style.display = 'block';
}

function hideSgPart(){
    myCallback(function(){
        trjDatos.classList.remove("animated","fadeInDown");
        trjDatos.classList.add("animated","fadeOutUp");
    },400).then(function(){
        trjDatos.style.display = 'none';
        trjDatos.classList.remove("animated","fadeOutUp");
        trjDatos.classList.add("animated","fadeInDown");
    });
}

document.getElementById("btnBefore").addEventListener("click", function(ey){
    ey.preventDefault();
    myCallback(function(){
        trjDatos.classList.remove("animated","fadeInDown");
        trjDatos.classList.add("animated","fadeOutUp");
    },400).then(function(){
        trjDatos.style.display = 'none';
        showPpal();
        trjDatos.classList.remove("animated","fadeOutUp");
        trjDatos.classList.add("animated","fadeInDown");
    });
});

function receivedEvent(Event){
    Event.stopPropagation();
    Event.preventDefault();
    Event.returnValue = false;
    Event.cancelBubble = true;
    return false;
}

function validateKeys(Ev, pnt){
    var keys = Ev.keyCode || Ev.which, listPermit = [32, 8, 192, 37, 38, 39, 40, 46, 35, 36, 9];
    (pnt) ? listPermit.push(110) : delete listPermit[listPermit.indexOf('110')];
    if((keys < 65 || keys > 90) && !(isInArray(keys, listPermit))){
        receivedEvent(Ev);
    }
}

/*function cierraStCondo(){
   var objStCondo = document.getElementById("setCondo");
    myCallback(function(){
        objStCondo.classList.remove("animated","fadeIn");
        objStCondo.classList.add("animated","fadeOut");
        objStCondo.style.display = 'none';
    },400).then(function(){
       objStCondo.classList.remove("animated","fadeOut");
       objStCondo.classList.add("animated","fadeIn");
    }); 
}*/

function saveData(){
    var condoV = document.getElementById("stCondo").innerHTML.trim(), sdFalle = document.getElementById("nFallecido").value.trim(),
        lSoli = document.getElementById("nPaga").value.trim(), laFch = document.getElementById("nFecha").value.trim(),
        lOrac = xJson.workspace.Oracion ? document.getElementById("orTmplt").options[document.getElementById("orTmplt").selectedIndex].innerHTML : null,
        lMsj = (document.getElementById("slpzdo").value == 1 ? document.getElementById("ltxtPer").value : document.getElementById("menTmplt").options[document.getElementById("menTmplt").selectedIndex].innerHTML);
    //setear el JSON    
    xJson.workspace.Condolencia.properties.txt = condoV;
    xJson.workspace.Fallecido.properties.txt = sdFalle.toString().toUpperCase();
    xJson.workspace.QuienPaga.properties.txt = lSoli;
    xJson.workspace.Fecha.properties.txt = laFch;
    if(xJson.workspace.Oracion) xJson.workspace.Oracion.properties.txt = lOrac;
    xJson.workspace.Mensaje.properties.txt = lMsj;
}

function ctrlMsjP(objeto){
    document.getElementById("stCondo").style.textAlign = xJson.workspace.Condolencia.properties.alGn;
    foquear();
    saveData();
    //cierraStCondo();
    document.getElementById("vPrevia").style.display = 'block';
    objeto.style.display = 'none';
}

document.getElementById("saveCondo").addEventListener("click", function(ej){
    ej.preventDefault();
    //validar datos
    var lFalle = document.getElementById("nFallecido"), lPag = document.getElementById("nPaga"),
        laFch = document.getElementById("nFecha"), lMen = document.getElementById("menTmplt"), lOra = document.getElementById("orTmplt"),
        sTmSw = xJson.workspace.Oracion ? (lOra.options[lOra.selectedIndex].value != 'X') : true;
        
    if(lFalle.value.trim() != '' && lPag.value.trim() != '' && laFch.value.trim() != '' && sTmSw){
        //console.log('Oracion:', lOra.style.display.toString().trim(),",switch: ", sTmSw);
        //document.getElementById("setCondo").style.display = 'block';
        //lMen.options[lMen.selectedIndex].value != 'X'
        if(document.getElementById("slpzdo").value == 0){
             if(lMen.options[lMen.selectedIndex].value != 'X'){
                ctrlMsjP(this);
             }else{
                 mostrarNotificacion('Todos los campos son requeridos', 'notification', 'danger');
             }
        }else{
            if(document.getElementById("ltxtPer").value != ''){
                ctrlMsjP(this);
            }else{
                mostrarNotificacion('Todos los campos son requeridos', 'notification', 'danger');
            }
        }
    }else{
        mostrarNotificacion('Todos los campos son requeridos', 'notification', 'danger');
    }   
});

/*[].forEach.call(document.querySelectorAll('[contenteditable]'), function (el) {
    el.addEventListener('paste', function(e) {
        e.preventDefault();
        var text = e.clipboardData.getData("text/plain");
        document.execCommand("insertHTML", false, text);
    }, false);
});*/
var _onPaste_StripFormatting_IEPaste = false;

function OnPaste_StripFormatting(elem, e) {
    if (e.originalEvent && e.originalEvent.clipboardData && e.originalEvent.clipboardData.getData) {
        e.preventDefault();
        var text = e.originalEvent.clipboardData.getData('text/plain');
        window.document.execCommand('insertText', false, text);
    }else if (e.clipboardData && e.clipboardData.getData) {
        e.preventDefault();
        var text = e.clipboardData.getData('text/plain');
        window.document.execCommand('insertText', false, text);
    }else if (window.clipboardData && window.clipboardData.getData) {
        if (!_onPaste_StripFormatting_IEPaste) {
            _onPaste_StripFormatting_IEPaste = true;
            e.preventDefault();
            window.document.execCommand('ms-pasteTextOnly', false);
        }
        _onPaste_StripFormatting_IEPaste = false;
    }
}

document.getElementById("backEdit").addEventListener("click", function(ek){
    ek.preventDefault();
    var elOcul = document.getElementById("shwVPrevia"), btnPrv = document.getElementById("backEdit"),
        btnGenPdf = document.getElementById("gnPdf");
    //debemos ocultar la visualizacion previa y mostrar a sgPart
    xJson.workspace.Fallecido.properties.tFn = document.getElementById('vFOrT').value + 'px';
    myCallback(function(){
        elOcul.classList.remove("animated","fadeIn");
        elOcul.classList.add("animated","fadeOut");
        btnPrv.classList.remove("animated","slideInLeft");
        btnPrv.classList.add("animated","slideOutLeft");
        btnGenPdf.classList.remove("animated","slideInRight");
        btnGenPdf.classList.add("animated","slideOutRight");
    }, 400).then(function(){
        elOcul.style.display = 'none';
        btnPrv.style.display = 'none';
        btnGenPdf.style.display = 'none';
        trjDatos.style.display = "block";
        elOcul.classList.remove("animated","fadeOut");
        elOcul.classList.add("animated","fadeIn");
        btnPrv.classList.remove("animated","slideOutLeft");
        btnPrv.classList.add("animated","slideInLeft");
        btnGenPdf.classList.remove("animated","slideOutRight");
        btnGenPdf.classList.add("animated","slideInRight");
        saveData();
    });
});
//herramientas de edicion en condolencia
function foquear(){
    if(document.activeElement.id != "stCondo"){
        document.getElementById("stCondo").focus();
    }
}
var isBold = document.queryCommandState("Bold");
 isIE() ? document.execCommand("DefaultParagraphSeparator", false, "div") : document.execCommand('defaultparagraphseparator', false, "br");
 isIE() ? (document.getElementById("regrePub").classList.remove("prevBtn"), document.getElementById("regrePub").classList.add("iePubBtnsBack")) : (document.getElementById("regrePub").classList.remove("iePubBtnsBack"), document.getElementById("regrePub").classList.add("prevBtn"));
 isIE() ? (document.getElementById("genPub").classList.remove("genPdf"), document.getElementById("genPub").classList.add("iePubBtnsPdf")) : (document.getElementById("regrePub").classList.remove("iePubBtnsPdf"), document.getElementById("regrePub").classList.add("genPdf"));
document.getElementById("stCondo").addEventListener("keydown", function(st){
    /*if(st.keyCode === 13){
        document.execCommand('insertHTML', false, '<br>');
        return false;
    }*/
    if (st.which === 13 && isIE()){
        document.execCommand('insertHTML', false, '<br>');
        // prevent the default behaviour of return key pressed
        return false;
    }
});

document.getElementById("btnBold").addEventListener("click", function (ej){
   ej.preventDefault();
   if(isIE()){
       document.execCommand("Bold");
   }else{
       document.execCommand("bold", false, null);
   }
   foquear();
});

document.getElementById("btnItalic").addEventListener("click", function(ei){
    ei.preventDefault();
    isIE() ? document.execCommand('Italic') : document.execCommand("italic", false, null);
    foquear();
});

document.getElementById("btnRight").addEventListener("click", function(er){
    er.preventDefault();
    isIE() ? document.execCommand('JustifyRight', false) : document.execCommand("justifyRight", false, null);
    foquear();
});

document.getElementById("btnCenter").addEventListener("click", function(ec){
    ec.preventDefault();
    isIE() ? document.execCommand('JustifyCenter', false) : document.execCommand("justifyCenter", false, null);
    foquear();
});

document.getElementById("btnLeft").addEventListener("click", function(el){
    el.preventDefault();
    isIE() ? document.execCommand('JustifyLeft', false) : document.execCommand("justifyLeft", false, null);
    foquear();
});

document.getElementById("btnUndo").addEventListener("click", function(eu){
    eu.preventDefault();
    isIE() ? document.execCommand('Undo') : document.execCommand("undo", false, null);
    foquear();
});

document.getElementById("btnRedo").addEventListener("click", function(eo){
    eo.preventDefault();
    isIE() ? document.execCommand('Redo') : document.execCommand("redo", false, null);
    foquear();
});

document.getElementById("btnLB").addEventListener("click", function(lb){
    lb.preventDefault();
    isIE() ? document.execCommand("insertLineBreak") : document.execCommand("insertLineBreak", false, null);
    foquear();
});
//spinner
document.getElementById('spnFll').onchange = function(e){
    e.preventDefault();
    var tFa = PxToPt(parseFloat(xJson.workspace.Fallecido.properties.tFn.toString().split('px')[0]));
        if(parseFloat(document.getElementById('spnFll').value) > (Number(tFa) + 5)){
            document.getElementById('spnFll').value = (Number(tFa) + 5);
        }else if(parseFloat(document.getElementById('spnFll').value) < (Number(tFa) - 5)){
            document.getElementById('spnFll').value = (Number(tFa) - 5);
        }
};
//
//herramientas de edicion en condolencia
document.getElementById("vPrevia").addEventListener("click", function(eh){
   eh.preventDefault();
   saveData();
   //console.log(xJson);
   var PosDR = null, lyPrevia = document.getElementById("shwVPrevia");
   lyPrevia.style.backgroundImage = "url('" + xJson.workspace.propsGrls.background + "')";
   lyPrevia.style.backgroundSize = xJson.workspace.propsGrls.ancho + 'mm ' + xJson.workspace.propsGrls.alto + 'mm';
   lyPrevia.style.width = xJson.workspace.propsGrls.ancho + 'mm';
   lyPrevia.style.height = xJson.workspace.propsGrls.alto + 'mm';
   xJson.workspace.Fallecido.properties.tFn = String(PtToPx(document.getElementById('spnFll').value)) + 'px';
   myCallback(function(){
       hideSgPart();
       //acomodar los elementos antes de mostrarlo
    }, 400).then(function(){
       document.getElementById("shwVPrevia").style.display = "block";
       document.getElementById("backEdit").style.display = "block";
       document.getElementById("gnPdf").style.display = "block";
       //console.log(document.getElementById("shwVPrevia").getBoundingClientRect()); //aqui ya tenemos los valores de posicion
       PosDR = document.getElementById("shwVPrevia").getBoundingClientRect();
       if(!xJson.workspace.Oracion && document.getElementById("Oracion")){
           var dlElm = document.getElementById("Oracion");
               dlElm.parentElement.removeChild(dlElm);
       }
       for(var l in xJson){
        for(var s in xJson[l]){
            if(s !== "propsGrls"){
                //debemos crear un elemento div con el id que corresponde al nombre de la propiedad s
                if(document.getElementById(s)){
                    node = document.getElementById(s);
                }else{
                    var node = document.createElement("div");
                    node.id = s;
                    node.style.position = "absolute";
                    lyPrevia.appendChild(node);
                }
                 for(var t in xJson[l][s]){
                     //ahora vamos a recorrer cada propiedad
                     //console.log(xJson[l][s]);
                     for(var j in xJson[l][s][t]){
                         switch(j){
                             case "txt":
                                 //debemos asignar el contenido al elemento
                                 node.innerHTML = xJson[l][s][t][j];
                                 break;
                             case "tFn":
                                 //tamaño de fuente del elemento ya incluye la unidad
                                 node.style.fontSize = xJson[l][s][t][j];
                                 break;
                             case "tpFuente":
                                 //nombre de la fuente del elemento
                                 node.style.fontFamily = xJson[l][s][t][j];
                                 break;
                             case "sFn":
                                 //estilo de fuente del elemento
                                 node.style.fontStyle = xJson[l][s][t][j];
                                 break;
                             case "alGn":
                                 //alineacion del elemento
                                 node.style.textAlign = xJson[l][s][t][j];
                                 break;
                             case "fnBld":
                                 //si el texto va en negritas
                                 node.style.fontWeight = xJson[l][s][t][j];
                                 break;
                             case "fnCol":
                                 //color de la fuente
                                 node.style.color = xJson[l][s][t][j];
                                 break;
                             case "lineH":
                                 //lineHeight del elemento
                                 node.style.lineHeight = xJson[l][s][t][j].toString().indexOf("pt") > -1 ? xJson[l][s][t][j] : xJson[l][s][t][j] + 'pt';
                                 break;
                             case "lettSpc":
                                 //letterSpacing del elemento
                                 node.style.letterSpacing = xJson[l][s][t][j].toString().indexOf("pt") > -1 ? xJson[l][s][t][j] : xJson[l][s][t][j] + 'pt';
                                 break;
                             case "ofsLft":
                                 //posicion left respecto al ws
                                 //console.log(window.getComputedStyle(document.getElementById('shwVPrevia')).getPropertyValue("margin-left"));
                                 node.style.left = (document.getElementById("shwVPrevia").getBoundingClientRect().left + 2 + xJson[l][s][t][j]) + 'px';
                                 break;
                             case "ofTop":
                                 //posicion top respecto al ws
                                 
                                 node.style.top = (document.getElementById("shwVPrevia").offsetTop + 2 + xJson[l][s][t][j]) + 'px';
                                 break;
                             case "clW":
                                 //ancho del elemento ya incluye la unidad
                                 node.style.width = xJson[l][s][t][j].toString().indexOf("px") > -1 ? xJson[l][s][t][j] : xJson[l][s][t][j] + 'px';
                                 break;
                             case "clH":
                                 //alto del elemento ya incluye la unidad
                                 node.style.height = xJson[l][s][t][j].toString().indexOf("px") > -1 ? xJson[l][s][t][j] : xJson[l][s][t][j] + 'px';
                                 break;

                         }
                         //console.log(lyPrevia.childNodes);
                       }
                    }
                }
            }
        }
    });
});

window.onresize = function(){
    if(document.getElementById('shwVPrevia').style.display == 'block'){
        //alert('Has redimensionado la ventana'); //reacomodar elementos
        for(var acm in xJson){
            for(var acm1 in xJson[acm]){
                if(acm1 !== 'propsGrls'){
                    nodo = document.getElementById(acm1);
                    for(var zx in xJson[acm][acm1]){
                        for(var zw in xJson[acm][acm1][zx]){
                            if(zw == 'ofsLft'){
                                nodo.style.left = (document.getElementById("shwVPrevia").getBoundingClientRect().left + 2 + xJson[acm][acm1][zx][zw]) + 'px';
                            }else if(zw == 'ofTop'){
                                nodo.style.top = (document.getElementById("shwVPrevia").offsetTop + 2 + xJson[acm][acm1][zx][zw]) + 'px';
                            }
                        }
                    }
                }
            }
        }      
    }
};

function generateCond(arrJs){
   var dats = JSON.stringify(arrJs), dat = {"dts" : dats, 
        "MsgP": (document.getElementById("slpzdo").value == 1 ? document.getElementById("ltxtPer").value : ''), "Msg" : (document.getElementById("slpzdo").value == 1 ? '' : document.getElementById("menTmplt").value)};
    
    if(xJson.workspace.Oracion) dat["Orc"] = document.getElementById("orTmplt").value;
    
    as.consumerAjax('notification', 'assets/includes/genPubCondo.php', 'POST', true, dat, 
                false, false, true, function(data){
        var drAct = window.location.href.split("/");
            drAct.pop();
        var nV = drAct.join("/");
        openNewTab(nV + data);
        window.location.reload(true);
    }); 
}

document.getElementById("gnPdf").addEventListener("click", function(em){
    em.preventDefault();
    if(confirm("Deseas generar la condolencia ?")){
        generateCond(xJson);
        //ver si vamos a resetear el flujo de la app
        
    }
});

document.getElementById("nFallecido").addEventListener("keydown", function(eq){
    validateKeys(eq, false);
});

document.getElementById("nPaga").addEventListener("keydown", function(ew){
    validateKeys(ew, true);
});

if(document.getElementById("btnStCondo")){
    document.getElementById("btnStCondo").addEventListener("click", function(ep){
        ep.preventDefault();
        //validar datos
    });
}
if(document.getElementById("fmedsConds")){
    $("#fmedsConds").change(function(){
        dat = {"tp": "all", "md": document.getElementById("fmedsConds").value};
       as.consumerAjax("notification", "assets/includes/filTemplates.php", 'POST', true, dat,
               false, false, true, function(data){
                   document.getElementById("slPlan").innerHTML = data;
               });
    }); 
}
$(document).on("pagecreate", "#publiCondo", function(){
    $(document).on("swipeleft swiperight", "#publiCondo", function(e){
        if ($(".ui-page-active").jqmData("panel") !== "open") {
            if (e.type === "swipeleft"){
                //$("#btnSalir").click();
            } else if (e.type === "swiperight") {
                $("#nav-panel").panel("open");
            }
        }
    });
    $("#slpzdo").bind("change", function(event, ui) {
        if(this.value==1){
            //vamos a mostrar la caja de texto
            $("#msjContent").hide();
            $("#ltxtPer").textinput({disabled:false, mini:false});
            document.getElementById("menTmplt").selectedIndex = 0;
            $("#txtMsjPer").show();
            $("#txtMsjPer").css({width:'76%', padding:'0'});
            $("#ltxtPer").css({width:'100%', padding:'0.5rem', height:'2.9rem', lineHeight:'2.9rem'});
            //$("#ltxtPer").focus();
        }else{
            //vamos a mostrar el select normal
            $("#txtMsjPer").hide();
            $("#ltxtPer").val('');
            $("#ltxtPer").textinput({disabled:true, mini:true});
            $("#msjContent").show();
            $("#menTmplt").focus();
        }
    });
});