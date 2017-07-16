
var browser = jQuery.browser.msie;
var version = jQuery.browser.version;


function showDialog(){
    var dialogOpts = {
        title: "核算歷史記錄",
        modal: true,
        autoOpen: false,
        height: 600,
        width: 900,
        bgiframe:true,
        close:function(e){
            if(browser && version=='6.0'){
                jQuery('select').css('display','inline');
            };
        },
        open:function(e){
            if(browser && version=='6.0'){
                jQuery('select').css('display','none');
            };
        }
    };

    jQuery("#example").dialog(dialogOpts);
    jQuery( "#example" ).dialog( "open" );

};


function showDialog2(value1){
    var dialogOpts = {
        title: value1,
        modal: true,
        autoOpen: false,
        height: 400,
        width: 900,
        resize:false,
        bgiframe:true,
        close:function(e){
            if(browser && version=='6.0'){
                jQuery('select').css('display','inline');
            };
        },
        open:function(e){
            if(browser && version=='6.0'){
                jQuery('select').css('display','none');
            };
        }
    };

    var dlg = jQuery("#example").dialog(dialogOpts);
    dlg.parent().appendTo(jQuery(".ajaxForm1"));
    jQuery( "#example" ).dialog( "open" );

};


function showDialog3(value1){
    var dialogOpts = {
        title: value1,
        modal: true,
        autoOpen: false,
        height: 400,
        width: 400,
        bgiframe:true,
        close:function(e){
            if(browser && version=='6.0'){
                jQuery('select').css('display','inline');
            };
        },
        open:function(e){
            if(browser && version=='6.0'){
                jQuery('select').css('display','none');
            };
        }
    };

    var dlg = jQuery("#example").dialog(dialogOpts);
    dlg.parent().appendTo(jQuery(".ajaxForm1"));
    jQuery( "#example" ).dialog( "open" );

};

function dialog(v_title,v_div,v_height,v_width, v_onclose) {
    title = v_title || " ";
    div = v_div || "example";
    height = parseInt(v_height) || 400;
    width = parseInt(v_width) || 900;

    var dialogOpts = {
        title: title,
        modal: true,
        autoOpen: false,
        height: height,
        width: width,
        resize:false,
        bgiframe:true,
        close:function(e){
            if(browser && version=='6.0'){
                jQuery('select').css('display','inline');
            };
        },
        open:function(e){
            if(browser && version=='6.0'){
                jQuery('select').css('display','none');
            };
        }
    };

    var dlg = jQuery("#"+div).dialog(dialogOpts);
    dlg.parent().appendTo(jQuery(".ajaxForm1"));
    jQuery( "#"+div).dialog( "open" );

};


function closeDialog(){
    jQuery( "#example" ).dialog( "close" );
    doAlert('家戶人口已新增!');
}

function onlyCloseDialog(v_div){
    div = v_div || "example";
    jQuery( "#"+div ).dialog( "close" );
}

function checkSlide2(divid){
    //不以單鍵開關
    if(document.getElementById(divid).style.display=='none'){
        Effect.SlideDown(divid,{
            duration: 0.5
        });
    }
}

function checkSlide(divid){

    //單鍵開關
    if(document.getElementById(divid).style.display=='none'){
        Effect.SlideDown(divid,{
            duration: 0.5
        });
    }else{
        Effect.SlideUp(divid,{
            duration: 0.5
        });
    }

}

function checkSlideLh110(divid){
    var dataStatus = document.getElementById('dataStatus').value;
    //單鍵開關
    if(document.getElementById(divid).style.display=='none'){
        Effect.SlideDown(divid,{
            duration: 0.5
        });
    }else{
        if(dataStatus == 'edit'){
            document.getElementById('dataStatus').value = 'create';
        }else{
            Effect.SlideUp(divid,{
                duration: 0.5
            });
        }

    }

}

function checkSlideDp110(divid){
    var dataStatus = document.getElementById('dataStatus').value;
    //單鍵開關
    if(document.getElementById(divid).style.display=='none'){
        Effect.SlideDown(divid,{
            duration: 0.5
        });
    }else{
        if(dataStatus == 'edit'){
            document.getElementById('dataStatus').value = 'create';
        }else{
            Effect.SlideUp(divid,{
                duration: 0.5
            });
        }

    }

}






function setNewLh110(){

    var newEffdt = document.getElementById('newEffdt').value;
    alert(newEffdt);

}


function checkNormal(divid){
    if(document.getElementById(divid).style.display=='none'){
        $(divid).show();
    }else{
        $(divid).hide();
    }
}


function hideDiv(divid) {
    $(divid).hide();
}

function showDiv(divid) {
    $(divid).show();
}

function doConfirm(text,link){

    if(browser && version=='6.0'){
        jQuery('select').css('display','none');
    };

    jConfirm(text, '系統訊息', function(r) {
        if(r ==true){
            location.href = link;
            if(browser && version=='6.0'){
                jQuery('select').css('display','inline');
            };
        }
        if(r==false){
            endLoad();
            if(browser && version=='6.0'){
                jQuery('select').css('display','inline');
            };
        }
    });

}



function doAlert(text){
    jAlert(text,'系統訊息');
    jQuery('#popup_overlay').bgiframe();
}

function closeDialogById(v_id){
    id = v_id ||'example';
    jQuery( "#"+id ).dialog( "close" );
}

function setLovValue(id,type,value,value2){
    if(type=='1'){
        document.getElementById(id).value = value;
        jQuery('#example').dialog('close');
    }else{
        document.getElementById(id).value = value;
        document.getElementById(id+'2').value = value2;
        jQuery('#example').dialog('close');
    }
}

function setTwnspcode(_twnspcode,_txt) {
    jQuery('#'+_txt).val(_twnspcode);
    jQuery('#example').dialog('close');
}

function setTwnspcode(_twnspcode,_twnspname2,_txt,_span) {
    jQuery('#'+_txt).val(_twnspcode);
    if(_twnspname2 != '' && _span != '')
    jQuery('#'+_span).html(_twnspname2);
    jQuery('#example').dialog('close');
}

function setVilg(_vilgcode,_vligname,_codetxt,_nametxt) {
    jQuery('#'+_codetxt).val(_vilgcode);
    jQuery('#'+_nametxt).val(_vligname);
    jQuery('#example').dialog('close');
}

function setCnt(_cntcode,_txt) {
    jQuery('#'+_txt).val(_cntcode);
    jQuery('#example').dialog('close');
}

// vim: ts=4 sw=4 expandtab
