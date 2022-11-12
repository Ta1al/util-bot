import { isValidRequest, PlatformAlgorithm } from "discord-verify/web";
import { Env } from "./utils/types";
import router from "./utils/router";

async function fetch(request: Request, env: Env): Promise<Response> {
  if (request.method === "POST") {
    const isValid = await isValidRequest(
      request,
      env.DISCORD_PUBLIC_KEY,
      PlatformAlgorithm.Cloudflare
    );
    if (!isValid) return new Response("Unauthorized", { status: 401 });
  }

  return router.handle(request, env);
}

export default { fetch };
