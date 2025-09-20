import {
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
@Index(['user', 'post'], { unique: true })
export class Bookmarks {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.bookmarks, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Post, (post) => post.bookmarks, {
    onDelete: 'CASCADE',
  })
  post: Post;

  @UpdateDateColumn()
  updatedAt: Date;
}
