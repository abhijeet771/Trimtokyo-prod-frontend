import { useState } from "react";

import {
INITIAL_REEL_FORM,
REEL_MODAL_MODE,
} from "../constants/reel";

import {
getAdminReels,
createReel as createReelAPI,
updateReel as updateReelAPI,
deleteReel as deleteReelAPI,
} from "../services/api";

const useReel = () => {

const [reels, setReels] = useState([]);
const [loading, setLoading] = useState(false);
const [search, setSearch] = useState("");
const [modalOpen, setModalOpen] = useState(false);

const [modalMode, setModalMode] = useState(
REEL_MODAL_MODE.CREATE
);

const [selectedReel, setSelectedReel] =
useState(null);

const [formData, setFormData] = useState(
INITIAL_REEL_FORM
);

/* ===========================
   MODAL
=========================== */

const openCreateModal = () => {

setSelectedReel(null);

setFormData(INITIAL_REEL_FORM);

setModalMode(REEL_MODAL_MODE.CREATE);

setModalOpen(true);

};

const openEditModal = (reel) => {

setSelectedReel(reel);

setFormData({
title: reel.title,
description: reel.description,
video: null,
});

setModalMode(REEL_MODAL_MODE.EDIT);

setModalOpen(true);

};

const closeModal = () => {

setModalOpen(false);

setSelectedReel(null);

setFormData(INITIAL_REEL_FORM);

};

/* ===========================
   FORM
=========================== */

const updateField = (name, value) => {

setFormData((prev) => ({
...prev,
[name]: value,
}));

};

const updateVideo = (file) => {

setFormData((prev) => ({
...prev,
video: file,
}));

};

/* ===========================
   FETCH REELS
=========================== */

const fetchReels = async () => {

setLoading(true);

try {

const { data } = await getAdminReels();

setReels(data.data || []);

} catch (error) {

console.error(error);

} finally {

setLoading(false);

}

};

/* ===========================
   CREATE REEL
=========================== */

const createReel = async () => {

try {

const payload = new FormData();

payload.append("title", formData.title);
payload.append("description", formData.description);

if (formData.video) {
payload.append("video", formData.video);
}

await createReelAPI(payload);

await fetchReels();

closeModal();

} catch (error) {

console.error(error);

}

};

/* ===========================
   UPDATE REEL
=========================== */

const editReel = async () => {

if (!selectedReel) return;

try {

const payload = new FormData();

payload.append("title", formData.title);
payload.append("description", formData.description);

if (formData.video) {
payload.append("video", formData.video);
}

await updateReelAPI(selectedReel._id, payload);

await fetchReels();

closeModal();

} catch (error) {

console.error(error);

}

};

/* ===========================
   DELETE REEL
=========================== */

const removeReel = async (id) => {

const confirmDelete = window.confirm(
"Are you sure you want to delete this reel?"
);

if (!confirmDelete) return;

try {

await deleteReelAPI(id);

await fetchReels();

} catch (error) {

console.error(error);

}

};

return {

loading,

reels,

search,

setSearch,

modalOpen,

modalMode,

selectedReel,

formData,

updateField,

updateVideo,

openCreateModal,

openEditModal,

closeModal,

fetchReels,

createReel,

editReel,

removeReel,

};

};

export default useReel;