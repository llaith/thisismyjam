package controllers

import play.api._
import play.api.mvc._

import play.api.libs.ws._
import play.api.libs.ws.WS
import play.api.libs.json

/* Holds the functionality for interfacing with external music services such as Last.fm.
 */
trait MusicSearch {

	//Base URL for last.fm API requests
	private val last_fm_url = "http://ws.audioscrobbler.com/2.0/"

	//Constructs and returns the URL to be used to search for a track on last.fm
	private def lfm_track_search_url(query: String, limit: Int = 30): String = last_fm_url + 
		"?method=track.search" + 
		"&track=" + query.replace(" ","+") + 
		"&api_key=" + System.getenv("LASTFM_API_KEY") + 
		"&limit=" + limit +
		"&format=" + "json"

	//Performs the search for a song and returns the result as a JSON document.
	def musicSearch(track: String): scala.concurrent.Future[play.api.libs.ws.Response] = {
		WS.url( lfm_track_search_url(track, 15) ).get()
	}
}