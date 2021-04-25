import { FontWeights, getTheme } from "@fluentui/react";

const theme = getTheme();
export const errorStyles = {
message : {
    color: theme.palette.red,
    align:"right",
    backgroundColor: "#fde7e9",
    width:"100%",
    paddingLeft:"5px"
}
};

export const buttonStyles = {
    root: {
        color: theme.palette.neutralPrimary,
        outerWidth:"100%",
        display: "flex",
        alignItems: "center",
        marginLeft:"auto",
        marginRight:"auto"
    },
    rootHovered: {
        color: theme.palette.neutralDark
    }
};
