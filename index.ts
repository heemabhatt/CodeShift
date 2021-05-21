import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as Helper from './Controls/Helper';
import ReactDOM = require("react-dom");
import React = require("react");
import { ISearchButtonProps, SearchButton } from "./Controls/SearchButton";
export class CeoAuthenticationLogSearch implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	private _container: HTMLDivElement;
	private _inputCeoUserId: string = "";
	private _inputCeoCompanyId: string = "";
	private _inputElement: React.ReactElement;
	private _notifyOutputChanged: () => void;
	private _context: ComponentFramework.Context<IInputs>;
	private searchProps: ISearchButtonProps;
	private _outputCeoSearch: string;
	constructor() {
		this.onClickHandler = this.onClickHandler.bind(this);
		this.searchProps = {
			onClick: this.onClickHandler,
			companyId: '',
			userId: '',
			disabled: false,
			context: this._context,
			isModalOpen: false
		}
		this._outputCeoSearch = "";
	}

	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
		this._container = container;
		this._notifyOutputChanged = notifyOutputChanged;

		if (!Helper.isEmptyStringProperty(context.parameters.ceoCompanyId)
			&& !Helper.isEmptyString(context.parameters.ceoCompanyId.raw)) {
			this._inputCeoCompanyId = context.parameters.ceoCompanyId.raw || "";
			this.searchProps.companyId = this._inputCeoCompanyId;
		}
		if (!Helper.isEmptyStringProperty(context.parameters.ceoUserId)
			&& !Helper.isEmptyString(context.parameters.ceoUserId.raw)) {
			this._inputCeoUserId = context.parameters.ceoUserId.raw || "";
			this.searchProps.userId = this._inputCeoUserId;
		}
		if (!Helper.isEmptyStringProperty(context.parameters.ceoSearch)
			&& !Helper.isEmptyString(context.parameters.ceoSearch.raw)) {
			this._outputCeoSearch = context.parameters.ceoSearch.raw || "";
			this.searchProps.ceoSearch = this._outputCeoSearch;
		}

		this.searchProps.disabled = Helper.isEmptyStringProperty(context.parameters.ceoUserId)
			|| Helper.isEmptyString(context.parameters.ceoUserId.raw) || Helper.isEmptyStringProperty(context.parameters.ceoSearch) || Helper.isEmptyString(context.parameters.ceoSearch.raw);
	}

	public updateView(context: ComponentFramework.Context<IInputs>): void {

		if (!Helper.isEmptyStringProperty(context.parameters.ceoCompanyId)
			&& !Helper.isEmptyString(context.parameters.ceoCompanyId.raw)) {
			this._inputCeoCompanyId = context.parameters.ceoCompanyId.raw || "";
			this.searchProps.companyId = this._inputCeoCompanyId;
		}
		
		if (!Helper.isEmptyStringProperty(context.parameters.ceoUserId)
			&& !Helper.isEmptyString(context.parameters.ceoUserId.raw)) {
			this._inputCeoUserId = context.parameters.ceoUserId.raw || "";
			this.searchProps.userId = this._inputCeoUserId;
		}
		
		if (!Helper.isEmptyStringProperty(context.parameters.ceoSearch)
			&& !Helper.isEmptyString(context.parameters.ceoSearch.raw)) {
			this._outputCeoSearch = context.parameters.ceoSearch.raw || "";
		}

		this.searchProps.context = context;

		this.searchProps.disabled = Helper.isEmptyStringProperty(context.parameters.ceoUserId)
			|| Helper.isEmptyString(context.parameters.ceoUserId.raw) || Helper.isEmptyStringProperty(context.parameters.ceoCompanyId) || Helper.isEmptyString(context.parameters.ceoCompanyId.raw);
		this.renderControl(context);
	}

	private renderControl(context: ComponentFramework.Context<IInputs>) {
		ReactDOM.render(this._inputElement = React.createElement(SearchButton, this.searchProps), this._container);
	}

	public onClickHandler(event: any) {
		this._outputCeoSearch = JSON.stringify(event);
		this._notifyOutputChanged();
	}

	public getOutputs(): IOutputs {
		console.log("Returning Output: " + this._outputCeoSearch);
		return {
			ceoSearch: this._outputCeoSearch,
			ceoUserId: this._inputCeoUserId, ceoCompanyId: this._inputCeoCompanyId
		};
	}

	public destroy(): void {
		ReactDOM.unmountComponentAtNode(this._container);
	}
}
