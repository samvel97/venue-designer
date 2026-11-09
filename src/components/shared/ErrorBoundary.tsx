import { Component, type ErrorInfo, type ReactNode } from "react";

export default class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="grid h-full place-content-center gap-4 text-center">
        <p className="text-muted-foreground text-sm">Something went wrong. Please reload the page.</p>
        <button
          className="bg-primary text-primary-foreground mx-auto h-9 cursor-pointer rounded-lg px-4 text-sm font-medium"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }
}
