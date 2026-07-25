export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export interface SpotifyUserProfile {
  id: string;
  display_name: string;
  external_urls: { spotify: string };
  followers: { href: string | null; total: number };
  href: string;
  images: Array<{ url: string; height: number | null; width: number | null }>;
  type: string;
  uri: string;
}
