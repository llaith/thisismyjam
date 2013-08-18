package controllers

import play.api._
import play.api.cache.Cache
import play.api.data._
import play.api.data.Forms._
import play.api.mvc._
import play.api.libs.concurrent.Execution.Implicits._
import play.api.Play.current

import play.api.libs.json._

import models.MusicModel

import scala.concurrent.Future

object Application extends Controller with MusicSearch {
  
  def index = Action {
    Ok(views.html.index("Your new application is ready."))
  }

    def search = Action { implicit request =>
        Async {
    		musicSearch( 
                Form("query" -> text).bindFromRequest.get
            ).map { response => Ok(response.json) }
        }
    }  

    def submitSong = Action { implicit request => 
        val jsRequest = request.body.asJson.getOrElse(Json.obj())

        val requestFormInputs = (
            (jsRequest \ "artist").asOpt[String],
            (jsRequest \ "name").asOpt[String],
            (jsRequest \ "mbid").asOpt[String]
        )

        requestFormInputs match {
            case (Some(artist), Some(name), Some(mbid)) => {
            
                Async {
                    /* Here's the thing: we can't trust user requests to submit songs since they could put in
                     * whatever they want and it would be submitted to the database, so we instead basically force 
                     * them to submit a valid id of a song -- or of an artist and name for a real song -- by checking 
                     * the supplied info against the Last.fm API.
                     *
                     * Of course we also cache the result of the API call in case more than one user likes that song, 
                     * to reduce the amount of times we make a call to Last.fm otherwise we could risk getting banned.
                     */
                    def songInfoFuture: Future[JsValue] = {
                        
                        //Valid data either comes with an mbid, or with {mbid : ""} but a valid artist and name
                        mbid match {
                            case "" => {
                                Cache.getAs[Future[JsValue]]("artist." + artist + "$" + "name." + name) match {
                                    case Some(cachedInfo) => cachedInfo
                                    case None => {
                                        val lastfmInfo = {
                                            musicInfo(artist, name).map {response => response.json}
                                        }
                                        Cache.set("artist." + artist + "$" + "name." + name, lastfmInfo)
                                        lastfmInfo
                                    }
                                }
                            }
                            case _ => {
                                Cache.getAs[Future[JsValue]]("mbid." + mbid) match {
                                    case Some(cachedInfo) => cachedInfo
                                    case None => {
                                        val lastfmInfo = {

                                            musicInfo(mbid).map {response => response.json}
                                        }
                                        Cache.set("mbid." + mbid, lastfmInfo)
                                        lastfmInfo
                                    }
                                }
                            }
                        }
                    }

                    songInfoFuture.map { songInfo =>

                        val confirmedInfo = (
                            (songInfo \ "track" \ "artist" \ "name").asOpt[String],
                            (songInfo \ "track" \ "name").asOpt[String]
                        )

                        confirmedInfo match {
                            case (Some(confirmedArtist), Some(confirmedName)) => {
                                Async {
                                    MusicModel.submitSong(confirmedArtist, confirmedName, mbid, "last.fm")
                                        .map {result => Ok(result)}
                                }
                            }
                            case _ => BadRequest(
                                Json.obj("error" -> "Error validating track with external service")
                            )
                        }
                            
                    } 
                }
            }
            case _ => BadRequest(Json.obj("error" -> "Request missing inputs"))
        }
    }

    def listSongs = Action { implicit request =>
        Async {
            val songsList = MusicModel.listSongs(25)
            val songsJsonArray = songsList.map { song => Json.arr(song) }

            songsJsonArray.map { array => Ok(array(0)) }
        }

    }

}