import { BaseButton, Button, loadTheme, PrimaryButton } from '@fluentui/react';
import * as React from 'react';
import { IInputs, IOutputs } from '../generated/ManifestTypes';
import { IListItem } from './DetailsListSimple';
import * as Helper from './Helper';
import * as WebApiHelper from './WebApiHelper';
import * as WebServiceHelper from './WebServiceHelper';
import { ILookupModalProps, LookupModal } from './LookupModal';
import { buttonStyles } from './style/Search-styles';

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
  isValid?: boolean;
  errorMessage?:string;
}

export class SearchButton extends React.Component<ISearchButtonProps, ISearchButtonState, ILookupModalProps>{
  private _userInfo: WebApiHelper.IUserInfo;
  private _ceoUsersResult:any;
  private _seasResult: any;
  private _sebsResult: any;
  private _allItems: IListItem[] = [];
  private _columns = [
   
    {
      key: "column1",
      name: "Full Name",
      fieldName: "fullName",
      minWidth: 50,
      maxWidth: 100,
      isResizable: true
    },
    {
      key: "column2",
      name: "Contact Email",
      fieldName: "email",
      minWidth: 150,
      maxWidth: 200,
      isResizable: true
    },
    {
      key: "column3",
      name: "Contact Phone",
      fieldName: "phone",
      minWidth: 150,
      maxWidth: 250,
      isResizable: true
    },
    {
      key: "column4",
      name: "Company Name",
      fieldName: "companyName",
      minWidth: 150,
      maxWidth: 350,
      isResizable: true
    },
    {
      key: "column5",
      name: "WCIS ID",
      fieldName: "wcisId",
      minWidth: 150,
      maxWidth: 250,
      isResizable: true
    },
    {
      key: "column6",
      name: "Index",
      fieldName: "index",
      minWidth: 10,
      maxWidth: 10,
      isResizable: false
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
      disabled: this.props.disabled ? this.props.disabled : true, 
      isValid: true,
      errorMessage:"" 
    }
    this.onClick = this.onClick.bind(this);
  }

  componentDidUpdate(prevProps: ISearchButtonProps, other: any) {
    if (this.props.companyId !== prevProps.companyId) {
      this.setState({
        companyId: this.props.companyId,
        disabled: (this.props.userId.length === 0) || (this.props.companyId.length === 0),
        isValid:true,
        errorMessage:""
      });
    }
  

    if (this.props.userId !== prevProps.userId) {
      this.setState({
        userId: this.props.userId,
        disabled: (this.props.userId.length === 0) || (this.props.companyId.length === 0),
        isValid:true,
        errorMessage:""
      });
    }
  }
  private hideModal(e: any) {
  
    this.setState({ isModalOpen: !this.state.isModalOpen });
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
          let item = {
            index: i,
            fullName: ceoUserResult[i].wfsv_contactid.fullname ,
            email:ceoUserResult[i].wfsv_contactid.emailaddress1,
            phone:ceoUserResult[i].wfsv_contactid.mobilephone,
            companyName: ceoUserResult[i].wfsv_ceocompanyid.wfsv_companyid.name, //CEO Company name or Company name?
            wcisId: ceoUserResult[i].wfsv_ceocompanyid.wfsv_wcisclientid
          };
          console.log("ITEMS: "+ JSON.stringify(item) );
          this._allItems.push(item);
        }
      
        this.setState({ isModalOpen: true }); // Open modal 
       console.log("Display result for pop up selected record: " +  this.props.selection);
          /*
        const ceoSearchResult = WebApiHelper.generateOutput(this._ceoUsersResult[this.props.selection?.index]);
         if (!Helper.isNullObject(ceoSearchResult) && !Helper.isEmptyString(ceoSearchResult)) {
           const output: IOutputs = {
             ceoSearch: ceoSearchResult
           };
           this.props.onClick(output);
         }*/
        
      }
      else if (ceoUserResult.length < 1) {
        this.setState({
          isValid: false,
          errorMessage:"Invalid CEO User ID or CEO Company ID."
        });
        // Webservice lookup - TODO
        /*
        this._seasResult = WebServiceHelper.callSeasService(this.props.companyId);
        this._sebsResult = WebServiceHelper.callSebsService(this.props.userId);
        if (Helper.isNullObject(this._seasResult) || Helper.isNullObject(this._sebsResult)) {
          Helper.showError("Invalid CEO User/Company Combination. No result found from SEAS/SEBS.");
          this.setState({
            isValid: false
          });
          return;
        }
        Helper.logInformation(`seasResult: ${JSON.stringify(this._seasResult)}   sebsResult: ${JSON.stringify(this._sebsResult)}`);
        */
      }
      else {
        // Process single record
        Helper.logInformation("Display result for 1 record: ");
        const ceoSearchResult = WebApiHelper.generateOutput(ceoUserResult[0]);
        if (!Helper.isNullObject(ceoSearchResult) && !Helper.isEmptyString(ceoSearchResult)) {
          const output: IOutputs = {
            ceoSearch: ceoSearchResult
          };
          this.props.onClick(output);
        }
      }
    }
    catch (error) {
      console.log(`An error occurred : ${error}`);
    }  
  }

  onSelected(event: any) {
    
  }

  render() {
    const { disabled } = this.state;
 
    return (
      <React.Fragment>
        <PrimaryButton text="Search" onClick={this.onClick} disabled={disabled}  styles={buttonStyles} />
        {this.state.isValid ? null : <Helper.ErrorMessage message={this.state.errorMessage}  />}
        <LookupModal
          records={this._allItems}
          columns={this._columns}
          onSelected={this.onSelected.bind(this)}
          isModalOpen={this.state.isModalOpen}
          hideModal={this.hideModal.bind(this)}
        />
      </React.Fragment>);
  }
}
