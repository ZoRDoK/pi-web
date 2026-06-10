export function ideasStyles(): string {
  return `
    <style>
      :host { display: contents; }
      .toolbar { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 10px 12px; border-bottom: 1px solid var(--pi-border-muted); }
      .toolbar span, .muted, small { color: var(--pi-muted); }
      .composer, .ideas { display: grid; gap: 10px; padding: 12px; }
      .composer { border-bottom: 1px solid var(--pi-border-muted); }
      label { color: var(--pi-text-secondary); font-size: 13px; font-weight: 600; }
      textarea { box-sizing: border-box; width: 100%; resize: vertical; border: 1px solid var(--pi-border); border-radius: 9px; background: var(--pi-bg); color: var(--pi-text); padding: 10px; font: inherit; }
      textarea:focus { outline: 2px solid var(--pi-accent-border); outline-offset: 1px; }
      .composer-actions { display: flex; justify-content: flex-end; }
      .idea-card { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 12px; align-items: start; border: 1px solid var(--pi-border); border-radius: 10px; background: var(--pi-surface); padding: 12px; }
      .idea-copy { display: grid; min-width: 0; gap: 5px; }
      .idea-text { display: block; width: 100%; margin: 0; border: 0; background: transparent; color: inherit; cursor: text; padding: 0; text-align: left; white-space: pre-wrap; }
      .idea-text:hover { color: var(--pi-accent); }
      .idea-actions { display: inline-flex; gap: 8px; }
      button { border: 1px solid var(--pi-accent-border); border-radius: 7px; background: var(--pi-accent); color: var(--pi-bg); cursor: pointer; padding: 6px 10px; font: inherit; }
      button.secondary { border-color: var(--pi-border); background: var(--pi-surface); color: var(--pi-text); }
      button:disabled { cursor: wait; opacity: 0.65; }
      .status, .warning { margin: 12px 12px 0; border: 1px solid var(--pi-border); border-radius: 8px; padding: 10px; }
      .status.info { border-color: var(--pi-accent-border); background: var(--pi-bg-overlay-soft); }
      .status.success { border-color: var(--pi-success-border); background: var(--pi-success-surface); color: var(--pi-success); }
      .status.error { border-color: var(--pi-danger); color: var(--pi-danger); }
      .warning { display: flex; justify-content: space-between; gap: 10px; align-items: center; border-color: var(--pi-warning-border); background: var(--pi-warning-surface); }
      a { color: var(--pi-accent); }
      .empty { padding: 16px; color: var(--pi-muted); }
      @media (max-width: 760px) {
        .idea-card { grid-template-columns: 1fr; }
        .idea-actions { justify-content: start; }
      }
    </style>
  `;
}
