// Sources
// https://actix.rs/docs/server/#tls--https

use actix_web::{get, App, HttpRequest, HttpServer, Responder};
use openssl::ssl::{SslAcceptor, SslFiletype, SslMethod};
use actix_files;

#[get("/")]
async fn index(_req: HttpRequest) -> impl Responder {
    "Welcome!

You've reached Elliot's testing and demo server.

Currently, the only thing that exists on this server is Mimikatz which you can find at \"/mimikatz.exe\". Feel free to use this site for your own testing and demo purposes.

It would be best for ring0mo.de to remain unflagged by AV web scanners, so please don't link directly to anywhere on this website besides this page. Also, please don't use the downloads on this website for any nefarious purposes or legitimate pentests. These binaries will not be kept up-to-date, and I cannot be held liable in either case (not to mention they may be missing DLLs).

This website is powered by Actix, a blazingly fast, feature-rich and secure web framework written in Rust. See the source for this website on my GitHub.

Infosec blog: elliotkillick3com (obfuscated, replace 3 for .)
Twitter: twitter.com/3ElliotKillick3 (obfuscated, remove 3s)
GitHub: github.com/3ElliotKillick3 (obfuscated, remove 3s)"
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let mut builder = SslAcceptor::mozilla_intermediate(SslMethod::tls()).unwrap();
    builder.set_private_key_file("/etc/letsencrypt/live/ring0mo.de/privkey.pem", SslFiletype::PEM).unwrap();
    builder.set_certificate_chain_file("/etc/letsencrypt/live/ring0mo.de/fullchain.pem").unwrap();

    HttpServer::new(|| {
        App::new()
            // Welcome message
            .service(index)

            // Serve files
            // Enable hidden files for Let's Encrypt authentication using .well-known directory
            .service(actix_files::Files::new("/", "public").use_hidden_files())
    })
        .bind_openssl("0.0.0.0:443", builder)?
        .bind(("0.0.0.0", 80))?
        .run()
        .await
}
