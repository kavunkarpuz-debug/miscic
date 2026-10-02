import { describe, expect, test } from 'claude-code/testing'

const PROPS = { hasSurvey: false, isWorking: false, maxRows: 10, bodyColumns: 41 } as never

for (const surface of ['terminal', 'desktop'] as const) {
  describe(surface, () => {
    test('şeritte emoji tavuk çizilir, satır şerit genişliğine sığar', async ($, on) => {
      on('ui.render', { component: 'AbovePrompt' }, () => null as never)

      const ui = await $.ui.mount({ plugin: 'tavuk', surface, component: 'AbovePrompt', props: PROPS })

      expect(await ui.find({ type: 'Text', text: '\u{1F424}' })).toBeDefined()
      // Civciv 2 hücre, geri kalan metin 38 hücre
      const others = (await ui.findAll({ type: 'Text' })).filter(t => t.text !== '\u{1F424}')
      expect(others.reduce((n, t) => n + [...t.text].length, 0)).toBe(38)
    })
  })
}
