export const isMobile = (str: string): boolean => {
  //const regex = new RegExp('^09[0-9]\\d{8}$');
  return /^(09\d{9}|9\d{9})$/.test(str);
};

export async function convertImageToBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}

const DEFAULT_AVATAR_MARKERS = ['default-avatar', 'image-default'];

/** Shared placeholder for job seeker and employer when no custom photo exists. */
export const DEFAULT_AVATAR_SRC = '/images/default-avatar.png';

/** True when avatar is a real uploaded photo (not the placeholder/default). */
export function hasCustomAvatar(avatar: unknown): boolean {
  if (typeof avatar !== 'string') return false;
  const value = avatar.trim();
  if (!value) return false;
  return !DEFAULT_AVATAR_MARKERS.some((marker) => value.includes(marker));
}

/**
 * Resolve user avatar values from the API into a browser-loadable URL.
 * DB may store a bare filename under storage/profile_images.
 * Returns null for default/placeholder avatars.
 */
export function resolveAvatarUrl(
  avatar: unknown,
  baseUrl?: string,
): string | null {
  if (!hasCustomAvatar(avatar)) return null;
  const value = (avatar as string).trim();

  if (/^(blob:|data:)/i.test(value)) {
    return value;
  }

  const origin =
    baseUrl?.replace(/\/$/, '') ||
    (typeof window !== 'undefined' ? window.location.origin : '');

  if (/^https?:\/\//i.test(value)) {
    try {
      const parsed = new URL(value);
      // Legacy bug: url(filename) → https://host/file.jpg (missing storage path)
      if (/^\/[^/]+\.(jpe?g|png|gif|webp|svg)$/i.test(parsed.pathname)) {
        return `${parsed.origin}/storage/profile_images${parsed.pathname}`;
      }
    } catch {
      // keep original
    }
    return value;
  }

  if (value.startsWith('/storage/') || value.startsWith('storage/')) {
    return `${origin}/${value.replace(/^\//, '')}`;
  }

  if (value.startsWith('profile_images/')) {
    return `${origin}/storage/${value}`;
  }

  if (!value.includes('/')) {
    return `${origin}/storage/profile_images/${value}`;
  }

  return `${origin}/${value.replace(/^\//, '')}`;
}

/** Always returns a displayable avatar URL (custom or shared default). */
export function resolveAvatarSrc(
  avatar: unknown,
  baseUrl?: string,
): string {
  return resolveAvatarUrl(avatar, baseUrl) ?? DEFAULT_AVATAR_SRC;
}
