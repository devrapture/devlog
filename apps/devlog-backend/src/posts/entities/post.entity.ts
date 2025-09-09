import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PostStatus {
  PUBLISHED = 'published',
  DRAFT = 'draft',
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  body: string;

  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.DRAFT,
  })
  status: PostStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  coverImage: string;

  @Column('text', {
    unique: true,
    nullable: true,
  })
  slug: string;

  @Column({
    type: 'time with time zone',
    nullable: true,
  })
  publishedAt: Date;

  @Column('int', { default: 0 })
  views: number;

  @Column('int', { default: 0 })
  likes: number;

  @Column('int', { default: 0 })
  comments: number;

  @Column('int', { default: 0 })
  bookmarks: number;

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  author: User;

  @ManyToMany(() => Category, (category) => category.posts)
  categories: Category[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
