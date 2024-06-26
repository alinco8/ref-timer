import { ChakraProvider, ColorModeProvider, CSSReset } from '@chakra-ui/react';
import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from '@remix-run/react';
import theme from '~/theme';
import './index.css';

export function Layout({ children }: { readonly children: React.ReactNode }) {
    return (
        <html lang="ja">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return (
        <ChakraProvider theme={theme}>
            <ColorModeProvider>
                <Outlet />
                <CSSReset />
            </ColorModeProvider>
        </ChakraProvider>
    );
}
