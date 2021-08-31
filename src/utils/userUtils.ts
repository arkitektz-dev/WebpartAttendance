import { WebPartContext } from "@microsoft/sp-webpart-base";

export function getCurrentUser(context: WebPartContext) {
  return context.pageContext.user;
}
