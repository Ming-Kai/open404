package com.wezoomtek

import org.grails.databinding.BindingHelper
import org.joda.time.DateTime
import org.grails.databinding.DataBindingSource
import org.codehaus.groovy.grails.commons.DefaultGrailsDomainClass

class MinguoDateTimeBindingHelper implements BindingHelper {
    Object getPropertyValue(Object obj, String propertyName, DataBindingSource source) {
        def clazz = new DefaultGrailsDomainClass(obj.class)
        def value = source[propertyName]
        def pattern = /(\d{3})\/?(\d{2})\/?(\d{2})?/
        def timePattern = /(\d{2}):(\d{2})([AP]M)?/

        if (value instanceof String && value.matches(pattern)
            && clazz.getPropertyByName(propertyName).type == Date) {
            def r = (value =~ pattern)

            def year = r[0][1].toInteger() + 1911
            def month = r[0][2].toInteger()
            def day = (r[0][3] ? r[0][3].toInteger() : 1)
            def hour = 0
            def minute = 0

            def timeValue = source[propertyName + "_timeEntry"]
            if (timeValue?.matches(timePattern)) {
                def tr = (timeValue =~ timePattern)

                hour = tr[0][1].toInteger()
                minute = tr[0][2].toInteger()
                def ampm = tr[0][3]

                if (ampm) {
                    hour = hour % 12

                    if (ampm == "PM") {
                        hour += 12
                    }
                }
            }

            return new DateTime(year, month, day, hour, minute).toDate()
        }

        return value
    }
}
