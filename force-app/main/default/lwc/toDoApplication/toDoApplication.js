import { LightningElement, track } from 'lwc';

export default class ToDoApplication extends LightningElement {
    taskName = "";
    taskDate = null;
    incompleteTasks = [];
    completedTasks = [];

    changeHandler(event) {
        let { name, value } = event.target;
        if (name === "taskName") {
            this.taskName = value;
        } else if (name === "taskDate") {
            this.taskDate = value;
        }
    }

    resetHandler() {
        this.taskName = "";
        this.taskDate = null;
    }

    addTaskHandler(event) {
        //if end date is missing then populate todays date as end date
        if (!this.taskDate) {
            this.taskDate = new Date().toISOString().slice(0, 10);
        }

        if (this.validateTask()) {//if valid data comes, not duplicate
            this.incompleteTasks = [
                ...this.incompleteTasks,
                {
                    taskName: this.taskName,
                    taskDate: this.taskDate
                }
            ];
            this.resetHandler();
            let sortedTask = this.sortTask(this.incompleteTasks);
            this.incompleteTasks = [...sortedTask];
            console.log('after incompleteTasks =>', JSON.stringify(this.incompleteTasks))
        }
    }

    validateTask() {
        let element = this.template.querySelector(".taskName");
        let isValid = true;
        if (!this.taskName) {//if task name is empty 
            isValid = false;
            console.log("Enter Task Name");
        } else {
            console.log("Check for Duplicate");
            let taskItem = this.incompleteTasks.find(
                (currItem) =>
                    currItem.taskName === this.taskName &&
                    currItem.taskDate === this.taskDate
            );
            if (taskItem) {
                isValid = false;
                console.log("Duplicate Task Found");
                element.setCustomValidity('This task is already exist');
            }
        }
        if (isValid) {
            element.setCustomValidity("");
            console.log('True Value- Valid Data');
        }
        element.reportValidity();
        console.log('element.reportValidity()-->', element.reportValidity());
        return isValid;
    }

    sortTask(inputArr) {
        let sortedArray = inputArr.sort((a, b) => {
            const dateA = new Date(a.taskDate);
            const dateB = new Date(b.taskDate);
            return dateA - dateB;
        });
        return sortedArray;
    }

    removalHandler(event) {
        let index = event.target.name;
        this.incompleteTasks.splice(index, 1);
        let sortedTask = this.sortTask(this.incompleteTasks);
        this.incompleteTasks = [...sortedTask];
        console.log('after incompleteTasks =>', JSON.stringify(this.incompleteTasks))
    }

    completeTaskHandler(event) {
        let index = event.target.name;
        let removeItem = this.incompleteTasks.splice(index, 1);
        let sortedTask = this.sortTask(this.incompleteTasks);
        this.incompleteTasks = [...sortedTask];
        console.log('after incompleteTasks =>', JSON.stringify(this.incompleteTasks))
        this.completedTasks = [...this.completedTasks,removeItem[0]];
    }

    // removeIndex(event){
    //     let index = event.target.name;
    //     this.incompleteTasks.splice(index, 1);
    //     let sortedTask = this.sortTask(this.incompleteTasks);
    //     this.incompleteTasks = [...sortedTask];
    //     return;
    // }
}