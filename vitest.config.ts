import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        typecheck: {
            checker: 'tsc',
            include: ['tests/**/*.{test,spec}.{ts,tsx}'],
            tsconfig: './tsconfig.json'
        },
    },
});