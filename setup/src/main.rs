use std::io;
use std::env;
use std::fs;
use std::path::{Path, PathBuf};

extern crate dirs;
use serde::{Deserialize, Serialize};
extern crate serde_json;

#[derive(Serialize, Deserialize)]
struct Manifest {
    name: String,
    description: String,
    path: String,
    r#type: String,
    allowed_origins: Vec<String>,
}

fn write_manifest(path: &Path, manifest: Manifest) -> io::Result<()> {
    let data: String = serde_json::to_string(&manifest)?;
    fs::write(path, data)?;

    Ok(())
}

fn main() -> io::Result<()> {
    let args: Vec<String> = env::args().collect();

    if args.len() < 2 {
        eprintln!("usage: {} <executable-path> [extension-id]", args[0]);
        return Ok(())
    }

    let path = Path::new(&args[1]);
    let exec_path = match fs::canonicalize(path) {
        Ok(path) => path,
        Err(_) => {
            eprintln!("error: no absolute path for '{}'.", path.display());
            return Ok(())
        }
    };

    let browsers = vec!(
        (".config/google-chrome", "NativeMessagingHosts", true),
        (".config/google-chrome-beta", "NativeMessagingHosts", true),
        (".config/google-chrome-unstable", "NativeMessagingHosts", true),
        (".config/chromium", "NativeMessagingHosts", true),
        (".mozilla", "native-messaging-hosts", false),
    );

    for (browser, subpath, need_ext_id) in browsers {
        let mut path: PathBuf = dirs::home_dir().unwrap();

        path.push(browser);

        if !path.exists() {
            continue;
        }

        path.push(subpath);

        if !path.exists() {
            fs::create_dir_all(path.as_path())?;
        }

        path.push("com.synkhronix.media_mind");

        let mut manifest = Manifest {
            name: "com.synkhronix.media_mind".to_owned(),
            description: "Allows you to use the multimedia keys of your keyboard to control media playback.".to_owned(),
            path: exec_path.to_str().unwrap().to_string(),
            r#type: "stdio".to_owned(),
            allowed_origins: vec!(),
        };

        if !need_ext_id {
            manifest.allowed_origins.push("com.synkhronix.media_mind".to_string());
        } else if args.len() > 2 {
            manifest.allowed_origins.push(args[2].clone());
        }

        if manifest.allowed_origins.is_empty() {
            continue;
        }

        println!("writing manifest to {}", path.display());
        write_manifest(path.as_path(), manifest)?;
    }

    Ok(())
}
