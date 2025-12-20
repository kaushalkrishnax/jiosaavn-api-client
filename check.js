/** Quick check script to verify downloadLinks are populated when encryptedMediaUrl exists */
import { searchSongs, getSongsById } from './index.ts'

// Helper logger
const logLinks = (links) => {
  if (!links || links.length === 0) {
    console.log('downloadLinks: none')
    return
  }
  console.log('downloadLinks:')
  links.forEach((l) => console.log(`  ${l.quality}: ${l.url}`))
}

const main = async () => {
  // Find a song via search
  const search = await searchSongs({ query: 'blinding lights', limit: 1 })
  const songId = search.data.results[0]?.id
  console.log('search ok:', search.ok, 'status:', search.status)
  console.log('search first song id:', songId)
  console.log('search first song downloadLinks:');
  logLinks(search.data.results[0]?.downloadLinks)

  // Also test a known song ID to ensure repeatability
  const knownId = songId || 'fW-Mxsnu'
  if (!songId) {
    console.log('\n(using fallback knownId)', knownId)
  }

  // Fetch full song details to ensure decrypted links are added
  if (songId) {
    const details = await getSongsById(songId)
    console.log('\ngetSongsById ok:', details.ok, 'status:', details.status)
    const song = details.data.songs[0]
    console.log('song id:', song.id)
    console.log('has encryptedMediaUrl:', Boolean(song.encryptedMediaUrl))
    if (song.encryptedMediaUrl) {
      console.log('encryptedMediaUrl (truncated):', song.encryptedMediaUrl.slice(0, 40) + '...')
    }
    logLinks(song.downloadLinks)
  }
  // Repeat check for knownId if different
  if (songId !== knownId && knownId) {
    const details = await getSongsById(knownId)
    console.log('\ngetSongsById (knownId) ok:', details.ok, 'status:', details.status)
    const song = details.data.songs[0]
    console.log('song id:', song.id)
    console.log('has encryptedMediaUrl:', Boolean(song.encryptedMediaUrl))
    if (song.encryptedMediaUrl) {
      console.log('encryptedMediaUrl (truncated):', song.encryptedMediaUrl.slice(0, 40) + '...')
    }
    logLinks(song.downloadLinks)
  }
}

main().catch((err) => {
  console.error('check.js error:', err)
  process.exit(1)
})
