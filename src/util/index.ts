import {
  RouteBases,
  Routes,
  RESTPatchAPIInteractionOriginalResponseJSONBody as Patch,
  APIInteractionResponse as Response
} from "discord-api-types/v10";
import fetch from "node-fetch";
import escapeMarkdown from "./markdownEscape";
import emitter from "./emitter";
import FormData from "form-data";

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

async function updateMessageWithAttachment(
  body: Patch,
  applicationId: string,
  token: string,
  attachment: { name: string; file: Buffer }[],
  messageId: string | undefined = undefined
): Promise<any> {
  const url = `${RouteBases.api}${Routes.webhookMessage(applicationId, token, messageId)}`;

  const form = new FormData();
  body.attachments = [];
  attachment.forEach((a, i) => body.attachments?.push({ id: `${i}`, filename: a.name }));
  form.append("payload_json", JSON.stringify(body));
  attachment.forEach((a, i) => form.append(`files[${i}]`, a.file, { filename: a.name }));
  return fetch(url, {
    method: "PATCH",
    body: form
  })
    .then(res => res.json())
    .catch(e => e);
}

export { respond, updateMessage, escapeMarkdown, emitter, updateMessageWithAttachment };
