import { Exclude } from 'class-transformer';
import { type, userInfo } from 'os';
import { User } from 'src/auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './tasks-status.enum';
import { TasksController } from './tasks.controller';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @ManyToOne((type) => User, (user) => user.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
