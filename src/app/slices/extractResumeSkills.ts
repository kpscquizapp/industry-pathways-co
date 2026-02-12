import { createSlice } from "@reduxjs/toolkit";

const extractResumeSkills = createSlice({
  name: "extractResumeSkills",
  initialState: {
    data: null,
  },
  reducers: {
    setExtractedSkills: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setExtractedSkills } = extractResumeSkills.actions;
export default extractResumeSkills.reducer;
