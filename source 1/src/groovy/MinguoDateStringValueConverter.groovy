package com.wezoomtek

import org.grails.databinding.converters.FormattedValueConverter
import org.joda.time.DateTime

class MinguoDateStringValueConverter implements FormattedValueConverter {
    def convert(value, String format) {
        if (format == 'MINGUO') {
            def pattern = /(\d{3})\/?(\d{2})\/?(\d{2})?/
            def matcher = (value =~ pattern)

            if (matcher) {
                return new DateTime(
                    matcher[0][1].toInteger() + 1911,
                    matcher[0][2].toInteger(),
                    (matcher[0][3] ? matcher[0][3].toInteger() : 1),
                    0, 0
                ).toDate()
            }
        }
    }

    Class getTargetType() {
        // specifies the type to which this converter may be applied
        Date
    }
}
