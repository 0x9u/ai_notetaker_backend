import Task from "@/types/task";

const tasks : Record<string, Record<string, Task>> = {};

export function addTask(userId: string, title: string) {
    tasks[userId] = tasks[userId] || {};
    const taskId = Math.random().toString(36).substring(2, 9);
    let task ={
        title,
        percentage: 0,
        status: 'Pending',
        userId,
        taskId,
    };

    tasks[userId][taskId] = task;

    return task;
}

export function deleteTask(userId: string, taskId: string) {
    setTimeout(() => {
        delete tasks[userId][taskId];
    }, 10000);
}

export default tasks;
