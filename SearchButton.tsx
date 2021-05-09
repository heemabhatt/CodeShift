import { BaseButton, Button, getTheme, loadTheme, mergeStyles, PrimaryButton } from '@fluentui/react';
import * as React from 'react';
import { IInputs, IOutputs } from '../generated/ManifestTypes';
import { IListItem } from './DetailsListSimple';
import * as Helper from './Helper';
import * as WebApiHelper from './WebApiHelper';
import * as WebServiceHelper from './WebServiceHelper';
import { ILookupModalProps, LookupModal } from './LookupModal';
import { buttonStyles } from './style/Search-styles';

const theme = getTheme();
export interface ISearchButtonProps {
  onClick(event: any): void;
  [x: string]: any;
  userId: string;
  disabled: boolean;
  companyId: string;
  context: ComponentFramework.Context<IInputs>;
  isModalOpen: boolean;
  selection?: IListItem;
}

export interface ISearchButtonState {
  disabled: boolean;
  userId: string;
  companyId: string;
  context: ComponentFramework.Context<IInputs>;
  isModalOpen: boolean;
  selection?: IListItem;
  selectDisabled: boolean;
  isValid?: boolean;
  errorMessage?: string;
  ceoSearch?: string;
}

export class SearchButton extends React.Component<ISearchButtonProps, ISearchButtonState, ILookupModalProps>{
  private _userInfo: WebApiHelper.IUserInfo;
  private _ceoUsersResult: any;
  private _seasResult: any;
  private _sebsResult: any;
  private _allItems: IListItem[] = [];
  private _columns = [
   
    {
      key: "column1",
      name: "Full Name",
      fieldName: "fullName",
      minWidth: 150,
      maxWidth: 250,
      isResizable: true
    },
    {
      key: "column2",
      name: "Contact Email",
      fieldName: "email",
      minWidth: 150,
      maxWidth: 250,
      isResizable: true
    },
    {
      key: "column3",
      name: "Contact Phone",
      fieldName: "phone",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true
    },
    {
      key: "column4",
      name: "Company Name",
      fieldName: "companyName",
      minWidth: 150,
      maxWidth: 250,
      isResizable: true
    },
    {
      key: "column5",
      name: "WCIS ID",
      fieldName: "wcisId",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true
    },
    {
      key: "column6",
      name: "",
      fieldName: "index",
      minWidth: 10,
      maxWidth: 10,
      isResizable: false,
      className: mergeStyles({ visibility: "hidden", padding:"0px", margin:"0px" })
    }
  ];

  constructor(props: ISearchButtonProps) {
    super(props);

    this.state = {
      userId: this.props.userId,
      companyId: this.props.companyId,
      context: this.props.context,
      isModalOpen: false,
      selection: this.props.selection,
      selectDisabled: true,
      disabled: (this.props.companyId.length === 0 || this.props.userId.length === 0) ? true : false,
      isValid: true,
      errorMessage: ""
    }
    this.onClick = this.onClick.bind(this);
  }

  componentDidUpdate(prevProps: ISearchButtonProps, other: any) {
    if (this.props.companyId !== prevProps.companyId) {
      this.setState({
        companyId: this.props.companyId,
        disabled: (this.props.userId.length === 0) || (this.props.companyId.length === 0),
        isValid: true,
        errorMessage: ""
      });
    }
    if (this.props.userId !== prevProps.userId) {
      this.setState({
        userId: this.props.userId,
        disabled: (this.props.userId.length === 0) || (this.props.companyId.length === 0),
        isValid: true,
        errorMessage: ""
      });
    }
    if (this.props.ceoSearch !== prevProps.ceoSearch) {
      this.setState({
        ceoSearch: this.props.ceoSearch,

      });
    }
    if (this.props.selection !== prevProps.selection) {
      this.setState({
        selectDisabled: Helper.isNullObject(this.props.selection)
      });
    }
  }

  private hideModal(ev?: any) {
    if(ev==="selectClicked")
    {
      if (!Helper.isNullObject(this.state.selection) && this.state.selection?.index >= 0) {
        const ceoSearchResult = WebApiHelper.generateOutput(this._ceoUsersResult[this.state.selection?.index]);
        console.log("Generated output from pop up selection:: " + JSON.stringify(ceoSearchResult));
  
        if (!Helper.isNullObject(ceoSearchResult) && !Helper.isEmptyString(ceoSearchResult)) {
          // Set output
          const output: IOutputs = {
            ceoUserId: this.state.userId,
            ceoCompanyId: this.state.companyId,
            ceoSearch: ceoSearchResult
          };
          this.setState(
            {
              isModalOpen: false,
              selection: undefined,
              selectDisabled: true,
              isValid: true,
              errorMessage: ""
            });
  
          this.props.onClick(output);
        }
      }
    }
    
    // close pop up     
    this.setState({ isModalOpen: false, selection: undefined, selectDisabled: true });
  }

  onSelected(item: IListItem) {
    this.setState({ selection: item, selectDisabled: this.props.selectDisabled });
  }

  async onClick(event: any) {

    if (Helper.isEmptyString(this.props.companyId) || Helper.isEmptyString(this.props.userId)) {
      Helper.showError(`Please enter valid CEO User ID or CEO Company ID.`);
      return;
    }

    try {
      // Set System User Info
      let userInfoResult = await WebApiHelper.getUserInfo(this.props.context);
      if (userInfoResult === undefined || Helper.isEmptyString(userInfoResult.userFullName) || Helper.isEmptyString(userInfoResult.userGuid)) {
        Helper.showError("Invalid/Unauthorized User.");
        return;
      }
      this._userInfo = userInfoResult;

      // Retrieve CEO User ID Data 
      const ceoUserResult = await WebApiHelper.retrieveCeoUser(this.props.userId, this.props.companyId, this.props.context);
      Helper.logInformation(`CEO User : ${JSON.stringify(ceoUserResult)}`);
      if (Helper.isNullObject(ceoUserResult)) {
        Helper.showError("Error fetching CEO User ID Data.");
        return;
      }

      // Process CEO User Result 
      if (ceoUserResult.length > 1) {
        this._ceoUsersResult = ceoUserResult;
        //Show pop up
        this._allItems = [];

        for (let i = 0; i < ceoUserResult.length; i++) {
          if (ceoUserResult[i]) {
            let item = {
              index: i,
              fullName: (ceoUserResult[i].wfsv_contactid && ceoUserResult[i].wfsv_contactid.fullname) ? ceoUserResult[i].wfsv_contactid.fullname : "",
              email: (ceoUserResult[i].wfsv_contactid && ceoUserResult[i].wfsv_contactid.emailaddress1) ? ceoUserResult[i].wfsv_contactid.emailaddress1 : "",
              phone: (ceoUserResult[i].wfsv_contactid && ceoUserResult[i].wfsv_contactid.mobilephone) ? ceoUserResult[i].wfsv_contactid.mobilephone : "",
              // WF : company
              companyName: (ceoUserResult[i].wfsv_ceocompanyid && ceoUserResult[i].wfsv_ceocompanyid.wfsv_companyid && ceoUserResult[i].wfsv_ceocompanyid.wfsv_companyid.name) ? ceoUserResult[i].wfsv_ceocompanyid.wfsv_companyid.name : "",
              wcisId: (ceoUserResult[i].wfsv_ceocompanyid && ceoUserResult[i].wfsv_ceocompanyid.wfsv_wcisclientid) ? ceoUserResult[i].wfsv_ceocompanyid.wfsv_wcisclientid : ""
            };
            console.log("ITEMS: " + JSON.stringify(item));
            this._allItems.push(item);
          }
        }

        this.setState({ isModalOpen: true }); // Open modal 
      }
      else if (ceoUserResult.length < 1) 
      {
        this._seasResult = await WebServiceHelper.callSeasService(this.props.companyId);
        this._sebsResult = await WebServiceHelper.callSebsService(this.props.userId);
        
        if (Helper.isNullObject(this._seasResult) || Helper.isEmptyString(this._sebsResult)) {
          this.setState({
            isValid: false,
            errorMessage: "Invalid CEO User/Company Combination. No result found from SEAS/SEBS."
          });
          const output: IOutputs = {
            ceoUserId: this.state.userId,
            ceoCompanyId: this.state.companyId,
            ceoSearch: ""
          };

          this.props.onClick(output);
          return;
        }
        Helper.logInformation(`seasResult: ${JSON.stringify(this._seasResult)}   sebsResult: ${JSON.stringify(this._sebsResult)}`);

        //Create CEO User ID record
        const newCEOUser = await WebApiHelper.createCEOUserRecord(this.props.userId, this.props.companyId, this._seasResult, this._sebsResult, this._userInfo, this.props.context);
        console.log("newCEOUser" + JSON.stringify(newCEOUser));

        this.setState({
          isValid: newCEOUser && newCEOUser.status === "success",
          errorMessage:  (newCEOUser && newCEOUser.errorMessage) ? newCEOUser.errorMessage || "An error occurred returning result" : "",
        });
        //Set output
        const output: IOutputs = {
          ceoUserId: this.state.userId,
          ceoCompanyId: this.state.companyId,
          ceoSearch: ( newCEOUser && newCEOUser.outputValue)? newCEOUser.outputValue:""
        };
       
        this.props.onClick(output);
      }
      else if (ceoUserResult.length === 1) {
        // Process single record
        Helper.logInformation("Display result for 1 record: ");
        const ceoSearchResult = WebApiHelper.generateOutput(ceoUserResult[0]);
        if (!Helper.isNullObject(ceoSearchResult) && !Helper.isEmptyString(ceoSearchResult)) {
          //Set output
          this.setState({
            isValid: true,
            errorMessage:  ""
          });
            const output: IOutputs = {
            ceoUserId: this.props.userId,
            ceoCompanyId: this.props.companyId,
            ceoSearch: ceoSearchResult
          };
          this.props.onClick(output);
        }
      }
      else{
        this.setState({
          isValid: false,
          errorMessage: "Invalid CEO User ID or CEO Company ID."
        });
          const output: IOutputs = {
          ceoUserId: this.state.userId,
          ceoCompanyId: this.state.companyId,
          ceoSearch: ""
        };
      
      this.props.onClick(output);
    }
  }
    catch (error) {
      console.log(`An error occurred : ${error}`);
    }
  }

  render() {
    const { disabled, selectDisabled } = this.state;

    return (
      <React.Fragment>
        <PrimaryButton text="Search" onClick={this.onClick} disabled={disabled} styles={buttonStyles} />
        {this.state.isValid ? null : <Helper.ErrorMessage message={this.state.errorMessage} />}
        <LookupModal
          records={this._allItems}
          columns={this._columns}
          onSelected={this.onSelected.bind(this)}
          isModalOpen={this.state.isModalOpen}
          hideModal={this.hideModal.bind(this)}
          selectDisabled={selectDisabled}
        />
      </React.Fragment>);
  }
}
