import { IAuthDTO } from "@modules/users/dtos/IAuthDTO";
import { container } from "tsyringe";
import { AuthenticateUserService } from "./AuthenticateUserService";
import { IResponseDTO } from "@dtos/IResponseDTO";
import { Request, Response } from "express";

export class AuthenticateUserController {
  public async handle(
    request: Request<never, never, IAuthDTO>,
    response: Response
  ): Promise<Response> {
    try {
      const userData = request.body;

      console.log("[LOGIN] Tentando autenticar:", userData.email);

      const authenticateUser = container.resolve(AuthenticateUserService);
      const user = await authenticateUser.execute(userData);

      console.log("[LOGIN] Autenticação bem-sucedida:", user);

      return response.status(user.code).send(user);
    } catch (error: unknown) {
      console.error("[LOGIN ERROR]", error);

      const errMsg =
        error instanceof Error
          ? error.message
          : "Erro interno durante autenticação";

      return response.status(500).json({
        code: 500,
        message_code: "AUTHENTICATE_ERROR",
        message: errMsg,
      });
    }
  }
}
