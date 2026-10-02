export type MessageIds = string[]

declare module 'claude-code' {
  interface PluginState {
    bismillah: { awaiting: boolean; firstIds: MessageIds }
  }
}
