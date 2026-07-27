import { useState } from "react";

import { getReels } from "../services/api";

const useHomepageReels = () => {

const [loading, setLoading] = useState(false);

const [reels, setReels] = useState([]);

const [viewerOpen, setViewerOpen] =
useState(false);

const [selectedReel, setSelectedReel] =
useState(null);

/* ===========================
   FETCH REELS
=========================== */

const fetchReels = async () => {

setLoading(true);

try {

const { data } = await getReels();

setReels(data.data || []);

} catch (error) {

console.error(error);

} finally {

setLoading(false);

}

};

/* ===========================
   OPEN VIEWER
=========================== */

const openViewer = (reel) => {

setSelectedReel(reel);

setViewerOpen(true);

};

/* ===========================
   CLOSE VIEWER
=========================== */

const closeViewer = () => {

setViewerOpen(false);

setSelectedReel(null);

};

return {

loading,

reels,

viewerOpen,

selectedReel,

fetchReels,

openViewer,

closeViewer,

};

};

export default useHomepageReels;