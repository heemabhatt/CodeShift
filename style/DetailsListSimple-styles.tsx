import { mergeStyleSets, ITextFieldStyles } from "@fluentui/react";

export const textFieldStyles: Partial<ITextFieldStyles> = {
  root: {
    margin: "0 30px 20px 0",
    maxWidth: "300px"
  },
  subComponentStyles: {
    label: {
      root: {
        float: "left",
        marginRight: "2rem"
      }
    }
  }
};

export const listStyles = mergeStyleSets({
  body: {},
  container: {
    maxHeight: "300px",
    maxWidth: "800px"
  }
});
