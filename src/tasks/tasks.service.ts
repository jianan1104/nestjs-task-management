import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  getTasks(filterDTO: GetTasksFilterDTO, user: User): Promise<Task[]> {
      return this.taskRepository.getTasks(filterDTO, user);
  }

  async getTaskByID(id: string, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id, user }});
    if (!found) throw new NotFoundException(`Task with ID ${id} not found.`);

    return found;
  }

  createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDTO, user);
  }

  async deleteTaskByID(id: string, user): Promise<void> {
    const result = await this.taskRepository.delete({id, user});
    if (result.affected === 0)
      throw new NotFoundException(`Task with ID ${id} not found.`);
  }

  async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
      const task = await this.getTaskByID(id, user);

      task.status = status;
      this.taskRepository.save(task);

      return task;
  }
}
