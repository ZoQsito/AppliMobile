export function useSelection(items?: any[]): {
    handleDeselectAll: () => void;
    handleDeselectOne: (item: any) => void;
    handleSelectAll: () => void;
    handleSelectOne: (item: any) => void;
    selected: never[];
};
