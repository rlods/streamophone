import axios from 'axios'
//
import config from '../config'
// import { changeSamplerSampleBPM, changeSamplerSampleNormalizationVolume, changeSamplerSampleSpeed } from '../actions/sampler'

// ------------------------------------------------------------------

const API_FETCHER = axios.create({ baseURL: config.API.URL })

// ------------------------------------------------------------------

export const fetch = async url => {
	const response = await API_FETCHER.get(url)
	const { data } = response
	if (data && data.error)
		throw new Error(data.error)
	return data
}

// ------------------------------------------------------------------

export const loadTracks = ({ providerId, resourceType, resourceId, samplesCount, samplesTransformation }) =>
	fetch(`tracks/${providerId}/${resourceType}/${resourceId}?count=${samplesCount}&transformation=${samplesTransformation}`)

// ------------------------------------------------------------------

//	Enrichment // TODO re-enable
//	provider.enrichTracks(tracks, (baseIndex, enrichedTracks) => {
//		console.log(`${enrichedTracks.length} tracks have been enriched`)
//		enrichedTracks.forEach((enrichedTrack, index) => {
//			const sampleIndex = baseIndex + index
//			// Update normalization volume (TODO: apply that also in the Player)
//			if (enrichedTrack.gain) {
//				let volume = 0.5 * Math.pow(10, ((-12 - enrichedTrack.gain) / 20))
//				if (volume > 1.0) volume = 1.0
//				dispatch(changeSamplerSampleNormalizationVolume(sampleIndex, volume))
//			}
//			// Update BPM (TODO: apply that also in the Player)
//			if (enrichedTrack.bpm) {
//				if (sourceBPM > 0)
//					dispatch(changeSamplerSampleSpeed(sampleIndex, sourceBPM / enrichedTrack.bpm))
//				dispatch(changeSamplerSampleBPM(sampleIndex, enrichedTrack.bpm))
//			}
//		})
//	})
