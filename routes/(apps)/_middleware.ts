import { FreshContext, MiddlewareHandler } from "$fresh/server.ts";
import {
  AppProperties,
  AuthenticatedState,
} from "$root/defaults/interfaces.ts";

export const handler: MiddlewareHandler<AuthenticatedState>[] = [
  /**
   * Get all available pages for current user.
   * @param request The HTTP incomming request.
   * @param context The Fresh context object with custom `AuthenticatedState`.
   * @returns The response from the next middleware.
   */
  async function getAllAvailablePages(
    request: Request,
    context: FreshContext<AuthenticatedState>,
  ): Promise<Response> {
    const pathname = new URL(request.url).pathname;
    const currentApp = pathname.split("/")[1];
    const properties: AppProperties = (await import(
      `./${currentApp}/(_props)/props.ts`
    )).default;

    context.state.availablePages = properties.pages;
    if (
      context.state.session.eduPersonPrimaryAffiliation == "student" &&
      Deno.env.get("LOCAL") != "true"
    ) {
      properties.adminOnly.forEach((page) =>
        delete context.state.availablePages[page]
      );
    }

    return await context.next();
  },
];
