// Sources
// https://actix.rs/docs/static-files/#directory
// https://users.rust-lang.org/t/how-to-host-a-html-page-in-actix-web-2-0/46510/14
// https://docs.rs/actix-web/latest/actix_web/middleware/struct.DefaultHeaders.html

// This needs TLS support

use actix_web::{get, web, App, HttpServer, Responder, middleware::DefaultHeaders};
use actix_files;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            // Disable FLOC
            .wrap(DefaultHeaders::new().add(("Permissions-Policy", "interest-cohort=()")))

            // Serve static site
            .service(actix_files::Files::new("/", "../public")
                .index_file("index.html")
                .use_last_modified(true))
     })
        .bind(("0.0.0.0", 80))?
        .run()
        .await
}
