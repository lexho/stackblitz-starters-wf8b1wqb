export async function save(page) {
    if(page.id === 0) {
        //insert(page)
        console.log("insert")
    } else {
        //update(page)
        console.log("update")
    }
    return Promise.resolve();
}