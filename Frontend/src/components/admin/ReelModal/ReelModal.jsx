import React, { useEffect, useState } from "react";

import {INITIAL_REEL_FORM,REEL_MODAL_MODE,ACCEPTED_VIDEO_TYPES,MAX_VIDEO_SIZE_MB,} from "../../../constants/reel";

import "./ReelModal.scss";

const ReelModal = ({
mode = REEL_MODAL_MODE.CREATE,
reel = null,
formData,
updateField,
updateVideo,
createReel,
editReel,
onClose,
}) => {

const [preview, setPreview] = useState("");

useEffect(() => {if (mode === REEL_MODAL_MODE.EDIT && reel) {
setPreview(reel.videoUrl);
} else {
setPreview("");
}}, [mode, reel]);

const handleChange = (e) => {
updateField(
e.target.name,
e.target.value
);

};

const handleVideoChange = (e) => {
const file = e.target.files[0];
if (!file) return;
if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
alert("Unsupported video format.");
return;

}

if (file.size >MAX_VIDEO_SIZE_MB * 1024 * 1024
) {
alert(
`Video size should be less than ${MAX_VIDEO_SIZE_MB} MB`
);

return;

}

updateVideo(file);

setPreview(
URL.createObjectURL(file)
);

};

const handleSubmit = async (e) => {
e.preventDefault();

if (mode === REEL_MODAL_MODE.CREATE) {
await createReel();
} else {

await editReel();

}

};

return (

<div className="reel-modal-overlay">

<div className="reel-modal">

<div className="reel-modal__header">

<h2>

{
mode === REEL_MODAL_MODE.CREATE
? "Add New Reel"
: "Edit Reel"
}

</h2>

<button onClick={onClose}>

✕

</button>

</div>

<form
className="reel-modal__form"
onSubmit={handleSubmit}
>

<div className="reel-modal__group">

<label>

Video

</label>

<input
type="file"
accept="video/*"
onChange={handleVideoChange}
/>

</div>

{preview && (

<div className="reel-modal__preview">

<video
src={preview}
controls
/>

</div>

)}

<div className="reel-modal__group">

<label>

Title

</label>

<input
type="text"
name="title"
value={formData.title}
onChange={handleChange}
placeholder="Enter reel title"
/>

</div>

<div className="reel-modal__group">

<label>

Description

</label>

<textarea
rows="5"
name="description"
value={formData.description}
onChange={handleChange}
placeholder="Write description..."
/>

</div>

<div className="reel-modal__footer">

<button
type="button"
className="secondary"
onClick={onClose}
>

Cancel

</button>

<button
type="submit"
className="primary"
>

{
mode === REEL_MODAL_MODE.CREATE
? "Upload Reel"
: "Save Changes"
}

</button>
</div>
</form>
</div>
</div>

);

};

export default ReelModal;