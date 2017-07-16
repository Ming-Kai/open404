var click_value="";
function click1()
{
    click_value='0';
}

function click2()
{
    click_value='1';
}

function getenccert()  //--------------取得自然人憑證公鑰與個人資料-------------------------------------
{
    var certstr = HiCOSX1.GetCertForEncrypt();
    if(certstr == "")
    {
        alert(HiCOSX1.GetErrorString());
        return (false);
    }

    document.getElementById('enccert').value = certstr;
    document.getElementById('name').value  = HiCOSX1.GetNameFromCert(certstr);
    document.getElementById('serialNumber').value  = HiCOSX1.GetSerialNumberFromCert(certstr);
    document.getElementById('lastfour').value  = HiCOSX1.GetLastFourFromCert(certstr);
    document.getElementById('notafter').value  = HiCOSX1.GetNotAfterFromCert(certstr);
    document.getElementById('notbefore').value  = HiCOSX1.GetNotBeforeFromCert(certstr);
}
function docheckpin()//---------------------------檢查PINCODE是否正確---------------------------------
{
    document.getElementById('click').value = click_value;

    if(click_value=="")
    {
        alert("請點選登入或註冊。");
        return (false);
    }
    else
    {
        var re = HiCOSX1.Sign("WhatEver", document.getElementById('PIN').value);
        if(re == "")
        {
            alert(HiCOSX1.GetErrorString());
            document.form1.PIN.focus();
            return (false);
        }
        else
        {
            alert("PinCode正確。");
            getenccert();
        }
    }
}
