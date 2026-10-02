import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

const DEFAULT_LINE = 'Bismillahirrahmanirrahim'
const MAX_IDS = 500

const awaiting = atom({ plugin: 'bismillah', key: 'awaiting' } as const, false)
const firstIds = atom({ plugin: 'bismillah', key: 'firstIds' } as const, [] as string[])

// Ekrandaki satır id'si, saklanan satır uuid'sinin son bölümü sıfırlanmış hali; ilk dört bölüm eşleşir
const rowKey = (id: string) => id.split('-').slice(0, 4).join('-')

// Kullanıcının kendi yazdığı her prompt'a verilen ilk metinli cevap satırı ayarlanan açılış satırıyla başlar
export const register: Register = (on, options) => {
  const line = typeof options.line === 'string' ? options.line.trim() : DEFAULT_LINE

  on('session.append', async ($, e, next) => {
    if (e.agentId === undefined) {
      const kind = e.origin.kind
      if (e.door === 'prompt' && (kind === 'composer' || kind === 'bridge')) {
        await update($, awaiting, () => true)
      } else if (
        e.door === 'response' &&
        e.message.content.some(b => b.type === 'text') &&
        (await read($, awaiting))
      ) {
        await update($, awaiting, () => false)
        await update($, firstIds, ids => [...ids, rowKey(e.uuid)].slice(-MAX_IDS))
      }
    }

    return next(e)
  })

  on('ui.render', { component: 'AssistantMessage' }, async ($, e, next) => {
    if (!line || !e.props.isFirstOfReply || !(await read($, firstIds)).includes(rowKey(e.requestId))) {
      return next(e)
    }

    return next({ ...e, props: { ...e.props, text: `${line}\n\n${e.props.text}` } })
  })
}
