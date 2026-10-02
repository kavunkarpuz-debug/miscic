// Civcivin dünyası: tek satırlık şerit, harfler (yem), kırıntılar. Saf fonksiyonlar, rastgelelik dışarıdan verilir.
// Civciv emojisi sola baktığı için hep sola yürür; sol uca varınca sağ uca ışınlanır.

export type Rand = () => number

export type Letter = { x: number; ch: string; shake: number }
export type Crumb = { x: number; ttl: number }

export type World = {
  width: number
  x: number // civcivin sol hücresi (gagası)
  letters: Letter[]
  crumbs: Crumb[]
  peck: number // >0: gagalıyor, kalan kare
  idle: number // >0: duruyor, kalan kare
  hungry: number // yem yokken geçen kare
  step: number
}

export type Cell = { ch: string; color?: string; dim?: boolean }

export const SPRITE_W = 2
const PECK_FRAMES = 4
const CATCH_CHANCE = 0.65
const CRUMB_TTL = 12
const REFILL_AFTER = 50
const RANDOM_FOOD = 'abcçdefgğhıijklmnoöprsştuüvyz'

export const newWorld = (width: number): World => ({
  width: Math.max(width, SPRITE_W + 2),
  x: Math.max(width, SPRITE_W + 2) - SPRITE_W,
  letters: [],
  crumbs: [],
  peck: 0,
  idle: 0,
  hungry: 0,
  step: 0,
})

// Gaganın bulunduğu hücre
export const beakX = (w: World) => w.x

const letterAt = (w: World, x: number) => w.letters.find(l => l.x === x)

// Şerit genişliği değişince tavuğu ve harfleri sığdırır
export const resize = (w: World, width: number) => {
  w.width = Math.max(width, SPRITE_W + 2)
  w.x = Math.min(w.x, w.width - SPRITE_W)
  w.letters = w.letters.filter(l => l.x < w.width)
  w.crumbs = w.crumbs.filter(c => c.x < w.width)
}

// Metnin harflerini şeride yem olarak saçar (tavuğun üstüne ve birbirine bitişik düşmez)
export const scatter = (w: World, text: string, rand: Rand) => {
  const chars = [...text].filter(c => /[\p{L}\p{N}]/u.test(c))
  const max = Math.max(1, Math.floor(w.width / 6))
  for (let i = 0; i < 4 * max && w.letters.length < max && chars.length > 0; i++) {
    const ch = chars.splice(Math.floor(rand() * chars.length), 1)[0]!
    const x = Math.floor(rand() * w.width)
    const onChicken = x >= w.x - 1 && x <= w.x + SPRITE_W
    const crowded = w.letters.some(l => Math.abs(l.x - x) < 2)
    if (!onChicken && !crowded) {
      w.letters.push({ x, ch, shake: 0 })
    } else {
      chars.push(ch)
    }
  }
  w.letters.sort((a, b) => a.x - b.x)
}

// Bir kare ilerletir
export const step = (w: World, rand: Rand) => {
  w.step++
  w.crumbs = w.crumbs.map(c => ({ ...c, ttl: c.ttl - 1 })).filter(c => c.ttl > 0)
  for (const l of w.letters) l.shake = Math.max(0, l.shake - 1)

  const front = beakX(w) - 1

  if (w.peck > 0) {
    w.peck--
    if (w.peck === 0) {
      const target = letterAt(w, front)
      if (target) {
        if (rand() < CATCH_CHANCE) {
          w.letters = w.letters.filter(l => l !== target)
          w.crumbs.push({ x: target.x, ttl: CRUMB_TTL })
        } else {
          target.shake = 3 // ıskaladı, harf titriyor
        }
      }
    }
    return
  }

  if (w.idle > 0) {
    w.idle--
    return
  }

  if (letterAt(w, front)) {
    w.peck = PECK_FRAMES
    return
  }

  if (w.letters.length === 0) {
    w.hungry++
    if (w.hungry > REFILL_AFTER) {
      w.hungry = 0
      scatter(w, RANDOM_FOOD, rand)
    }
  } else {
    w.hungry = 0
  }

  if (rand() < 0.05) {
    w.idle = 3 + Math.floor(rand() * 6)
    return
  }

  // Sol uca vardıysa sağ uca ışınlan
  w.x = w.x > 0 ? w.x - 1 : w.width - SPRITE_W
}

// Şeridi hücre hücre çizer
export const cells = (w: World): Cell[] => {
  const row: Cell[] = Array.from({ length: w.width }, () => ({ ch: ' ' }))
  for (const c of w.crumbs) row[c.x] = { ch: '·', dim: true }
  for (const l of w.letters) row[l.x] = { ch: l.ch, color: l.shake > 0 ? 'yellow' : undefined }

  // Gagalanan harf her vuruşta kırmızı yanıp söner
  const target = w.peck > 0 && w.peck % 2 === 0 ? letterAt(w, beakX(w) - 1) : undefined
  if (target) row[target.x] = { ch: target.ch, color: 'red' }

  // Tavuğun kapladığı hücreler boş kalır; tavuk emojisi buraya çizilir
  for (let i = 0; i < SPRITE_W && w.x + i < w.width; i++) row[w.x + i] = { ch: ' ' }
  return row
}

// Tavuk: yazı tipinin renkli emojisi (🐤 sarı civciv, yandan tam gövde), SPRITE_W hücre genişliğinde
export const CHICKEN = '\u{1F424}'

// Aynı stildeki komşu hücreleri tek parça metinde birleştirir
export const runs = (row: Cell[]) => {
  const out: Cell[] = []
  for (const c of row) {
    const last = out[out.length - 1]
    if (last && last.color === c.color && last.dim === c.dim) last.ch += c.ch
    else out.push({ ...c })
  }
  return out
}
