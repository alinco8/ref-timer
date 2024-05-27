import { RemixBrowser } from '@remix-run/react';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';

startTransition(() => {
    hydrateRoot(
        document,
        <StrictMode>
            <ErrorBoundary fallbackRender={({ error }) => error.toString()}>
                <RemixBrowser />
            </ErrorBoundary>
        </StrictMode>,
    );
});
