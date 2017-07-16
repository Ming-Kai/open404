class UrlMappings {

    static mappings = {
        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }

       "/"(controller: "homepage", action: "index")     //default index
        "500"(view: "/error")
    }
}
