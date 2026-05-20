const LENS_MARGIN_PX = 8;
const MAX_LENS_WIDTH_PX = 720;

interface RowOverflowLensRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface RowOverflowLensViewport {
  width: number;
}

export function rowOverflowLensStyle(target: EventTarget | null): string {
  if (typeof HTMLElement === "undefined" || !(target instanceof HTMLElement)) return "";
  const anchor = target.querySelector<HTMLElement>(".action-main") ?? target;
  return rowOverflowLensStyleForRect(anchor.getBoundingClientRect(), { width: window.innerWidth });
}

export function rowOverflowLensStyleForRect(rect: RowOverflowLensRect, viewport: RowOverflowLensViewport): string {
  const left = Math.max(LENS_MARGIN_PX, rect.left);
  const availableWidth = Math.max(0, viewport.width - left - LENS_MARGIN_PX);
  const maxWidth = Math.min(MAX_LENS_WIDTH_PX, availableWidth);
  const minWidth = Math.min(rect.width, maxWidth);

  return [
    `top: ${px(rect.top)};`,
    `left: ${px(left)};`,
    `height: ${px(rect.height)};`,
    `min-width: ${px(minWidth)};`,
    `max-width: ${px(maxWidth)};`,
  ].join(" ");
}

export function shouldOpenOverflowLensFromPointer(event: PointerEvent): boolean {
  return event.pointerType === "mouse" || event.pointerType === "pen";
}

export function shouldOpenOverflowLensFromFocus(event: FocusEvent): boolean {
  if (typeof HTMLElement === "undefined" || !(event.currentTarget instanceof HTMLElement)) return false;
  return event.currentTarget.matches(":focus-visible");
}

export function focusMovedWithinCurrentTarget(event: FocusEvent): boolean {
  if (typeof HTMLElement === "undefined" || typeof Node === "undefined") return false;
  return event.currentTarget instanceof HTMLElement && event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget);
}

function px(value: number): string {
  return `${String(Math.round(value))}px`;
}
