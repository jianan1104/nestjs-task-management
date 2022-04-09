import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
    private task: Task[] = [];

    getAllTasks(): Task[] {
        return this.task;
    };

    getTasksWithFilters(filterDTO: GetTasksFilterDTO): Task[] {
        const { status, search } = filterDTO;
        let tasks = this.getAllTasks();

        if(status) {
            tasks = tasks.filter(task => task.status === status);
        }

        if(search) {
            tasks = tasks.filter(task => task.title.includes(search) || task.description.includes(search))
        }

        return tasks

    }

    getTaskByID(id: string) : Task {
        const found = this.task.find((task) => task.id === id);
        if(!found) {
            throw new NotFoundException(`Task with ID ${id} not found.`);
        }

        return found;
    }

    createTask(createTaskDTO: CreateTaskDTO): Task {
        const { title, description } = createTaskDTO;
        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN
        };

        this.task.push(task);

        return task
    };

    deleteTaskByID(id: string): void {
        const found = this.getTaskByID(id);
        const index = this.task.map(task => task.id).indexOf(found.id);
        this.task.splice(index, 1);
    };

    updateTaskStatus(id: string, status: TaskStatus) {
        const task = this.getTaskByID(id);
        task.status = status;

        return task;
    }
}
