import crypto from 'node-forge'

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

export type ImageLink = { quality: string; url: string }
export type DownloadLink = { quality: string; url: string }

export interface TokenExtractors {
  song: (url: string) => string | undefined
  album: (url: string) => string | undefined
  artist: (url: string) => string | undefined
  playlist: (url: string) => string | undefined
}

export const tokenExtractors: TokenExtractors = {
  song: (url) => url.match(/jiosaavn\.com\/song\/[^/]+\/([^/?#]+)/)?.[1],
  album: (url) => url.match(/jiosaavn\.com\/album\/[^/]+\/([^/?#]+)/)?.[1],
  artist: (url) => url.match(/jiosaavn\.com\/artist\/[^/]+\/([^/?#]+)/)?.[1],
  playlist: (url) => {
    const matches = url.match(/(?:jiosaavn\.com|saavn\.com)\/(?:featured|s\/playlist)\/[^/]+\/([^/?#]+)$|\/([^/?#]+)$/)
    const filtered = matches?.filter((item) => item !== undefined)
    return (filtered && filtered[filtered.length - 1 || 0]) || undefined
  }
}

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

export const pickUserAgent = (userAgents: string[] = defaultUserAgents): string => {
  const agents = userAgents.length > 0 ? userAgents : defaultUserAgents
  const choice = Math.floor(Math.random() * agents.length)
  return agents[choice]!
}

export const stringifyIds = (ids: string | string[]) =>
  Array.isArray(ids) ? ids.filter(Boolean).join(',') : ids

export const ensureToken = (token: string | undefined, kind: keyof TokenExtractors) => {
  if (!token) throw new Error(`Unable to extract ${kind} token from link`)
  return token
}
