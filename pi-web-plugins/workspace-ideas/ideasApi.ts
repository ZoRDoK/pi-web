import type { WorkspacePanelContext, WorkspacePanelSessionInfo } from "@jmfederico/pi-web/plugin-api";

export async function writeWorkspaceFile(context: WorkspacePanelContext, path: string, content: string): Promise<void> {
  await context.files.writeFile(path, content);
}

export async function startIdeaSession(context: WorkspacePanelContext, ideaId: string, prompt: string): Promise<WorkspacePanelSessionInfo> {
  return await context.sessions.startWithPrompt(prompt, { newWorkspace: true, ideaId });
}
