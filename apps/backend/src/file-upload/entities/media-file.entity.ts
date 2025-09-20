import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MediaFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  originalName: string;

  @Column('text')
  mimeType: string;

  @Column('int')
  size: number;

  @Column('text')
  url: string;

  @Column('text')
  publicId: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  altText: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.mediaFiles, {
    onDelete: 'CASCADE',
  })
  uploader: User;
}
