/**
 * Class-based React Error Boundary containment structure.
 * Prevents client-side execution exceptions from breaking layout cycles, formatting raw debugging streams cleanly.
 */
import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Uncaught rendering context fault:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-950/20 text-red-200 min-h-screen font-mono border border-red-500/20 m-4 rounded-sm">
          <h1 className="text-xl font-bold mb-4 text-red-400 uppercase tracking-wider">AxioSigil Render Crash Caught</h1>
          <p className="mb-4 text-xs text-slate-400">The interface layer encountered a fatal validation exception. Stack trace sequence details:</p>

          <h2 className="font-bold text-xs uppercase text-slate-500 mt-4">Error Descriptor:</h2>
          <pre className="bg-black/40 p-4 rounded-sm overflow-auto border border-red-900/30 text-xs mt-2 whitespace-pre-wrap text-red-300">
            {this.state.error && this.state.error.toString()}
          </pre>

          {this.state.errorInfo?.componentStack && (
            <>
              <h2 className="font-bold text-xs uppercase text-slate-500 mt-4">Component Invalidation Tree:</h2>
              <pre className="bg-black/40 p-4 rounded-sm overflow-auto border border-slate-800 text-[10px] mt-2 whitespace-pre-wrap text-slate-400">
                {this.state.errorInfo.componentStack}
              </pre>
            </>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}