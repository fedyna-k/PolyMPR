FROM denoland/deno:alpine

WORKDIR /app

COPY . .
RUN deno cache main.ts
RUN deno task build

USER deno
EXPOSE 443

CMD ["run", "-A", "main.ts"]