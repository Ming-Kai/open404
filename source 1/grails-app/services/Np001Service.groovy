
import groovy.sql.Sql
import org.springframework.web.context.request.RequestContextHolder
import javax.servlet.http.HttpSession
import java.text.SimpleDateFormat
import jxl.Workbook
import org.apache.poi.hssf.usermodel.HSSFWorkbook
import jxl.Sheet
import groovy.json.JsonSlurper
import org.codehaus.groovy.grails.web.context.ServletContextHolder

class Np001Service {

    static transactional = true

    def dataSource_pg
    def openDownload(){
        def sql = new Sql(dataSource_pg)
        def url = "http://opendata.epa.gov.tw/webapi/api/rest/datastore/355000000I-000002/?format=json&token=UrgGlOHJKEym6RVqwrhUdg&limit=100"
        def json = url.toURL().text
        
        try{
            if(json){
                def source = new JsonSlurper().parseText(json)
                if(source?.success){
                    source["result"]["records"]?.each{row->
                        def str =""" insert into "public"."aqx"(site_name,county,psi,major_pollutant,status,so2,co,o3,pm10,pm2_5,no2,wind_speed,wind_direc,fpmi,nox,no,publish_dt) 
                                        values('${row["SiteName"]}','${row["County"]}','${row["PSI"]}','${row["MajorPollutant"]}','${row["Status"]}','${row["SO2"]}','${row["CO"]}','${row["O3"]}','${row["PM10"]}','${row["PM2.5"]}','${row["NO2"]}','${row["WindSpeed"]}','${row["WindDirec"]}','${row["FPMI"]}','${row["NOx"]}','${row["NO"]}',to_timestamp('${row["PublishTime"]}', 'YYYY-MM-DD HH24:MI')) """
                        sql.execute(str.toString())
                    }
                }
            }
        }catch(e){
            println e
        }
    }
    
}
