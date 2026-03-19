import { describe, it, expect } from 'vitest'
import {
  validateUrlForFetch,
  UrlValidationError,
} from '../metadata-plugins/url-validator'

describe('validateUrlForFetch', () => {
  describe('valid URLs', () => {
    it('should accept valid https URL', () => {
      const url = validateUrlForFetch('https://example.com')
      expect(url.href).toBe('https://example.com/')
    })

    it('should accept valid http URL', () => {
      const url = validateUrlForFetch('http://example.com')
      expect(url.href).toBe('http://example.com/')
    })

    it('should accept URL with path', () => {
      const url = validateUrlForFetch('https://example.com/products/item')
      expect(url.pathname).toBe('/products/item')
    })

    it('should accept URL with query params', () => {
      const url = validateUrlForFetch('https://example.com?foo=bar')
      expect(url.search).toBe('?foo=bar')
    })

    it('should accept well-known e-commerce domains', () => {
      expect(() =>
        validateUrlForFetch('https://www.amazon.com/dp/B08N5WRWNW')
      ).not.toThrow()
      expect(() =>
        validateUrlForFetch('https://www.ebay.com/itm/123')
      ).not.toThrow()
    })
  })

  describe('invalid URL format', () => {
    it('should reject invalid URL', () => {
      expect(() => validateUrlForFetch('not-a-url')).toThrow(UrlValidationError)
    })

    it('should reject empty string', () => {
      expect(() => validateUrlForFetch('')).toThrow(UrlValidationError)
    })
  })

  describe('protocol validation', () => {
    it('should reject ftp protocol', () => {
      expect(() => validateUrlForFetch('ftp://example.com')).toThrow(
        /protocol.*not allowed/i
      )
    })

    it('should reject file protocol', () => {
      expect(() => validateUrlForFetch('file:///etc/passwd')).toThrow(
        /protocol.*not allowed/i
      )
    })

    it('should reject javascript protocol', () => {
      expect(() => validateUrlForFetch('javascript:alert(1)')).toThrow(
        /protocol.*not allowed/i
      )
    })

    it('should reject data protocol', () => {
      expect(() =>
        validateUrlForFetch('data:text/html,<script>alert(1)</script>')
      ).toThrow(/protocol.*not allowed/i)
    })
  })

  describe('SSRF protection - localhost', () => {
    it('should reject localhost', () => {
      expect(() => validateUrlForFetch('http://localhost')).toThrow(
        /private.*not allowed/i
      )
    })

    it('should reject localhost with port', () => {
      expect(() => validateUrlForFetch('http://localhost:3000')).toThrow(
        /private.*not allowed/i
      )
    })

    it('should reject 127.0.0.1', () => {
      expect(() => validateUrlForFetch('http://127.0.0.1')).toThrow(
        /private.*not allowed/i
      )
    })

    it('should reject 127.0.0.1 with port', () => {
      expect(() => validateUrlForFetch('http://127.0.0.1:8080')).toThrow(
        /private.*not allowed/i
      )
    })

    it('should reject ::1 IPv6 loopback', () => {
      expect(() => validateUrlForFetch('http://[::1]')).toThrow(
        /private.*not allowed/i
      )
    })
  })

  describe('SSRF protection - private IP ranges', () => {
    it('should reject 10.x.x.x', () => {
      expect(() => validateUrlForFetch('http://10.0.0.1')).toThrow(
        /private.*not allowed/i
      )
    })

    it('should reject 10.x.x.x Amazon AWS', () => {
      expect(() => validateUrlForFetch('http://10.0.1.23')).toThrow(
        /private.*not allowed/i
      )
    })

    it('should reject 172.16.x.x', () => {
      expect(() => validateUrlForFetch('http://172.16.0.1')).toThrow(
        /private.*not allowed/i
      )
    })

    it('should reject 172.31.x.x', () => {
      expect(() => validateUrlForFetch('http://172.31.255.255')).toThrow(
        /private.*not allowed/i
      )
    })

    it('should reject 192.168.x.x', () => {
      expect(() => validateUrlForFetch('http://192.168.1.1')).toThrow(
        /private.*not allowed/i
      )
    })

    it('should reject 192.168.0.100', () => {
      expect(() => validateUrlForFetch('http://192.168.0.100')).toThrow(
        /private.*not allowed/i
      )
    })
  })

  describe('SSRF protection - link-local', () => {
    it('should reject 169.254.x.x (APIPA)', () => {
      expect(() => validateUrlForFetch('http://169.254.169.254')).toThrow(
        /private.*not allowed/i
      )
    })

    it('should reject AWS metadata endpoint', () => {
      expect(() =>
        validateUrlForFetch('http://169.254.169.254/latest/meta-data/')
      ).toThrow(/private.*not allowed/i)
    })

    it('should reject 169.254.0.1', () => {
      expect(() => validateUrlForFetch('http://169.254.0.1')).toThrow(
        /private.*not allowed/i
      )
    })
  })

  describe('SSRF protection - other blocked hostnames', () => {
    it('should reject .local domains', () => {
      expect(() => validateUrlForFetch('http://intranet.local')).toThrow(
        /private.*not allowed/i
      )
    })

    it('should reject ip6-localhost', () => {
      expect(() => validateUrlForFetch('http://ip6-localhost')).toThrow(
        /private.*not allowed/i
      )
    })
  })

  describe('SSRF protection - blocked subdomains on e-commerce', () => {
    it('should reject aws.amazon.com', () => {
      expect(() => validateUrlForFetch('https://aws.amazon.com')).toThrow(
        /subdomain.*not allowed/i
      )
    })

    it('should reject cloud.ebay.com', () => {
      expect(() => validateUrlForFetch('https://cloud.ebay.com')).toThrow(
        /subdomain.*not allowed/i
      )
    })

    it('should reject internal.walmart.com', () => {
      expect(() => validateUrlForFetch('https://internal.walmart.com')).toThrow(
        /subdomain.*not allowed/i
      )
    })

    it('should reject admin.amazon.com', () => {
      expect(() => validateUrlForFetch('https://admin.amazon.com')).toThrow(
        /subdomain.*not allowed/i
      )
    })

    it('should allow www.amazon.com', () => {
      expect(() => validateUrlForFetch('https://www.amazon.com')).not.toThrow()
    })

    it('should allow smile.amazon.com', () => {
      expect(() =>
        validateUrlForFetch('https://smile.amazon.com')
      ).not.toThrow()
    })
  })
})
