const manifest = {
  "name": "Background",
  "description": "Make your editor look brand new.",
  "editorOnly": false,
  "tags": [
    "editor",
    "new",
    "astraeditor"
  ],
  "info": [
    {
      "type": "notice",
      "text": "This may reduce performance, and will override RemixWarp's original wallpaper settings.",
      "id": "reducePerformance"
    }
  ],
  "credits": [
    {
      "name": "KOSHINO",
      "link": "https://github.com/KOSHINOawa"
    }
  ],
  "userscripts": [
    {
      "url": "userscript.js"
    }
  ],
  "userstyles": [
    {
      "url": "style.css"
    }
  ],
  "l10n": {
    "defaultLocale": "en",
    "locales": ["en", "zh-cn"]
  },
  "permissions": [
    "tab"
  ]
};
export default manifest;
