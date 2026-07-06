const AVATAR_STYLE = "avataaars";

export interface DicebearAvatar {
  seed: string;
  url: string;
  dataUri: string;
}

export function getAvatarUrl(seed: string, size = 128) {
  const params = new URLSearchParams({
    seed,
    size: String(size),
  });

  // return `https://api.dicebear.com/9.x/${AVATAR_STYLE}/png?${params.toString()}`;
  return `https://api.dicebear.com/10.x/adventurer/svg?${params.toString()}`;
}

function createSeed() {
  return crypto.randomUUID();
}

export function generateAvatars(count: number): DicebearAvatar[] {
  return Array.from({ length: count }, () => {
    const seed = createSeed();
    const url = getAvatarUrl(seed);

    return {
      seed,
      url,
      dataUri: url,
    };
  });
}
