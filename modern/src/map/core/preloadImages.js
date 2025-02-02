import { green, grey, red } from "@mui/material/colors";
import createPalette from "@mui/material/styles/createPalette";
import { loadImage, prepareIcon } from "./mapUtil";

import directionSvg from "../../resources/images/direction.svg";
import backgroundSvg from "../../resources/images/background.svg";
import backgroundEmptySvg from "../../resources/images/background-empty.svg";
import animalSvg from "../../resources/images/icon/animal.svg";
import bicycleSvg from "../../resources/images/icon/bicycle.svg";
import boatSvg from "../../resources/images/icon/boat.svg";
import busSvg from "../../resources/images/icon/bus.svg";
import carSvg from "../../resources/images/icon/car.svg";
import craneSvg from "../../resources/images/icon/crane.svg";
import defaultSvg from "../../resources/images/icon/default.svg";
import helicopterSvg from "../../resources/images/icon/helicopter.svg";
import motorcycleSvg from "../../resources/images/icon/motorcycle.svg";
import offroadSvg from "../../resources/images/icon/offroad.svg";
import personSvg from "../../resources/images/icon/person.svg";
import pickupSvg from "../../resources/images/icon/pickup.svg";
import pirogueSvg from "../../resources/images/icon/pirogue.svg";
import holopuniSvg from "../../resources/images/icon/holopuni.svg";
import planeSvg from "../../resources/images/icon/plane.svg";
import scooterSvg from "../../resources/images/icon/scooter.svg";
import shipSvg from "../../resources/images/icon/ship.svg";
import tractorSvg from "../../resources/images/icon/tractor.svg";
import trainSvg from "../../resources/images/icon/train.svg";
import tramSvg from "../../resources/images/icon/tram.svg";
import trolleybusSvg from "../../resources/images/icon/trolleybus.svg";
import truckSvg from "../../resources/images/icon/truck.svg";
import vanSvg from "../../resources/images/icon/van.svg";

export const mapIcons = {
  animal: animalSvg,
  bicycle: bicycleSvg,
  boat: boatSvg,
  bus: busSvg,
  car: carSvg,
  crane: craneSvg,
  default: defaultSvg,
  helicopter: helicopterSvg,
  motorcycle: motorcycleSvg,
  offroad: offroadSvg,
  person: personSvg,
  pickup: pickupSvg,
  pirogue: pirogueSvg,
  holopuni: holopuniSvg,
  plane: planeSvg,
  scooter: scooterSvg,
  ship: shipSvg,
  tractor: tractorSvg,
  train: trainSvg,
  tram: tramSvg,
  trolleybus: trolleybusSvg,
  truck: truckSvg,
  van: vanSvg,
};

export const mapIconKey = (category) =>
  mapIcons.hasOwnProperty(category) ? category : "default";

export const mapImages = {};

const mapPalette = createPalette({
  neutral: { main: grey["A700"] },
  success: { main: green["A400"] },
  error: { main: red["A400"] },
  "#fff": { main: "#ffffff" },
});

export default async () => {
  const background = await loadImage(backgroundSvg);
  const backgroundEmpty = await loadImage(backgroundEmptySvg);
  mapImages.background = await prepareIcon(background);
  mapImages.direction = await prepareIcon(await loadImage(directionSvg));
  await Promise.all(
    Object.keys(mapIcons).map(async (category) => {
      const results = [];
      ["#fff", "info", "success", "error", "neutral"].forEach((color) => {
        results.push(
          loadImage(mapIcons[category]).then((icon) => {
            mapImages[`${category}-${color}`] = prepareIcon(
              backgroundEmpty,
              icon,
              mapPalette[color].main
            );
          })
        );
      });
      await Promise.all(results);
    })
  );
};
