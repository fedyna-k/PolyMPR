import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(request, context) {
    return new Response({
      test: await request.json(),
      context,
    });
  },
};
