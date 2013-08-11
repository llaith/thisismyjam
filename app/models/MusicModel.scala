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

// import scala.concurrent.ExecutionContext.Implicits.global

object MusicModel extends Controller with MongoController {

	private def jams_collection: JSONCollection = db.collection[JSONCollection]("jams")

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

	def listSongs(limit: Long): Future[List[JsObject]] = {
		val cursor: Cursor[JsObject] = jams_collection
										.find( Json.obj(), Json.obj("artist" -> 1, "title" -> 1) )
										.sort(Json.obj("created" -> -1))
										.options( QueryOpts().batchSize(limit) )
										.cursor[JsObject]

		cursor.toList
	}
}