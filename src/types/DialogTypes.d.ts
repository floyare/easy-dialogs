export type DialogType = {
    id: string;
    component: React.ComponentType<any>;
    props?: Record<string, any>;
}