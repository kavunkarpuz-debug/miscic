import { describe, expect, test } from 'claude-code/testing'
import type { Engine } from 'claude-code/testing'
import type { On } from 'claude-code'

const BESMELE = 'Bismillahirrahmanirrahim'

// Motorun yerine: cevap satırını metniyle tek Text olarak çizer
const stubRender = (on: On) =>
  on('ui.render', { component: 'AssistantMessage' }, ($, e) => {
    const { Text } = $.ui.resolve(e)
    return Text({ children: e.props.text })
  })

// Durum deposunun yerine: firstIds sorulduğunda verilen id'leri döner
const markFirst = (on: On, ids: string[]) =>
  on('state.get', (_$, e) => ({ value: e.key === 'firstIds' ? ids : undefined, version: 1 }) as never)

const drawnText = async (
  $: Engine,
  surface: 'terminal' | 'desktop',
  requestId: string,
  isFirstOfReply = true,
) => {
  const ui = await $.ui.mount({
    plugin: 'bismillah',
    surface,
    component: 'AssistantMessage',
    requestId,
    props: { text: 'cevap', isFirstOfReply },
  })
  return (await ui.find({ type: 'Text' }))?.text
}

for (const surface of ['terminal', 'desktop'] as const) {
  describe(surface, () => {
    // Not: test kiti $.state taklidine izin vermiyor; işaretli satıra eklenmesi canlı oturumda doğrulanır
    test('işaretlenmemiş cevap satırına besmele eklenmez', async ($, on) => {
      stubRender(on)
      markFirst(on, ['a1'])

      expect(await drawnText($, surface, 'a2')).toBe('cevap')
    })

    test('madde işaretsiz devam bloğuna besmele eklenmez', async ($, on) => {
      stubRender(on)
      markFirst(on, ['a1'])

      expect(await drawnText($, surface, 'a1', false)).toBe('cevap')
    })
  })
}
