import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(@Inject(REQUEST) private request: Request) {}
  doSomething() {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Doing something in the AuthService');
        resolve('return this');
      }, 20);
    });
  }
}
