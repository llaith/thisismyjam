package controllers

import play.api._
import play.api.data._
import play.api.data.Forms._
import play.api.mvc._
import play.api.libs.concurrent.Execution.Implicits._

import play.api.libs.json._

import models.MusicModel

object Application extends Controller with MusicSearch {
  
  def index = Action {
    Ok(views.html.index("Your new application is ready."))
  }

    def search = Action { implicit request =>
        Async {
    		musicSearch( 
                Form("query" -> text).bindFromRequest.get.replace(" ","+") 
            ).map { response => Ok(response.json) }
        }
    }  

    def submitSong = Action { implicit request => 
        val (artist, title, mbid) = Form(tuple("artist" -> text, "title" -> text, "mbid" -> text)).bindFromRequest.get
        Async {
            MusicModel.submitSong(artist, title, mbid, "last.fm").map(result => Ok(result))
         }
    }

    def listSongs = Action { implicit request =>
        Async {
            val songsList = MusicModel.listSongs(10)
            val songsJsonArray = songsList.map { song => Json.arr(song) }

            songsJsonArray.map { array => Ok(array(0)) }
        }

    }

}