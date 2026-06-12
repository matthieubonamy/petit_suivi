// Web stub for expo-image-picker
// Converts images to base64 data URIs immediately so they persist in localStorage

export const MediaTypeOptions = { All: 'All', Videos: 'Videos', Images: 'Images' };

export async function requestMediaLibraryPermissionsAsync() {
  return { status: 'granted' };
}

export async function requestCameraPermissionsAsync() {
  return { status: 'granted' };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function openFilePicker(capture?: 'environment' | 'user'): Promise<{
  canceled: boolean;
  assets?: Array<{ uri: string; width: number; height: number }>;
}> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    if (capture) {
      input.setAttribute('capture', capture);
    }

    let settled = false;

    input.onchange = async () => {
      if (settled) return;
      settled = true;
      const file = input.files?.[0];
      if (!file) return resolve({ canceled: true });

      try {
        // Convert to base64 immediately so the URI persists (no blob URL)
        const base64 = await fileToBase64(file);
        const img = new window.Image();
        img.onload = () =>
          resolve({
            canceled: false,
            assets: [{ uri: base64, width: img.width, height: img.height }],
          });
        img.onerror = () =>
          resolve({ canceled: false, assets: [{ uri: base64, width: 300, height: 300 }] });
        img.src = base64;
      } catch {
        resolve({ canceled: true });
      }
    };

    // Handle cancel (focus returns to window without file change)
    const onFocus = () => {
      setTimeout(() => {
        if (!settled && (!input.files || input.files.length === 0)) {
          settled = true;
          resolve({ canceled: true });
        }
        window.removeEventListener('focus', onFocus);
      }, 500);
    };
    window.addEventListener('focus', onFocus);

    input.click();
  });
}

export async function launchImageLibraryAsync(_options?: object) {
  return openFilePicker(); // galerie — sans capture
}

export async function launchCameraAsync(_options?: object) {
  return openFilePicker('environment'); // caméra arrière
}

export default {
  MediaTypeOptions,
  requestMediaLibraryPermissionsAsync,
  requestCameraPermissionsAsync,
  launchImageLibraryAsync,
  launchCameraAsync,
};
