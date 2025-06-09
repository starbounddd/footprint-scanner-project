export enum AppMode {
  ONE_TO_ONE = 'one-to-one',
  ONE_TO_MANY = 'one-to-many',
}

export interface ControlPanelProps {
    mode: AppMode;
    setMode: (mode: AppMode) => void;
    }
