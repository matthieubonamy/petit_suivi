// Web stub for expo-image-manipulator
export const SaveFormat = { JPEG: 'jpeg', PNG: 'png', WEBP: 'webp' };
export const FlipType = { Vertical: 'vertical', Horizontal: 'horizontal' };

export async function manipulateAsync(
  uri: string,
  _actions?: object[],
  _options?: object
): Promise<{ uri: string; width: number; height: number; base64?: string }> {
  // On web, return the uri unchanged (no manipulation needed for web demo)
  return { uri, width: 100, height: 100 };
}

export default { manipulateAsync, SaveFormat, FlipType };
