use std::io;
use std::env;
use std::fs;
use std::path::{Path, PathBuf};

#[cfg(target_os = "windows")] use winreg::enums::*;
#[cfg(target_os = "windows")] use winreg::RegKey;

extern crate dirs;
use serde::{Deserialize, Serialize};
extern crate serde_json;

#[derive(Clone, Serialize, Deserialize)]
struct ChromeManifest {
    name: String,
    description: String,
    path: String,
    r#type: String,
    allowed_origins: Vec<String>,
}

#[derive(Clone, Serialize, Deserialize)]
struct FirefoxManifest {
    name: String,
    description: String,
    path: String,
    r#type: String,
    allowed_extensions: Vec<String>,
}

#[derive(Clone)]
enum Manifest {
    Chrome(ChromeManifest),
    Firefox(FirefoxManifest),
}

fn write_manifest(path: &Path, manifest: Manifest) -> io::Result<()> {
    let data: String = match manifest {
        Manifest::Chrome(data) => serde_json::to_string(&data)?,
        Manifest::Firefox(data) => serde_json::to_string(&data)?
    };

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

    let firefox_manifest = FirefoxManifest {
        name: "com.synkhronix.media_mind".to_owned(),
        description: "Allows you to use the multimedia keys of your keyboard to control media playback.".to_owned(),
        path: exec_path.to_str().unwrap().to_string(),
        r#type: "stdio".to_owned(),
        allowed_extensions: vec!("media-mind@synkhronix.com".to_owned()),
    };

    let mut chrome_manifest = ChromeManifest {
        name: "com.synkhronix.media_mind".to_owned(),
        description: "Allows you to use the multimedia keys of your keyboard to control media playback.".to_owned(),
        path: exec_path.to_str().unwrap().to_string(),
        r#type: "stdio".to_owned(),
        allowed_origins: vec!(),
    };

    if args.len() > 2 {
        chrome_manifest.allowed_origins.push(args[2].clone());
    }

    let browsers = if cfg!(target_os = "windows") {
        vec!(
            ("Google\\Chrome", "NativeMessagingHosts",
                Manifest::Chrome(chrome_manifest.clone())),
            ("Mozilla", "NativeMessagingHosts",
                Manifest::Firefox(firefox_manifest.clone())),
        )
    } else {
        vec!(
            (".config/google-chrome", "NativeMessagingHosts",
                Manifest::Chrome(chrome_manifest.clone())),
            (".config/google-chrome-beta", "NativeMessagingHosts",
                Manifest::Chrome(chrome_manifest.clone())),
            (".config/google-chrome-unstable", "NativeMessagingHosts",
                Manifest::Chrome(chrome_manifest.clone())),
            (".config/chromium", "NativeMessagingHosts",
                Manifest::Chrome(chrome_manifest.clone())),
            (".mozilla", "native-messaging-hosts",
                Manifest::Firefox(firefox_manifest.clone())),
        )
    };

    for (browser, subpath, mut manifest) in browsers {
        let mut path: PathBuf = if cfg!(target_os = "windows") {
            dirs::data_local_dir().unwrap()
        } else {
            dirs::home_dir().unwrap()
        };

        path.push(browser);

        if !path.exists() {
            continue;
        }

        path.push(subpath);

        if !path.exists() {
            fs::create_dir_all(path.as_path())?;
        }

        if cfg!(target_os = "windows") {
            let mut new_exec_path: PathBuf = path.clone();

            if cfg!(target_os = "windows") {
                new_exec_path.push("media_mind.exe");
            } else {
                new_exec_path.push("media_mind");
            }

            fs::copy(exec_path.as_path(), new_exec_path.as_path())?;

            match &mut manifest {
                Manifest::Chrome(manifest) =>
                    manifest.path = new_exec_path.as_path().to_str().unwrap().to_string(),
                Manifest::Firefox(manifest) =>
                    manifest.path = new_exec_path.as_path().to_str().unwrap().to_string(),
            };
        }

        path.push("com.synkhronix.media_mind.json");

        println!("writing manifest to {}", path.display());
        write_manifest(path.as_path(), manifest)?;

        if cfg!(target_os = "windows") {
            let hlm = RegKey::predef(HKEY_LOCAL_MACHINE);

            let mut reg_path: PathBuf = PathBuf::new();

            reg_path.push("Software".to_string());
            reg_path.push(browser);
            reg_path.push("NativeMessagingHosts".to_string());
            reg_path.push("com.synkhronix.media_mind".to_string());

            let (key, _) = hlm.create_subkey(reg_path.as_path())?;

            println!("setting registry key {} to {}", reg_path.display(), path.display());
            key.set_value("", &path.as_path().to_str().unwrap().to_string())?;
        }
    }

    Ok(())
}
