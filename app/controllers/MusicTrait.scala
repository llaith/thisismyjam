package controllers

import play.api._
import play.api.mvc._

import play.api.libs.ws._
import play.api.libs.ws.WS
import play.api.libs.json

/* Provides an easy way of checking for the user being logged in across the controllers.
 * Controllers that require user authentication use this trait and wrap the necessary action with isAuthenticated
 * to implement user authentication handling.
 */
trait MusicSearch {

	private val last_fm_url = "http://ws.audioscrobbler.com/2.0/"

	private def lfm_track_search_url(query: String): String = last_fm_url + 
		"?method=track.search" + 
		"&track=" + query + 
		"&api_key=" + System.getenv("LASTFM_API_KEY") + 
		"&format=" + "json"

	def musicSearch(track: String) = {
		WS.url( lfm_track_search_url(track) ).get()
	}
}