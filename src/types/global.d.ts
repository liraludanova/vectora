export {};

declare global {
    interface Window {
        dataLayer: unknown[];
        gtag: (
            command: "config" | "event" | "js",
            targetId: string | Date,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            params?: Record<string, any>,
        ) => void;
    }
}
