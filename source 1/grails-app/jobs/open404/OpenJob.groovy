package open404

import groovy.sql.Sql
import groovy.json.JsonSlurper
import grails.util.Environment

class OpenJob {
    static triggers = {
      cron name:'OpenJob', startDelay:10000, cronExpression: "0 10 * * * ?"//每小時10分
    }
    def np001Service

    def execute() {
        if (Environment.current != Environment.DEVELOPMENT) { //開發使用
            return true
        }
        np001Service.openDownload()
    }
}
