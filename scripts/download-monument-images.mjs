
import fs from "node:fs/promises";
import path from "node:path";

const outputDir = path.resolve("public/images/monuments");
const api = "https://commons.wikimedia.org/w/api.php";

// Only explicitly approved image filenames are included.
// Other monuments are deliberately left pending.
const approvedImages = [
  {
    slug: "rani-ki-vav",
    file: "Rani ki vav, Patan.jpg"
  },
  {
    slug: "modhera-sun-temple",
    file: "Sun Temple Modhera (Gujarat).JPG"
  },
  {
    slug: "charminar",
    file: "Charminar at Hyderabad Telangana India.jpg"
  },
  {
    slug: "shore-temple",
    file: "Shore temple - mahabalipuram.JPG"
  },
  {
    slug: "hampi",
    file: "Virupaksha temple hampi.jpg"
  }
];

async function getImageDetails(filename) {
  const params = new URLSearchParams({
    action: "query",
    titles: `File:${filename}`,
    prop: "imageinfo",
    iiprop: "url|mime|extmetadata",
    iiurlwidth: "1600",
    format: "json"
  });

  const response = await fetch(`${api}?${params}`, {
    headers: {
      "User-Agent": "BharatDarshanHeritageAtlas/1.0"
    }
  });

  if (!response.ok) {
    throw new Error(`Commons API error: ${response.status}`);
  }

  const data = await response.json();
  const pages = Object.values(data.query?.pages || {});
  const page = pages[0];

  if (!page || page.missing !== undefined) {
    throw new Error("Exact Wikimedia file was not found.");
  }

  const info = page.imageinfo?.[0];

  if (!info || !info.thumburl) {
    throw new Error("Image URL is unavailable.");
  }

  if (!["image/jpeg", "image/png", "image/webp"].includes(info.mime)) {
    throw new Error(`Unsupported image format: ${info.mime}`);
  }

  return {
    url: info.thumburl,
    metadata: info.extmetadata || {},
    mime: info.mime,
    title: page.title
  };
}

function clean(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function downloadImage(item) {
  const destination = path.join(
    outputDir,
    `${item.slug}.jpg`
  );

  // Never overwrite an existing photograph automatically.
  try {
    await fs.access(destination);
    console.log(`SKIPPED existing image: ${item.slug}`);
    return null;
  } catch {
    // File does not exist; continue.
  }

  console.log(`Downloading: ${item.slug}`);

  const details = await getImageDetails(item.file);
  const response = await fetch(details.url);

  if (!response.ok) {
    throw new Error(`Image download failed: ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  // Basic file signature validation.
  const isJpeg =
    buffer[0] === 0xff && buffer[1] === 0xd8;

  const isPng =
    buffer.subarray(0, 8).toString("hex") ===
    "89504e470d0a1a0a";

  const isWebp =
    buffer.toString("ascii", 8, 12) === "WEBP";

  if (!isJpeg && !isPng && !isWebp) {
    throw new Error("Downloaded content is not a valid image.");
  }

  await fs.writeFile(destination, buffer);

  const metadata = details.metadata;

  return {
    monument: item.slug,
    filename: details.title,
    localPath: `/images/monuments/${item.slug}.jpg`,
    photographer: clean(metadata.Artist?.value || "Not specified"),
    licence: clean(metadata.LicenseShortName?.value || "Check source"),
    licenceUrl: metadata.LicenseUrl?.value || "",
    source: `https://commons.wikimedia.org/wiki/${encodeURIComponent(
      details.title.replaceAll(" ", "_")
    )}`
  };
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });

  const credits = [];
  const failed = [];

  for (const item of approvedImages) {
    try {
      const result = await downloadImage(item);

      if (result) {
        credits.push(result);
      }
    } catch (error) {
      console.error(`FAILED: ${item.slug} — ${error.message}`);
      failed.push(item.slug);
    }
  }

  const creditsPath = path.join(
    outputDir,
    "verified-image-credits.json"
  );

  await fs.writeFile(
    creditsPath,
    JSON.stringify(credits, null, 2),
    "utf8"
  );

  console.log("\n========== DOWNLOAD REPORT ==========");
  console.log(`Approved images: ${approvedImages.length}`);
  console.log(`New downloads: ${credits.length}`);
  console.log(`Failed: ${failed.length}`);
  console.log("Remaining monuments: pending verification");
  console.log("=====================================");
}

main().catch(console.error);
