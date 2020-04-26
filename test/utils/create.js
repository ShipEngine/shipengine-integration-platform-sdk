"use strict";

const SDK = require("../../lib");
const _merge = require("lodash.merge");

const create = module.exports = {
  app (manifest = {}, merge = true) {
    if (merge) {
      _merge(manifest, {
        version: "1.23.456",
      });
    }

    return new SDK.App(manifest);
  },

  carrier (pojo = {}, app = create.app(), merge = true) {
    if (merge) {
      _merge(pojo, {
        id: "11111111-1111-1111-1111-111111111111",
        name: "Dummy Carrier",
        websiteURL: "https://example.com",
        logo: {
          colorSVG: "<svg></svg>",
          blackAndWhiteSVG: "<svg></svg>",
        },
        deliveryServices: [
          {
            id: "33333333-3333-3333-3333-333333333333",
            name: "Dummy Delivery Service",
            class: "ground",
            grade: "standard",
            originCountries: ["US"],
            destinationCountries: ["US"],
          }
        ],
      });
    }

    return new SDK.Carrier(pojo, app);
  },
};