import {
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export interface FollowWithCurrentUser extends Follow {
  followedByCurrentUserId?: string;
  currentFollow?: {
    followedByCurrentUserId?: string;
    followCount?: string;
  };
}

@Entity()
@Index(['follower', 'following'], {
  unique: true,
})
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.following, {
    onDelete: 'CASCADE',
  })
  follower: User;

  @ManyToOne(() => User, (user) => user.follower, {
    onDelete: 'CASCADE',
  })
  following: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
