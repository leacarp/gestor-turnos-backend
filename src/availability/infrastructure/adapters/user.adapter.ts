import { Injectable, Inject } from "@nestjs/common";
import { IUserPort } from "src/availability/domain/ports/user.port";
import { USER_SERVICE } from "src/user/infrastructure/constants/user-service.constants";
import type { IUserService } from "src/user/services/interfaces/IUserService";

@Injectable()
export class UserAdapter implements IUserPort {
  constructor(@Inject(USER_SERVICE) private readonly userService: IUserService) {}

  async existsProvider(providerId: string): Promise<boolean> {
    return this.userService.existsProvider(providerId);
  }
}