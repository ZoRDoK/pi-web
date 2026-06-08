import type { PiWebPlugin } from "@jmfederico/pi-web/plugin-api";
import { defineIdeasPanelElement, ideasPanelBadge } from "./ideasPanelElement.js";

const plugin: PiWebPlugin = {
  apiVersion: 1,
  name: "Workspace Ideas",
  activate: ({ pluginId, html, svg }) => {
    defineIdeasPanelElement();

    return {
      contributions: {
        actions: [
          {
            id: "workspace.open-ideas",
            title: "Open Workspace Ideas",
            description: "Open the workspace Ideas tab.",
            group: "Workspace",
            enabled: (context) => context.state.selectedWorkspace !== undefined,
            run: (context) => {
              if (context.state.selectedWorkspace === undefined) return;
              context.selectWorkspaceTool(`${pluginId}:workspace.ideas`);
            },
          },
        ],
        workspacePanels: [
          {
            id: "workspace.ideas",
            title: "Ideas",
            icon: svg`
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18h6"></path>
                <path d="M10 22h4"></path>
                <path d="M8.2 14.6a6 6 0 1 1 7.6 0c-.8.6-1.3 1.5-1.5 2.4H9.7c-.2-.9-.7-1.8-1.5-2.4Z"></path>
              </svg>
            `,
            order: 45,
            badge: (context) => ideasPanelBadge(context),
            render: (context) => html`<pi-web-workspace-ideas-panel .context=${context}></pi-web-workspace-ideas-panel>`,
          },
        ],
      },
    };
  },
};

export default plugin;
