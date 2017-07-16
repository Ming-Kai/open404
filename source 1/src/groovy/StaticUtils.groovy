package com.wezoomtek

import org.springframework.context.MessageSource
import org.springframework.context.i18n.LocaleContextHolder as local
import grails.util.Holders as holders

class StaticUtils {


    static Boolean idnoValidate(String val) {
        def pattern = "ABCDEFGHJKLMNPQRSTUVXYWZIO"
        def TWPID_PATTERN = /^[ABCDEFGHJKLMNPQRSTUVXYWZIO][12]\d{8}$/

        //取消原先自動toUpperCase，嚴格檢查輸入value大小寫
        if (val ==~ TWPID_PATTERN) {
            int code = pattern.indexOf(val.getAt(0)) + 10
            int sum = 0
            sum +=  (int)(code / 10) + 9 * (code % 10) + 8 * (val.getAt(1).toInteger())
            sum += 7 * (val.getAt(2).toInteger()) + 6 * (val.getAt(3).toInteger())
            sum += 5 * (val.getAt(4).toInteger()) + 4 * (val.getAt(5).toInteger())
            sum += 3 * (val.getAt(6).toInteger()) + 2 * (val.getAt(7).toInteger())
            sum += 1 * (val.getAt(8).toInteger())
            def chk = (sum % 10)
            //若餘數為0讓檢查碼為0
            if (chk == 0) {
            	chk = 10
            }

            if ( 10 - chk == val.getAt(9).toInteger()) {
                return true
            }
        }


        return false
    }

    //在groovy中取得meessage
    static String getMessageInGroovy(String code) {
        MessageSource messageSource = holders.grailsApplication.mainContext.getBean('messageSource')
        def result = messageSource.getMessage(code, null, local.getLocale())
        return result
    }
}
