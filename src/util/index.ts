import { RouteBases, Routes, RESTPatchAPIInteractionOriginalResponseJSONBody as Patch } from "discord-api-types/v10";
import fetch from "node-fetch";
import escapeMarkdown from './markdownEscape';

async function updateMessage(body: Patch, applicationId: string, token: string, messageId: string | undefined = undefined): Promise<any> {
  const url = `${RouteBases.api}${Routes.webhookMessage(applicationId, token, messageId)}`;
  return fetch(url, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .catch(e => e);
}

export { updateMessage, escapeMarkdown };