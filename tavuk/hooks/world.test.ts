import { describe, expect, test } from 'claude-code/testing'

import { SPRITE_W, beakX, cells, newWorld, resize, runs, scatter, step } from './world'

// 0.5: hiç durmaz/dönmez, gagalarsa yakalar
const steady = () => 0.5

describe('tavuk dünyası', () => {
  test('harfler tavuğun üstüne ve birbirine bitişik saçılmaz', () => {
    const w = newWorld(60)
    let seed = 1
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
    scatter(w, 'merhaba dünya nasılsın', rand)

    expect(w.letters.length).toBeGreaterThan(0)
    expect(w.letters.length).toBeLessThanOrEqual(10)
    for (const l of w.letters) {
      expect(l.x >= w.x - 1 && l.x <= w.x + SPRITE_W).toBe(false)
    }
    for (let i = 1; i < w.letters.length; i++) {
      expect(w.letters[i]!.x - w.letters[i - 1]!.x).toBeGreaterThanOrEqual(2)
    }
  })

  test('civciv sağ uçta doğar, sola yürüyüp harfi gagalar ve yer; yerinde kırıntı kalır', () => {
    const w = newWorld(40)
    expect(w.x).toBe(40 - SPRITE_W)
    w.letters = [{ x: 20, ch: 'a', shake: 0 }]

    for (let i = 0; i < 40 && w.letters.length > 0; i++) step(w, steady)

    expect(w.letters).toEqual([])
    expect(w.crumbs.map(c => c.x)).toEqual([20])
    expect(beakX(w)).toBe(21)
  })

  test('ıskalarsa harf yerinde kalır ve titrer', () => {
    const w = newWorld(40)
    w.letters = [{ x: 10, ch: 'b', shake: 0 }]
    w.x = 11
    w.peck = 1

    step(w, () => 0.9)

    expect(w.letters.length).toBe(1)
    expect(w.letters[0]!.shake).toBeGreaterThan(0)
  })

  test('arkada kalan harfe dönmez, sola devam eder', () => {
    const w = newWorld(40)
    w.x = 20
    w.letters = [{ x: 30, ch: 'c', shake: 0 }]

    step(w, steady)

    expect(w.x).toBe(19)
  })

  test('sol uca varınca sağ uca ışınlanır, şeritten taşmaz', () => {
    const w = newWorld(12)
    const xs: number[] = []
    for (let i = 0; i < 30; i++) {
      step(w, steady)
      xs.push(w.x)
      expect(w.x).toBeGreaterThanOrEqual(0)
      expect(w.x + SPRITE_W).toBeLessThanOrEqual(w.width)
    }
    expect(xs.slice(8, 12)).toEqual([1, 0, 10, 9])
  })

  test('civcivin kapladığı hücreler boş bırakılır (emoji oraya çizilir)', () => {
    const w = newWorld(20)
    w.x = 5
    w.letters = [{ x: 6, ch: 'z', shake: 0 }]

    expect(cells(w).slice(5, 5 + SPRITE_W).map(c => c.ch)).toEqual([' ', ' '])
  })

  test('gagalanan harf vuruşta kırmızı yanıp söner', () => {
    const w = newWorld(20)
    w.x = 5
    w.letters = [{ x: 4, ch: 'k', shake: 0 }]

    w.peck = 2
    expect(cells(w)[4]).toEqual({ ch: 'k', color: 'red' })
    w.peck = 1
    expect(cells(w)[4]!.color).toBeUndefined()
  })

  test('genişlik küçülünce civciv ve harfler sığdırılır, satır genişliği korunur', () => {
    const w = newWorld(80)
    w.x = 70
    w.letters = [{ x: 60, ch: 'd', shake: 0 }, { x: 10, ch: 'e', shake: 0 }]
    resize(w, 40)

    expect(w.x + SPRITE_W).toBeLessThanOrEqual(40)
    expect(w.letters.map(l => l.ch)).toEqual(['e'])
    expect(runs(cells(w)).map(r => r.ch).join('').length).toBe(40)
  })
})
