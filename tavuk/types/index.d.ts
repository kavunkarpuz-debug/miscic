export type Tick = number

declare module 'claude-code' {
  interface PluginState {
    tavuk: { tick: Tick; isHidden: boolean }
  }
}
