class Item {
    constructor() {
        this.text = "";
    }
}
class ToDoList {
    constructor() {
        this.items = [];
    }
}
class Issue {
    constructor() {
        this.issue = "";
        this.solved = false;
    }
}
class Issues {
    constructor() {
        this.issues = [];
    }
}
export class Notes {
    constructor() {
        this.todo = new ToDoList();
        this.issues = new Issues();
    }
}
