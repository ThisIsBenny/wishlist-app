export interface Migration {
  readonly name: string
  readonly version: number
  up(): Promise<void>
  down?(): Promise<void>
}
