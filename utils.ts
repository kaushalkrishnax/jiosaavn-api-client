import crypto from 'node-forge'
import type { ImageLink, DownloadLink, TokenExtractors } from './index.d.js'

/**
 * Default User-Agent strings for HTTP requests
 * Helps avoid API rate limiting by rotating different user agents
 * @internal
 */
const defaultUserAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0',
  'Mozilla/5.0 (Linux; Android 13; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:136.0) Gecko/20100101 Firefox/136.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) obsidian/1.8.4 Chrome/130.0.6723.191 Electron/33.3.2 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64; rv:135.0) Gecko/20100101 Firefox/135.0',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'
]

/**
 * Token extractors for parsing JioSaavn URLs
 * Extracts unique tokens from different types of JioSaavn URLs
 */
export const tokenExtractors: TokenExtractors = {
  /**
   * Extract token from song URL
   * @param url - JioSaavn song URL
   * @returns Token if found, undefined otherwise
   * @example
   * tokenExtractors.song('https://www.jiosaavn.com/song/blinding-lights/EqAyBEKEBRs')
   * // Returns: 'EqAyBEKEBRs'
   */
  song: (url) => url.match(/jiosaavn\.com\/song\/[^/]+\/([^/?#]+)/)?.[1],

  /**
   * Extract token from album URL
   * @param url - JioSaavn album URL
   * @returns Token if found, undefined otherwise
   */
  album: (url) => url.match(/jiosaavn\.com\/album\/[^/]+\/([^/?#]+)/)?.[1],

  /**
   * Extract token from artist URL
   * @param url - JioSaavn artist URL
   * @returns Token if found, undefined otherwise
   */
  artist: (url) => url.match(/jiosaavn\.com\/artist\/[^/]+\/([^/?#]+)/)?.[1],

  /**
   * Extract token from playlist URL
   * @param url - JioSaavn playlist URL
   * @returns Token if found, undefined otherwise
   */
  playlist: (url) => {
    const matches = url.match(/(?:jiosaavn\.com|saavn\.com)\/(?:featured|s\/playlist)\/[^/]+\/([^/?#]+)$|\/([^/?#]+)$/)
    const filtered = matches?.filter((item) => item !== undefined)
    return (filtered && filtered[filtered.length - 1 || 0]) || undefined
  }
}

/**
 * Creates image URLs in different quality sizes from a base image URL
 * Converts HTTP to HTTPS and replaces size parameters
 *
 * @param link - Base image URL from JioSaavn API
 * @returns Array of ImageLink objects with different quality options
 * @throws Returns empty array if link is falsy
 *
 * @example
 * const links = createImageLinks('http://c.saavncdn.com/...150x150.jpg');
 * // Returns:
 * // [
 * //   { quality: '50x50', url: 'https://...' },
 * //   { quality: '150x150', url: 'https://...' },
 * //   { quality: '500x500', url: 'https://...' }
 * // ]
 */
export const createImageLinks = (link: string): ImageLink[] => {
  if (!link) return []

  const qualities = ['50x50', '150x150', '500x500']
  const qualityRegex = /150x150|50x50/
  const protocolRegex = /^http:\/\//

  return qualities.map((quality) => ({
    quality,
    url: link.replace(qualityRegex, quality).replace(protocolRegex, 'https://')
  }))
}

/**
 * Decrypts encrypted media URL and generates download links in various bitrates
 * Uses DES-ECB decryption with JioSaavn's known key and IV
 *
 * @param encryptedMediaUrl - Base64-encoded encrypted media URL from API
 * @returns Array of DownloadLink objects with different quality bitrates (12, 48, 96, 160, 320 kbps)
 * @throws Returns empty array if encryptedMediaUrl is falsy
 *
 * @example
 * const links = createDownloadLinks(encryptedUrl);
 * // Returns:
 * // [
 * //   { quality: '12kbps', url: 'https://...' },
 * //   { quality: '48kbps', url: 'https://...' },
 * //   { quality: '96kbps', url: 'https://...' },
 * //   { quality: '160kbps', url: 'https://...' },
 * //   { quality: '320kbps', url: 'https://...' }
 * // ]
 */
export const createDownloadLinks = (encryptedMediaUrl: string): DownloadLink[] => {
  if (!encryptedMediaUrl) return []

  const key = '38346591'
  const iv = '00000000'

  const encrypted = crypto.util.decode64(encryptedMediaUrl)
  const decipher = crypto.cipher.createDecipher('DES-ECB', crypto.util.createBuffer(key))
  decipher.start({ iv: crypto.util.createBuffer(iv) })
  decipher.update(crypto.util.createBuffer(encrypted))
  decipher.finish()
  const decryptedLink = decipher.output.getBytes()

  const qualities = [
    { id: '_12', bitrate: '12kbps' },
    { id: '_48', bitrate: '48kbps' },
    { id: '_96', bitrate: '96kbps' },
    { id: '_160', bitrate: '160kbps' },
    { id: '_320', bitrate: '320kbps' }
  ]

  return qualities.map((quality) => ({
    quality: quality.bitrate,
    url: decryptedLink.replace('_96', quality.id)
  }))
}

/**
 * Selects a random User-Agent from provided or default list
 * Useful for avoiding API rate limiting by rotating user agents
 *
 * @param userAgents - Optional array of User-Agent strings. If empty or not provided, uses defaults
 * @returns A randomly selected User-Agent string
 *
 * @example
 * const agent = pickUserAgent();
 * // Returns random default User-Agent
 *
 * const customAgent = pickUserAgent(['Custom UA 1', 'Custom UA 2']);
 * // Returns one of the custom UAs
 */
export const pickUserAgent = (userAgents: string[] = defaultUserAgents): string => {
  const agents = userAgents && userAgents.length > 0 ? userAgents : defaultUserAgents
  const choice = Math.floor(Math.random() * agents.length)
  return agents[choice]!
}

/**
 * Converts single ID or array of IDs to comma-separated string
 * Filters out falsy values when processing arrays
 *
 * @param ids - Single ID string or array of ID strings
 * @returns Comma-separated string of IDs (or single ID if input was string)
 *
 * @example
 * stringifyIds('song-123')
 * // Returns: 'song-123'
 *
 * stringifyIds(['song-1', 'song-2', 'song-3'])
 * // Returns: 'song-1,song-2,song-3'
 *
 * stringifyIds(['song-1', '', 'song-2'])
 * // Returns: 'song-1,song-2' (empty strings filtered out)
 */
export const stringifyIds = (ids: string | string[]): string =>
  Array.isArray(ids) ? ids.filter(Boolean).join(',') : ids

/**
 * Ensures a token is present, throws error if not found
 * Used for URL-based API calls that require extracted tokens
 *
 * @param token - Token to validate (may be undefined)
 * @param kind - Type of token being validated (for error message)
 * @returns The token if present
 * @throws Error with message indicating which token type could not be extracted
 *
 * @example
 * const token = ensureToken(extractedToken, 'song');
 * // Throws: Error: Unable to extract song token from link (if token is undefined)
 */
export const ensureToken = (token: string | undefined, kind: keyof TokenExtractors): string => {
  if (!token) throw new Error(`Unable to extract ${kind} token from link`)
  return token
}
