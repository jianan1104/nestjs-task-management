import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './tasks-status.enum';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(filterDTO: GetTasksFilterDTO): Promise<Task[]> {
    const { status, search } = filterDTO;
    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (status) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();

    return tasks;
  }

  async createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
    const { title, description } = createTaskDTO;
    const task: Task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.save(task);
    return task;
  }
}
