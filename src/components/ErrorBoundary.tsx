import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { logger } from "@/lib/logger";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * ErrorBoundary - Catch runtime errors and display a fallback UI.
 * 
 * BMAD Task: T-005
 * Risk Addressed: 02_RISKS.md §5.1 - No Global Error Boundary
 */
class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // T-007: Centralized logging integrated
        logger.error("Uncaught runtime error in React component tree", error, { errorInfo });
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = "/dashboard";
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
                    <div className="max-w-md w-full text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="p-4 bg-destructive/10 rounded-full">
                                <AlertTriangle className="h-12 w-12 text-destructive" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold tracking-tight">Something went wrong</h1>
                            <p className="text-muted-foreground">
                                An unexpected error has occurred. We've been notified and are working on it.
                            </p>
                        </div>

                        {process.env.NODE_ENV === "development" && this.state.error && (
                            <div className="p-4 bg-muted rounded-md text-left overflow-auto max-h-40">
                                <p className="text-xs font-mono text-destructive">
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button onClick={() => window.location.reload()} variant="outline" className="gap-2">
                                <RefreshCcw className="h-4 w-4" />
                                Reload Page
                            </Button>
                            <Button onClick={this.handleReset} className="gap-2">
                                Go to Dashboard
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
