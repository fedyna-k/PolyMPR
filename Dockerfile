FROM denoland/deno:alpine

WORKDIR /app

COPY . .
RUN deno cache main.ts --allow-import flag
RUN deno task build

USER deno
EXPOSE 80
EXPOSE 443

CMD ["run", "-A", "main.ts"]