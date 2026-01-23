import type { AppThunk, AppDispatch, RootState, AppExtra } from '../types'

export const initializeApp = (): AppThunk => (
	dispatch: AppDispatch,
	getState: () => RootState,
	{ app }: AppExtra
) => {
	// App initialization logic can be added here
}
