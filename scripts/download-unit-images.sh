#!/usr/bin/env bash
#
# Download generic TI4 unit miniature images from the Fandom wiki into
# public/ti4-img/units/.
#
# The Fandom wiki blocks plain curl, so we send a realistic browser
# User-Agent and a matching Referer header. If a particular file still
# fails (HTTP 403/404), open the URL manually in a browser, download
# the image, and place it at public/ti4-img/units/<filename>.
#
# Each entry is "filename|wiki-page-URL". For each entry the script
# fetches the wiki page, extracts the first miniature image URL, and
# downloads it. The 11 filenames below match UNIT_ICON_FILENAME in
# data/factionSheets.ts.

set -euo pipefail

DEST="public/ti4-img/units"
mkdir -p "$DEST"

UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
REF="https://twilight-imperium.fandom.com"

ENTRIES=(
  "flagship.png|https://twilight-imperium.fandom.com/wiki/Flagship"
  "war-sun.png|https://twilight-imperium.fandom.com/wiki/War_Sun"
  "dreadnought.png|https://twilight-imperium.fandom.com/wiki/Dreadnought"
  "cruiser.png|https://twilight-imperium.fandom.com/wiki/Cruiser"
  "destroyer.png|https://twilight-imperium.fandom.com/wiki/Destroyer"
  "carrier.png|https://twilight-imperium.fandom.com/wiki/Carrier"
  "fighter.png|https://twilight-imperium.fandom.com/wiki/Fighter"
  "infantry.png|https://twilight-imperium.fandom.com/wiki/Infantry"
  "mech.png|https://twilight-imperium.fandom.com/wiki/Mech"
  "pds.png|https://twilight-imperium.fandom.com/wiki/PDS"
  "space-dock.png|https://twilight-imperium.fandom.com/wiki/Space_Dock"
)

for entry in "${ENTRIES[@]}"; do
  filename="${entry%%|*}"
  page="${entry##*|}"
  out="$DEST/$filename"

  if [[ -f "$out" ]]; then
    echo "[skip] $filename already exists"
    continue
  fi

  html=$(curl -sSL -A "$UA" -H "Referer: $REF" "$page" || true)
  if [[ -z "$html" ]]; then
    echo "[fail] $filename — could not fetch $page (open manually and save image to $out)"
    continue
  fi

  img_url=$(printf '%s' "$html" \
    | grep -oE 'https://static\.wikia\.nocookie\.net/twilightimperium/images/[^"]+\.(png|jpg)' \
    | head -1 || true)

  if [[ -z "$img_url" ]]; then
    echo "[fail] $filename — no miniature URL found on $page (save manually to $out)"
    continue
  fi

  if curl -sSL -A "$UA" -H "Referer: $REF" -o "$out" "$img_url"; then
    echo "[ok] $filename ← $img_url"
  else
    echo "[fail] $filename — download error (save manually to $out)"
  fi
done

echo
echo "Done. Missing files can be downloaded by hand from the URLs above."
