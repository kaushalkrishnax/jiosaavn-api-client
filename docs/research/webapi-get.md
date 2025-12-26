# JioSaavn `webapi.get` — Internal Development Endpoint (Research Notes)

> **Status:** 🚧 Under Development / Internal Use Only
>
> This document captures reverse-engineering observations of the undocumented JioSaavn endpoint:
>
> ```
> __call=webapi.get
> ```
>
> The endpoint appears to be a **next-generation orchestration API** used internally by the JioSaavn web app. It is **not production-ready**, **not stable**, and **not part of the public API surface**.
>
> This documentation exists purely to record findings discovered during deep debugging and traffic inspection.

---

## 1. Endpoint Overview

```
https://www.jiosaavn.com/api.php
  ?__call=webapi.get
  &token=<opaque-token>
  &type=<entity-type>
  &ctx=wap6dot0
  &api_version=4
  &_format=json
  &_marker=0
```

### Key characteristics

* Uses a **`token`**, not an ID
* Token matches the **last segment** of many `perma_url`s
* Token ≠ legacy entity ID
* Endpoint responds with **page-level objects**, not pure entities

---

## 2. Token Semantics

* The `token` is **not** the same as:

  * Song ID
  * Album ID
  * Artist ID
  * Playlist ID

* It is a **page token**, likely mapping to frontend routing

* Same token appears in:

  * `perma_url`
  * internal navigation payloads

**Implication:**

* Token cannot be used with legacy APIs
* Token is resolved only by `webapi.get`

---

## 3. Supported `type` Values (Observed)

### 3.1 `type=album`

* Returns a **page-style album object**
* Includes:

  * Album metadata
  * `list` of songs
  * `modules` describing UI sections

#### Invalid album token

* Returns **nothing** (empty response)
* one test url found: https://www.jiosaavn.com/song/this-is-a-sample-trailer-testing/FBsNBhkID1Y
* No error object

---

### 3.2 `type=playlist`

* Returns playlist-shaped object
* Includes:

  * Metadata
  * `modules` such as:

    * `relatedPlaylist`
    * `currentlyTrendingPlaylists`
    * `artists`

#### Invalid playlist token

* Empty or partially populated object
* No explicit error

---

### 3.3 `type=artist`

* Returns artist-shaped object
* For **invalid artist token**, returns a **synthetic placeholder artist**:

```json
{
  "artistId": null,
  "name": "",
  "topSongs": [],
  "similarArtists": [],
  "isRadioPresent": false
}
```

Characteristics:

* Structurally valid
* Semantically empty
* Includes empty modules

**Interpretation:**

* Soft-failure response
* Must be treated as NOT_FOUND

---

### 3.4 `type=show`

```json
{
  "status": "failure",
  "message": "season not available"
}
```

* Explicit failure payload
* Often returned with HTTP 200

---

### 3.5 Invalid or random `type`

```json
[]
```

* Silent failure
* No metadata
* No error description

---

## 4. `modules` Object

Most responses include a `modules` field describing frontend UI composition:

```json
"modules": {
  "relatedPlaylist": { ... },
  "currentlyTrending": { ... },
  "artists": { ... }
}
```

### Observations

* Each module maps to a **separate internal API**
* Includes:

  * Source API name
  * Position
  * Scroll behavior
  * Source parameters

**Conclusion:**

* `modules` is a **frontend layout DSL**, not core data
* Extremely unstable
* Changes frequently

---

## 5. Context (`ctx`) Behavior

* `ctx=wap6dot0` is commonly used
* `web6dot0` does **not** always work here
* No `ctx` often falls back to legacy behavior

This differs from legacy endpoints and confirms that `webapi.get` is **frontend-specific**.

---

## 6. Error Model (Inconsistent by Design)

| Case             | Response              |
| ---------------- | --------------------- |
| Invalid album    | Empty response        |
| Invalid playlist | Empty / partial       |
| Invalid artist   | Placeholder object    |
| Invalid show     | `{ status: failure }` |
| Random type      | `[]`                  |

**There is no unified error contract.**

---

## 7. Relationship to Legacy APIs

| Legacy API     | webapi.get   |
| -------------- | ------------ |
| Entity-centric | Page-centric |
| ID-based       | Token-based  |
| Stable (ish)   | Experimental |
| Normalized     | UI-driven    |

**Analogy:**

> Same bullets, different guns.

The underlying data sources overlap, but orchestration and structure differ completely.

---

## 8. Why This Endpoint Matters

* Likely future replacement for legacy APIs
* Explains why:

  * IDs ≠ URL tokens
  * Modules exist in responses
  * Web responses differ drastically from app responses

But today:

* ❌ Not reliable
* ❌ Not complete
* ❌ Not safe for public SDKs

---

## 9. Final Verdict

**Do not use `webapi.get` in production.**

* Track it
* Document it
* Flex the research
* Revisit in v3+ if JioSaavn stabilizes it

---

> *"Didn’t touch the smoking gun — but I found the bullets."*
