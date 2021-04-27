import * as React from "react";
import {
  DetailsList,
  Selection,
  IColumn,
  MarqueeSelection,
  DetailsListLayoutMode,
  TextField,
  SelectionMode
} from "@fluentui/react";
import { listStyles, textFieldStyles } from "./style/DetailsListSimple-styles";

export interface IDetailsListSimpleProps<T = any> {
  columns: IColumn[];
  records: T[];
  onSelected?(selection: T): void;
}

export interface IListItem<T = any> {
  index: T;
  [x: string]: T;
}

export interface IDetailsListSimpleState {
  items: IListItem[];
  selectionDetails: IListItem;
}

export class DetailsListSimple extends React.Component<
  IDetailsListSimpleProps,
  IDetailsListSimpleState
> {
  private _selection: Selection;
  private _allItems: IListItem[];
  private _columns: IColumn[];

  constructor(props: IDetailsListSimpleProps) {
    super(props);

    this._selection = new Selection({
      onSelectionChanged: () => {
        let details = this._getSelectionDetails();
        this.setState({ selectionDetails: details });
        if (this.props.onSelected) this.props.onSelected(details);
      }
    });

    this._allItems = props.records;

    this.state = {
      items: this._allItems,
      selectionDetails: this._getSelectionDetails()
    };
  }

  componentDidMount() {
    window.dispatchEvent(new Event("resize"));
  }

  private _onChangeText = (
    ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    text: string | undefined
  ): void => {
    debugger;
    let filteredSet = this._allItems.filter(
      (i) =>
        JSON.stringify(i)
          .toLowerCase()
          .indexOf((text as string).toLowerCase()) > -1
    );
    this.setState({
      items: text ? filteredSet : this._allItems
    });
  };

  render() {
    const { items } = this.state;
    return (
      <React.Fragment>
        <TextField
          label="Filter:"
          onChange={this._onChangeText}
          styles={textFieldStyles}
        />
        <MarqueeSelection selection={this._selection}>
          <DetailsList
            items={items}
            columns={this.props.columns}
            setKey="set"
            layoutMode={DetailsListLayoutMode.justified}
            selection={this._selection}
            selectionPreservedOnEmptyClick={true}
            selectionMode={SelectionMode.single}
            ariaLabelForSelectionColumn="Toggle selection"
            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
            checkButtonAriaLabel="Row checkbox"
            onItemInvoked={(item) => this._onItemInvoked(item)}
            className={[listStyles.body, listStyles.container].join(" ")}
          />
        </MarqueeSelection>
      </React.Fragment>
    );
  }

  private _getSelectionDetails(): IListItem {
    return this._selection.getSelection()[0] as IListItem;
  }

  private async _onItemInvoked(item: IListItem) {
    alert(`${item.index} selected`);
  }
}
