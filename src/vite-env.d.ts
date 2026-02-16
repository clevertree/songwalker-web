/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_LIBRARY_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
