
import * as React from "react";
import { contentStyles, iconButtonStyles } from "./style/LookupModal-styles";
import {
  Modal,
  IconButton,
  IIconProps,
  initializeIcons,
  PrimaryButton,
  Stack,
  IStackTokens,
  IStackItemStyles
} from "@fluentui/react";
import {
  DetailsListSimple,
  IDetailsListSimpleProps,
  IListItem
} from "./DetailsListSimple";
initializeIcons();

const cancelIcon: IIconProps = { iconName: "Cancel" };

export interface ILookupModalProps extends IDetailsListSimpleProps {
  isModalOpen: boolean;
  selectDisabled:boolean;
  hideModal: (ev?: any) => any;
}

export interface ILookupModalState {
  selection?: IListItem;
  selectDisabled:boolean;
}

const itemAlignmentsStackTokens: IStackTokens = {
  childrenGap: 20,
  padding: 10
};

const stackItemStyles: IStackItemStyles = {
  root: {
    padding: 5
  }
};

export class LookupModal extends React.Component<
  ILookupModalProps,
  ILookupModalState
>
{
  constructor(props: ILookupModalProps) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.setState({
      selectDisabled:true
    });
  }
 
  onSelected(item: IListItem) {
    this.setState({ selection: item , selectDisabled:false});
    if (this.props.onSelected) this.props.onSelected(item);
  }
  onClick(event: any) {
    if (this.props.onSelected) this.props.onSelected(this.state.selection);
    this.props.hideModal("selectClicked");
  }
  render() {
    const { columns, records } = this.props;
     const {selectDisabled} =this.props;
    return (
      <div>
        <Modal
          isOpen={this.props.isModalOpen}
          onDismiss={this.props.hideModal}
          isBlocking={false}
          containerClassName={contentStyles.container}
        >
          <div className={contentStyles.header}>
            <span>Multiple results returned, please select one.</span>
            <IconButton
              styles={iconButtonStyles}
              iconProps={cancelIcon}
              ariaLabel="Close popup modal"
              onClick={this.props.hideModal}
            />
          </div>
          <div className={contentStyles.body}>
            <Stack tokens={itemAlignmentsStackTokens}>
              <Stack.Item align="auto" styles={stackItemStyles}>
                <DetailsListSimple
                  records={records}
                  columns={columns}
                  onSelected={this.onSelected.bind(this)}
                />
              </Stack.Item>
              <Stack.Item align="end" styles={stackItemStyles}>
                <PrimaryButton text="Select" onClick={this.onClick} disabled={selectDisabled}   />
              </Stack.Item>
            </Stack>
          </div>
        </Modal>
      </div>
    );
  }
}
