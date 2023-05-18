/**
 * Defines a context
 */
export type Context<KeyType, ValueType> = KeyType & { __context__: ValueType };

/**
 * Extracts context value type
 */
export type ContextType<Key extends Context<unknown, unknown>> =
  Key extends Context<unknown, infer ValueType> ? ValueType : never;

/**
 * Creates a typed Context.
 * @param key a context key value
 * @template ValueType the type of value that can be provided by this context.
 * @returns the context key value cast to `Context<K, ValueType>`
 */
export function createContext<ValueType, K = unknown>(key: K) {
  return key as Context<K, ValueType>;
}
