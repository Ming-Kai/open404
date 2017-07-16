dataSource {
    pooled = true
    driverClassName = "oracle.jdbc.OracleDriver"
    dialect = org.hibernate.dialect.Oracle10gDialect
}

hibernate {
    cache.use_second_level_cache = true
    cache.use_query_cache = false
    // cache.region.factory_class = 'net.sf.ehcache.hibernate.EhCacheRegionFactory' // Hibernate 3
    cache.region.factory_class = 'org.hibernate.cache.ehcache.EhCacheRegionFactory' // Hibernate 4
    //singleSession = true // configure OSIV singleSession mode
    hbm2ddl.auto = false
    //show_sql = true
    jdbc.use_get_generated_keys = true
}

// environment specific settings
environments {
    development {
        dataSource {
            dbCreate = "update"
            url      = "jdbc:oracle:thin:@10.1.1.222:1521:db1"
            username = "open404"
            password = "open404"
            properties {
                // See http://grails.org/doc/latest/guide/conf.html#dataSource for documentation
                jmxEnabled = true
                initialSize = 1
                maxActive = 50
                minIdle = 5
                maxIdle = 25
                maxWait = 10000
                maxAge = 10 * 60000
                timeBetweenEvictionRunsMillis = 5000
                minEvictableIdleTimeMillis = 60000
                validationQuery = "SELECT 1 FROM DUAL"
                validationQueryTimeout = 3
                validationInterval = 15000
                testOnBorrow = true
                testWhileIdle = true
                testOnReturn = true
            }
        }

        dataSource_pg {
            driverClassName = "org.postgresql.Driver"
            dialect = "org.hibernate.dialect.PostgreSQLDialect"
            dbCreate = "update"
            url = "jdbc:postgresql://10.1.1.223:5432/open404"
            username = "open404"
            password = "open404"
            properties {
                // See http://grails.org/doc/latest/guide/conf.html#dataSource for documentation
                jmxEnabled = true
                initialSize = 1
                maxActive = 50
                minIdle = 5
                maxIdle = 25
                maxWait = 10000
                maxAge = 10 * 60000
                timeBetweenEvictionRunsMillis = 5000
                minEvictableIdleTimeMillis = 60000
                validationQuery = "SELECT 1"
                validationQueryTimeout = 3
                validationInterval = 15000
                testOnBorrow = true
                testWhileIdle = true
                testOnReturn = true
            }
        }

    }

}
