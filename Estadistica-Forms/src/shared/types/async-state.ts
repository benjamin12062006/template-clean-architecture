/**
 * @module AsyncState
 *
 * Modela el estado de una operacion asincrona en la UI.
 * Reemplaza booleanos `isLoading / isError / data` por una union discriminada limpia.
 *
 * Uso en store:
 *   state: AsyncState<EstadisticasOutput, DomainFailure>
 *
 * Uso en view model:
 *   if (AsyncState.isSuccess(state)) { ... state.data ... }
 */   

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type IdleState = Readonly<{ readonly status: 'idle' }>;

export type LoadingState = Readonly<{ readonly status: 'loading' }>;

export type SuccessState<T> = Readonly<{
  readonly status: 'success';
  readonly data: T;
  readonly updatedAt: number; // Date.now()
}>;

export type FailureState<F> = Readonly<{
  readonly status: 'failure';
  readonly failure: F;
  readonly failedAt: number; // Date.now()
}>;

/** Estado asincrono completo — 4 estados posibles, nunca ambiguos. */
export type AsyncState<T, F> =
  | IdleState
  | LoadingState
  | SuccessState<T>
  | FailureState<F>;

// ---------------------------------------------------------------------------
// Constructors
// ---------------------------------------------------------------------------

export const AsyncState = {
  // `()` => funcion sin parametros.
  idle: (): IdleState => ({ status: 'idle' }),

  loading: (): LoadingState => ({ status: 'loading' }),

  success: <T>(data: T): SuccessState<T> => ({
    status: 'success',
    data,
    updatedAt: Date.now(),
  }),

  failure: <F>(failure: F): FailureState<F> => ({
    status: 'failure',
    failure,
    failedAt: Date.now(),
  }),

  // Guards: retornan boolean en runtime y refinan tipos en TypeScript (`s is ...`).
  isIdle: <T, F>(s: AsyncState<T, F>): s is IdleState => s.status === 'idle',
  isLoading: <T, F>(s: AsyncState<T, F>): s is LoadingState => s.status === 'loading',
  isSuccess: <T, F>(s: AsyncState<T, F>): s is SuccessState<T> => s.status === 'success',
  isFailure: <T, F>(s: AsyncState<T, F>): s is FailureState<F> => s.status === 'failure',

  // Combinator
  map: <T, U, F>(
    state: AsyncState<T, F>,
    fn: (data: T) => U,
  ): AsyncState<U, F> => {
    if (AsyncState.isSuccess(state)) {
      return AsyncState.success(fn(state.data));
    }
    // En no-success no hay `data`; se retorna el mismo estado sin ejecutar `fn`.
    return state as AsyncState<U, F>;
  },
} as const;
