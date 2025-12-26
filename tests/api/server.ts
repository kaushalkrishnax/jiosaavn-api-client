import { createServer } from "http";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { JioSaavnClient } from "../../index";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new JioSaavnClient();
const PORT = 3000;

const server = createServer(async (req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url!, `http://localhost:${PORT}`);

  // Serve HTML on root
  if (url.pathname === "/" || url.pathname === "/index.html") {
    try {
      const html = readFileSync(join(__dirname, "index.html"), "utf-8");
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
    } catch (error) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error loading page");
    }
    return;
  }

  // API Routes
  if (url.pathname === "/api/test") {
    try {
      const method = url.searchParams.get("method");
      const paramsJson = url.searchParams.get("params");
      const params = paramsJson ? JSON.parse(paramsJson) : {};

      let result;

      switch (method) {
        case "searchAll":
          result = await client.searchAll(params);
          break;
        case "searchSongs":
          result = await client.searchSongs(params);
          break;
        case "searchAlbums":
          result = await client.searchAlbums(params);
          break;
        case "searchArtists":
          result = await client.searchArtists(params);
          break;
        case "searchPlaylists":
          result = await client.searchPlaylists(params);
          break;
        case "getSongsById":
          result = await client.getSongsById(params);
          break;
        case "getSongByLink":
          result = await client.getSongByLink(params);
          break;
        case "getSongSuggestions":
          result = await client.getSongSuggestions(params);
          break;
        // case "getSongLyrics":
        //   result = await client.getSongLyrics(params);
        //   break;
        case "getAlbumById":
          result = await client.getAlbumById(params);
          break;
        case "getAlbumByLink":
          result = await client.getAlbumByLink(params);
          break;
        case "getArtistById":
          result = await client.getArtistById(params);
          break;
        case "getArtistByLink":
          result = await client.getArtistByLink(params);
          break;
        case "getArtistSongs":
          result = await client.getArtistSongs(params);
          break;
        case "getArtistAlbums":
          result = await client.getArtistAlbums(params);
          break;
        case "getPlaylistById":
          result = await client.getPlaylistById(params);
          break;
        case "getPlaylistByLink":
          result = await client.getPlaylistByLink(params);
          break;
        case "getBrowseModules":
          result = await client.getBrowseModules();
          break;
        case "getTrendingContent":
          result = await client.getTrendingContent(params);
          break;
        default:
          throw new Error(`Unknown method: ${method}`);
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res
        .end
        // JSON.stringify({
        //   error: error.message,
        //   stack: error.stack,
        // })
        ();
    }
    return;
  }

  // 404
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

server.listen(PORT, () => {
  console.log(`\n🎵 JioSaavn API Tester Server`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🌐 Server running at: http://localhost:${PORT}`);
  console.log(`📁 Serving: ${join(__dirname, "index.html")}`);
  console.log(`\n✨ Open http://localhost:${PORT} in your browser`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
});
