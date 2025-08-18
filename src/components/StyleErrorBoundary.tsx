'use client';

import React from 'react';
import { Alert } from '@mantine/core';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class StyleErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Only log non-style related errors to avoid spam
    if (
      !error.message.includes('style property') &&
      !error.message.includes('data-variant')
    ) {
      console.error('StyleErrorBoundary caught an error:', error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Reset error boundary when children change (route navigation)
    if (prevProps.children !== this.props.children && this.state.hasError) {
      this.setState({ hasError: false, error: undefined });
    }
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI or the children anyway for style errors
      if (
        this.state.error?.message.includes('style property') ||
        this.state.error?.message.includes('data-variant')
      ) {
        // For style errors, just render the children anyway
        return this.props.children;
      }

      return (
        this.props.fallback || (
          <Alert color="red" title="Something went wrong">
            An error occurred while rendering this component.
          </Alert>
        )
      );
    }

    return this.props.children;
  }
}
