const manifest = {
  "editorOnly": true,
  "name": "block-pins/name",
  "description": "block-pins/description",
  "credits": [
    {
      "name": "SharkPool",
      "link": "https://github.com/SharkPool-SP/"
    }
  ],
  "info": [
    {
      "type": "notice",
      "text": "block-pins/checkbox-notice",
      "id": "checkbox-notice"
    }
  ],
  "settings": [
    {
      "dynamic": false,
      "name": "block-pins/auto-load-exts",
      "id": "autoLoadExts",
      "type": "boolean",
      "default": true
    }
  ],
  "userscripts": [
    { "url": "userscript.js" }
  ],
  "tags": [
    "editor",
    "new",
    "astraeditor"
  ],
  "enabledByDefault": true,
  "l10n": {
    "defaultLocale": "en",
    "locales": ["en", "zh-cn"]
  },
  "permissions": [
    "vm",
    "tab"
  ]
};
export default manifest;
