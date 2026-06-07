type Coin = {
  productId: string
  name: string
  icon: string
  fallback: number
  price?: number
}

type TickerMessage = {
  channel?: string
  events?: Array<{ tickers?: Array<{ product_id?: string; price?: string }> }>
}

const coins: Coin[] = [
  { productId: 'BTC-USD', name: 'Bitcoin', icon: '/assets/coins/btc.svg', fallback: 107055.53 },
  { productId: 'ETH-USD', name: 'Ethereum', icon: '/assets/coins/eth.svg', fallback: 2590.04 },
  { productId: 'SOL-USD', name: 'Solana', icon: '/assets/coins/sol.svg', fallback: 142.53 },
  { productId: 'XRP-USD', name: 'XRP', icon: '/assets/coins/xrp.svg', fallback: 1.852 },
  { productId: 'USDC-USD', name: 'USD Coin', icon: '/assets/coins/usdc.svg', fallback: 0.9997 },
  { productId: 'BNB-USD', name: 'Binance Coin', icon: '/assets/coins/bnb.svg', fallback: 604.41 },
  { productId: 'NIGHT-USD', name: 'Midnight', icon: '/assets/coins/night.svg', fallback: 0.06998 },
  { productId: 'DOGE-USD', name: 'Dogecoin', icon: '/assets/coins/doge.svg', fallback: 0.1278 },
  { productId: 'SUI-USD', name: 'Sui', icon: '/assets/coins/sui.svg', fallback: 1.427 },
  { productId: 'USDT-USD', name: 'Tether', icon: '/assets/coins/usdt.svg', fallback: 1 },
]

function formattedPrice(value: number): string {
  const digits = value >= 100 ? 2 : value >= 1 ? 3 : 5
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`
}

function coinRow(coin: Coin): string {
  return `
    <div class="coin-row" data-product="${coin.productId}">
      <span class="coin-row__price">${formattedPrice(coin.price ?? coin.fallback)}</span>
      <span class="coin-row__name">${coin.name}</span>
      <img class="coin-row__icon" src="${coin.icon}" alt="" width="41" height="41">
    </div>
  `
}

function renderLists(): void {
  const left = document.querySelector<HTMLDivElement>('#coin-list-left')
  const right = document.querySelector<HTMLDivElement>('#coin-list-right')
  if (!left || !right) return
  left.innerHTML = coins.slice(0, 5).map(coinRow).join('')
  right.innerHTML = coins.slice(5).map(coinRow).join('')
}

function updatePrice(coin: Coin): void {
  const price = document.querySelector<HTMLElement>(`[data-product="${coin.productId}"] .coin-row__price`)
  if (price && coin.price) price.textContent = formattedPrice(coin.price)
}

export function connectPriceFeed(): void {
  renderLists()
  let reconnectTimer: number | undefined

  const connect = (): void => {
    const socket = new WebSocket('wss://advanced-trade-ws.coinbase.com')

    socket.addEventListener('open', () => {
      socket.send(JSON.stringify({ type: 'subscribe', product_ids: coins.map(({ productId }) => productId), channel: 'ticker' }))
      socket.send(JSON.stringify({ type: 'subscribe', channel: 'heartbeats' }))
    })

    socket.addEventListener('message', ({ data }) => {
      const message = JSON.parse(data) as TickerMessage
      if (message.channel !== 'ticker') return

      for (const event of message.events ?? []) {
        for (const ticker of event.tickers ?? []) {
          const coin = coins.find(({ productId }) => productId === ticker.product_id)
          if (!coin || !ticker.price) continue
          coin.price = Number(ticker.price)
          updatePrice(coin)
        }
      }
    })

    socket.addEventListener('close', () => {
      window.clearTimeout(reconnectTimer)
      reconnectTimer = window.setTimeout(connect, 3000)
    })
  }

  connect()
}
