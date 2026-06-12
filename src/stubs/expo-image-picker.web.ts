// Web stub for expo-image-picker
export const MediaTypeOptions = { All: 'All', Videos: 'Videos', Images: 'Images' };

export async function requestMediaLibraryPermissionsAsync() {
  return { status: 'granted' };
}

export async function requestCameraPermissionsAsync() {
  return { status: 'granted' };
}

export async function launchImageLibraryAsync(_options?: object): Promise<{
  canceled: boolean;
  assets?: Array<{ uri: string; width: number; height: number }>;
}> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return resolve({ canceled: true });
      const uri = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () =>
        resolve({ canceled: false, assets: [{ uri, width: img.width, height: img.height }] });
      img.src = uri;
    };
    input.oncancel = () => resolve({ canceled: true });
    input.click();
  });
}

export async function launchCameraAsync(_options?: object) {
  return launchImageLibraryAsync(_options);
}

export default { MediaTypeOptions, requestMediaLibraryPermissionsAsync, requestCameraPermissionsAsync, launchImageLibraryAsync, launchCameraAsync };
