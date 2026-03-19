import * as net from 'node:net'

const BLOCKED_HOSTNAMES = [
  'localhost',
  'localhost.localdomain',
  'ip6-localhost',
  'ip6-loopback',
  'ip6-allnodes',
  'ip6-allrouters',
]

const BLOCKED_SUBDOMAINS = [
  'aws',
  'cloud',
  'internal',
  'intranet',
  'admin',
  'dev',
  'staging',
  'test',
  'admin',
  'portal',
  'console',
]

const BLOCKED_ECOMMERCE_DOMAINS = [
  'amazon',
  'ebay',
  'etsy',
  'walmart',
  'target',
  'bestbuy',
]

const IPV6_PRIVATE_PATTERNS = [
  /^::1$/, // IPv6 loopback
  /^fe80:/i, // IPv6 link-local
  /^fc00:/i, // IPv6 unique local
  /^fd00:/i, // IPv6 unique local
  /^::ffff:/i, // IPv4-mapped IPv6
]

const IPV4_PRIVATE_PATTERNS = [
  /^127\./, // Loopback: 127.0.0.0/8
  /^10\./, // Private: 10.0.0.0/8
  /^172\.(1[6-9]|2\d|3[01])\./, // Private: 172.16.0.0/12
  /^192\.168\./, // Private: 192.168.0.0/16
  /^169\.254\./, // Link-local: 169.254.0.0/16 (includes 169.254.169.254 AWS metadata)
  /^0\./, // Current network: 0.0.0.0/8
  /^224\./, // Multicast: 224.0.0.0/4
  /^240\./, // Reserved: 240.0.0.0/4
]

export class UrlValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UrlValidationError'
  }
}

function isPrivateIpAddress(ipString: string): boolean {
  return IPV4_PRIVATE_PATTERNS.some((pattern) => pattern.test(ipString))
}

function isPrivateIpv6Address(ipString: string): boolean {
  return IPV6_PRIVATE_PATTERNS.some((pattern) => pattern.test(ipString))
}

function isPrivateHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase()

  if (BLOCKED_HOSTNAMES.includes(lower)) {
    return true
  }

  if (lower.endsWith('.local')) {
    return true
  }

  const normalizedHostname = lower.startsWith('[') ? lower.slice(1, -1) : lower
  const ip = net.isIP(normalizedHostname)
  if (ip === 4 && isPrivateIpAddress(normalizedHostname)) {
    return true
  }
  if (ip === 6 && isPrivateIpv6Address(normalizedHostname)) {
    return true
  }

  return false
}

export function validateUrlForFetch(urlString: string): URL {
  let url: URL

  try {
    url = new URL(urlString)
  } catch {
    throw new UrlValidationError('Invalid URL format')
  }

  const protocol = url.protocol.toLowerCase()
  if (protocol !== 'http:' && protocol !== 'https:') {
    throw new UrlValidationError(
      `Protocol '${protocol}' is not allowed. Only HTTP(S) are permitted.`
    )
  }

  const hostname = url.hostname.toLowerCase()

  if (isPrivateHostname(hostname)) {
    throw new UrlValidationError(
      'Access to private/internal networks is not allowed'
    )
  }

  const dotIndex = hostname.indexOf('.')
  if (dotIndex > 0) {
    const subdomain = hostname.slice(0, dotIndex)
    const secondLevelDomain = hostname.slice(dotIndex + 1)
    const tldIndex = secondLevelDomain.indexOf('.')
    const domainWithoutTld =
      tldIndex > 0 ? secondLevelDomain.slice(0, tldIndex) : secondLevelDomain

    if (BLOCKED_ECOMMERCE_DOMAINS.includes(domainWithoutTld)) {
      if (BLOCKED_SUBDOMAINS.includes(subdomain)) {
        throw new UrlValidationError('Access to this subdomain is not allowed')
      }
    }
  }

  return url
}
