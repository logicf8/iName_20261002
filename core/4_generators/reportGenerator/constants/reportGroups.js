//core\4_generators\reportGenerator\constants\reportGroups.js
import { filter } from "../../../shared/global/myConstants.js";

export const GROUP1 = {
  CABINET: filter.Cabinet.group1,
  OPENCAB: filter.CabTyp2.group1,
  APPLIANCE: filter.Appliance.group1,
  FRONT: filter.Fronts.group1,
  CUSTOM: filter.CustomMade.group1
};

export const FRONT_GROUPS = {
  DOOR: filter.Fronts.group2.Door,
  DRAWERFRONT: filter.Fronts.group2.DrawerFront,
  DOORDISHW: filter.Fronts.group2.DishwasherFront
};

export const APPLIANCE_GROUPS = {
  ACCESSORIES: filter.Appliance.group2.Accessories
};