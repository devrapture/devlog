import { Injectable } from '@nestjs/common';

@Injectable()
export class FollowsService {
  constructor(){}

  followUser(userId,followingId){
    return {
      userId,
      followingId
    }
  }

  unfollowUser(userId,followingId){
    return {
      userId,
      followingId
    }
  }
}
