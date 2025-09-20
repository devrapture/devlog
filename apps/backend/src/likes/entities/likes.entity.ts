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
export class Likes {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.likes, {
    onDelete: 'CASCADE',
  })
  user: User;

  // Many likes can be associated with one post
  @ManyToOne(() => Post, (post) => post.likes, {
    onDelete: 'CASCADE',
  })
  post: Post;
}
