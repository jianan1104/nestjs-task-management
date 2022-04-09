import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './tasks.model';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDTO } from './dto/update-task-status.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterDTO: GetTasksFilterDTO): Task[] {
      if(Object.keys(filterDTO).length) {
        return this.tasksService.getTasksWithFilters(filterDTO);
      } else {
        return this.tasksService.getAllTasks();
      }
  }

  // http://localhost:3000/tasks/:id
  @Get('/:id')
  getTaskByID(@Param('id') id: string): Task {
      return this.tasksService.getTaskByID(id);
  }

  @Post()
  createTask(@Body() createTaskDTO: CreateTaskDTO): Task {
    return this.tasksService.createTask(createTaskDTO);
  }

  // http://localhost:3000/tasks/:id
  @Delete('/:id')
  deleteTaskByID(@Param('id') id: string): void {
    return this.tasksService.deleteTaskByID(id);
  }

  // http://localhost:3000/task/:id/status
  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDTO: UpdateTaskStatusDTO,
  ): Task {
      const { status } = updateTaskStatusDTO;
      return this.tasksService.updateTaskStatus(id, status);
  }
}
