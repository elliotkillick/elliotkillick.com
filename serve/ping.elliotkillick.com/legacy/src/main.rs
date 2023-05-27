// Sources
// https://actix.rs/docs/extractors/#query
// https://docs.rs/regex/latest/regex/#example-avoid-compiling-the-same-regex-in-a-loop
// https://docs.rs/actix-web/latest/actix_web/middleware/struct.DefaultHeaders.html
// https://docs.rs/actix-web/latest/actix_web/http/struct.StatusCode.html

use std::fs;
use regex::Regex;
use lazy_static::lazy_static;
use serde::Deserialize;
use actix_web::{get, web, App, HttpServer, Responder, middleware::DefaultHeaders, http::StatusCode};

#[derive(Deserialize)]
struct Info {
    email: String,
}

#[get("/subscribe")]
async fn subscribe(info: web::Query<Info>) -> impl Responder {
    if is_email_valid(info.email.to_owned()) {
        match fs::File::create("emails/".to_owned() + &info.email.to_owned()) {
            Ok(_) =>
                format!("You're subscribed, {}!<br /><br />
                         To unsubcribe, simply go to: https://ping.elliotkillick.com/unsubscribe?email={}<br /><br />
                         Please note that email newsletters haven't been fully set up yet, but as soon as they are you can expect to start seeing updates on new posts in your inbox.<br /><br />
                         <a href=\"https://elliotkillick.com\">Return to homepage</a> | <a href=\"https://github.com/ElliotKillick/elliotkillick.com/tree/master/serve/ping.elliotkillick.com/src/main.rs\">See the source</a>", info.email, info.email)
                    .customize()
                    .with_status(StatusCode::OK)
                    .insert_header(("Content-Type", "text/html")),
            Err(_) =>
                format!("Error: Failed to create file<br /><br />
                         <a href=\"https://elliotkillick.com\">Return to homepage</a>")
                    .customize()
                    .with_status(StatusCode::INTERNAL_SERVER_ERROR)
                    .insert_header(("Content-Type", "text/html")),
        }
    }
    else {
        format!("Error: Invalid email<br /><br />
                 <a href=\"https://elliotkillick.com\">Return to homepage</a>")
            .customize()
            .with_status(StatusCode::BAD_REQUEST)
            .insert_header(("Content-Type", "text/html"))
    }
}

#[get("/unsubscribe")]
async fn unsubscribe(info: web::Query<Info>) -> impl Responder {
    if is_email_valid(info.email.to_owned()) {
        match fs::remove_file("emails/".to_owned() + &info.email.to_owned()) {
            Ok(_) =>
                format!("You've sucessfully unsubscribed, {}!<br /><br />
                         <a href=\"https://ping.elliotkillick.com/subscribe?email={}\">Resubscribe</a> | <a href=\"https://elliotkillick.com\">Return to homepage</a>", info.email, info.email)
                    .customize()
                    .with_status(StatusCode::OK)
                    .insert_header(("Content-Type", "text/html")),
            Err(_) =>
                format!("Error: Failed to remove file<br /><br />
                         <a href=\"https://elliotkillick.com\">Return to homepage</a>")
                    .customize()
                    .with_status(StatusCode::INTERNAL_SERVER_ERROR)
                    .insert_header(("Content-Type", "text/html")),
        }
    }
    else {
        format!("Error: Invalid email<br /><br />
                 <a href=\"https://elliotkillick.com\">Return to homepage</a>")
            .customize()
            .with_status(StatusCode::BAD_REQUEST)
            .insert_header(("Content-Type", "text/html"))
    }
}

fn is_email_valid(email: String) -> bool {
    lazy_static! {
        // Email filter
        // Prevent path traversal and XSS (to safely serve "text/html") vulnerabilities
        static ref EMAIL_RE: Regex = Regex::new(r"[A-Za-z0-9@._]").unwrap();
    }

    let result = EMAIL_RE.replace_all(&email, "");
    if ! result.is_empty() {
        return false
    }

    return true
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            // Disable FLOC
            .wrap(DefaultHeaders::new().add(("Permissions-Policy", "interest-cohort=()")))

            // Newsletter
            .service(subscribe)
            .service(unsubscribe)
     })
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}
