import { Likes } from '../../likes/entities/likes.entity';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Bookmarks } from '../../bookmarks/entities/bookmark.entity';

export enum PostStatus {
  PUBLISHED = 'published',
  DRAFT = 'draft',
}

@Entity()
@Index('idx_post_authorId', ['author'])
@Index('idx_post_status', ['status'])
@Index('idx_post_createdAt', ['createdAt'])
@Index('idx_post_title', ['title'])
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
    type: 'timestamp with time zone',
    nullable: true,
  })
  publishedAt: Date;

  @Column('int', { default: 0 })
  views: number;

  @Column('int', { default: 0 })
  likesCount: number;

  @Column('int', { default: 0 })
  comments: number;

  @Column('int', { default: 0 })
  bookmarkCount: number;

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  author: User;

  @ManyToMany(() => Category, (category) => category.posts)
  @JoinTable()
  categories: Category[];

  // One post can have many likes
  @OneToMany(() => Likes, (likes) => likes.post)
  likes: Likes[];

  @OneToMany(() => Bookmarks, (bookmarks) => bookmarks.post)
  bookmarks: Bookmarks[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
