import { theme } from "twin.macro";

import { PI } from "~/tools/trigonometry";

/**
 * must be serializable to json
 */
export class StackVizConfig {
  static ZOOM_LEVEL = 1.25;
  static COLOR_FADE = 0.65;
  static TEXTURE_FADE = 1.35;

  // ------------- COMPONENTS ------------------ //
  static COMPONENT_WIDTH = 4;
  static COMPONENT_HEIGHT = 4;
  static COMPONENT_MIDDLE_SCALE = 0.9;
  static COMPONENT_INNER_SCALE = 0.8;

  static COMPONENT_ICON_SIZE = StackVizConfig.COMPONENT_WIDTH * 0.4;
  static COMPONENT_BADGE_POSITION_X = 1.9;
  static COMPONENT_BADGE_POSITION_Y = 1.9;

  // ------------- COMPONENTS SPOTLIGHTED ------------------ //
  static COMPONENT_WIDTH_SPOTLIGHTED = StackVizConfig.COMPONENT_WIDTH * StackVizConfig.ZOOM_LEVEL;
  static COMPONENT_HEIGHT_SPOTLIGHTED = StackVizConfig.COMPONENT_HEIGHT * StackVizConfig.ZOOM_LEVEL;

  // ------------- HEALTH STATE BADGES ------------- //
  static BADGE_SCALE = 0.9;
  static BADGE_SCALE_BIG = 1.15;
  static BADGE_BORDER_SCALE = 1.05;
  static BADGE_BORDER_SCALE_BIG = 1.3;
  static BADGE_LABEL_HEIGHT = 1.3;
  static BADGE_LABEL_WIDTH = 4;

  static BADGE_LABEL_VERTICAL_ALIGN = -0.11;

  static BADGE_DEVIATING_COLOR = 0xffa647;
  static BADGE_CRITICAL_COLOR = 0xeb5757;

  // ------------- GROUPS -----------------------//
  static GROUP_SIZE_RADIUS = 2.6;
  static GROUP_MIDDLE_SCALE = 0.9;
  static GROUP_INNER_SCALE = 0.8;
  static GROUP_ICON_RATIO = 0.4;

  static GROUP_BADGE_POSITION_ANGLE = PI / 4;
  static GROUP_BADGE_POSITION = 0.2;

  static FONT = theme`fontFamily.text`;

  static DEFAULT_BG_COLOR = theme`colors.gray.100`;
  static PREVIEW_BG_COLOR = theme`colors.white`;
  static MIN_CELL_WIDTH = 10;
  static MIN_CELL_HEIGHT = 10;
  static COMPONENT_TEXT_DISTANCE = StackVizConfig.COMPONENT_WIDTH * 0.25;
  static CI_DEPTH = 2;

  // ------------- GRID -----------------------//
  static GRID_COLOR_PRIMARY = 0xffffff;
  static GRID_COLOR_EXTENDED = 0xf8f8f8;
  static GRID_BORDER_COLOR = 0xf5f5f5;
  static GRID_CELL_BORDER_COLOR = 0xf0f0f0;

  static CELL_HMARGIN = 9;
  static CELL_VMARGIN = 10;
  static GROUP_CELL_TEXT_ROOM = 0.95;
  static GROUP_CELL_TEXT_DISTANCE_FROM_LINE = 0.5;

  static RELATION_OFFSET_FROM_ELEMENT = 0.5;

  static RELATION_CONE_HEADWIDTH = 0.85;
  static RELATION_CONE_HEADLENGTH = 0.8;
  static RELATION_CIRCLE_OUTER_RADIUS = 0.5985316;
  static RELATION_CIRCLE_BLANK_RADIUS = 0.4655246;
  static RELATION_CIRCLE_INNER_RADIUS = 0.3325176;
  static RELATION_CIRCLE_LINE_LOCATION = 0.42;
  static INDIRECT_RELATION_COLOR = 0xb8bcc2;
  static GROUP_RELATION_COLOR = 0xb8bcc2;
  static FONT_COLOR = 0x8c8c8c;
  static FONT_HOVER_COLOR = 0x29a2ff;

  static USE_SPLINES = true;
  static SPLINES_PRECISION_FACTOR = 10;

  static HEALTH_STATE_COLORS = {
    COMPONENT: {
      CRITICAL: 0xf78783,
      FLAPPING: 0xffbf70,
      DEVIATING: 0xffbf70,
      CLEAR: 0xaae6af,
      UNKNOWN: 0xdbdde0,
      DISABLED: 0xdbdde0,
    },
    RELATION: {
      CRITICAL: 0xf78783,
      FLAPPING: 0xffbf70,
      DEVIATING: 0xffbf70,
      CLEAR: 0x8ede95,
      UNKNOWN: 0xb8bcc2,
      DISABLED: 0xb8bcc2,
    },
  };

  static EXTENDED_RELATION_COLOR_FACTOR = 1.22;

  // ---------------- RELATIONS MOVING POINTS --------------- //
  static RELATION_MOVING_POINTS_COLOR_CRITICAL = 0xf78783;
  static RELATION_MOVING_POINTS_COLOR_DEVIATING = 0xffbf70;
  static RELATION_MOVING_POINTS_COLOR_UNKNOWN = 0xb8bcc2;

  static RELATION_MOVING_POINTS_SCALE = 0.2;
  static RELATION_MOVING_POINTS_SPEED = 0.1;
  static RELATION_MOVING_POINTS_STEP_BETWEEN = 1.3;

  static RELATION_MOVING_POINTS_Z_INDEX = 1.9;
  static RELATION_MOVING_POINTS_LIMIT = 150;

  // ----------------- CAMERA ---------------------- //
  static ANIMATION_OFFSET_TO_CENTER_DURATION = 1.2;
  static ANIMATION_ZOOM_TO_CENTER_DURATION = 1.2;
  static ANIMATION_OFFSET_TO_ELEMENT_DURATION = 1.2;
  static ANIMATION_ZOOM_TO_ELEMENT_DURATION = 1.2;

  static ANIMATION_OFFSET_TO_CENTER_EASE = "power4.in";
  static ANIMATION_ZOOM_TO_CENTER_EASE = "power4.out";
  static ANIMATION_OFFSET_TO_ELEMENT_EASE = "power4.out";
  static ANIMATION_ZOOM_TO_ELEMENT_EASE = "power4.in";

  // Camera's scale determine how many pixels on the screen will occupy the single unit(let's think about it as meters) of threejs space
  // So, for example, scale is 30 and the component width is 4 units, that's mean that component on the screen will take 120 pixels to render
  // if scale is 4 and the component width is 4 units, that's mean that component on the screen will take 16 pixels to render
  // and so on...
  static CAMERA_SCALE_MAX = 30;
  static CAMERA_SCALE_LOD_LOW = 4;
  static CAMERA_SCALE_LOD_MEDIUM = 5;
  static CAMERA_SCALE_LOOK_AT = 10;

  // --------------- INTERACTION MESH -------------- //
  static INTERACTION_MESH_DISK_SIZE_FOR_GROUPS = 1;
}
