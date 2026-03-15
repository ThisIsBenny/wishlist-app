import { describe, it, expect } from 'vitest'
import { runPipeline } from '../index'

const workingUrls = [
  'https://nomadgoods.com/eu/products/stratos-band-black-hardware-ultra-orange',
  'https://shop.everythingsmart.io/products/everything-presence-pro',
  'https://www.berrybase.de/yubico-yubikey-5c-nfc',
  'https://ablecarry.com/products/core-sling-ultra-black',
  'https://www.mukama.com/de/products/able-carry-core-sling',
  'https://babykochs.de/hoppstar-kinder-digitalkamera-expert-mit-selfie-kamera/',
  'https://www.baby-walz.de/p/britax-roemer-kinderfahrradsitz-jockey-maxi-warm-white-8306052/',
  'https://www.mueller.de/p/lego-star-wars-75421-smart-play-darth-vaders-tie-fighter-PPN3155353/',
  'https://www.amazon.de/Anker-geflochtenes-schmutzabweisendes-Ladekabel-MacBook/dp/B0DBTTC2CH',
  'https://www.lego.com/de-de/product/death-star-75419',
]

const knownIssues = [
  {
    url: 'https://www.idealo.de/preisvergleich/OffersOfProduct/208344924_-capture-clip-v3-inkl-wechselplatte-kelp-peak-design.html',
    reason: 'Returns 503 (AkamaiGHost)',
  },
  {
    url: 'https://www.smythstoys.com/de/de-de/spielzeug/action-spielzeug/actionfiguren/super-mario-figuren-und-sets/super-mario-galaxy-film-interaktives-spielzeug-schluepfender-yoshi/p/254238',
    reason: 'Blocked by Incapsula bot protection',
  },
]

describe('Pipeline URL Integration Tests', () => {
  describe.each(workingUrls)('Working URL: %s', (url) => {
    it('should extract metadata', async () => {
      const result = await runPipeline(url, 60000)

      expect(result.title).toBeTruthy()
    }, 70000)
  })

  describe.each(knownIssues)('Known Issue - $reason: %s', ({ url, reason }) => {
    it.skip(`skipped: ${reason}`, async () => {
      const result = await runPipeline(url, 60000)

      expect(result.title).toBeTruthy()
    }, 70000)
  })
})
