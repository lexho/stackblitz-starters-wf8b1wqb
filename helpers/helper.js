export function contains(content, route) {
    for(const entry of content.pages) {
        if(route == entry.path) return true;
    }
}

/** Duplikate vermeiden
* wenn neue seite == bestehender eintrag */
export function uniquePath(content, path) {
    let route = path
    while(contains(content, route)) {
        console.log("routing table already contains route: " + route)
        //removeRoute(app, route);
        route += 1
        console.log("+1")
    }
    //routingTable.push({route: route, page: page})
    return route;
}