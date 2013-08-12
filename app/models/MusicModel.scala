package models

import play.api.db._
import play.api.mvc._
import play.api.Play.current

import play.api.libs.json._

import reactivemongo.api._

import play.modules.reactivemongo._
import play.modules.reactivemongo.json.collection.JSONCollection


import reactivemongo.core.commands.LastError

import scala.concurrent.Future


object MusicModel extends Controller with MongoController {

	private def jams_collection: JSONCollection = db.collection[JSONCollection]("jams")

	/* Submits a song as a "jam", artist and title being the artist and title of the song, mbid being the 
	 * unique Musicbrainz identifier for the song, service being the name of the service used to find the 
	 * song.
	 */
	def submitSong(artist: String, title: String, mbid: String, service: String): Future[JsObject] = {
		    val newSong = Json.obj(
		        "type" -> "song",
		        "service" -> service,
		        "created" -> new java.util.Date().getTime(),
		        "artist" -> artist,
		        "title" -> title,
		        "mbid" -> mbid
		    )
	    jams_collection.insert(newSong).map{ lastError => 
	    	Json.obj(
	    		"ok" -> lastError.ok
	    	)
		}
	}

	/* Lists all the songs submitted as "jams" as a Future instance of a List of the document. 
	 * Limit is an optional parameter to limit the number of songs returned.
	 */
	def listSongs(limit: Int = 30): Future[List[JsObject]] = {
		jams_collection
			.find( Json.obj(), Json.obj("artist" -> 1, "title" -> 1) )
			.sort(Json.obj("created" -> -1))
			.options( QueryOpts().batchSize(limit) )
			.cursor[JsObject]
			.toList
	}
}