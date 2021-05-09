import { mergeStyleSets, ITextFieldStyles, getTheme, IStyleFunctionOrObject, IDetailsColumnStyleProps, IDetailsColumnStyles, IDetailsRowProps, IDetailsRowStyles, hiddenContentStyle } from "@fluentui/react";
const theme = getTheme();
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
    maxWidth: "1000px"
  }
});

export const indexColumnStyles: IDetailsRowStyles = {
  root: {
    visibility: "hidden",
    width:"0px"
  },
  cellAnimation: {},
  cellMeasurer: {},
  cellPadded: {},
  cellUnpadded: {},
  cell: {},
  isRowHeader: {},
  isMultiline: {},
  check: {},
  checkCell: {},
  checkCover: {},
  fields: {}
};
