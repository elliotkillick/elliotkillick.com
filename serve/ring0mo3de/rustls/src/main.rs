// Sources
// https://github.com/actix/examples/blob/master/https-tls/rustls/src/main.rs
// https://docs.rs/tokio/0.2.21/tokio/signal/index.html

use std::{fs::File, io::BufReader};

use actix_files::Files;
use actix_web::{middleware, web, App, HttpServer};

use rustls::{Certificate, PrivateKey, ServerConfig};
use rustls_pemfile::{certs, pkcs8_private_keys};

use tokio::task;
use tokio::signal::unix::{signal, SignalKind};

async fn handle_sighup_reload() -> std::io::Result<()> {
    // An infinite stream of hangup signals
    let mut stream = signal(SignalKind::hangup())?;

    loop {
        stream.recv().await;
        log::info!("Reloading rustls configuration...");
        load_rustls_config();
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::default().default_filter_or("info"));

    let config = load_rustls_config();
    task::spawn(handle_sighup_reload());

    log::info!("Starting web server...");
    HttpServer::new(|| {
        App::new()
            // Enable logger
            .wrap(middleware::Logger::default())

            // Serve files
            // Enable hidden files for Let's Encrypt authentication using .well-known directory
            .service(web::redirect("/index.txt", "/"))
            .service(Files::new("/", "public").use_hidden_files().index_file("index.txt"))
    })
    .bind_rustls("0.0.0.0:443", config)?
    .bind(("0.0.0.0", 80))?
    .run()
    .await
}

fn load_rustls_config() -> rustls::ServerConfig {
    // init server config builder with safe defaults
    let config = ServerConfig::builder()
        .with_safe_defaults()
        .with_no_client_auth();

    // load TLS key/cert files
    let cert_file = &mut BufReader::new(File::open("/etc/letsencrypt/live/ring0mo.de/fullchain.pem").unwrap());
    let key_file = &mut BufReader::new(File::open("/etc/letsencrypt/live/ring0mo.de/privkey.pem").unwrap());

    // convert files to key/cert objects
    let cert_chain = certs(cert_file)
        .unwrap()
        .into_iter()
        .map(Certificate)
        .collect();
    let mut keys: Vec<PrivateKey> = pkcs8_private_keys(key_file)
        .unwrap()
        .into_iter()
        .map(PrivateKey)
        .collect();

    // exit if no keys could be parsed
    if keys.is_empty() {
        eprintln!("Could not locate PKCS 8 private keys.");
        std::process::exit(1);
    }

    config.with_single_cert(cert_chain, keys.remove(0)).unwrap()
}
