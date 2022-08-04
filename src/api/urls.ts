const actualUrl = {
    // 'test': {hostname: '192.168.252.140', port: '8000', protocol: 'http:', ws: 'ws'},
    'test': {hostname: '192.168.252.191', port: '9009', protocol: 'http:', ws: 'ws'},
    'main': {
        hostname: window.location.hostname,
        port: window.location.port,
        protocol: window.location.protocol,
        ws: 'wss'
    },
}

const server = window.location.port === '3000' ? 'test' : 'main'

export function getHostname() {
    const {hostname, port, protocol} = actualUrl[server]
    return `${protocol}//${hostname}${port ? ':' + port : ''}`
}

export function getWsLiveDataUrl() {
    const {hostname, port, ws} = actualUrl[server]
    return `${ws}://${hostname}${port ? ':' + port : ''}/liveData`;
}

export const apiUrl = `${getHostname()}/api/`
export const restAuthUrl = `${getHostname()}/rest-auth/`

