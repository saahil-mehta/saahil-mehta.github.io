// The film's entry: exposes the site's object renderer to the composition page.
import { stageObjects } from "../src/scripts/objects3d";

(window as unknown as { stageObjects: typeof stageObjects }).stageObjects = stageObjects;
