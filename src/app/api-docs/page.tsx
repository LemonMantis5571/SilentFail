'use client';

import { useEffect, useRef } from 'react';

export default function ApiDocsPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const scriptLoaded = useRef(false);

    useEffect(() => {
        if (scriptLoaded.current) return;

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@scalar/api-reference';
        script.async = true;

        script.onload = () => {
            scriptLoaded.current = true;
        };

        document.body.appendChild(script);


        return () => {

            script.remove();


            const scalarElements = document.querySelectorAll('[class*="scalar"], [id*="scalar"]');
            scalarElements.forEach(el => el.remove());


            const styleTags = document.querySelectorAll('style[data-scalar]');
            styleTags.forEach(el => el.remove());
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-50 bg-[#0f0f10] overflow-y-auto"
        >
            <div
                id="api-reference"
                data-url="/api/openapi"
                data-configuration={JSON.stringify({
                    theme: 'purple',
                    darkMode: true,
                    hiddenClients: ['unirest'],
                    defaultHttpClient: {
                        targetKey: 'javascript',
                        clientKey: 'fetch',
                    },
                })}
            />
        </div>
    );
}
