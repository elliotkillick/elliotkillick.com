+++
title = "PGP Key"
path = "pgp"

[extra]
date = 2023-01-01
+++

<p>**Currently still brute-force generating these keys at ~15 million keys / second**</p>

You can find the PGP fingerprints of my PGP key and subkeys below.

Main key: 1337AA1A8CCFC4730953325AE01E62C34CA31337

- Only used as a main key for containing its subkeys
- This key still needs to be uploaded to key servers but I'm waiting on the subkeys
    - The subkeys I wanted have actually already been generated but they're problematic because their creation timestamps predate the master key creation timestamp and thus can't be imported as a subkey to it (OpenPGP v4 certificates include a creation timestamp as part of their fingerprint calculation)

Code subkey:

- Used to sign Git commits on GitHub; not all my repos have their commits PGP signed but those that do (e.g all QubesOS-related repos) use this key

Website subkey:

- Used to sign Git commits to my elliotonsecurity.com repo on GitHub

Messages (Sign) subkey:

- Used for sending/receving signed messages

Messages (Encrypt) subkey:

- Used for sending/receving encrypted messages
- For ECC certificates, encryption requires a cv25519 key (as opposed to the ed25519 keys above)
    - I haven't started bruteforcing this yet because VanityGPG doesn't directly support cv25519 (I've made an incomplete one line patch that allow for cv25519 fingerprint calculation but `get_armored_results()` needs work to nicely output a blank PGP master key with the vanity encryption subkey attached. Then, its keygrip (a GPG implementation detail referring to the (256-bit ECC) key material) can be moved across keys while faking system time to get the same fingerpint on another key. I've already established a working process for the latter.)

If you're sending me a PGP encrypted message then use the Messages key. Note that I prefer [Wire](wire.com) for end-to-end encrypted messages (you will receive a quicker response this way) but if you would rather send a PGP encrypted email or even a PGP encrypted Wire message (only do this if the extra security is absolutely necessary) then go for it.

[PGP key download](/elliotkillick.asc) | [PGP key mirror](https://keys.openpgp.org/search?q=contact@elliotkillick.com)

These vanity PGP keys were generated through brute-force with the VanityGPG Rust crate.
