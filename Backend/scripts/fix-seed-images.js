import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = resolve(__dirname, "../seed/placesData.js");
let content = readFileSync(filePath, "utf-8");

const placeImages = {
  "Hunza Valley": "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&q=80",
  "Naran & Kaghan Valleys": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  "Fairy Meadows": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  "Skardu": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
  "Swat Valley": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
  "Lahore Fort": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80",
  "Badshahi Mosque": "https://images.unsplash.com/photo-1570346355038-85b57a38e0a7?w=800&q=80",
  "Mohenjo-daro": "https://images.unsplash.com/photo-1569587112025-0d460e81a126?w=800&q=80",
  "Deosai National Park": "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=800&q=80",
  "Shangrila Resort": "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80",
  "Karimabad": "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80",
  "Naltar Valley": "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80",
  "Lal Suhanra National Park": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
  "Khewra Salt Mine": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  "Hingol National Park": "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
  "Malam Jabba": "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80",
  "Ayubia": "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
  "Nathia Gali": "https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=800&q=80",
  "Margalla Hills": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
  "Attabad Lake": "https://images.unsplash.com/photo-1439853949127-fa647821eba0?w=800&q=80",
  "Saif-ul-Malook": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
  "Derawar Fort": "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
  "Quaid-e-Azam Residency": "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=800&q=80",
  "Ziarat": "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&q=80",
  "Gwadar Port": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  "Makli Necropolis": "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&q=80",
  "Shahi Qila": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80",
  "Minar-e-Pakistan": "https://images.unsplash.com/photo-1570346355038-85b57a38e0a7?w=800&q=80",
  "Faisal Mosque": "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=800&q=80",
  "Wagah Border": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80",
  "Hunza Eagle's Nest": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  "Rakaposhi View Point": "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80",
  "Passu Cones": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
  "Baltit Fort": "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
  "Altit Fort": "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=800&q=80",
  "Phander Valley": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
  "Shandur Pass": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  "Chitral Valley": "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=800&q=80",
  "Kalam Valley": "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80",
  "Mahodand Lake": "https://images.unsplash.com/photo-1439853949127-fa647821eba0?w=800&q=80",
  "Kundol Lake": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
  "Ansoo Lake": "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80",
  "Lulusar Lake": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  "Babusar Top": "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80",
  "Lowari Pass": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
  "Port Qasim": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  "Clifton Beach": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  "Makran Coast": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  "Ormara Beach": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  "Neelum Valley": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
  "Murree": "https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=800&q=80",
};

// Replace each base64 image with the mapped URL
let replacements = 0;
for (const [name, url] of Object.entries(placeImages)) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(
    `(name:\\s*"${escapedName}"[\\s\\S]*?image:\\s*")[^"]*"`,
    "g"
  );
  const newContent = content.replace(regex, `$1${url}"`);
  if (newContent !== content) {
    replacements++;
    content = newContent;
  }
}

writeFileSync(filePath, content, "utf-8");
console.log(`✅ Updated ${replacements} place images in placesData.js`);
