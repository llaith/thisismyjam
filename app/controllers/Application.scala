package controllers

import play.api._
import play.api.data._
import play.api.data.Forms._
import play.api.mvc._

import play.api.libs.concurrent.Execution.Implicits._

object Application extends Controller with MusicSearch {
  
  def index = Action {
    Ok(views.html.index("Your new application is ready."))
  }

  def search = Action { implicit request =>
  		Async {
  			searchSong( Form("query" -> text).bindFromRequest.get.replace(" ","+") ).map { response => Ok(response.json) }
  		}
  }  

  def  submitSong = Action { implicit request => 
  	val (artist, title, mbid) = Form(tuple("artist" -> text, "title" -> text, "mbid" -> text)).bindFromRequest.get
  	Ok(artist + ", " + title + ", " + mbid)
  }
}