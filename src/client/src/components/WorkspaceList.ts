import { LitElement, html, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { Workspace, WorkspaceActivity } from "../api";
import type { WorkspaceLabelItem } from "../plugins/types";
import { workspaceActivityFor, workspaceActivityIndicator } from "../workspaceActivity";
import { renderActivityIndicator } from "./activityBadge";
import { focusMovedWithinCurrentTarget, rowOverflowLensStyle, shouldOpenOverflowLensFromFocus, shouldOpenOverflowLensFromPointer } from "./rowOverflowLens";
import { activateSelectableRow, activateSelectableRowFromKeyboard } from "./selectableRow";
import { listStyles } from "./shared";
import { renderWorkspaceLabelItems } from "./workspaceLabel";

@customElement("workspace-list")
export class WorkspaceList extends LitElement {
  @property({ attribute: false }) workspaces: Workspace[] = [];
  @property({ attribute: false }) selected?: Workspace;
  @property({ type: Boolean, reflect: true }) collapsible = false;
  @property({ type: Boolean, reflect: true }) collapsed = false;
  @property({ attribute: false }) workspaceLabelItems: (workspace: Workspace) => WorkspaceLabelItem[] = () => [];
  @property({ attribute: false }) activities: Record<string, WorkspaceActivity> = {};
  @property({ attribute: false }) onSelect?: (workspace: Workspace) => void;
  @property({ attribute: false }) onToggleCollapsed?: () => void;
  @state() private overflowLensWorkspaceId: string | undefined;
  @state() private overflowLensStyle = "";

  protected override updated(changed: PropertyValues<this>): void {
    if (changed.has("workspaces") && this.overflowLensWorkspaceId !== undefined && !this.workspaces.some((workspace) => workspace.id === this.overflowLensWorkspaceId)) this.overflowLensWorkspaceId = undefined;
    if (changed.has("collapsed") && this.collapsed) this.overflowLensWorkspaceId = undefined;
    if ((changed.has("selected") || changed.has("workspaces") || changed.has("collapsed")) && !this.collapsed) this.scrollSelectedIntoView();
  }

  override render() {
    return html`
      <section>
        <h2>${this.renderHeading()}</h2>
        ${this.collapsed ? null : this.workspaces.map((workspace) => {
          const label = `${workspace.label}${workspace.isMain ? " · main" : ""}`;
          const items = this.workspaceLabelItems(workspace);
          return html`
            <div
              class=${`action-row workspace-row ${this.selected?.id === workspace.id ? "selected" : ""}`}
              tabindex="0"
              title=${workspace.path}
              @pointerenter=${(event: PointerEvent) => { if (shouldOpenOverflowLensFromPointer(event)) this.openOverflowLens(workspace.id, event.currentTarget); }}
              @pointerleave=${() => { this.closeOverflowLens(workspace.id); }}
              @focusin=${(event: FocusEvent) => { if (shouldOpenOverflowLensFromFocus(event)) this.openOverflowLens(workspace.id, event.currentTarget); }}
              @focusout=${(event: FocusEvent) => { this.closeOverflowLensOnFocusOut(workspace.id, event); }}
              @click=${(event: MouseEvent) => { activateSelectableRow(event, () => this.onSelect?.(workspace)); }}
              @keydown=${(event: KeyboardEvent) => { this.handleWorkspaceKeydown(event, workspace); }}
            >
              <div class="action-main">
                ${this.renderWorkspaceMain(label, items, workspace)}
              </div>
              ${this.overflowLensWorkspaceId === workspace.id ? html`
                <div class="row-overflow-lens" style=${this.overflowLensStyle}>
                  ${this.renderWorkspaceMain(label, items, workspace)}
                </div>
              ` : null}
            </div>
          `;
        })}
      </section>
    `;
  }

  private renderHeading() {
    if (!this.collapsible) return "Workspaces";
    const selectedSummary = this.selected === undefined ? "No workspace selected" : `${this.selected.label}${this.selected.isMain ? " · main" : ""} · ${this.selected.path}`;
    const selectedTitle = this.selected?.path ?? selectedSummary;
    return html`<button class="section-toggle" aria-expanded=${String(!this.collapsed)} @click=${() => { this.onToggleCollapsed?.(); }}><span class="section-title"><span class="section-name">${this.collapsed ? "▸" : "▾"} Workspaces</span><small class="section-selected" title=${selectedTitle}>${selectedSummary}</small></span><small class="section-count">${this.workspaces.length}</small></button>`;
  }

  private renderActivity(workspace: Workspace) {
    const kind = workspaceActivityIndicator(workspaceActivityFor(workspace, this.activities));
    return renderActivityIndicator(kind, kind === "terminal" ? "Workspace terminal active" : "Workspace active") ?? "";
  }

  private renderWorkspaceMain(label: string, items: WorkspaceLabelItem[], workspace: Workspace) {
    return html`
      <span class="workspace-label">
        <span class="workspace-label-base">${label}</span>
        ${renderWorkspaceLabelItems(items)}
      </span>
      <small>${this.renderActivity(workspace)}${workspace.path}</small>
    `;
  }

  private openOverflowLens(workspaceId: string, target: EventTarget | null): void {
    this.overflowLensWorkspaceId = workspaceId;
    this.overflowLensStyle = rowOverflowLensStyle(target);
  }

  private closeOverflowLens(workspaceId: string): void {
    if (this.overflowLensWorkspaceId === workspaceId) this.overflowLensWorkspaceId = undefined;
  }

  private closeOverflowLensOnFocusOut(workspaceId: string, event: FocusEvent): void {
    if (focusMovedWithinCurrentTarget(event)) return;
    this.closeOverflowLens(workspaceId);
  }

  private handleWorkspaceKeydown(event: KeyboardEvent, workspace: Workspace): void {
    if (event.key === "Escape" && this.overflowLensWorkspaceId === workspace.id) {
      event.preventDefault();
      event.stopPropagation();
      this.overflowLensWorkspaceId = undefined;
      return;
    }
    activateSelectableRowFromKeyboard(event, () => this.onSelect?.(workspace));
  }

  private scrollSelectedIntoView(): void {
    this.renderRoot.querySelector<HTMLElement>(".action-row.selected")?.scrollIntoView({ block: "nearest" });
  }

  static override styles = listStyles;
}
