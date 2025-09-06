import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';
import { SKIP_WRAP_KEY } from '../decorators/skip-wrap.decorator';

export interface Response<T> {
  success: true;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private readonly reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const handler = context.getHandler();
    const controller = context.getClass();

    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_WRAP_KEY, [
      handler,
      controller,
    ]);
    if (skip) {
      // Do not wrap this endpoint
      return next.handle() as unknown as Observable<Response<T>>;
    }

    // Allow per-route message, fallback to a sensible default
    const customMessage =
      this.reflector.getAllAndOverride<string>(RESPONSE_MESSAGE_KEY, [
        handler,
        controller,
      ]) ?? this.buildDefaultMessage(handler);

    return next.handle().pipe(
      map((data) => ({
        success: true,
        message: customMessage,
        data: data as T,
      })),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type, @typescript-eslint/no-unused-vars
  private buildDefaultMessage(handler: Function): string {
    // e.g. "createUser" -> "OK"
    // You can make this smarter if you want to infer messages by method name
    return 'OK';
  }
}
