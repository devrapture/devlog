import { Post } from '../../posts/entities/post.entity';
import { MediaFile } from '../../file-upload/entities/media-file.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Likes } from '../../likes/entities/likes.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: string;

  @Column({
    type: 'text',
    unique: true,
  })
  email: string;

  @Column('text')
  password: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  avatar: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  bio: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  displayName: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Column({
    nullable: true,
  })
  lastLoginAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => MediaFile, (mediaFile) => mediaFile.uploader)
  mediaFiles: MediaFile[];

  // One user can author many posts
  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  // One user can like many posts
  @OneToMany(() => Likes, (likes) => likes.user)
  likes: Likes[];
}
