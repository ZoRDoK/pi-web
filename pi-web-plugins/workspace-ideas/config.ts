import type { WorkspacePanelContext } from "@jmfederico/pi-web/plugin-api";

export const ideasConfigPath = ".pi-web/ideas.json";
export const ideasDirectoryPath = ".pi-web";
export const gitignorePath = ".gitignore";
export const ideasConfigVersion = 1;

export interface IdeasConfig {
  version: typeof ideasConfigVersion;
  ideas: Idea[];
  archive: Idea[];
}

export interface Idea {
  id: string;
  text: string;
  createdAt: string;
  runSessionId?: string;
  runWorkspaceId?: string;
  doneAt?: string;
}

export function emptyIdeasConfig(): IdeasConfig {
  return { version: ideasConfigVersion, ideas: [], archive: [] };
}

export function parseIdeasConfig(value: unknown): IdeasConfig {
  if (!isRecord(value)) return emptyIdeasConfig();
  return {
    version: ideasConfigVersion,
    ideas: Array.isArray(value["ideas"]) ? value["ideas"].filter(isIdea) : [],
    archive: Array.isArray(value["archive"]) ? value["archive"].filter(isIdea) : [],
  };
}

export function createIdea(text: string): Idea {
  return {
    id: createIdeaId(),
    text,
    createdAt: new Date().toISOString(),
  };
}

export function archiveIdea(idea: Idea): Idea {
  return { ...idea, doneAt: new Date().toISOString() };
}

export function withRunSession(idea: Idea, sessionId: string, workspaceId: string): Idea {
  return { ...idea, runSessionId: sessionId, runWorkspaceId: workspaceId };
}

export function ideasCacheKey(context: WorkspacePanelContext): string {
  return `${context.machine.id}:${context.workspace.projectId}:${context.workspace.id}`;
}

export function gitignoreContainsPiWeb(content: string): boolean {
  return content.split(/\r?\n/u).some((line) => {
    const trimmed = line.trim();
    return trimmed === ideasDirectoryPath || trimmed === `${ideasDirectoryPath}/`;
  });
}

export function appendPiWebGitignoreEntry(content: string): string {
  if (gitignoreContainsPiWeb(content)) return content;
  return `${content}${content.endsWith("\n") || content === "" ? "" : "\n"}${ideasDirectoryPath}/\n`;
}

function createIdeaId(): string {
  return `idea-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function isIdea(value: unknown): value is Idea {
  if (!isRecord(value)) return false;
  return typeof value["id"] === "string"
    && typeof value["text"] === "string"
    && typeof value["createdAt"] === "string"
    && optionalString(value["runSessionId"])
    && optionalString(value["runWorkspaceId"])
    && optionalString(value["doneAt"]);
}

function optionalString(value: unknown): boolean {
  return value === undefined || typeof value === "string";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
