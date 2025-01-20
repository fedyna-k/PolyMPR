export async function listModules(): Promise<void> {
  for await (const path of Deno.readDir("routes/(apps)")) {
    if (path.isDirectory) {
      console.log(path.name);
    }
  }
}