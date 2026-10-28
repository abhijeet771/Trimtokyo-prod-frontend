import apik from "../apik.js";

/* -------------------------------------------------------------------------- */
/*                            DISPLAY SETTINGS API                            */
/* -------------------------------------------------------------------------- */

const BASE_PATH = "/api/display-settings";

/* -------------------------------------------------------------------------- */
/*                         GET DISPLAY SETTINGS                               */
/* -------------------------------------------------------------------------- */

export const getDisplaySettings = async () => {
  const response = await apik.get(BASE_PATH);
  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                        UPDATE DISPLAY SETTINGS                             */
/* -------------------------------------------------------------------------- */

export const updateDisplaySettings = async (data) => {
  const response = await apik.put(BASE_PATH, data);
  return response.data;
};