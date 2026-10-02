import { atom, read, update } from 'claude-code'
import type { Register, Timer } from 'claude-code'

import { CHICKEN, SPRITE_W, cells, newWorld, resize, runs, scatter, step } from './world'
import type { Cell } from './world'

const FRAME_MS = 180

const tick = atom({ plugin: 'tavuk', key: 'tick' } as const, 0)
const isHidden = atom({ plugin: 'tavuk', key: 'isHidden' } as const, false)

// Prompt'un üstündeki şeritte dolaşan, gönderilen prompt'un harflerini gagalayan tavuk
export const register: Register = on => {
  const world = newWorld(80)
  let timer: Timer | undefined

  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'tavuk', description: 'Tavuğu gizle / geri getir' })
    timer?.cancel()
    timer = $.clock.every(FRAME_MS, () => {
      void (async () => {
        if (await read($, isHidden)) return
        step(world, Math.random)
        await update($, tick, n => n + 1)
      })()
    })

    return next(e)
  })

  on('command.run', { command: 'tavuk' }, async $ => {
    const hidden = await update($, isHidden, h => !h)
    return { text: hidden ? 'Tavuk kümese girdi.' : 'Tavuk geri döndü.' }
  })

  // Gönderilen prompt'un harfleri yem olur
  on('prompt.submit', ($, e, next) => {
    scatter(world, e.text, Math.random)
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey || (await read($, isHidden))) {
      return next(e)
    }
    await read($, tick)

    const width = e.props.bodyColumns - 1
    if (width !== world.width) resize(world, width)

    const row = cells(world)
    const texts = (part: Cell[], prefix: string) =>
      runs(part).map((r, i) => (
        <Text key={`${prefix}${i}`} color={r.color} dimColor={r.dim} wrap="truncate">
          {r.ch}
        </Text>
      ))
    const { Box, Text } = $.ui.resolve(e)

    return (
      <Box flexDirection="row">
        {texts(row.slice(0, world.x), 'a')}
        <Text key="tavuk">{CHICKEN}</Text>
        {texts(row.slice(world.x + SPRITE_W), 'b')}
      </Box>
    )
  })
}
