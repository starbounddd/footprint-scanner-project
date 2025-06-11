export enum AppMode {
  ONE_TO_ONE = 'one-to-one',
  ONE_TO_MANY = 'one-to-many',
}

export interface ControlPanelProps {
    mode: AppMode;
    setMode: (mode: AppMode) => void;
    }

  export type ImageData = {
    imageName: string;
    imageUrl: string;
  }

export interface ViewStorageProps {
    storedImages: ImageData[];
    setStoredImages: React.Dispatch<React.SetStateAction<ImageData[]>>;
    isImageStored: boolean;
}

