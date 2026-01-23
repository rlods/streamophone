
// Extend Window interface for webkit AudioContext
declare global {
	interface Window {
		webkitAudioContext: typeof AudioContext
	}
}

export const AUDIO_CONTEXT: AudioContext = new (window.AudioContext || window.webkitAudioContext)()
