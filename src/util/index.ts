import {
  RouteBases,
  Routes,
  RESTPatchAPIInteractionOriginalResponseJSONBody as Patch,
  APIInteractionResponse as Response
} from "discord-api-types/v10";
import fetch from "node-fetch";
import escapeMarkdown from "./markdownEscape";
import emitter from './emitter';

async function respond(res: any, body: Response) {
  return await res.send(body);
}

async function updateMessage(
  body: Patch,
  applicationId: string,
  token: string,
  messageId: string | undefined = undefined
): Promise<any> {
  const url = `${RouteBases.api}${Routes.webhookMessage(applicationId, token, messageId)}`;
  return fetch(url, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .catch(e => e);
}

export { respond, updateMessage, escapeMarkdown, emitter };
