export interface AppRoute {
  projectId: string | undefined;
  workspaceId: string | undefined;
  sessionId: string | undefined;
  tool: "files" | "git" | undefined;
  view: "chat" | "files" | "git" | undefined;
  file: string | undefined;
  diff: string | undefined;
}

export function readRoute(): AppRoute {
  const params = new URLSearchParams(window.location.search);
  return {
    projectId: params.get("project") ?? undefined,
    workspaceId: params.get("workspace") ?? undefined,
    sessionId: params.get("session") ?? undefined,
    tool: parseTool(params.get("tool")),
    view: parseView(params.get("view")),
    file: params.get("file") ?? undefined,
    diff: params.get("diff") ?? undefined,
  };
}

export function writeRoute(route: AppRoute): void {
  const url = new URL(window.location.href);
  url.searchParams.delete("project");
  url.searchParams.delete("workspace");
  url.searchParams.delete("session");
  url.searchParams.delete("tool");
  url.searchParams.delete("view");
  url.searchParams.delete("file");
  url.searchParams.delete("diff");
  if (route.projectId !== undefined && route.projectId !== "") url.searchParams.set("project", route.projectId);
  if (route.workspaceId !== undefined && route.workspaceId !== "") url.searchParams.set("workspace", route.workspaceId);
  if (route.sessionId !== undefined && route.sessionId !== "") url.searchParams.set("session", route.sessionId);
  if (route.tool !== undefined) url.searchParams.set("tool", route.tool);
  if (route.view !== undefined) url.searchParams.set("view", route.view);
  if (route.file !== undefined && route.file !== "") url.searchParams.set("file", route.file);
  if (route.diff !== undefined && route.diff !== "") url.searchParams.set("diff", route.diff);
  const next = `${url.pathname}${url.search}${url.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (next !== current) window.history.pushState({}, "", url);
}

function parseTool(value: string | null): "files" | "git" | undefined {
  return value === "files" || value === "git" ? value : undefined;
}

function parseView(value: string | null): "chat" | "files" | "git" | undefined {
  return value === "chat" || value === "files" || value === "git" ? value : undefined;
}
