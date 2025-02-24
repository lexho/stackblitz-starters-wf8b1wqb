class Item {
    text: String = "";
}

class ToDoList {
    items:Item[] = [];
}

class Issue {
    issue: String = "";
    solved: Boolean = false;
}
class Issues {
    issues: Issue[] = []
}

export class Notes {
    todo:ToDoList = new ToDoList();
    issues:Issues = new Issues();
}