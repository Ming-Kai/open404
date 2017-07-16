import grails.converters.JSON
import groovy.sql.Sql
import java.text.SimpleDateFormat

class MapController {
	
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd")
	
	def dataSource
	def map_api_key = "AIzaSyBqUcfS1bD22-fEXS7b3NVPVeb8ao1yhnU"
	
	def index(){
		def qdate = sdf.format(new Date()) 
		def qhour = new Date().getHours()

		[map_api_key:map_api_key,qdate:qdate,qhour:qhour]
	} 
		
	def filter_aqxSite(){
		println params
		def qdate = params.qdate
		if(!params.qdate){
			qdate = sdf.format(new Date())
		}
		def qhour = params.qhour
		if(!params.qhour){
			qhour = new Date().getHours()
		}
		
		def sql = new Sql(dataSource)
		
		def cmd = """
			select *
			from aqx_20170716
			where publish_dt = (select distinct publish_dt from aqx where publish_dt like '"""+qdate.replaceAll('-', '/')+"""%' and publish_dt < '"""+qdate.replaceAll('-', '/')+""" """+qhour+""":00' LIMIT 1)
		"""
		//println cmd
		def dataTable = sql.rows(cmd)
		//println dataTable
		render dataTable as JSON
	}
	
	def filter_factory(){
		def qFactory
		if(params.qFactory){
			qFactory = params.qFactory
		}
		def factorys = []
		if (qFactory.toString() != 'null' && qFactory.toString().indexOf(',')){
			factorys = qFactory.toString().split(",")
		}
		
		def sql = new Sql(dataSource)
		
		def cmd = """
			select * from factory where lat is not null and lon is not null
		"""
		if(factorys.size() > 0){
			cmd+=""" and ( """
			for(int i=0;i<factorys.size();i++){
				cmd +=""" "產業類別" like '%"""+factorys[i]+"""%' """
				if(i<(factorys.size()-1)){
					cmd +=""" or """
				}
			}
			cmd+=""" ) """
		}else{
			cmd+=""" and "產業類別" = '@@@' """
		}
		def dataTable = sql.rows(cmd)
		render dataTable as JSON
	}

}
