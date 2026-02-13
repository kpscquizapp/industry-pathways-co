import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ExtractResumeSkillsState {
  data: string[] | null;
}

const initialState: ExtractResumeSkillsState = {
  data: null,
};

const extractResumeSkills = createSlice({
  name: "extractResumeSkills",
  initialState,
  reducers: {
    setExtractedSkills: (state, action: PayloadAction<string[]>) => {
      state.data = action.payload;
    },
    clearExtractedSkills: (state) => {
      state.data = null;
    },
  },
});

export const { setExtractedSkills, clearExtractedSkills } =
  extractResumeSkills.actions;
export default extractResumeSkills.reducer;
