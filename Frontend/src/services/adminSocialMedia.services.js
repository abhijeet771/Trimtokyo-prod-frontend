import apik from "./apik";

const SOCIAL_MEDIA_BASE_URL = "/api/admin/social-media";

export const createSocialMedia = async (socialMediaData) => {
  const response = await apik.post(
    SOCIAL_MEDIA_BASE_URL,
    socialMediaData
  );
  return response.data;
};

export const getAllSocialMedia = async ({  page = 1,limit = 10,  search = "",  status = "",  platform = "",
} = {}) => {
  const response = await apik.get(SOCIAL_MEDIA_BASE_URL, {
    params: {      page,      limit,      search,      status,      platform,
    },
  });

  return response.data;
};


export const getSocialMediaById = async (id) => {
  const response = await apik.get(
    `${SOCIAL_MEDIA_BASE_URL}/${id}`
  );

  return response.data;
};


export const updateSocialMedia = async (id, socialMediaData) => {
  const response = await apik.put(
    `${SOCIAL_MEDIA_BASE_URL}/${id}`,
    socialMediaData
  );

  return response.data;
};


export const deleteSocialMedia = async (id) => {
  const response = await apik.delete(
    `${SOCIAL_MEDIA_BASE_URL}/${id}`
  );

  return response.data;
};
