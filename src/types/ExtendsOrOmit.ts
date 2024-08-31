export type ExtendsOrOmit<Left, Right, Keys extends keyof any, Type> = Left extends Right ? Type : Omit<Type, Keys>;// eslint-disable-line @typescript-eslint/no-explicit-any
