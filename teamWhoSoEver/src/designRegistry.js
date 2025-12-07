// src/designRegistry.js
// Central registry of designs, their grouped color keys, and default values.
// Add/adjust groups or defaults here when creating new design components.

const DESIGN_REGISTRY = {
  "Design 1": {
    // group: ordered list of keys in that group
    groups: {
      "Main Colors": [
        "crossLogoColor",
        "curveUnder1Color",
        "curveUnder2Color",
        "underLongColor",
        "curveSmallOColor"
      ],
      "Characters": [
        "man1Color",
        "man2Color",
        "man3Color",
        "man4Color"
      ],
      "Letters / Accents": [
        "wcolor",
        "scolor",
        "vcolor",
        "ecolor",
        "rcolor"
      ],
      "Gradient 1": ["gradient1StartColor", "gradient1EndColor"],
      "Gradient 2": ["gradient2StartColor", "gradient2EndColor"],
      "Gradient 3": ["gradient3StartColor", "gradient3EndColor"],
      "Gradient 4": ["gradient4StartColor", "gradient4EndColor"],
      "Gradient 5": ["gradient5StartColor", "gradient5EndColor"],
      "Gradient 6": ["gradient6StartColor", "gradient6MidColor", "gradient6EndColor"],
      "Gradient 7": ["gradient7Stop1", "gradient7Stop2", "gradient7Stop3", "gradient7Stop4"],
      "Gradient 8": ["gradient8StartColor", "gradient8EndColor"]
    },
    // default props to feed component / color editor
    defaults: {
      crossLogoColor: "#B3B4AC",
      curveUnder1Color: "#B3B4AC",
      curveUnder2Color: "#B3B4AC",
      underLongColor: "#B3B4AC",
      man1Color: "#3EA29A",
      man2Color: "#9ABB39",
      man3Color: "#E0A82D",
      man4Color: "#D33B3A",
      wcolor: "#D33B3A",
      scolor: "#44A499",
      vcolor: "#C5C42C",
      ecolor: "#399892",
      rcolor: "#399892",
      curveSmallOColor: "#E14B30",
      gradient1StartColor: "#F2BD6D",
      gradient1EndColor: "#DD8F3D",
      gradient2StartColor: "#CDBB31",
      gradient2EndColor: "#C5C42C",
      gradient3StartColor: "#BBC032",
      gradient3EndColor: "#92B243",
      gradient4StartColor: "#639E7E",
      gradient4EndColor: "#3DA396",
      gradient5StartColor: "#D78C39",
      gradient5EndColor: "#D3B924",
      gradient6StartColor: "#8EB341",
      gradient6MidColor: "#7CA947",
      gradient6EndColor: "#699E4E",
      gradient7Stop1: "#FD8D43",
      gradient7Stop2: "#E9A140",
      gradient7Stop3: "#D5B53C",
      gradient7Stop4: "#9BBD33",
      gradient8StartColor: "#ACC02B",
      gradient8EndColor: "#45AA9C"
    }
  },

  // Design 2 (example: many crossfill keys)
  "Design 2": {
    groups: {
      "Main Fills": [
        "crossfill1","crossfill2","crossfill3","crossfill4","crossfill5",
        "crossfill6","crossfill7","crossfill8","crossfill9","crossfill10",
        "crossfill11","crossfill12","crossfill13","crossfill14","crossfill15",
        "crossfill16","crossfill17","crossfill18"
      ]
    },
    defaults: {
      crossfill1: "#B3998E",
      crossfill2: "#B3998E",
      crossfill3: "#B3998E",
      crossfill4: "#B3998E",
      crossfill5: "#B3998E",
      crossfill6: "#B3998E",
      crossfill7: "#B3998E",
      crossfill8: "#B3998E",
      crossfill9: "#B3998E",
      crossfill10: "#B3998E",
      crossfill11: "#B3998E",
      crossfill12: "#B3998E",
      crossfill13: "#B3998E",
      crossfill14: "#B3998E",
      crossfill15: "#B3998E",
      crossfill16: "#B3998E",
      crossfill17: "#B3998E",
      crossfill18: "#B3998E"
    }
  },

  // Design 3
  "Design 3": {
    groups: {
      "Main Fills (A)": [
        "crossfill1A","crossfill2A","crossfill3A","crossfill4A","crossfill5A",
        "crossfill6A","crossfill7A","crossfill8A","crossfill9A","crossfill10A",
        "crossfill11A","crossfill12A","crossfill13A","crossfill14A","crossfill15A",
        "crossfill16A","crossfill17A","crossfill18A"
      ]
    },
    defaults: {
      crossfill1A: "#B3998E",
      crossfill2A: "#B3998E",
      crossfill3A: "#B3998E",
      crossfill4A: "#B3998E",
      crossfill5A: "#B3998E",
      crossfill6A: "#B3998E",
      crossfill7A: "#B3998E",
      crossfill8A: "#B3998E",
      crossfill9A: "#B3998E",
      crossfill10A: "#B3998E",
      crossfill11A: "#B3998E",
      crossfill12A: "#B3998E",
      crossfill13A: "#B3998E",
      crossfill14A: "#B3998E",
      crossfill15A: "#B3998E",
      crossfill16A: "#B3998E",
      crossfill17A: "#B3998E",
      crossfill18A: "#B3998E"
    }
  },

  // Design 4
  "Design 4": {
    groups: {
      "Main Fills (B)": [
        "crossfill1b","crossfill2b","crossfill3b","crossfill4b","crossfill5b",
        "crossfill6b","crossfill7b","crossfill8b","crossfill9b","crossfill10b",
        "crossfill11b","crossfill12b","crossfill13b","crossfill14b","crossfill15b",
        "crossfill16b","crossfill17b","crossfill18b","crossfill19b","crossfill20b",
        "crossfill21b","crossfill22b","crossfill23b","crossfill24b","crossfill25b",
        "crossfill26b","crossfill27b"
      ]
    },
    defaults: {
      crossfill1b: "#F9C808",
      crossfill2b: "#F9C808",
      crossfill3b: "#7C4B9C",
      crossfill4b: "#F9C808",
      crossfill5b: "#864988",
      crossfill6b: "#864988",
      crossfill7b: "#864988",
      crossfill8b: "#F9C808",
      crossfill9b: "#F9C808",
      crossfill10b: "#F9C808",
      crossfill11b: "#7C4B9C",
      crossfill12b: "#7C4B9C",
      crossfill13b: "#965778",
      crossfill14b: "#965778",
      crossfill15b: "#F9C808",
      crossfill16b: "#864988",
      crossfill17b: "#EAB778",
      crossfill18b: "#FAD637",
      crossfill19b: "#F9C808",
      crossfill20b: "#FAD637",
      crossfill21b: "#F9C808",
      crossfill22b: "#F9C808",
      crossfill23b: "#864988",
      crossfill24b: "#864988",
      crossfill25b: "#864988",
      crossfill26b: "#F9C808",
      crossfill27b: "#F9C808"
    }
  },

  // Design 5 & 6 intentionally empty (you said they are empty)
  "Design 5": { groups: {}, defaults: {} },
  "Design 6": { groups: {}, defaults: {} }
};

export default DESIGN_REGISTRY;
