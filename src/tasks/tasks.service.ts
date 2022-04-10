import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  getTasks(filterDTO: GetTasksFilterDTO): Promise<Task[]> {
      return this.taskRepository.getTasks(filterDTO);
  }

  async getTaskByID(id: string): Promise<Task> {
    const found = await this.taskRepository.findOne(id);
    if (!found) throw new NotFoundException(`Task with ID ${id} not found.`);

    return found;
  }

  createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
    return this.taskRepository.createTask(createTaskDTO);
  }

  async deleteTaskByID(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Task with ID ${id} not found.`);
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
      const task = await this.getTaskByID(id);

      task.status = status;
      this.taskRepository.save(task);

      return task;
  }
}
