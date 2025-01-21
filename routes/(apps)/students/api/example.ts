import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async POST(request, context) {
    if (request.headers.get("content-type") != "application/json") {
      return new Response(null, {
        status: 400,
      });
    }

    const responseBody = {
      requestBody: await request.json(),
      context,
    };

    return new Response(JSON.stringify(responseBody), {
      headers: {
        "content-type": "application/json",
      },
    });
  },
};
