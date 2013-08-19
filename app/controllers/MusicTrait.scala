package controllers

import play.api._
import play.api.mvc._

import play.api.libs.ws._
import play.api.libs.ws.WS
import play.api.libs.json

import scala.concurrent.Future

/* Holds the functionality for interfacing with external music services such as Last.fm.
 */
trait MusicSearch {

	//Base URL for last.fm API requests
	private val last_fm_url = "http://ws.audioscrobbler.com/2.0/"

	/* Constructs and returns the URL to be used to search for a track on last.fm
	 */
	private def lfm_track_search_url(query: String, limit: Int = 30): String = last_fm_url + 
		"?method=track.search" + 
		"&track=" + query.replace(" ","+") + 
		"&api_key=" + System.getenv("LASTFM_API_KEY") + 
		"&limit=" + limit +
		"&format=" + "json"

	/* Constructs and returns the URL to be used to get info for a track on last.fm by the mbid
	 */
	private def lfm_track_info_mbid_url(mbid: String): String = last_fm_url + 
		"?method=track.getInfo" + 
		"&mbid=" + mbid + 
		"&api_key=" + System.getenv("LASTFM_API_KEY") + 
		"&format=" + "json"

	/* Constructs and returns the URL to be used to get info for a track on last.fm by the mbid
	 */
	private def lfm_track_info_url(artist: String, name: String): String = last_fm_url + 
		"?method=track.getInfo" + 
		"&artist=" + artist.replace(" ","+") +
		"&track=" + name.replace(" ","+") + 
		"&api_key=" + System.getenv("LASTFM_API_KEY") + 
		"&format=" + "json"

	/* Performs the search for a song and returns the result as a JSON document.
	 */
	def musicSearch(track: String): scala.concurrent.Future[play.api.libs.ws.Response] = {
		WS.url( lfm_track_search_url(track, 15) ).get()
	}

	/* Requests the details for a song and returns the result as a JSON document.
	 * Requires the musicbrainz database ID as a parameter.
	 */
	def musicInfo(mbid: String): scala.concurrent.Future[play.api.libs.ws.Response] = {
		WS.url( lfm_track_info_mbid_url(mbid) ).get()
	}

	/* Requests the details for a song and returns the result as a JSON document.
	 * Requires the artist and song name as parameters.
	 */
	def musicInfo(artist: String, name: String) = {
		WS.url( lfm_track_info_url(artist, name) ).get()
	}
}